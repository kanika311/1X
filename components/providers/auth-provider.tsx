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
  number: string;
  name: string;
  token: string;
};

type AuthContextValue = {
  session: AuthSession;
  isReady: boolean;
  login: (number: string, password: string) => Promise<string | null>;
  signup: (name: string, number: string, password: string) => Promise<string | null>;
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
    const number =
      parsed?.type === "user" && parsed.number
        ? normalizeStoredNumber(parsed.number)
        : parsed?.email
          ? normalizeStoredNumber(parsed.email)
          : "";
    if (parsed?.type === "user" && parsed.token && number) {
      setAuthToken(parsed.token);
      return { type: "user", number, name: parsed.name, token: parsed.token };
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
    async (number: string, password: string): Promise<string | null> => {
      try {
        const digits = normalizeStoredNumber(number.trim());
        const data = await apiRequest<{
          token: string;
          user: { name: string; number?: string };
        }>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ number: digits, password }),
        });
        const userNumber = data.user.number ? normalizeStoredNumber(data.user.number) : digits;
        persist({
          type: "user",
          number: userNumber,
          name: data.user.name,
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
    async (name: string, number: string, password: string): Promise<string | null> => {
      try {
        const digits = normalizeStoredNumber(number.trim());
        const refCode = getStoredReferralCode();
        const referredBy = refCode ? decodeReferralCode(refCode) : null;
        const data = await apiRequest<{
          token: string;
          user: { name: string; number?: string };
        }>("/auth/register", {
          method: "POST",
          body: JSON.stringify({
            name: name.trim(),
            number: digits,
            password,
            role: "user",
            ...(referredBy ? { referredBy } : {}),
          }),
        });
        const userNumber = data.user.number ? normalizeStoredNumber(data.user.number) : digits;
        persist({
          type: "user",
          number: userNumber,
          name: data.user.name,
          token: data.token,
        });
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : "Sign up failed";
      }
    },
    [persist],
  );

  const logout = useCallback(() => persist(null), [persist]);

  const value = useMemo(
    () => ({ session, isReady, login, signup, logout }),
    [session, isReady, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
