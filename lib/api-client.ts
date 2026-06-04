const API = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_KEY = "onex-token";
console.log("NEXT_PUBLIC_API_URL =", process.env.NEXT_PUBLIC_API_URL);
console.log("API =", API);

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

  let res: Response;
  try {
    res = await fetch(`${API}${path}`, { ...rest, headers: h });
  } catch {
    throw new Error("Cannot reach API. Start onex-api on port 5000.");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data as T;
}
