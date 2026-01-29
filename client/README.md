# StudyBuddy Client

## Google Sign-In (frontend-only)
The login/signup pages will render the real Google button immediately when `VITE_GOOGLE_CLIENT_ID` is set.

1. Copy `.env.local.example` to `.env.local` and set your Client ID:
```
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
VITE_API_BASE_URL=http://127.0.0.1:8000
```
2. Restart the Vite dev server so the env loads.

When set, the app skips fetching the client ID from the backend and directly initializes Google Identity Services.

## Troubleshooting
- If the button stays disabled, ensure the value is correct and that you restarted the dev server.
- In Google Cloud Console, add your dev origin (`http://127.0.0.1:5173` and/or `http://localhost:5173`) under Authorized JavaScript origins.
- Backend must be reachable at `VITE_API_BASE_URL` for the final `/api/v1/auth/google` call.
