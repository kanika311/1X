"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

import { BrandHomeLink } from "@/components/brand/brand-logo";
import { useAuth } from "@/components/providers/auth-provider";
import { FOOTER_LEGAL, MOBILE_NAV } from "@/lib/nav";

export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { session, logout } = useAuth();

  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          className="fixed inset-y-0 left-0 z-[65] flex w-[min(88vw,320px)] flex-col bg-white shadow-glow"
        >
          <div className="flex items-center justify-between border-b border-ink/8 px-6 py-5">
            <BrandHomeLink size="sm" onNavigate={onClose} />
            <button type="button" onClick={onClose} aria-label="Close menu">
              <FiX className="text-2xl" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
            {MOBILE_NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="rounded-lg px-4 py-3.5 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-rose-50"
              >
                {label}
              </Link>
            ))}
            <p className="mt-6 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-subtle">More</p>
            {FOOTER_LEGAL.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="rounded-lg px-4 py-3 text-sm capitalize text-muted transition-colors hover:bg-rose-50 hover:text-ink"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/profile"
              onClick={onClose}
              className="rounded-lg px-4 py-3 text-sm font-semibold uppercase tracking-wide text-muted transition-colors hover:bg-rose-50"
            >
              Profile
            </Link>
          </nav>
          {session ? (
            <div className="border-t border-ink/8 p-6">
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full text-[11px] uppercase tracking-[0.2em] text-muted"
              >
                Sign out
              </button>
            </div>
          ) : null}
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
