"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaApple, FaGoogle } from "react-icons/fa";

import { BrandLogo, BrandTagline } from "@/components/brand/brand-logo";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mode = "login" | "signup";

export function AuthPanel() {
  const { login, signup, continueAsGuest } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "login") login(email);
    else signup(name, email);
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
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="relative">
          <Input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
        <Button type="submit" variant="default" className="w-full">
          {mode === "login" ? "Sign In" : "Create Account"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-ink/10" />
        <span className="text-xs uppercase tracking-wide text-muted">or</span>
        <span className="h-px flex-1 bg-ink/10" />
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1" onClick={() => login("guest@1x.com")}>
          <FaGoogle className="text-base" /> Google
        </Button>
        <Button type="button" variant="outline" className="flex-1" onClick={() => login("guest@1x.com")}>
          <FaApple className="text-base" /> Apple
        </Button>
      </div>

      <button
        type="button"
        onClick={continueAsGuest}
        className="mt-6 w-full text-center text-xs font-semibold uppercase tracking-wide text-muted transition-colors hover:text-ink"
      >
        Continue as Guest
      </button>
    </div>
  );
}
