"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { apiRequest, logoutSession } from "@/lib/api-client";
import { decodeReferralCode, getStoredReferralCode } from "@/lib/referral";

export type AuthSession = null | {
  type: "user";
  number?: string;
  name: string;
  email?: string;
};

type AuthContextValue = {
  session: AuthSession;
  isReady: boolean;
  login: (identifier: string, password: string) => Promise<string | null>;
  signup: (
    name: string,
    number: string,
    password: string,
    email?: string,
  ) => Promise<string | null>;
  updateProfile: (fields: { name?: string; email?: string }) => Promise<string | null>;
  deactivateAccount: () => Promise<string | null>;
  logout: () => void;
};

const STORAGE_KEY = "onex-auth-profile";

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeStoredNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 ? digits : value;
}

async function fetchCurrentUser(): Promise<AuthSession> {
  try {
    const data = await apiRequest<{ user: { name: string; number?: string; email?: string; role: string } | null }>(
      "/auth/me",
    );
    if (!data?.user || data.user.role !== "user") return null;
    const userNumber = data.user.number ? normalizeStoredNumber(data.user.number) : "";
    return {
      type: "user",
      number: userNumber,
      name: data.user.name,
      email: data.user.email,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    void (async () => {
      const fromCookie = await fetchCurrentUser();
      if (fromCookie) {
        setSession(fromCookie);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fromCookie));
      } else {
        // The HttpOnly cookie is the source of truth. A cached profile without
        // a valid cookie is stale and must not trigger authenticated API calls.
        setSession(null);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem("onex-auth-v2");
        localStorage.removeItem("onex-token");
      }
      setIsReady(true);
    })();
  }, []);

  const persist = useCallback((next: AuthSession) => {
    setSession(next);
    if (next?.type === "user") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("onex-wishlist");
      localStorage.removeItem("onex-cart");
    }
  }, []);

  const login = useCallback(
    async (identifier: string, password: string): Promise<string | null> => {
      try {
        const trimmed = identifier.trim();
        const digits = normalizeStoredNumber(trimmed);
        const data = await apiRequest<{
          user: { name: string; number?: string; email?: string; role: string };
        }>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ identifier: trimmed, number: digits, password, scope: "user" }),
        });
        if (data.user.role !== "user") {
          return "Please use the admin login page for admin accounts";
        }
        const userNumber = data.user.number ? normalizeStoredNumber(data.user.number) : "";
        persist({
          type: "user",
          number: userNumber,
          name: data.user.name,
          email: data.user.email,
        });
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : "Login failed";
      }
    },
    [persist],
  );

  const signup = useCallback(
    async (
      name: string,
      number: string,
      password: string,
      email?: string,
    ): Promise<string | null> => {
      try {
        const digits = normalizeStoredNumber(number.trim());
        const refCode = getStoredReferralCode();
        const referredBy = refCode ? decodeReferralCode(refCode) : null;
        const trimmedEmail = email?.trim();
        const data = await apiRequest<{
          user: { name: string; number?: string; email?: string };
        }>("/auth/register", {
          method: "POST",
          body: JSON.stringify({
            name: name.trim(),
            number: digits,
            password,
            role: "user",
            ...(trimmedEmail ? { email: trimmedEmail } : {}),
            ...(referredBy ? { referredBy } : {}),
          }),
        });
        const userNumber = data.user.number ? normalizeStoredNumber(data.user.number) : digits;
        persist({
          type: "user",
          number: userNumber,
          name: data.user.name,
          email: data.user.email,
        });
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : "Sign up failed";
      }
    },
    [persist],
  );

  const updateProfile = useCallback(
    async (fields: { name?: string; email?: string }): Promise<string | null> => {
      try {
        const data = await apiRequest<{
          user: { name: string; number?: string; email?: string };
        }>("/auth/me", {
          method: "PUT",
          auth: true,
          body: JSON.stringify(fields),
        });
        setSession((prev) =>
          prev?.type === "user"
            ? (() => {
                const next: AuthSession = {
                  ...prev,
                  name: data.user.name,
                  email: data.user.email,
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                return next;
              })()
            : prev,
        );
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : "Could not update profile";
      }
    },
    [],
  );

  const logout = useCallback(() => {
    void logoutSession();
    persist(null);
  }, [persist]);

  const deactivateAccount = useCallback(async (): Promise<string | null> => {
    try {
      await apiRequest("/auth/deactivate", { method: "POST", auth: true });
      await logoutSession();
      persist(null);
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : "Could not deactivate account";
    }
  }, [persist]);

  const value = useMemo(
    () => ({ session, isReady, login, signup, updateProfile, deactivateAccount, logout }),
    [session, isReady, login, signup, updateProfile, deactivateAccount, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
