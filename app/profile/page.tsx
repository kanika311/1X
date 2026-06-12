"use client";

import { AuthPanel } from "@/components/auth/auth-panel";
import { ProfileDetails } from "@/components/profile/profile-details";
import { useAuth } from "@/components/providers/auth-provider";
import { SoftImage } from "@/components/ui/soft-image";
import { IMG } from "@/lib/images";

export default function ProfilePage() {
  const { session, isReady } = useAuth();

  return (
    <div className="relative min-h-[calc(100dvh-72px)] overflow-hidden bg-cream">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 size-[420px] rounded-full bg-rose-200/50 blur-3xl" />
        <div className="absolute bottom-0 right-0 size-[380px] rounded-full bg-peach-100/90 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        {!isReady ? (
          <div className="flex h-64 items-center justify-center">
            <div className="size-8 animate-pulse rounded-full bg-rose-200" />
          </div>
        ) : session ? (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
            <div className="relative hidden aspect-[4/5] shadow-glow lg:block">
              <SoftImage
                src="/cyber.png"
                alt="Luxury physiotherapy"
                overlay="profile"
                rounded="3xl"
                sizes="40vw"
              />
              <p className="absolute bottom-8 left-8 right-8 z-10 text-2xl leading-snug text-white drop-shadow-sm">
                Your account — courses, bookings, and orders in one place.
              </p>
            </div>
            <div className="flex justify-center lg:justify-start">
              <ProfileDetails />
            </div>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="relative hidden aspect-[4/5] shadow-glow lg:block">
              <SoftImage
                src="/cyber.png"
                alt="Luxury physiotherapy"
                overlay="profile"
                rounded="3xl"
                sizes="50vw"
              />
              <p className="absolute bottom-8 left-8 right-8 z-10 text-2xl leading-snug text-white drop-shadow-sm">
                Sign in to view your orders and manage your 1X account.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <AuthPanel />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
