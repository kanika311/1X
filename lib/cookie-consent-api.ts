const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const COOKIE_CONSENT_STORAGE_KEY = "onex-cookie-consent";
export const COOKIE_VISITOR_ID_KEY = "onex-visitor-id";
export const COOKIE_PAGES_KEY = "onex-pages-before-consent";
export const COOKIE_PREFS_KEY = "onex-cookie-preferences";

export type ConsentStatus = "accepted" | "rejected" | "customized";

export type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
};

export type CookieConsentPayload = {
  visitorId: string;
  status: ConsentStatus;
  pageUrl: string;
  referrer: string;
  userAgent: string;
  preferences?: CookiePreferences;
  pagesBeforeConsent?: { url: string; visitedAt: string }[];
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

export function getStoredConsentStatus(): ConsentStatus | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  if (raw === "accepted" || raw === "rejected" || raw === "customized") return raw;
  return null;
}

export function hasAcceptedCookies(): boolean {
  return getStoredConsentStatus() !== null;
}

export function getStoredPreferences(): CookiePreferences {
  if (typeof window === "undefined") {
    return { necessary: true, analytics: false, marketing: false, functional: false };
  }
  try {
    const raw = localStorage.getItem(COOKIE_PREFS_KEY);
    if (raw) return JSON.parse(raw) as CookiePreferences;
  } catch {
    /* ignore */
  }
  return { necessary: true, analytics: true, marketing: false, functional: true };
}

export function markConsentLocally(status: ConsentStatus, preferences?: CookiePreferences) {
  localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, status);
  if (preferences) {
    localStorage.setItem(COOKIE_PREFS_KEY, JSON.stringify({ ...preferences, necessary: true }));
  }
  sessionStorage.removeItem(COOKIE_PAGES_KEY);
}

export function trackPageBeforeConsent(path: string) {
  if (typeof window === "undefined" || hasAcceptedCookies()) return;
  try {
    const raw = sessionStorage.getItem(COOKIE_PAGES_KEY);
    const list: { url: string; visitedAt: string }[] = raw ? JSON.parse(raw) : [];
    const url = path.slice(0, 500);
    if (!list.some((p) => p.url === url)) {
      list.push({ url, visitedAt: new Date().toISOString() });
      sessionStorage.setItem(COOKIE_PAGES_KEY, JSON.stringify(list.slice(-50)));
    }
  } catch {
    /* ignore */
  }
}

export function getPagesBeforeConsent(): { url: string; visitedAt: string }[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(COOKIE_PAGES_KEY);
    return raw ? (JSON.parse(raw) as { url: string; visitedAt: string }[]) : [];
  } catch {
    return [];
  }
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

export async function fetchPublicCookiePolicy(): Promise<{
  currentVersion: string;
  categories: CookiePreferences;
} | null> {
  try {
    const res = await fetch(`${API}/cookie-consents/policy/public`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.policy) return null;
    return {
      currentVersion: data.policy.currentVersion,
      categories: data.policy.categories,
    };
  } catch {
    return null;
  }
}
