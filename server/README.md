# StudyBuddy Server (FastAPI + SQLite)

## Quickstart (Windows PowerShell)

From repo root:

```powershell
Set-Location -LiteralPath "D:\StudyBuddy\server"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt

# Optional
Copy-Item .env.example .env

# Run
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## Endpoints

- `GET /health` – basic health check
- `GET /api/v1/notes` – list notes
- `POST /api/v1/notes` – create note

## SQLite

The SQLite database file defaults to `server/app.db` (configurable via `SQLITE_PATH`).
