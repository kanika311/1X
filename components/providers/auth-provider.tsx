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

import { apiRequest, setAuthToken } from "@/lib/api-client";
import { decodeReferralCode, getStoredReferralCode } from "@/lib/referral";

export type AuthSession = null | {
  type: "user";
  number?: string;
  name: string;
  email?: string;
  token: string;
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

const STORAGE_KEY = "onex-auth-v2";

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeStoredNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 ? digits : value;
}

function loadStoredSession(): AuthSession {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession & { email?: string };
    const number = parsed?.number ? normalizeStoredNumber(parsed.number) : "";
    // A session is valid if it has a token and at least one identifier (phone or email).
    if (parsed?.type === "user" && parsed.token && (number || parsed.email)) {
      setAuthToken(parsed.token);
      return { type: "user", number, name: parsed.name, email: parsed.email, token: parsed.token };
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setSession(loadStoredSession());
    setIsReady(true);
  }, []);

  const persist = useCallback((next: AuthSession) => {
    setSession(next);
    if (next?.type === "user") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setAuthToken(next.token);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setAuthToken(null);
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
          token: string;
          user: { name: string; number?: string; email?: string };
        }>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ identifier: trimmed, number: digits, password }),
        });
        const userNumber = data.user.number ? normalizeStoredNumber(data.user.number) : "";
        persist({
          type: "user",
          number: userNumber,
          name: data.user.name,
          email: data.user.email,
          token: data.token,
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
          token: string;
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
          token: data.token,
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

  const logout = useCallback(() => persist(null), [persist]);

  const deactivateAccount = useCallback(async (): Promise<string | null> => {
    try {
      await apiRequest("/auth/deactivate", { method: "POST", auth: true });
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
