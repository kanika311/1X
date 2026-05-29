"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";

const REVIEWS = [
  {
    quote:
      "The SOC Analyst course gave me real SIEM experience. I landed my first security role within two months.",
    name: "Arjun Mehta",
    role: "SOC Analyst · 1X Graduate",
  },
  {
    quote:
      "Dr. Ayesha’s sports therapy program transformed my recovery after ACL surgery. Truly luxury care.",
    name: "Priya Sharma",
    role: "Athlete · Pain Relief Client",
  },
  {
    quote:
      "Ethical hacking labs were intense and practical. The 1X platform feels as premium as top global brands.",
    name: "Rohan Kapoor",
    role: "Penetration Tester",
  },
] as const;

export function Testimonials() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % REVIEWS.length), 5500);
    return () => clearInterval(t);
  }, []);

  const r = REVIEWS[i];

  return (
    <section className="mx-auto max-w-4xl rounded-3xl bg-rose-50/40 px-4 py-24 text-center sm:px-6">
      <p className="eyebrow">Testimonials</p>
      <div className="mt-4 flex justify-center gap-1 text-rose-400">
        {Array.from({ length: 5 }).map((_, idx) => (
          <FiStar key={idx} className="fill-current" />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.blockquote
          key={r.name}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mt-10 font-serif text-2xl leading-relaxed text-ink md:text-3xl"
        >
          &ldquo;{r.quote}&rdquo;
        </motion.blockquote>
      </AnimatePresence>
      <p className="mt-8 text-sm font-medium text-ink">{r.name}</p>
      <p className="text-xs uppercase tracking-[0.2em] text-subtle">{r.role}</p>
      <div className="mt-8 flex justify-center gap-2">
        {REVIEWS.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setI(idx)}
            className={`h-1 rounded-full transition-all ${idx === i ? "w-8 bg-ink" : "w-3 bg-ink/20"}`}
            aria-label={`Review ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
