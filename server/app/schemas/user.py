from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserOut(BaseModel):
    id: int
    provider: str
    provider_sub: str

    email: EmailStr | None = None
    email_verified: bool

    name: str | None = None
    given_name: str | None = None
    family_name: str | None = None
    picture: str | None = None
    locale: str | None = None

    created_at: datetime | None = None
    updated_at: datetime | None = None
    last_login_at: datetime | None = None

    model_config = {"from_attributes": True}


class GoogleAuthIn(BaseModel):
    credential: str


class GoogleAuthCodeIn(BaseModel):
    code: str
    redirect_uri: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
