"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  getOrCreateVisitorId,
  hasAcceptedCookies,
  markCookiesAcceptedLocally,
  recordCookieConsent,
} from "@/lib/cookie-consent-api";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setVisible(!hasAcceptedCookies());
  }, []);

  async function accept() {
    setSubmitting(true);
    try {
      const visitorId = getOrCreateVisitorId();
      await recordCookieConsent({
        visitorId,
        pageUrl: window.location.pathname + window.location.search,
        referrer: document.referrer.slice(0, 500),
        userAgent: navigator.userAgent.slice(0, 500),
      });
      markCookiesAcceptedLocally();
      setVisible(false);
    } catch {
      markCookiesAcceptedLocally();
      setVisible(false);
    } finally {
      setSubmitting(false);
    }
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-rose-100/80 bg-white/95 p-4 shadow-glow backdrop-blur-md sm:p-5"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-muted">
          We use cookies to improve your experience on 1X. By clicking Accept, you agree to our use of cookies. See
          our{" "}
          <Link href="/privacy" className="font-medium text-mauve-deep underline-offset-2 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
        <Button type="button" size="sm" className="shrink-0 sm:min-w-[120px]" disabled={submitting} onClick={() => void accept()}>
          {submitting ? "Saving…" : "Accept cookies"}
        </Button>
      </div>
    </div>
  );
}
