import { apiFetch, clearAdminSession, type AdminUser } from "@/lib/admin/api";
import { getApiBaseUrl } from "@/lib/api-base";

export async function adminLogin(identifier: string, password: string) {
  const data = await apiFetch<{ user: AdminUser }>("/auth/login", {
    method: "POST",
    body: { identifier, password, scope: "admin" },
  });
  if (data.user.role !== "admin") throw new Error("This account is not an admin");
  localStorage.setItem("onex_admin_user", JSON.stringify(data.user));
  return data.user;
}

export async function adminLogout() {
  await fetch(`${getApiBaseUrl()}/auth/logout`, { method: "POST", credentials: "include" }).catch(() => {});
  clearAdminSession();
}

export function getStoredAdmin(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("onex_admin_user");
  return raw ? (JSON.parse(raw) as AdminUser) : null;
}

export async function requestPasswordReset(email: string) {
  return apiFetch<{ success: boolean; message: string }>("/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

export async function resetAdminPassword(token: string, password: string) {
  return apiFetch<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: { token, password },
  });
}
