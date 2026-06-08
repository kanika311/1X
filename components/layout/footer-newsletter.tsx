"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
    setEmail("");
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <p className="text-sm font-semibold lowercase tracking-wide text-mauve-deep">sign up for updates:</p>
      {done ? (
        <p className="mt-4 text-sm lowercase text-muted">thank you you&apos;re on the list.</p>
      ) : (
        <form onSubmit={submit} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch">
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
            className="min-h-11 rounded-none border-mauve/25 px-8 !normal-case !tracking-normal sm:shrink-0"
          >
            submit
          </Button>
        </form>
      )}
      <p className="mt-3 text-xs lowercase text-subtle">
        by signing up you agree to our{" "}
        <Link href="/contact" className="underline underline-offset-2 hover:text-mauve">
          terms
        </Link>
        .
      </p>
    </div>
  );
}
