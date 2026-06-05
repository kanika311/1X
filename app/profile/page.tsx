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

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-16">
        <div className="relative hidden aspect-[4/5] shadow-glow lg:block">
          <SoftImage
            src='/cyber.png'
            alt="Luxury physiotherapy"
            overlay="profile"
            rounded="3xl"
            sizes="50vw"
          />
          <p className="absolute bottom-8 left-8 right-8 z-10  text-2xl leading-snug text-white drop-shadow-sm">
            Your account — courses, bookings, and care in one place.
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          {!isReady ? (
            <div className="flex h-64 items-center justify-center">
              <div className="size-8 animate-pulse rounded-full bg-rose-200" />
            </div>
          ) : session ? (
            <ProfileDetails />
          ) : (
            <AuthPanel />
          )}
        </div>
      </div>
    </div>
  );
}
