from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.crud.notes import create_note, list_notes
from app.api.deps import get_current_user
from app.db.deps import get_db
from app.models.user import User
from app.schemas.note import NoteCreate, NoteOut

router = APIRouter()


@router.get("/", response_model=list[NoteOut])
def get_notes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[NoteOut]:
    return list_notes(db, user_id=current_user.id)


@router.post("/", response_model=NoteOut)
def post_note(
    payload: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> NoteOut:
    return create_note(db, user_id=current_user.id, payload=payload)
