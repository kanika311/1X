"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { subscribeNewsletter } from "@/lib/newsletter-api";

export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      await subscribeNewsletter(email);
      setDone(true);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign up.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <p className="text-sm font-semibold lowercase tracking-wide text-mauve-deep">sign up for updates:</p>
      {done ? (
        <p className="mt-4 text-sm lowercase text-muted">thank you you&apos;re on the list.</p>
      ) : (
        <form onSubmit={(e) => void submit(e)} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email address"
            required
            className="min-h-11 flex-1 border border-mauve/30 bg-white px-4 text-base lowercase text-ink outline-none placeholder:text-subtle focus-visible:border-mauve/60"
          />
          <Button
            type="submit"
            variant="outline"
            disabled={submitting}
            className="min-h-11 rounded-none border-mauve/25 px-8 !normal-case !tracking-normal sm:shrink-0"
          >
            {submitting ? "…" : "submit"}
          </Button>
        </form>
      )}
      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
      <p className="mt-3 text-xs lowercase text-subtle">
        by signing up you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-2 transition-colors hover:text-mauve">
          terms and conditions
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-2 transition-colors hover:text-mauve">
          privacy policy
        </Link>
        .
      </p>
    </div>
  );
}
