from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.crud.notes import create_note, list_notes
from app.db.deps import get_db
from app.schemas.note import NoteCreate, NoteOut

router = APIRouter()


@router.get("/", response_model=list[NoteOut])
def get_notes(db: Session = Depends(get_db)) -> list[NoteOut]:
    return list_notes(db)


@router.post("/", response_model=NoteOut)
def post_note(payload: NoteCreate, db: Session = Depends(get_db)) -> NoteOut:
    return create_note(db, payload)
