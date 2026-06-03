"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { storeReferralCode } from "@/lib/referral";

function ReferralCaptureInner() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (!ref?.trim()) return;

    storeReferralCode(ref.trim());

    if (pathname !== "/gift-cards") {
      router.replace("/gift-cards", { scroll: false });
      return;
    }

    const next = new URLSearchParams(searchParams.toString());
    next.delete("ref");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [searchParams, pathname, router]);

  return null;
}

export function ReferralCapture() {
  return (
    <Suspense fallback={null}>
      <ReferralCaptureInner />
    </Suspense>
  );
}
