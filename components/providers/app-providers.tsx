"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ShopProvider } from "@/components/providers/shop-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ShopProvider>{children}</ShopProvider>
    </AuthProvider>
  );
}
