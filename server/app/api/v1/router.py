from __future__ import annotations

from fastapi import APIRouter

from app.api.v1.routes import auth, health, notes, user_data

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(notes.router, prefix="/notes", tags=["notes"])
api_router.include_router(user_data.router, tags=["user-data"])
