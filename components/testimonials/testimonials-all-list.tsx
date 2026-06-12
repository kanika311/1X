"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { StarRating } from "@/components/testimonials/star-rating";
import { fetchApprovedTestimonials, type Testimonial } from "@/lib/testimonials-api";
import { cn } from "@/lib/utils";

const FALLBACK: Testimonial[] = [
  {
    _id: "1",
    fullName: "Arjun Mehta",
    email: "",
    photo: "",
    serviceUsed: "SOC Analyst Course",
    rating: 5,
    message:
      "The SOC Analyst course gave me real SIEM experience. I landed my first security role within two months.",
    serviceDate: "",
    status: "approved",
    featured: false,
    createdAt: "",
  },
  {
    _id: "2",
    fullName: "Priya Sharma",
    email: "",
    photo: "",
    serviceUsed: "Sports Therapy",
    rating: 5,
    message:
      "Dr. Ayxh sports therapy program transformed my recovery after ACL surgery. Truly luxury care.",
    serviceDate: "",
    status: "approved",
    featured: false,
    createdAt: "",
  },
  {
    _id: "3",
    fullName: "Rohan Kapoor",
    email: "",
    photo: "",
    serviceUsed: "Ethical Hacking",
    rating: 5,
    message:
      "Ethical hacking labs were intense and practical. The 1X platform feels as premium as top global brands.",
    serviceDate: "",
    status: "approved",
    featured: false,
    createdAt: "",
  },
];

const AUTO_MS = 5500;

export function TestimonialsAllList() {
  const [reviews, setReviews] = useState<Testimonial[]>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    fetchApprovedTestimonials(50)
      .then((list) => {
        if (list.length > 0) setReviews(list);
      })
      .finally(() => setLoading(false));
  }, []);

  const count = reviews.length;
  const current = reviews[active];

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActive(((index % count) + count) % count);
    },
    [count],
  );

  const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);
  const goNext = useCallback(() => goTo(active + 1), [active, goTo]);

  useEffect(() => {
    if (count < 2 || paused) return;
    const t = window.setInterval(() => setActive((v) => (v + 1) % count), AUTO_MS);
    return () => window.clearInterval(t);
  }, [count, paused]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl animate-pulse rounded-3xl bg-rose-50/50 px-6 py-20 text-center">
        <div className="mx-auto h-4 w-32 rounded-full bg-rose-100" />
        <div className="mx-auto mt-10 h-8 w-full max-w-lg rounded-lg bg-rose-100/80" />
        <div className="mx-auto mt-4 h-8 w-full max-w-md rounded-lg bg-rose-100/60" />
        <div className="mx-auto mt-10 size-14 rounded-full bg-rose-100" />
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="space-y-16">
      <section
        className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-b from-rose-50/70 via-rose-50/40 to-white px-4 py-14 text-center shadow-soft sm:px-8 sm:py-20"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-live="polite"
        aria-atomic="true"
      >
        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-rose-100 bg-white/90 text-ink shadow-soft transition hover:bg-white hover:text-mauve-deep sm:left-5"
              aria-label="Previous testimonial"
            >
              <FiChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-rose-100 bg-white/90 text-ink shadow-soft transition hover:bg-white hover:text-mauve-deep sm:right-5"
              aria-label="Next testimonial"
            >
              <FiChevronRight className="size-5" />
            </button>
          </>
        ) : null}

        <p className="eyebrow">Featured review</p>

        <div className="mt-4 flex justify-center">
          <StarRating value={current.rating} readOnly size="sm" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current._id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <blockquote className="mt-8 text-xl leading-relaxed text-ink sm:text-2xl md:text-3xl">
              &ldquo;{current.message}&rdquo;
            </blockquote>

            <div className="mt-8 flex flex-col items-center gap-3">
              {current.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={current.photo}
                  alt={current.fullName}
                  className="size-16 rounded-full border-2 border-rose-100 object-cover shadow-soft"
                />
              ) : (
                <div className="flex size-16 items-center justify-center rounded-full border-2 border-rose-100 bg-white text-xl font-medium text-mauve-deep shadow-soft">
                  {current.fullName.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-base font-medium text-ink">{current.fullName}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-subtle">{current.serviceUsed}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {count > 1 ? (
          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="flex justify-center gap-2">
              {reviews.map((r, idx) => (
                <button
                  key={r._id}
                  type="button"
                  onClick={() => goTo(idx)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    idx === active ? "w-10 bg-ink" : "w-3 bg-ink/20 hover:bg-ink/40",
                  )}
                  aria-label={`Go to review ${idx + 1}`}
                  aria-current={idx === active}
                />
              ))}
            </div>
            <p className="text-xs uppercase tracking-wide text-subtle">
              {active + 1} of {count}
            </p>
          </div>
        ) : null}
      </section>

      {count > 1 ? (
        <div>
          <p className="eyebrow mb-8 text-center">All reviews</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r, idx) => (
              <motion.button
                key={r._id}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, duration: 0.35 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => goTo(idx)}
                className={cn(
                  "flex flex-col rounded-2xl border p-6 text-left shadow-soft transition-shadow",
                  idx === active
                    ? "border-mauve/40 bg-white ring-2 ring-mauve/20"
                    : "border-rose-100/80 bg-white/70 hover:border-rose-200 hover:shadow-glow",
                )}
              >
                <StarRating value={r.rating} readOnly size="sm" />
                <p className="mt-4 line-clamp-4 flex-1 text-sm leading-relaxed text-ink">
                  &ldquo;{r.message}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-rose-100/60 pt-4">
                  {r.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.photo}
                      alt={r.fullName}
                      className="size-9 shrink-0 rounded-full border border-rose-100 object-cover"
                    />
                  ) : (
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-rose-50 text-xs font-medium text-mauve-deep">
                      {r.fullName.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{r.fullName}</p>
                    <p className="truncate text-xs uppercase tracking-wide text-subtle">{r.serviceUsed}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-md rounded-2xl border border-rose-100/80 bg-white/70 p-6 shadow-soft"
        >
          <StarRating value={current.rating} readOnly size="sm" />
          <blockquote className="mt-4 text-sm leading-relaxed text-ink">
            &ldquo;{current.message}&rdquo;
          </blockquote>
          <div className="mt-5 flex items-center gap-3 border-t border-rose-100/60 pt-4">
            {current.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.photo}
                alt={current.fullName}
                className="size-10 rounded-full border border-rose-100 object-cover"
              />
            ) : (
              <div className="flex size-10 items-center justify-center rounded-full bg-rose-50 text-sm font-medium text-mauve-deep">
                {current.fullName.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-ink">{current.fullName}</p>
              <p className="text-xs uppercase tracking-wide text-subtle">{current.serviceUsed}</p>
            </div>
          </div>
        </motion.article>
      )}
    </div>
  );
}
