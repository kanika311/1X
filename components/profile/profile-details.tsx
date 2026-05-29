"use client";

import { FiLogOut, FiMail, FiUser } from "react-icons/fi";

import { BrandLogo, BrandTagline } from "@/components/brand/brand-logo";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";

export function ProfileDetails() {
  const { session, logout } = useAuth();

  if (!session) return null;

  const displayName =
    session.type === "guest" ? "Guest" : session.name?.trim() || session.email?.split("@")[0] || "Member";
  const email = session.type === "guest" ? "Browsing as guest" : session.email ?? "—";
  const accountLabel = session.type === "guest" ? "Guest account" : "Registered member";

  return (
    <div className="glass w-full max-w-lg rounded-3xl p-8 shadow-glow sm:p-10">
      <div className="text-center">
        <BrandLogo size="lg" />
        <BrandTagline size="lg" className="mt-1" />
      </div>

      <div className="mt-10 flex flex-col items-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-lavender-100 text-ink">
          <FiUser className="text-3xl" />
        </div>
        <h1 className="mt-5 font-serif text-2xl text-ink">{displayName}</h1>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">{accountLabel}</p>
      </div>

      <dl className="mt-10 space-y-4">
        <div className="flex items-start gap-3 rounded-2xl border border-ink/8 bg-white/60 px-4 py-3.5">
          <FiUser className="mt-0.5 shrink-0 text-subtle" />
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Name</dt>
            <dd className="mt-0.5 text-base text-ink">{displayName}</dd>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-2xl border border-ink/8 bg-white/60 px-4 py-3.5">
          <FiMail className="mt-0.5 shrink-0 text-subtle" />
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Email</dt>
            <dd className="mt-0.5 text-base text-ink">{email}</dd>
          </div>
        </div>
      </dl>

      <Button type="button" variant="outline" className="mt-10 w-full" onClick={logout}>
        <FiLogOut /> Sign Out
      </Button>
    </div>
  );
}
