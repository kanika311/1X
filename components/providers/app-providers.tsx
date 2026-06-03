"use client";

import type { ReactNode } from "react";
import { ReferralCapture } from "@/components/referral/referral-capture";
import { AuthProvider } from "@/components/providers/auth-provider";
import { CatalogProvider } from "@/components/providers/catalog-provider";
import { ShopProvider } from "@/components/providers/shop-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ReferralCapture />
      <CatalogProvider>
        <ShopProvider>{children}</ShopProvider>
      </CatalogProvider>
    </AuthProvider>
  );
}
