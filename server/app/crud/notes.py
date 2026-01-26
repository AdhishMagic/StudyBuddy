from __future__ import annotations

from sqlalchemy.orm import Session

from app.models.note import Note
from app.schemas.note import NoteCreate


def list_notes(db: Session, limit: int = 50, offset: int = 0) -> list[Note]:
    return (
        db.query(Note)
        .order_by(Note.id.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


def create_note(db: Session, payload: NoteCreate) -> Note:
    note = Note(title=payload.title, content=payload.content)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note
