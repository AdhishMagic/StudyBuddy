from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.crud.user_data import get_value, upsert_value
from app.db.deps import get_db
from app.models.user import User
from app.schemas.user_data import UserDataOut, UserDataUpsert


router = APIRouter(prefix="/user-data")


@router.get("/{key}", response_model=UserDataOut)
def read_user_data(
    key: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserDataOut:
    exists, value, row = get_value(db, user_id=current_user.id, key=key)
    if not exists:
        raise HTTPException(status_code=404, detail="Not found")
    return UserDataOut(key=key, value=value, updated_at=getattr(row, "updated_at", None))


@router.put("/{key}", response_model=UserDataOut)
def write_user_data(
    key: str,
    payload: UserDataUpsert,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserDataOut:
    row = upsert_value(db, user_id=current_user.id, key=key, value=payload.value)
    exists, value, _ = get_value(db, user_id=current_user.id, key=key)
    if not exists:
        raise HTTPException(status_code=500, detail="Write failed")
    return UserDataOut(key=key, value=value, updated_at=getattr(row, "updated_at", None))
