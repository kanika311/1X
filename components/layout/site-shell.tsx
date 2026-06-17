"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { CookieConsentBanner } from "@/components/layout/cookie-consent-banner";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { WhatsAppWidget } from "@/components/layout/whatsapp-widget";

export function SiteShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="page-glow flex flex-col">
      <Navbar scrolled={scrolled} />
      <main>{children}</main>
      <Footer />
      <WhatsAppWidget />
      <CookieConsentBanner />
    </div>
  );
}
