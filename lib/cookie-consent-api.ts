const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const COOKIE_CONSENT_STORAGE_KEY = "onex-cookie-consent";
export const COOKIE_VISITOR_ID_KEY = "onex-visitor-id";

export type CookieConsentPayload = {
  visitorId: string;
  pageUrl: string;
  referrer: string;
  userAgent: string;
};

export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(COOKIE_VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(COOKIE_VISITOR_ID_KEY, id);
  }
  return id;
}

export function hasAcceptedCookies(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY) === "accepted";
}

export function markCookiesAcceptedLocally() {
  localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "accepted");
}

export async function recordCookieConsent(payload: CookieConsentPayload): Promise<void> {
  const res = await fetch(`${API}/cookie-consents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Could not save cookie preference.");
  }
}
