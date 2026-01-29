from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.models import note as _note  # noqa: F401
from app.models import user as _user  # noqa: F401
from app.models import user_data as _user_data  # noqa: F401


def _ensure_sqlite_migrations() -> None:
    # Minimal migration support for local SQLite: add notes.user_id if missing.
    from sqlalchemy import text

    with engine.connect() as conn:
        # users.last_login_at
        cols = conn.execute(text("PRAGMA table_info(users)"))
        user_cols = {row[1] for row in cols.fetchall()}
        if "last_login_at" not in user_cols:
            conn.execute(text("ALTER TABLE users ADD COLUMN last_login_at DATETIME"))
            conn.commit()

        # users.password_hash for local accounts
        cols = conn.execute(text("PRAGMA table_info(users)"))
        user_cols = {row[1] for row in cols.fetchall()}
        if "password_hash" not in user_cols:
            conn.execute(text("ALTER TABLE users ADD COLUMN password_hash TEXT"))
            conn.commit()

        cols = conn.execute(text("PRAGMA table_info(notes)"))
        col_names = {row[1] for row in cols.fetchall()}  # row[1] = name
        if "user_id" not in col_names:
            conn.execute(text("ALTER TABLE notes ADD COLUMN user_id INTEGER"))
            conn.commit()


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"]
    )

    @app.on_event("startup")
    def _startup() -> None:
        # Create tables for a simple SQLite setup.
        Base.metadata.create_all(bind=engine)
        _ensure_sqlite_migrations()

    @app.get("/")
    def root() -> dict:
        return {
            "name": settings.app_name,
            "status": "ok",
            "docs": "/docs",
            "health": "/health",
            "api_base": "/api/v1",
        }

    @app.get("/health")
    def health() -> dict:
        return {"status": "ok"}

    app.include_router(api_router, prefix="/api/v1")
    return app


app = create_app()
