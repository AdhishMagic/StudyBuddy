from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User
from app.core.security import hash_password, verify_password


def get_by_provider_sub(db: Session, *, provider: str, provider_sub: str) -> User | None:
    stmt = select(User).where(User.provider == provider, User.provider_sub == provider_sub)
    return db.execute(stmt).scalar_one_or_none()


def upsert_google_user(
    db: Session,
    *,
    sub: str,
    email: str | None,
    email_verified: bool,
    name: str | None,
    given_name: str | None,
    family_name: str | None,
    picture: str | None,
    locale: str | None,
) -> User:
    provider = "google"
    user = get_by_provider_sub(db, provider=provider, provider_sub=sub)
    now = datetime.now(timezone.utc)
    if user is None:
        user = User(
            provider=provider,
            provider_sub=sub,
            email=email,
            email_verified=email_verified,
            name=name,
            given_name=given_name,
            family_name=family_name,
            picture=picture,
            locale=locale,
            last_login_at=now,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    user.email = email
    user.email_verified = email_verified
    user.name = name
    user.given_name = given_name
    user.family_name = family_name
    user.picture = picture
    user.locale = locale
    user.last_login_at = now
    db.commit()
    db.refresh(user)
    return user


def get_password_user_by_email(db: Session, *, email: str) -> User | None:
    stmt = select(User).where(User.provider == "password", User.provider_sub == email)
    return db.execute(stmt).scalar_one_or_none()


def create_password_user(db: Session, *, email: str, password: str, name: str | None = None) -> User:
    existing = get_password_user_by_email(db, email=email)
    if existing:
        raise ValueError("User already exists")
    user = User(
        provider="password",
        provider_sub=email,
        email=email,
        email_verified=False,
        name=name,
        password_hash=hash_password(password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def check_password_user(db: Session, *, email: str, password: str) -> User | None:
    user = get_password_user_by_email(db, email=email)
    if user is None:
        return None
    if not verify_password(password, user.password_hash):
        return None
    # update last_login_at
    from datetime import datetime, timezone
    user.last_login_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(user)
    return user
