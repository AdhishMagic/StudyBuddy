from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.models import note as _note  # noqa: F401


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"]
    )

    @app.on_event("startup")
    def _startup() -> None:
        # Create tables for a simple SQLite setup.
        Base.metadata.create_all(bind=engine)

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
