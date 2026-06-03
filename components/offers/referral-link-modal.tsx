"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FiCheck, FiCopy, FiX } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  buildReferralShareMessage,
  buildReferralUrl,
  encodeReferralCode,
  whatsAppShareHref,
} from "@/lib/referral";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ReferralLinkModal({ open, onClose }: Props) {
  const { session, isReady } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  const code = session?.number ? encodeReferralCode(session.number) : "";
  const url ='https://1-x-phi.vercel.app/gift-cards';
  const shareMessage = useMemo(
    () => (url ? buildReferralShareMessage(url, session?.name) : ""),
    [url, session?.name],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setCopied(false);
    }
  }, [open]);

  const copyLink = useCallback(async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      /* fallback: user can select input */
    }
  }, [url]);

  const modal = (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="referral-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/55 p-3 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="referral-modal-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-rose-100/80 bg-white shadow-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative shrink-0 bg-gradient-to-r from-mauve-deep via-mauve to-rose-400 px-4 py-3 pr-10 text-white">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full border border-white/25 bg-white/10 transition hover:bg-white/20"
                aria-label="Close"
              >
                <FiX />
              </button>
              <p className="text-[10px] font-medium uppercase tracking-wider text-rose-100/90">Refer friends</p>
              <h2 id="referral-modal-title" className="font-serif text-lg leading-tight">
                Your referral link
              </h2>
            </div>

            <div className="px-4 py-4">
              {!isReady ? (
                <p className="text-center text-sm text-muted">Loading…</p>
              ) : !session ? (
                <div className="text-center">
                  <p className="text-sm text-muted">Sign in to get your personal referral link.</p>
                  <Link href="/login?next=/gift-cards" className="mt-4 block">
                    <Button className="w-full">Sign in</Button>
                  </Link>
                </div>
              ) : !code ? (
                <p className="text-center text-sm text-muted">Add a valid phone number on your account first.</p>
              ) : (
                <>
                  <p className="text-xs text-muted">
                    Friends who open this link land on 1X gift cards. You both unlock referral rewards when they join.
                  </p>
                  <label className="mt-3 block text-xs font-medium text-ink">Link</label>
                  <input
                    readOnly
                    value={url}
                    className="mt-1 w-full rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2 text-xs text-ink outline-none"
                    onFocus={(e) => e.target.select()}
                  />
                  <div className="mt-3 flex flex-col gap-2">
                    <Button type="button" className="w-full" onClick={() => void copyLink()}>
                      {copied ? (
                        <>
                          <FiCheck /> Copied
                        </>
                      ) : (
                        <>
                          <FiCopy /> Copy link
                        </>
                      )}
                    </Button>
                    <a
                      href={whatsAppShareHref(shareMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold",
                        "bg-[#25D366] text-white transition hover:bg-[#1ebe57]",
                      )}
                    >
                      <FaWhatsapp className="text-lg" />
                      Share on WhatsApp
                    </a>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(modal, document.body);
}
