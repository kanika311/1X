"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { apiFetch, clearAdminSession, type AdminUser } from "@/lib/api";
import { ADMIN } from "@/lib/admin/routes";

export function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    apiFetch<{ user: AdminUser }>("/auth/me")
      .then((data) => {
        if (!data?.user || data.user.role !== "admin") {
          clearAdminSession();
          router.replace(ADMIN.login);
          return;
        }
        localStorage.setItem("onex_admin_user", JSON.stringify(data.user));
        setReady(true);
      })
      .catch(() => {
        clearAdminSession();
        router.replace(ADMIN.login);
      });
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="size-8 animate-pulse rounded-full bg-rose-200" />
      </div>
    );
  }

  return <>{children}</>;
}
