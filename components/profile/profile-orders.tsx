"use client";

import Link from "next/link";
import { FiArrowRight, FiPackage } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import type { UserOrder } from "@/lib/orders-api";
import { formatPrice } from "@/lib/utils";

type ProfileOrdersProps = {
  orders: UserOrder[];
  loading?: boolean;
};

function paymentMeta(status: UserOrder["paymentStatus"]) {
  switch (status) {
    case "awaiting":
      return { text: "Awaiting UPI", dot: "bg-amber-400", pill: "bg-amber-50 text-amber-900" };
    case "submitted":
      return { text: "Verifying", dot: "bg-sky-400", pill: "bg-sky-50 text-sky-900" };
    case "confirmed":
      return { text: "Paid", dot: "bg-emerald-400", pill: "bg-emerald-50 text-emerald-900" };
    default:
      return { text: status, dot: "bg-rose-300", pill: "bg-rose-50 text-ink" };
  }
}

function orderMeta(status: UserOrder["status"]) {
  switch (status) {
    case "confirmed":
      return "Confirmed";
    case "cancelled":
      return "Cancelled";
    default:
      return "Pending";
  }
}

function formatOrderDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function OrderSkeleton() {
  return (
    <li className="animate-pulse px-4 py-4 sm:px-5">
      <div className="flex justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded-md bg-rose-100" />
          <div className="h-3 w-1/3 rounded-md bg-rose-50" />
        </div>
        <div className="h-4 w-16 rounded-md bg-rose-100" />
      </div>
    </li>
  );
}

export function ProfileOrders({ orders, loading = false }: ProfileOrdersProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-rose-100/90 bg-white/90 shadow-soft">
      <div className="flex items-center justify-between gap-3 border-b border-rose-100/80 bg-gradient-to-r from-rose-50/50 to-transparent px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-white text-mauve-deep shadow-soft ring-1 ring-rose-100">
            <FiPackage className="size-5" />
          </span>
          <div>
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-ink">Order history</h2>
            <p className="text-xs text-muted">Courses, services & memberships</p>
          </div>
        </div>
        {!loading && orders.length > 0 ? (
          <span className="rounded-full bg-mauve-deep px-3 py-1 text-xs font-semibold text-white">
            {orders.length}
          </span>
        ) : null}
      </div>

      {loading ? (
        <ul className="divide-y divide-rose-100/80">
          {Array.from({ length: 4 }).map((_, i) => (
            <OrderSkeleton key={i} />
          ))}
        </ul>
      ) : orders.length === 0 ? (
        <div className="mx-4 my-8 flex flex-col items-center rounded-2xl border border-dashed border-rose-200 bg-gradient-to-b from-rose-50/40 to-white px-6 py-12 text-center sm:mx-6">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-mauve-deep">
            <FiPackage className="size-7" />
          </span>
          <p className="mt-4 font-[family-name:var(--font-cormorant)] text-2xl text-ink">No orders yet</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            Enroll in a course or book a service — your purchases will show up here.
          </p>
          <Link href="/services" className="mt-6">
            <Button>
              Explore services <FiArrowRight />
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="hidden grid-cols-[1fr_7rem_6rem_8rem] gap-3 border-b border-rose-100/60 bg-rose-50/30 px-6 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted md:grid">
            <span>Order</span>
            <span>Date</span>
            <span className="text-right">Total</span>
            <span className="text-right">Status</span>
          </div>

          <div className="max-h-[min(52vh,480px)] overflow-y-auto overscroll-contain">
            <ul className="divide-y divide-rose-100/70">
              {orders.map((order) => {
                const pay = paymentMeta(order.paymentStatus);
                const titles = order.items.map((i) => i.title).join(" · ");
                const awaiting = order.paymentStatus === "awaiting";
                const itemTypes = [...new Set(order.items.map((i) => i.type))];

                return (
                  <li
                    key={order._id}
                    className="group px-4 py-3.5 transition-colors hover:bg-rose-50/40 sm:px-6 md:grid md:grid-cols-[1fr_7rem_6rem_8rem] md:items-center md:gap-3 md:py-3"
                  >
                    <div className="min-w-0 md:col-span-1">
                      <div className="flex items-start gap-2">
                        <span className={`mt-1.5 size-2 shrink-0 rounded-full ${pay.dot}`} aria-hidden />
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-medium leading-snug text-ink group-hover:text-mauve-deep">
                            {titles || "Order"}
                          </p>
                          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted md:hidden">
                            <span>{formatOrderDate(order.createdAt)}</span>
                            <span>·</span>
                            <span className="font-semibold text-ink">{formatPrice(order.subtotal)}</span>
                          </p>
                          <p className="mt-1 text-[10px] uppercase tracking-wide text-subtle">
                            #{order._id.slice(-8)} · {itemTypes.join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="mt-2 hidden text-xs text-muted md:mt-0 md:block">{formatOrderDate(order.createdAt)}</p>
                    <p className="hidden text-right text-sm font-semibold text-ink md:block">
                      {formatPrice(order.subtotal)}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center justify-start gap-1.5 md:mt-0 md:justify-end">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${pay.pill}`}>
                        {pay.text}
                      </span>
                      <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-semibold text-mauve-deep">
                        {orderMeta(order.status)}
                      </span>
                    </div>

                    {awaiting ? (
                      <p className="col-span-full mt-2 rounded-lg bg-amber-50/80 px-3 py-1.5 text-[11px] text-amber-900 md:mt-1">
                        Complete UPI payment and submit your transaction ID from checkout.
                      </p>
                    ) : null}
                    {order.paymentReference ? (
                      <p className="col-span-full mt-1 text-[11px] text-muted">
                        UPI ref: <span className="font-mono text-ink">{order.paymentReference}</span>
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </section>
  );
}
