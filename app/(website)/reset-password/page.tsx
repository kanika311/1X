"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetUserPassword } from "@/lib/user-auth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-sm text-red-500">This reset link is invalid or missing a token.</p>
        <Link href="/login" className="mt-4 inline-block text-sm font-medium text-mauve-deep hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <p className="text-sm text-ink">Your password has been updated.</p>
        <Button type="button" className="mt-6 w-full" onClick={() => router.replace("/login")}>
          Sign in
        </Button>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setSubmitting(true);
    try {
      await resetUserPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset password");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="relative">
        <Input
          type={showPass ? "text" : "password"}
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowPass((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle"
          aria-label={showPass ? "Hide password" : "Show password"}
        >
          {showPass ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      <Input
        type={showPass ? "text" : "password"}
        placeholder="Confirm new password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
        minLength={6}
        autoComplete="new-password"
      />
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative overflow-hidden bg-cream">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 size-[420px] rounded-full bg-rose-200/50 blur-3xl" />
        <div className="absolute bottom-0 right-0 size-[380px] rounded-full bg-peach-100/90 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-16 sm:px-6">
        <div className="glass w-full rounded-[1.75rem] p-8 shadow-glow sm:p-10">
          <h1 className="text-center font-serif text-2xl text-ink">Set new password</h1>
          <p className="mt-2 text-center text-sm text-muted">
            Choose a new password for your 1X account.
          </p>

          <div className="mt-8">
            <Suspense fallback={<p className="text-center text-sm text-muted">Loading…</p>}>
              <ResetPasswordForm />
            </Suspense>
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            <Link href="/login" className="font-medium text-mauve-deep hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
