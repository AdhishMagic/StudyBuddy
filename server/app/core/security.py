from __future__ import annotations

from datetime import datetime, timezone

import jwt
from jwt import PyJWTError
import os
import hashlib
import hmac

from app.core.config import settings


def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
    except PyJWTError as e:
        raise ValueError("Invalid token") from e

    exp = payload.get("exp")
    if exp is None:
        raise ValueError("Token missing exp")
    if datetime.now(timezone.utc).timestamp() >= float(exp):
        raise ValueError("Token expired")

    if payload.get("typ") != "access":
        raise ValueError("Invalid token type")

    return payload


def hash_password(password: str) -> str:
    """Create a PBKDF2-SHA256 hash with random salt.

    Format: pbkdf2_sha256:iterations:salt_hex:hash_hex
    """
    if not isinstance(password, str) or not password:
        raise ValueError("Password required")
    iterations = 200_000
    salt = os.urandom(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)
    return f"pbkdf2_sha256:{iterations}:{salt.hex()}:{dk.hex()}"


def verify_password(password: str, stored: str | None) -> bool:
    if not stored:
        return False
    try:
        algo, iterations_str, salt_hex, hash_hex = stored.split(":", 3)
        if algo != "pbkdf2_sha256":
            return False
        iterations = int(iterations_str)
        salt = bytes.fromhex(salt_hex)
        expected = bytes.fromhex(hash_hex)
        candidate = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)
        return hmac.compare_digest(candidate, expected)
    except Exception:
        return False
