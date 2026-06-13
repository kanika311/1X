"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { TestimonialForm } from "@/components/testimonials/testimonial-form";
import { TestimonialsAllList } from "@/components/testimonials/testimonials-all-list";
import { cn } from "@/lib/utils";

type TestimonialsTab = "reviews" | "share";

const TABS: { id: TestimonialsTab; label: string }[] = [
  { id: "reviews", label: "All testimonials" },
  { id: "share", label: "Share your experience" },
];

export function TestimonialsPageContent() {
  const [tab, setTab] = useState<TestimonialsTab>("reviews");

  useEffect(() => {
    if (window.location.hash === "#share") {
      setTab("share");
    }
  }, []);

  function selectTab(next: TestimonialsTab) {
    setTab(next);
    window.history.replaceState(null, "", next === "share" ? "/testimonials#share" : "/testimonials");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10 text-center"
      >
      
        <h1 className="mt-3 text-3xl text-ink md:text-4xl">Client voices</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
          Read what our clients say about 1X.
        </p>
      </motion.header>

      <div
        role="tablist"
        aria-label="Testimonials"
        className="mx-auto mb-10 flex max-w-xl gap-1 rounded-2xl border border-rose-100/80 bg-white/60 p-1 shadow-soft"
      >
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={id === "share" ? "share-tab" : "reviews-tab"}
            aria-selected={tab === id}
            aria-controls={id === "share" ? "share-panel" : "reviews-panel"}
            onClick={() => selectTab(id)}
            className={cn(
              "relative flex-1 rounded-xl px-3 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors sm:px-4 sm:text-sm",
              tab === id ? "text-white" : "text-muted hover:bg-rose-50/80 hover:text-ink",
            )}
          >
            {tab === id ? (
              <motion.span
                layoutId="testimonials-tab"
                className="absolute inset-0 rounded-xl bg-ink shadow-sm"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            ) : null}
            <span className="relative z-10">{label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "reviews" ? (
          <motion.div
            key="reviews"
            id="reviews-panel"
            role="tabpanel"
            aria-labelledby="reviews-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <TestimonialsAllList />
          </motion.div>
        ) : (
          <motion.div
            key="share"
            id="share-panel"
            role="tabpanel"
            aria-labelledby="share-tab"
            className="scroll-mt-28"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <TestimonialForm />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
