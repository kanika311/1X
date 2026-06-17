"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FiHeart,
  FiLogOut,
  FiPackage,
  FiPhone,
  FiShoppingBag,
} from "react-icons/fi";

import { ProfileOrders } from "@/components/profile/profile-orders";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
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
  const { session, logout } = useAuth();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => orderStats(orders), [orders]);

  if (!session) return null;

  const displayName = session.name?.trim() || "Member";
  const phone = session.number ?? "—";

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
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-white/70 px-3 py-1 text-sm text-muted">
                <FiPhone className="size-3.5 text-mauve" />
                {phone}
              </span>
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
    </div>
  );
}
