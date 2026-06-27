import { apiRequest } from "@/lib/api-client";

export async function requestUserPasswordReset(email: string) {
  return apiRequest<{ success: boolean; message: string }>("/auth/user-forgot-password", {
    method: "POST",
    body: JSON.stringify({ email: email.trim() }),
  });
}

export async function resetUserPassword(token: string, password: string) {
  return apiRequest<{ success: boolean; message: string }>("/auth/user-reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}
