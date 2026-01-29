from __future__ import annotations

from sqlalchemy.orm import Session

from app.models.note import Note
from app.schemas.note import NoteCreate


def list_notes(db: Session, *, user_id: int, limit: int = 50, offset: int = 0) -> list[Note]:
    return (
        db.query(Note)
        .filter(Note.user_id == user_id)
        .order_by(Note.id.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


def create_note(db: Session, *, user_id: int, payload: NoteCreate) -> Note:
    note = Note(user_id=user_id, title=payload.title, content=payload.content)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note
