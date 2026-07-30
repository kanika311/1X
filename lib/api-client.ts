import { getApiBaseUrl } from "@/lib/api-base";

const FETCH_CREDENTIALS: RequestCredentials = "include";

export function getAuthToken(): string | null {
  return null;
}

export function setAuthToken(_token: string | null) {
  /* Tokens are stored in httpOnly cookies — not accessible from JavaScript. */
}

async function refreshSessionIfNeeded(res: Response, path: string): Promise<boolean> {
  if (res.status !== 401) return false;
  // Session probe — 401 means logged out; don't chain another failing refresh call.
  if (path === "/auth/me" || path.endsWith("/auth/me")) return false;
  const refreshRes = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
    method: "POST",
    credentials: FETCH_CREDENTIALS,
  });
  return refreshRes.ok;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth = false, headers, ...rest } = options;
  const h: HeadersInit = { "Content-Type": "application/json", ...(headers || {}) };

  const apiBase = getApiBaseUrl();
  const url = `${apiBase}${path.startsWith("/") ? path : `/${path}`}`;

  let res: Response;
  try {
    res = await fetch(url, { ...rest, headers: h, credentials: FETCH_CREDENTIALS });
  } catch {
    throw new Error("Cannot reach API. Check your connection or API configuration.");
  }

  if (auth && res.status === 401) {
    const refreshed = await refreshSessionIfNeeded(res, path);
    if (refreshed) {
      res = await fetch(url, { ...rest, headers: h, credentials: FETCH_CREDENTIALS });
    }
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { message?: string }).message || `Request failed (${res.status})`);
  }
  return data as T;
}

export async function logoutSession() {
  await fetch(`${getApiBaseUrl()}/auth/logout`, {
    method: "POST",
    credentials: FETCH_CREDENTIALS,
  }).catch(() => {});
}
