from __future__ import annotations

from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "StudyBuddy API"
    env: str = "dev"

    cors_origins: List[str] = ["http://localhost:5173"]

    # SQLite file path (relative to `server/` by default)
    sqlite_path: str = "./app.db"

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _parse_cors_origins(cls, value):
        if value is None:
            return ["http://localhost:5173"]
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            # Allow simple comma-separated values in .env
            parts = [p.strip() for p in value.split(",")]
            return [p for p in parts if p]
        return value


settings = Settings()
