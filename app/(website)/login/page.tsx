"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { AuthPanel } from "@/components/auth/auth-panel";
import { useAuth } from "@/components/providers/auth-provider";
import { SoftImage } from "@/components/ui/soft-image";
import { isRegisteredUser } from "@/lib/auth-utils";
import { IMG } from "@/lib/images";

function LoginPageContent() {
  const { session, isReady } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  useEffect(() => {
    if (!isReady || !isRegisteredUser(session)) return;
    const target = next && next.startsWith("/") && !next.startsWith("/login") ? next : "/";
    router.replace(target);
  }, [session, isReady, router, next]);

  if (!isReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="size-8 animate-pulse rounded-full bg-rose-200" />
      </div>
    );
  }

  if (isRegisteredUser(session)) return null;

  return (
    <div className="relative overflow-hidden bg-cream">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 size-[420px] rounded-full bg-rose-200/50 blur-3xl" />
        <div className="absolute bottom-0 right-0 size-[380px] rounded-full bg-peach-100/90 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-16">
        <div className="relative hidden aspect-[4/5] shadow-glow lg:block">
          <SoftImage
            src={IMG.authCyber}
            alt="Sign in"
            overlay="profile"
            rounded="3xl"
            sizes="50vw"
          />
          <p className="absolute bottom-8 left-8 right-8 z-10  text-2xl leading-snug text-white drop-shadow-sm">
            Sign in to save wishlist items and add courses to your bag.
          </p>
        </div>

        <div className="flex flex-col items-center lg:items-end">
          <p className="mb-6 max-w-md text-center text-sm text-muted lg:text-left">
            Please login or create an account before adding to wishlist or shopping bag.
          </p>
          <AuthPanel />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="size-8 animate-pulse rounded-full bg-rose-200" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
