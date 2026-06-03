const REFERRAL_STORAGE_KEY = "onex-ref-from";
const REFERRAL_NAME_KEY = "onex-ref-from-name";

/** Stable short code from member phone (last 10 digits). */
export function encodeReferralCode(phone: string): string {
  const digits = phone.replace(/\D/g, "").slice(-10);
  if (digits.length < 10) return "";
  return btoa(digits).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeReferralCode(code: string): string | null {
  try {
    const normalized = code.trim().replace(/-/g, "+").replace(/_/g, "/");
    const pad = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
    const raw = atob(normalized + pad);
    const digits = raw.replace(/\D/g, "");
    return digits.length >= 10 ? digits : null;
  } catch {
    return null;
  }
}

export function buildReferralUrl(code: string): string {
  const path = `/gift-cards?ref=${encodeURIComponent(code)}`;
  if (typeof window === "undefined") return path;
  return `${window.location.origin}${path}`;
}

export function buildReferralShareMessage(url: string, referrerName?: string) {
  const who = referrerName?.trim() ? `${referrerName.trim()} invited you` : "A friend invited you";
  return `${who} to 1X — Dr. Ayxh gift cards & founding member benefits.\n\nJoin here:\n${url}`;
}

export function whatsAppShareHref(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function storeReferralCode(code: string, referrerName?: string) {
  if (!code.trim()) return;
  localStorage.setItem(REFERRAL_STORAGE_KEY, code.trim());
  if (referrerName?.trim()) {
    localStorage.setItem(REFERRAL_NAME_KEY, referrerName.trim());
  }
}

export function getStoredReferralCode(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFERRAL_STORAGE_KEY);
}

export function getStoredReferrerName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFERRAL_NAME_KEY);
}

export function clearStoredReferral() {
  localStorage.removeItem(REFERRAL_STORAGE_KEY);
  localStorage.removeItem(REFERRAL_NAME_KEY);
}
