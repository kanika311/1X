"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

import { StarRating } from "@/components/testimonials/star-rating";
import { fetchApprovedTestimonials, type Testimonial } from "@/lib/testimonials-api";

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

type Props = {
  showHeading?: boolean;
};

export function Testimonials({ showHeading = false }: Props) {
  const [reviews, setReviews] = useState<Testimonial[]>(FALLBACK);
  const [i, setI] = useState(0);

  useEffect(() => {
    fetchApprovedTestimonials(12).then((list) => {
      if (list.length > 0) setReviews(list);
    });
  }, []);

  useEffect(() => {
    if (reviews.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % reviews.length), 5500);
    return () => clearInterval(t);
  }, [reviews.length]);

  const r = reviews[i];
  if (!r) return null;

  return (
    <section className="mx-auto max-w-4xl rounded-3xl bg-rose-50/40 px-4 py-16 text-center sm:px-6 sm:py-24">
      {showHeading ? <p className="eyebrow">Client voices</p> : <p className="eyebrow">Testimonials</p>}
      <div className="mt-4 flex justify-center">
        <StarRating value={r.rating} readOnly size="sm" />
      </div>
      <AnimatePresence mode="wait">
        <motion.blockquote
          key={r._id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mt-10 text-xl leading-relaxed text-ink sm:text-2xl md:text-3xl"
        >
          &ldquo;{r.message}&rdquo;
        </motion.blockquote>
      </AnimatePresence>
      <div className="mt-8 flex flex-col items-center gap-3">
        {r.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={r.photo}
            alt={r.fullName}
            className="size-14 rounded-full border-2 border-rose-100 object-cover shadow-soft"
          />
        ) : null}
        <div>
          <p className="text-sm font-medium text-ink">{r.fullName}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-subtle">{r.serviceUsed}</p>
        </div>
      </div>
      {reviews.length > 1 ? (
        <div className="mt-8 flex justify-center gap-2">
          {reviews.map((_, idx) => (
            <button
              key={reviews[idx]._id}
              type="button"
              onClick={() => setI(idx)}
              className={`h-1 rounded-full transition-all ${idx === i ? "w-8 bg-ink" : "w-3 bg-ink/20"}`}
              aria-label={`Review ${idx + 1}`}
            />
          ))}
        </div>
      ) : null}
      {!showHeading ? (
        <Link
          href="/testimonials#share"
          className="mt-10 inline-block text-xs font-semibold uppercase tracking-wide text-mauve-deep hover:underline"
        >
          Share your experience
        </Link>
      ) : null}
    </section>
  );
}
