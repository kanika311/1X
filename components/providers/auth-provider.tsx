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

export type AuthSession = null | { type: "user" | "guest"; email?: string; name?: string };

type AuthContextValue = {
  session: AuthSession;
  isReady: boolean;
  login: (email: string) => void;
  signup: (name: string, email: string) => void;
  continueAsGuest: () => void;
  logout: () => void;
};

const STORAGE_KEY = "onex-auth-v1";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSession(JSON.parse(raw) as AuthSession);
    } catch {
      /* ignore */
    }
    setIsReady(true);
  }, []);

  const persist = useCallback((next: AuthSession) => {
    setSession(next);
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  const login = useCallback(
    (email: string) => {
      persist({ type: "user", email, name: email.split("@")[0] });
    },
    [persist],
  );

  const signup = useCallback(
    (name: string, email: string) => {
      persist({ type: "user", email, name });
    },
    [persist],
  );

  const continueAsGuest = useCallback(() => {
    persist({ type: "guest" });
  }, [persist]);

  const logout = useCallback(() => persist(null), [persist]);

  const value = useMemo(
    () => ({ session, isReady, login, signup, continueAsGuest, logout }),
    [session, isReady, login, signup, continueAsGuest, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
