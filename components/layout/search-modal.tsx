"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

import { offeringPath, CATEGORY_LABELS, DOMAIN_LABELS } from "@/lib/data/service-catalog";
import { useCatalog } from "@/components/providers/catalog-provider";

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { offerings } = useCatalog();
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    return offerings
      .filter((x) => x.title.toLowerCase().includes(query) || x.description.toLowerCase().includes(query))
      .slice(0, 8)
      .map((x) => ({
        title: x.title,
        href: offeringPath(x),
        type: `${DOMAIN_LABELS[x.domain]} · ${CATEGORY_LABELS[x.category]}`,
      }));
  }, [q, offerings]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/40 px-4 pt-24 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            onClick={(e) => e.stopPropagation()}
            className="glass w-full max-w-xl rounded-2xl p-6 shadow-glow"
          >
            <div className="flex items-center gap-3 border-b border-ink/10 pb-4">
              <FiSearch className="text-lg text-subtle" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search services…"
                className="flex-1 bg-transparent text-base text-ink outline-none placeholder:text-subtle"
              />
              <button type="button" onClick={onClose} aria-label="Close search">
                <FiX className="text-xl text-muted" />
              </button>
            </div>
            <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto">
              {results.length === 0 && q ? (
                <li className="py-4 text-center text-sm text-subtle">No results found</li>
              ) : (
                results.map((r) => (
                  <li key={r.href}>
                    <Link
                      href={r.href}
                      onClick={onClose}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-rose-50"
                    >
                      <span>{r.title}</span>
                      <span className="text-[10px] uppercase tracking-wide text-subtle">{r.type}</span>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
