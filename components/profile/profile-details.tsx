"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiCheck,
  FiHeart,
  FiLogOut,
  FiMail,
  FiPackage,
  FiPhone,
  FiShoppingBag,
} from "react-icons/fi";

import { ProfileOrders } from "@/components/profile/profile-orders";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchMyOrders, type UserOrder } from "@/lib/orders-api";
import { formatPrice } from "@/lib/utils";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "1X";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function orderStats(orders: UserOrder[]) {
  const pendingPayment = orders.filter((o) => o.paymentStatus === "awaiting").length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.subtotal || 0), 0);
  return { pendingPayment, totalSpent };
}

const quickLinks = [
  { href: "/services", label: "Browse services", icon: FiPackage },
  { href: "/wishlist", label: "Wishlist", icon: FiHeart },
  { href: "/cart", label: "Cart", icon: FiShoppingBag },
] as const;

export function ProfileDetails() {
  const { session, logout, updateProfile, deactivateAccount } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingEmail, setEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);

  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [deactivateError, setDeactivateError] = useState("");

  useEffect(() => {
    fetchMyOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => orderStats(orders), [orders]);

  if (!session) return null;

  const displayName = session.name?.trim() || "Member";
  const phone = session.number?.trim() ? session.number : "—";
  const currentEmail = session.email?.trim() || "";

  async function saveEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailError("");
    setEmailSaved(false);
    setEmailSaving(true);
    const err = await updateProfile({ email: emailInput.trim() });
    setEmailSaving(false);
    if (err) {
      setEmailError(err);
      return;
    }
    setEmailSaved(true);
    setEditingEmail(false);
  }

  function startEditingEmail() {
    setEmailInput(currentEmail);
    setEmailError("");
    setEmailSaved(false);
    setEditingEmail(true);
  }

  async function handleDeactivate() {
    setDeactivateError("");
    setDeactivating(true);
    const err = await deactivateAccount();
    setDeactivating(false);
    if (err) {
      setDeactivateError(err);
      return;
    }
    setConfirmDeactivate(false);
    router.push("/");
  }

  return (
    <div className="w-full space-y-5">
      <section className="relative overflow-hidden rounded-3xl border border-rose-100/90 bg-gradient-to-br from-white via-rose-50/80 to-lavender-50/60 p-5 shadow-glow sm:p-6">
        <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-rose-200/30 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 left-1/3 size-32 rounded-full bg-peach-100/50 blur-2xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-mauve-deep to-rose-400 text-lg font-semibold text-white shadow-soft ring-4 ring-white/80 sm:size-[4.5rem] sm:text-xl">
              {initials(displayName)}
            </div>
            <div className="min-w-0">
              <p className="eyebrow">Welcome back</p>
              <h1 className="mt-1 truncate font-[family-name:var(--font-cormorant)] text-3xl leading-tight text-ink sm:text-4xl">
                {displayName}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-white/70 px-3 py-1 text-sm text-muted">
                  <FiPhone className="size-3.5 text-mauve" />
                  {phone}
                </span>
                {currentEmail ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-white/70 px-3 py-1 text-sm text-muted">
                    <FiMail className="size-3.5 text-mauve" />
                    {currentEmail}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full shrink-0 border-rose-200/80 bg-white/70 sm:w-auto"
            onClick={logout}
          >
            <FiLogOut /> Sign out
          </Button>
        </div>

        <div className="relative mt-5 grid grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-2xl border border-white/80 bg-white/60 px-3 py-3 text-center backdrop-blur-sm sm:px-4 sm:py-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-xs">Orders</p>
            <p className="mt-0.5 text-xl font-semibold text-ink sm:text-2xl">{loading ? "—" : orders.length}</p>
          </div>
          <div className="rounded-2xl border border-white/80 bg-white/60 px-3 py-3 text-center backdrop-blur-sm sm:px-4 sm:py-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-xs">Pending pay</p>
            <p className="mt-0.5 text-xl font-semibold text-amber-800 sm:text-2xl">
              {loading ? "—" : stats.pendingPayment}
            </p>
          </div>
          <div className="rounded-2xl border border-white/80 bg-white/60 px-3 py-3 text-center backdrop-blur-sm sm:px-4 sm:py-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-xs">Spent</p>
            <p className="mt-0.5 text-base font-semibold text-ink sm:text-lg">
              {loading ? "—" : formatPrice(stats.totalSpent)}
            </p>
          </div>
        </div>

        <div className="relative mt-4 rounded-2xl border border-white/80 bg-white/60 px-4 py-3.5 backdrop-blur-sm">
          {editingEmail ? (
            <form onSubmit={saveEmail} className="space-y-3">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                {currentEmail ? "Update email" : "Add email (for password reset)"}
              </label>
              <Input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
              {emailError ? <p className="text-sm text-red-500">{emailError}</p> : null}
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={emailSaving}>
                  {emailSaving ? "Saving…" : "Save email"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingEmail(false)}
                  disabled={emailSaving}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Email</p>
                {currentEmail ? (
                  <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-ink">
                    {currentEmail}
                    {emailSaved ? <FiCheck className="size-3.5 text-emerald-600" /> : null}
                  </p>
                ) : (
                  <p className="mt-0.5 text-sm text-muted">
                    Add an email so you can reset your password if you forget it.
                  </p>
                )}
              </div>
              <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={startEditingEmail}>
                {currentEmail ? "Edit" : "Add email"}
              </Button>
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {quickLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-rose-100/80 bg-white/80 px-2 py-3 text-center shadow-soft transition-all hover:border-rose-200 hover:bg-white hover:shadow-glow sm:flex-row sm:justify-center sm:px-4 sm:py-3"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-rose-50 text-mauve-deep transition-colors group-hover:bg-rose-100">
              <Icon className="size-4" />
            </span>
            <span className="text-[11px] font-semibold text-ink sm:text-sm">{label}</span>
          </Link>
        ))}
      </div>

      <ProfileOrders orders={orders} loading={loading} />

      <section className="rounded-3xl border border-red-100 bg-red-50/40 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <FiAlertTriangle className="size-4" />
          </span>
          <div className="min-w-0">
            <h2 className="font-semibold text-ink">Deactivate account</h2>
            <p className="mt-1 text-sm text-muted">
              Your account will be disabled and you won&apos;t be able to sign in. To reactivate it later,
              you&apos;ll need to contact support.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4 border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => {
                setDeactivateError("");
                setConfirmDeactivate(true);
              }}
            >
              Deactivate my account
            </Button>
          </div>
        </div>
      </section>

      {confirmDeactivate ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-glow">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <FiAlertTriangle className="size-5" />
              </span>
              <h3 className="font-serif text-xl text-ink">Are you sure?</h3>
            </div>
            <p className="mt-3 text-sm text-muted">
              This will deactivate your account and sign you out immediately. You won&apos;t be able to log
              back in until support reactivates it.
            </p>
            {deactivateError ? <p className="mt-3 text-sm text-red-500">{deactivateError}</p> : null}
            <div className="mt-5 flex gap-3">
              <Button
                type="button"
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleDeactivate}
                disabled={deactivating}
              >
                {deactivating ? "Deactivating…" : "Yes, deactivate"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setConfirmDeactivate(false)}
                disabled={deactivating}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
