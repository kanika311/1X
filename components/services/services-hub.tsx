"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";

import { useCatalog } from "@/components/providers/catalog-provider";
import { CategorySection } from "@/components/services/service-offering-card";
import {
  CYBER_SECTIONS,
  PHYSIO_SECTIONS,
  type ServiceDomain,
} from "@/lib/data/service-catalog";

type ServicesHubProps = {
  initialDomain?: ServiceDomain;
};

export function ServicesHub({ initialDomain = "cyber" }: ServicesHubProps) {
  const { getByCategory, loading } = useCatalog();
  const domain = initialDomain;

  const sections = useMemo(() => {
    const sectionDefs = domain === "cyber" ? CYBER_SECTIONS : PHYSIO_SECTIONS;
    return sectionDefs.map((s) => ({
      ...s,
      items: getByCategory(domain, s.key),
    }));
  }, [domain, getByCategory]);

  return (
    <div>
      {loading ? (
        <p className="mt-4 text-center text-sm text-muted">Loading services…</p>
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
