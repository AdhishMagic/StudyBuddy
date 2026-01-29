from __future__ import annotations

import json

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user_data import UserData


def get_value(db: Session, *, user_id: int, key: str) -> tuple[bool, object | None, UserData | None]:
    row = db.execute(select(UserData).where(UserData.user_id == user_id, UserData.key == key)).scalar_one_or_none()
    if row is None:
        return False, None, None

    try:
        value = json.loads(row.value_json)
    except Exception:
        value = None
    return True, value, row


def upsert_value(db: Session, *, user_id: int, key: str, value: object) -> UserData:
    value_json = json.dumps(value, ensure_ascii=False)
    row = db.execute(select(UserData).where(UserData.user_id == user_id, UserData.key == key)).scalar_one_or_none()
    if row is None:
        row = UserData(user_id=user_id, key=key, value_json=value_json)
        db.add(row)
        db.commit()
        db.refresh(row)
        return row

    row.value_json = value_json
    db.commit()
    db.refresh(row)
    return row
