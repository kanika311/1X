import { getApiBaseUrl } from "@/lib/api-base";

const TOKEN_KEY = "onex-token";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth = false, headers, ...rest } = options;
  const h: HeadersInit = { "Content-Type": "application/json", ...(headers || {}) };
  if (auth) {
    const token = getAuthToken();
    if (!token) throw new Error("Not signed in");
    (h as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const apiBase = getApiBaseUrl();
  const url = `${apiBase}${path.startsWith("/") ? path : `/${path}`}`;

  let res: Response;
  try {
    res = await fetch(url, { ...rest, headers: h });
  } catch {
    throw new Error("Cannot reach API. Check your connection or API configuration.");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { message?: string }).message || `Request failed (${res.status})`);
  }
  return data as T;
}
