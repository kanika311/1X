"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";

import { CategorySection } from "@/components/services/service-offering-card";
import {
  CYBER_SECTIONS,
  DOMAIN_LABELS,
  PHYSIO_SECTIONS,
  PHYSIO_TECHNIQUES,
  getOfferingsByCategory,
  type ServiceDomain,
} from "@/lib/data/service-catalog";
import { cn } from "@/lib/utils";

const TABS: { key: ServiceDomain; label: string }[] = [
  { key: "cyber", label: "Cybersecurity" },
  { key: "physio", label: "Physiotherapy" },
];

export function ServicesHub() {
  const [domain, setDomain] = useState<ServiceDomain>("cyber");

  const switchDomain = useCallback((next: ServiceDomain) => {
    setDomain(next);
  }, []);

  const sections =
    domain === "cyber"
      ? CYBER_SECTIONS.map((s) => ({
          ...s,
          items: getOfferingsByCategory("cyber", s.key),
        }))
      : PHYSIO_SECTIONS.map((s) => ({
          ...s,
          items: getOfferingsByCategory("physio", s.key),
        }));

  return (
    <div>
      <header className="mb-12 text-center">
        {/* <p className="eyebrow">Our offerings</p> */}
        <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">Our Services</h1>
        {/* <p className="mx-auto mt-4 max-w-xl text-base text-muted">
          Premium cybersecurity courses and managed services — plus expert physiotherapy by Dr. Ayesha.
        </p> */}
      </header>

      <div className="mb-14 flex justify-center px-2">
        <div
          role="tablist"
          aria-label="Service domain"
          className="relative inline-flex w-full max-w-md rounded-full border border-rose-100 bg-rose-50/80 p-1.5 shadow-inner-soft"
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

      <AnimatePresence mode="wait">
        <motion.div
          key={domain}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-16 md:space-y-20"
        >
          {/* <p className="text-center text-sm text-muted">
            Showing <span className="font-medium text-ink">{DOMAIN_LABELS[domain]}</span> programs
          </p> */}
          {/* {domain === "physio" ? (
            <div className="rounded-3xl border border-rose-100 bg-rose-50/60 px-6 py-8 text-center shadow-soft">
              <p className="eyebrow">Techniques we use</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Evidence-based methods tailored to your recovery
              </p>
              <ul className="mt-5 flex flex-wrap justify-center gap-2">
                {PHYSIO_TECHNIQUES.map((technique) => (
                  <li
                    key={technique}
                    className="rounded-full border border-rose-200/80 bg-white/80 px-4 py-2 text-xs font-medium text-ink"
                  >
                    {technique}
                  </li>
                ))}
              </ul>
            </div>
          ) : null} */}
          {sections.map((section) => (
            <CategorySection
              key={`${domain}-${section.key}`}
              label={section.label}
              domain={domain}
              category={section.key}
              items={section.items}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
