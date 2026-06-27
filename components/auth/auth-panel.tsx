"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { BrandLogo, BrandTagline } from "@/components/brand/brand-logo";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestUserPasswordReset } from "@/lib/user-auth";

type Mode = "login" | "signup" | "forgot";

function AuthPanelForm() {
  const { login, signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Forgot password state
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSubmitting, setResetSubmitting] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setResetMessage("");
    setResetError("");
  }

  function afterAuth() {
    const next = searchParams.get("next");
    if (next && next.startsWith("/") && !next.startsWith("/login")) {
      router.push(next);
      return;
    }
    if (typeof window !== "undefined" && window.location.pathname === "/profile") {
      router.refresh();
      return;
    }
    router.push("/");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!password.trim()) return;
    if (mode === "signup" && !phone.trim() && !email.trim()) {
      setError("Phone number ya email mein se kam se kam ek zaroori hai.");
      return;
    }
    setSubmitting(true);
    const err =
      mode === "login"
        ? await login(phone, password)
        : await signup(name, phone, password, email);
    setSubmitting(false);
    if (err) {
      setError(err);
      return;
    }
    afterAuth();
  }

  async function submitForgot(e: React.FormEvent) {
    e.preventDefault();
    setResetError("");
    setResetMessage("");
    if (!resetEmail.trim()) return;
    setResetSubmitting(true);
    try {
      const res = await requestUserPasswordReset(resetEmail);
      setResetMessage(res.message || "If that email is registered, a reset link has been sent.");
    } catch (err) {
      setResetError(err instanceof Error ? err.message : "Could not send reset email.");
    } finally {
      setResetSubmitting(false);
    }
  }

  return (
    <div className="glass w-full max-w-md rounded-[1.75rem] p-8 shadow-glow sm:p-10">
      <div className="text-center">
        <BrandLogo size="xl" />
        <BrandTagline size="xl" className="mt-1" />
      </div>

      {mode === "forgot" ? (
        <div className="mt-8">
          <h2 className="text-center font-serif text-xl text-ink">Reset your password</h2>
          <p className="mt-2 text-center text-sm text-muted">
            Enter the email linked to your account and we&apos;ll send a reset link.
          </p>

          <form onSubmit={submitForgot} className="mt-6 space-y-4">
            <Input
              type="email"
              autoComplete="email"
              placeholder="Email address"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            {resetMessage ? (
              <p className="rounded-xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900">
                {resetMessage}
              </p>
            ) : null}
            {resetError ? <p className="text-sm text-red-500">{resetError}</p> : null}
            <Button type="submit" variant="default" className="w-full" disabled={resetSubmitting}>
              {resetSubmitting ? "Sending…" : "Send reset link"}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => switchMode("login")}
            className="mt-5 block w-full text-center text-sm font-medium text-mauve-deep hover:underline"
          >
            Back to sign in
          </button>
        </div>
      ) : (
        <>
          <div className="mt-8 flex rounded-full bg-lavender-50 p-1">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`flex-1 rounded-full py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  mode === m ? "bg-white text-ink shadow-soft" : "text-muted"
                }`}
              >
                {m === "login" ? "Login" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <AnimatePresence mode="wait">
              {mode === "signup" ? (
                <motion.div
                  key="signup-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="Email (phone ke bina bhi chalega)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
            <Input
              type={mode === "login" ? "text" : "tel"}
              inputMode={mode === "login" ? "text" : "numeric"}
              autoComplete={mode === "login" ? "username" : "tel"}
              placeholder={mode === "login" ? "Phone number or email" : "Phone number (optional)"}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required={mode === "login"}
              maxLength={mode === "login" ? 60 : 15}
            />
            <div className="relative">
              <Input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
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
            {mode === "login" ? (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => switchMode("forgot")}
                  className="text-xs font-medium text-mauve-deep hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            ) : null}
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            <Button type="submit" variant="default" className="w-full" disabled={submitting}>
              {submitting ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}

export function AuthPanel() {
  return (
    <Suspense fallback={<div className="h-64 w-full max-w-md animate-pulse rounded-[1.75rem] bg-rose-100/50" />}>
      <AuthPanelForm />
    </Suspense>
  );
}
