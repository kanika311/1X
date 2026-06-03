"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";

import { useCatalog } from "@/components/providers/catalog-provider";
import { CategorySection } from "@/components/services/service-offering-card";
import {
  CYBER_SECTIONS,
  PHYSIO_SECTIONS,
  type ServiceDomain,
} from "@/lib/data/service-catalog";
import { cn } from "@/lib/utils";

const TABS: { key: ServiceDomain; label: string }[] = [
  { key: "cyber", label: "Cybersecurity" },
  { key: "physio", label: "Physiotherapy" },
];

export function ServicesHub() {
  const { getByCategory, loading, fromApi } = useCatalog();
  const [domain, setDomain] = useState<ServiceDomain>("cyber");

  const switchDomain = useCallback((next: ServiceDomain) => {
    setDomain(next);
  }, []);

  const sections = useMemo(() => {
    const sectionDefs = domain === "cyber" ? CYBER_SECTIONS : PHYSIO_SECTIONS;
    return sectionDefs.map((s) => ({
      ...s,
      items: getByCategory(domain, s.key),
    }));
  }, [domain, getByCategory]);

  return (
    <div>
      <header className=" text-center">
        <h1 className=" font-serif text-4xl text-ink md:text-5xl">Our Services</h1>
      
      </header>

      <div className="flex justify-center px-2">
        <div
          role="tablist"
          aria-label="Service domain"
          className="relative inline-flex w-full max-w-md rounded-full border border-rose-100 bg-rose-50/80 p-1.5 shadow-inner-soft mt-4"
        >
          {TABS.map((tab) => {
            const active = domain === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => switchDomain(tab.key)}
                className={cn(
                  "relative z-10 flex-1 rounded-full py-3 text-xs font-semibold uppercase tracking-wide transition-colors duration-300 sm:text-sm",
                  active ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="service-domain-pill"
                    className="absolute inset-0 rounded-full bg-white shadow-soft"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <span className="relative">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <p className="mt-12 text-center text-sm text-muted">Loading services…</p>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={domain}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-16 md:space-y-20"
          >
            {sections.map((section) =>
              section.items.length > 0 ? (
                <CategorySection
                  key={`${domain}-${section.key}`}
                  label={section.label}
                  domain={domain}
                  category={section.key}
                  items={section.items}
                />
              ) : null,
            )}
            {sections.every((s) => s.items.length === 0) ? (
              <p className="py-12 text-center text-muted">
                No active programs in this section. Add products in the admin panel.
              </p>
            ) : null}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
