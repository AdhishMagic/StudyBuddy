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

## Google Sign-In setup

The app supports Google authentication via Google Identity Services.

1. Create OAuth credentials in Google Cloud Console and note:
	- OAuth Client ID (Web application)
	- Client secret
	- Authorized JavaScript origins: include your client URL (e.g. `http://127.0.0.1:5173`)
	- Authorized redirect URIs: if using code flow with `/api/v1/auth/google/code`, add your callback URL.

2. Add these to `server/.env`:

```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

3. The client fetches the ID from `GET /api/v1/auth/google/client-id`. Alternatively set `VITE_GOOGLE_CLIENT_ID` in the client env.

## Endpoints

- `GET /health` – basic health check
- `GET /api/v1/notes` – list notes
- `POST /api/v1/notes` – create note

## SQLite

The SQLite database file defaults to `server/app.db` (configurable via `SQLITE_PATH`).
