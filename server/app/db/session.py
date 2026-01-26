from __future__ import annotations

from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings


def _sqlite_url() -> str:
    # Resolve DB path relative to the `server/` folder (portable across CWDs)
    server_dir = Path(__file__).resolve().parents[2]
    configured = Path(settings.sqlite_path)
    db_path = configured if configured.is_absolute() else (server_dir / configured)

    # Ensure parent dir exists if user points to a nested path
    if db_path.parent and str(db_path.parent) not in (".", ""):
        db_path.parent.mkdir(parents=True, exist_ok=True)

    # `check_same_thread=False` allows using the same connection in different threads (FastAPI typical)
    return f"sqlite:///{db_path.as_posix()}"


engine = create_engine(
    _sqlite_url(),
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
