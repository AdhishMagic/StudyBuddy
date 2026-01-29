type JsonValue = any;

const apiBaseUrl = (() => {
  const fromEnv = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
  return fromEnv?.trim() ? fromEnv.trim() : "http://127.0.0.1:8000";
})();

export function getAuthToken(): string {
  try {
    return localStorage.getItem("authToken") || "";
  } catch {
    return "";
  }
}

function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGetMe() {
  const res = await fetch(`${apiBaseUrl}/api/v1/auth/me`, {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });
  if (!res.ok) throw new Error("Not authenticated");
  return (await res.json()) as { id: number; email?: string | null; name?: string | null; picture?: string | null };
}

export async function apiGetUserData<T = JsonValue>(key: string): Promise<T> {
  const res = await fetch(`${apiBaseUrl}/api/v1/user-data/${encodeURIComponent(key)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });
  if (res.status === 404) throw new Error("NotFound");
  if (!res.ok) throw new Error("Request failed");
  const data = (await res.json()) as { key: string; value: T };
  return data.value;
}

export async function apiPutUserData<T = JsonValue>(key: string, value: T): Promise<void> {
  const res = await fetch(`${apiBaseUrl}/api/v1/user-data/${encodeURIComponent(key)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ value }),
  });
  if (!res.ok) throw new Error("Request failed");
}

export async function apiSignupEmail(payload: { name?: string | null; email: string; password: string }) {
  const res = await fetch(`${apiBaseUrl}/api/v1/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as {
    access_token: string;
    token_type: string;
    user: { id: number; email?: string | null; name?: string | null; picture?: string | null };
  };
}

export async function apiLoginEmail(payload: { email: string; password: string }) {
  const res = await fetch(`${apiBaseUrl}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Invalid email or password");
  return (await res.json()) as {
    access_token: string;
    token_type: string;
    user: { id: number; email?: string | null; name?: string | null; picture?: string | null };
  };
}
