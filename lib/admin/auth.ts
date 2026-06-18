import { apiFetch, clearAdminSession, setToken, type AdminUser } from "@/lib/admin/api";

export async function adminLogin(identifier: string, password: string) {
  const data = await apiFetch<{ token: string; user: AdminUser }>("/auth/login", {
    method: "POST",
    body: { identifier, password },
  });
  if (data.user.role !== "admin") throw new Error("This account is not an admin");
  setToken(data.token);
  localStorage.setItem("onex_admin_user", JSON.stringify(data.user));
  return data.user;
}

export function adminLogout() {
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
