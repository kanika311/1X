"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  fetchPublicCookiePolicy,
  getOrCreateVisitorId,
  getPagesBeforeConsent,
  getStoredPreferences,
  hasAcceptedCookies,
  markConsentLocally,
  recordCookieConsent,
  type ConsentStatus,
  type CookiePreferences,
} from "@/lib/cookie-consent-api";

const DEFAULT_PREFS: CookiePreferences = {
  necessary: true,
  analytics: true,
  marketing: false,
  functional: true,
};

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>(DEFAULT_PREFS);

  useEffect(() => {
    setVisible(!hasAcceptedCookies());
    setPrefs(getStoredPreferences());
    void fetchPublicCookiePolicy().then((policy) => {
      if (policy?.categories) {
        setPrefs((p) => ({ ...p, ...policy.categories, necessary: true }));
      }
    });
  }, []);

  async function submit(status: ConsentStatus, preferences: CookiePreferences) {
    setSubmitting(true);
    try {
      const visitorId = getOrCreateVisitorId();
      await recordCookieConsent({
        visitorId,
        status,
        pageUrl: window.location.pathname + window.location.search,
        referrer: document.referrer.slice(0, 500),
        userAgent: navigator.userAgent.slice(0, 500),
        preferences,
        pagesBeforeConsent: getPagesBeforeConsent(),
      });
      markConsentLocally(status, preferences);
      setVisible(false);
      setCustomizeOpen(false);
    } catch {
      markConsentLocally(status, preferences);
      setVisible(false);
      setCustomizeOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  function acceptAll() {
    void submit("accepted", { necessary: true, analytics: true, marketing: true, functional: true });
  }

  function rejectAll() {
    void submit("rejected", { necessary: true, analytics: false, marketing: false, functional: false });
  }

  function saveCustom() {
    const hasOptional = prefs.analytics || prefs.marketing || prefs.functional;
    void submit(hasOptional ? "customized" : "rejected", { ...prefs, necessary: true });
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-rose-100/80 bg-white/95 p-4 shadow-glow backdrop-blur-md sm:p-5"
    >
      <div className="mx-auto max-w-7xl">
        {!customizeOpen ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-muted">
              We use cookies to improve your experience on 1X. Choose Accept all, Reject non-essential, or customize
              your preferences. See our{" "}
              <Link href="/privacy" className="font-medium text-mauve-deep underline-offset-2 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button type="button" size="sm" variant="outline" disabled={submitting} onClick={() => setCustomizeOpen(true)}>
                Customize
              </Button>
              <Button type="button" size="sm" variant="outline" disabled={submitting} onClick={rejectAll}>
                Reject
              </Button>
              <Button type="button" size="sm" className="min-w-[100px]" disabled={submitting} onClick={acceptAll}>
                {submitting ? "Saving…" : "Accept all"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-ink">Cookie preferences</p>
                <p className="mt-1 text-sm text-muted">Necessary cookies are always enabled.</p>
              </div>
              <button
                type="button"
                className="text-sm text-muted hover:text-ink"
                onClick={() => setCustomizeOpen(false)}
              >
                Back
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["Necessary", "necessary", "Required for core site functionality.", true],
                  ["Analytics", "analytics", "Helps us understand how visitors use the site.", false],
                  ["Marketing", "marketing", "Used for relevant promotions and campaigns.", false],
                  ["Functional", "functional", "Enables enhanced features and personalization.", false],
                ] as const
              ).map(([label, key, desc, locked]) => (
                <label
                  key={key}
                  className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50/40 px-4 py-3"
                >
                  <input
                    type="checkbox"
                    checked={prefs[key]}
                    disabled={locked || submitting}
                    onChange={(e) => setPrefs((p) => ({ ...p, [key]: e.target.checked }))}
                    className="mt-1 accent-mauve-deep"
                  />
                  <span>
                    <span className="block text-sm font-medium text-ink">{label}</span>
                    <span className="block text-xs text-muted">{desc}</span>
                  </span>
                </label>
              ))}
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button type="button" size="sm" variant="outline" disabled={submitting} onClick={rejectAll}>
                Reject non-essential
              </Button>
              <Button type="button" size="sm" disabled={submitting} onClick={saveCustom}>
                {submitting ? "Saving…" : "Save preferences"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
