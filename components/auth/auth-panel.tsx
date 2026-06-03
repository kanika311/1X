"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { BrandLogo, BrandTagline } from "@/components/brand/brand-logo";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mode = "login" | "signup";

function AuthPanelForm() {
  const { login, signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
    setSubmitting(true);
    const err =
      mode === "login"
        ? await login(phone, password)
        : await signup(name, phone, password);
    setSubmitting(false);
    if (err) {
      setError(err);
      return;
    }
    afterAuth();
  }

  return (
    <div className="glass w-full max-w-md rounded-[1.75rem] p-8 shadow-glow sm:p-10">
      <div className="text-center">
        <BrandLogo size="xl" />
        <BrandTagline size="xl" className="mt-1" />
      </div>

      <div className="mt-8 flex rounded-full bg-lavender-50 p-1">
        {(["login", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
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
              key="name"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
            </motion.div>
          ) : null}
        </AnimatePresence>
        <Input
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="Phone number (10 digits)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          minLength={10}
          maxLength={15}
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
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <Button type="submit" variant="default" className="w-full" disabled={submitting}>
          {submitting ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
        </Button>
      </form>

      {/* <p className="mt-4 text-center text-[11px] text-muted">
        Wishlist and bag are saved to your account on our server.
      </p> */}
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
