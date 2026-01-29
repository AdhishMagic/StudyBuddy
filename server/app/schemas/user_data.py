from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class UserDataUpsert(BaseModel):
    value: Any = Field(..., description="Arbitrary JSON-serializable value")


class UserDataOut(BaseModel):
    key: str
    value: Any
    updated_at: datetime | None = None
