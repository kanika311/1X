"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";

import { PhotoUploadField } from "@/components/testimonials/photo-upload-field";
import { StarRating } from "@/components/testimonials/star-rating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchActiveProducts } from "@/lib/products-api";
import { submitTestimonial } from "@/lib/testimonials-api";

const FALLBACK_SERVICES = [
  "Sports Therapy",
  "Pain Relief Program",
  "SOC Analyst Course",
  "Ethical Hacking",
  "Geriatric Physiotherapy",
  "Cybersecurity Consultation",
  "Other 1X Service",
];

type TestimonialFormProps = {
  embedded?: boolean;
};

export function TestimonialForm({ embedded = false }: TestimonialFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [serviceUsed, setServiceUsed] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [consent, setConsent] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [services, setServices] = useState<string[]>(FALLBACK_SERVICES);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchActiveProducts()
      .then((products) => {
        if (products.length > 0) {
          setServices([...products.map((p) => p.title), "Other 1X Service"]);
        }
      })
      .catch(() => setServices(FALLBACK_SERVICES));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!consent) {
      setError("Please confirm your testimonial is based on your genuine experience.");
      return;
    }
    if (message.trim().length < 20) {
      setError("Please write at least 20 characters in your testimonial.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitTestimonial({
        fullName: fullName.trim(),
        email: email.trim(),
        serviceUsed,
        rating,
        message: message.trim(),
        serviceDate,
        consent,
        photo,
      });
      setSuccess(true);
      setFullName("");
      setEmail("");
      setServiceUsed("");
      setRating(5);
      setMessage("");
      setServiceDate("");
      setConsent(false);
      setPhoto(null);
      setError("");
      window.setTimeout(() => setSuccess(false), 8000);
      if (result.message) {
        /* message shown in success UI */
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className={embedded ? "relative w-full" : "relative mx-auto max-w-2xl"}>
      <AnimatePresence>
        {success ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/90 px-5 py-4 text-emerald-900 shadow-soft"
            role="status"
          >
            <FiCheck className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="font-medium">Thank you for sharing your experience!</p>
              <p className="mt-1 text-sm text-emerald-800/90">
                Your testimonial has been submitted and will appear on our site after a quick review.
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className={embedded ? "space-y-5" : "glass rounded-2xl p-6 shadow-soft sm:p-8"}
        style={embedded ? undefined : { borderRadius: "16px" }}
      >
        {!embedded ? (
          <header className="mb-8 text-center">
            <p className="eyebrow">Share your story</p>
            <h2 className="mt-2 text-2xl text-ink sm:text-3xl">Share your experience</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Real experiences help others trust 1X. Your review is moderated before it goes live.
            </p>
          </header>
        ) : (
          <p className="text-sm leading-relaxed text-muted">
            Real experiences help others trust 1X. Your review is moderated before it goes live.
          </p>
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-ink">
              Full name
            </label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              required
              maxLength={120}
            />
          </div>

          <PhotoUploadField value={photo} onChange={setPhoto} />

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="serviceUsed" className="mb-2 block text-sm font-medium text-ink">
              Service used
            </label>
            <select
              id="serviceUsed"
              value={serviceUsed}
              onChange={(e) => setServiceUsed(e.target.value)}
              required
              className="flex h-11 w-full rounded-xl border border-ink/15 bg-white px-4 text-base text-ink shadow-inner-soft transition-colors focus-visible:border-mauve/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200/80"
            >
              <option value="" disabled>
                Select a service
              </option>
              {services.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-ink">Rating</p>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-ink">
              Testimonial message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your experience with 1X…"
              required
              minLength={20}
              maxLength={2000}
              rows={5}
              className="w-full resize-y rounded-xl border border-ink/15 bg-white px-4 py-3 text-base text-ink placeholder:text-subtle shadow-inner-soft transition-colors focus-visible:border-mauve/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200/80"
            />
            <p className="mt-1 text-right text-xs text-subtle">{message.length}/2000</p>
          </div>

          <div>
            <label htmlFor="serviceDate" className="mb-2 block text-sm font-medium text-ink">
              Date of service
            </label>
            <Input
              id="serviceDate"
              type="date"
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
              max={today}
              required
            />
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-rose-100/80 bg-white/60 px-4 py-3">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 size-4 shrink-0 rounded border-rose-200 text-mauve-deep focus:ring-rose-300"
              required
            />
            <span className="text-sm leading-relaxed text-muted">
              I confirm this testimonial is based on my genuine experience.
            </span>
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit testimonial"}
          </Button>
        </div>
      </form>
    </div>
  );
}
