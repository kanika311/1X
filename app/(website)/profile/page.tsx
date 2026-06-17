"use client";

import { AuthPanel } from "@/components/auth/auth-panel";
import { ProfileDetails } from "@/components/profile/profile-details";
import { useAuth } from "@/components/providers/auth-provider";
import { SoftImage } from "@/components/ui/soft-image";

export default function ProfilePage() {
  const { session, isReady } = useAuth();

  return (
    <div className="relative bg-cream">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-0 size-80 rounded-full bg-rose-200/35 blur-3xl" />
        <div className="absolute bottom-0 right-0 size-72 rounded-full bg-lavender-100/60 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 size-96 -translate-x-1/2 rounded-full bg-peach-100/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:max-w-4xl">
        {!isReady ? (
          <div className="flex h-52 flex-col items-center justify-center gap-3">
            <div className="size-10 animate-pulse rounded-2xl bg-rose-100" />
            <p className="text-sm text-muted">Loading your account…</p>
          </div>
        ) : session ? (
          <ProfileDetails />
        ) : (
          <div className="space-y-6">
            <header className="text-center lg:text-left">
              <p className="eyebrow">Member account</p>
              <h1 className="mt-2 font-[family-name:var(--font-cormorant)] text-4xl text-ink">Your 1X profile</h1>
              <p className="mt-2 text-sm text-muted">Sign in to track orders, courses, and bookings.</p>
            </header>
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className="relative hidden aspect-[5/6] max-h-[480px] shadow-glow lg:block">
                <SoftImage
                  src="/physiotherapy.png"
                  alt="1X wellness and cyber"
                  overlay="profile"
                  rounded="3xl"
                  sizes="40vw"
                />
                <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ink/75 via-ink/30 to-transparent p-6 pt-16">
                  <p className="font-[family-name:var(--font-cormorant)] text-2xl leading-snug text-white">
                    One account for courses, care & orders.
                  </p>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <AuthPanel />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
