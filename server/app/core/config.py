from __future__ import annotations

from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # NOTE: We keep `extra="ignore"` so adding new keys to `.env` doesn't crash startup.
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "StudyBuddy API"
    env: str = "dev"

    # Stored as a string so EnvSettingsSource doesn't try to JSON-decode it.
    # Use comma-separated origins.
    cors_origins: str = "http://localhost:5173,http://localhost:8080,http://localhost:8081,http://127.0.0.1:5173,http://127.0.0.1:8080,http://127.0.0.1:8081"

    # Google Identity / OAuth
    google_client_id: str | None = None
    google_client_secret: str | None = None

    # App-issued token signing (for simple session auth)
    secret_key: str = "dev-secret-change-me"
    access_token_expires_minutes: int = 60 * 24 * 7

    # SQLite file path (relative to `server/` by default)
    sqlite_path: str = "./app.db"

    @property
    def cors_origins_list(self) -> List[str]:
        value = self.cors_origins
        parts = [p.strip() for p in value.split(",")]
        return [p for p in parts if p]


settings = Settings()
