from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class NoteCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    content: str = Field(min_length=1, max_length=4000)


class NoteOut(BaseModel):
    id: int
    user_id: int | None = None
    title: str
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}
