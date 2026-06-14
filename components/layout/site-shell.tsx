"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { CookieConsentBanner } from "@/components/layout/cookie-consent-banner";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { WhatsAppWidget } from "@/components/layout/whatsapp-widget";
import { trackPageBeforeConsent } from "@/lib/cookie-consent-api";

export function SiteShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    trackPageBeforeConsent(pathname);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="page-glow flex min-h-dvh flex-col">
      <Navbar scrolled={scrolled} />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppWidget />
      <CookieConsentBanner />
    </div>
  );
}
