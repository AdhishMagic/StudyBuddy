from __future__ import annotations

from datetime import datetime, timedelta, timezone

import jwt
import requests
from fastapi import APIRouter, Depends, HTTPException
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from sqlalchemy.orm import Session

from app.core.config import settings
from app.api.deps import get_current_user
from app.crud.users import upsert_google_user, create_password_user, check_password_user, get_password_user_by_email
from app.crud.user_data import upsert_value
from app.db.deps import get_db
from app.schemas.user import AuthResponse, GoogleAuthCodeIn, GoogleAuthIn, UserOut
from pydantic import BaseModel, EmailStr
from app.models.user import User


router = APIRouter(prefix="/auth")


@router.get("/google/client-id")
def google_client_id() -> dict:
    # Safe to expose: this is a public identifier used by the browser-based Google SDK.
    return {"client_id": settings.google_client_id or ""}


def _create_access_token(*, user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expires_minutes)
    payload = {
        "sub": str(user_id),
        "exp": int(expire.timestamp()),
        "iat": int(datetime.now(timezone.utc).timestamp()),
        "typ": "access",
    }
    return jwt.encode(payload, settings.secret_key, algorithm="HS256")


def _verify_google_id_token(credential: str) -> dict:
    if not settings.google_client_id:
        raise HTTPException(status_code=500, detail="GOOGLE_CLIENT_ID not configured")

    try:
        info = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            settings.google_client_id,
        )
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Google credential")

    issuer = info.get("iss")
    if issuer not in ("accounts.google.com", "https://accounts.google.com"):
        raise HTTPException(status_code=401, detail="Invalid token issuer")

    sub = info.get("sub")
    if not sub:
        raise HTTPException(status_code=401, detail="Invalid token subject")

    return info


@router.post("/google", response_model=AuthResponse)
def google_login(payload: GoogleAuthIn, db: Session = Depends(get_db)) -> AuthResponse:
    info = _verify_google_id_token(payload.credential)

    user = upsert_google_user(
        db,
        sub=info.get("sub"),
        email=info.get("email"),
        email_verified=bool(info.get("email_verified", False)),
        name=info.get("name"),
        given_name=info.get("given_name"),
        family_name=info.get("family_name"),
        picture=info.get("picture"),
        locale=info.get("locale"),
    )

    # Store a copy of the login profile in SQLite (user_data) for app usage.
    upsert_value(
        db,
        user_id=user.id,
        key="user",
        value={
            "id": user.id,
            "provider": user.provider,
            "email": user.email,
            "name": user.name,
            "picture": user.picture,
            "last_login_at": user.last_login_at.isoformat() if user.last_login_at else None,
        },
    )

    token = _create_access_token(user_id=user.id)
    return AuthResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/google/code", response_model=AuthResponse)
def google_code_login(payload: GoogleAuthCodeIn, db: Session = Depends(get_db)) -> AuthResponse:
    if not settings.google_client_id:
        raise HTTPException(status_code=500, detail="GOOGLE_CLIENT_ID not configured")
    if not settings.google_client_secret:
        raise HTTPException(status_code=500, detail="GOOGLE_CLIENT_SECRET not configured")

    try:
        token_resp = requests.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": payload.code,
                "client_id": settings.google_client_id,
                "client_secret": settings.google_client_secret,
                "redirect_uri": payload.redirect_uri,
                "grant_type": "authorization_code",
            },
            timeout=15,
        )
    except requests.RequestException:
        raise HTTPException(status_code=502, detail="Failed to contact Google token endpoint")

    if token_resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Google code exchange failed")

    token_json = token_resp.json()
    google_id_token = token_json.get("id_token")
    if not google_id_token:
        raise HTTPException(status_code=401, detail="Google response missing id_token")

    info = _verify_google_id_token(google_id_token)

    user = upsert_google_user(
        db,
        sub=info.get("sub"),
        email=info.get("email"),
        email_verified=bool(info.get("email_verified", False)),
        name=info.get("name"),
        given_name=info.get("given_name"),
        family_name=info.get("family_name"),
        picture=info.get("picture"),
        locale=info.get("locale"),
    )

    upsert_value(
        db,
        user_id=user.id,
        key="user",
        value={
            "id": user.id,
            "provider": user.provider,
            "email": user.email,
            "name": user.name,
            "picture": user.picture,
            "last_login_at": user.last_login_at.isoformat() if user.last_login_at else None,
        },
    )

    token = _create_access_token(user_id=user.id)
    return AuthResponse(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def read_me(current_user: User = Depends(get_current_user)) -> UserOut:
    return UserOut.model_validate(current_user)


class SignupIn(BaseModel):
    name: str | None = None
    email: EmailStr
    password: str


class LoginIn(BaseModel):
    email: EmailStr
    password: str


@router.post("/signup", response_model=AuthResponse)
def signup(payload: SignupIn, db: Session = Depends(get_db)) -> AuthResponse:
    existing = get_password_user_by_email(db, email=payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Account already exists")
    try:
        user = create_password_user(db, email=payload.email, password=payload.password, name=payload.name)
    except ValueError:
        raise HTTPException(status_code=400, detail="Account already exists")

    # Store a copy in user_data
    upsert_value(
        db,
        user_id=user.id,
        key="user",
        value={
            "id": user.id,
            "provider": user.provider,
            "email": user.email,
            "name": user.name,
            "picture": None,
            "last_login_at": user.last_login_at.isoformat() if user.last_login_at else None,
        },
    )

    token = _create_access_token(user_id=user.id)
    return AuthResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginIn, db: Session = Depends(get_db)) -> AuthResponse:
    user = check_password_user(db, email=payload.email, password=payload.password)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = _create_access_token(user_id=user.id)
    return AuthResponse(access_token=token, user=UserOut.model_validate(user))
