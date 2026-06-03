"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CollaborationPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
      <p className="eyebrow">Partnerships</p>
      <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">Business collaboration</h1>
      <p className="mt-6 text-base leading-relaxed text-muted">
        We work with clinics, gyms, universities, and enterprises for bulk therapy packages, cybersecurity upskilling,
        co-branded gift cards, and sponsored programs.
      </p>

      <ul className="mt-10 space-y-4">
        {[
          "Corporate cyber training & SOC readiness",
          "Workplace physiotherapy & wellness days",
          "Gift card & membership bundles for teams",
          "Co-marketing and referral partnerships",
        ].map((item) => (
          <li
            key={item}
            className="rounded-2xl border border-rose-100 bg-white/70 px-5 py-4 text-sm text-ink"
          >
            {item}
          </li>
        ))}
      </ul>

      <form
        className="glass mt-12 space-y-5 rounded-2xl p-8 shadow-soft"
        onSubmit={(e) => {
          e.preventDefault();
          alert("Thank you — our partnerships team will reach out within 2 business days.");
        }}
      >
        <h2 className="font-serif text-xl text-ink">Propose a collaboration</h2>
        <Input name="company" placeholder="Company / organisation" required />
        <Input name="name" placeholder="Your name" required />
        <Input name="email" type="email" placeholder="Work email" required />
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us about your partnership idea"
          required
          className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base text-ink outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-rose-200/80"
        />
        <Button type="submit" className="w-full">
          Submit proposal
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        Prefer email?{" "}
        <Link href="/contact" className="font-medium text-mauve-deep hover:underline">
          Contact us
        </Link>
      </p>
    </article>
  );
}
