import type { AuthSession } from "@/components/providers/auth-provider";

export function isRegisteredUser(session: AuthSession): boolean {
  return session?.type === "user" && Boolean(session.number) && Boolean(session.token);
}

export const LOGIN_PATH = "/login";
