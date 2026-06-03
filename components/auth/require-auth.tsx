"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { isRegisteredUser, LOGIN_PATH } from "@/lib/auth-utils";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { session, isReady } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isReady) return;
    if (!isRegisteredUser(session)) {
      router.replace(`${LOGIN_PATH}?next=${encodeURIComponent(pathname)}`);
    }
  }, [session, isReady, router, pathname]);

  if (!isReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="size-8 animate-pulse rounded-full bg-rose-200" />
      </div>
    );
  }

  if (!isRegisteredUser(session)) return null;

  return <>{children}</>;
}
