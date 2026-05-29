"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { AmiBot } from "@/components/chatbot/amibot";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export function SiteShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

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
      <AmiBot />
    </div>
  );
}
