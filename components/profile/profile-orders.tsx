"use client";

import { useEffect, useState } from "react";
import { FiPackage } from "react-icons/fi";

import { fetchMyOrders, type UserOrder } from "@/lib/orders-api";
import { formatPrice } from "@/lib/utils";

function paymentLabel(status: UserOrder["paymentStatus"]) {
  switch (status) {
    case "awaiting":
      return { text: "Awaiting UPI payment", className: "bg-amber-50 text-amber-800" };
    case "submitted":
      return { text: "Payment submitted — verifying", className: "bg-sky-50 text-sky-800" };
    case "confirmed":
      return { text: "Payment confirmed", className: "bg-emerald-50 text-emerald-800" };
    default:
      return { text: status, className: "bg-rose-50 text-ink" };
  }
}

function orderLabel(status: UserOrder["status"]) {
  switch (status) {
    case "confirmed":
      return "Confirmed";
    case "cancelled":
      return "Cancelled";
    default:
      return "Pending";
  }
}

export function ProfileOrders() {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="glass w-full rounded-3xl border border-rose-100/80 bg-white/90 p-6 shadow-soft sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-rose-50 text-mauve-deep">
          <FiPackage className="size-5" />
        </span>
        <div>
          <h2 className="text-xl text-ink">My orders</h2>
          <p className="text-sm text-muted">Courses, services, and gift cards you have purchased.</p>
        </div>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-muted">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-rose-100 bg-rose-50/40 px-4 py-8 text-center text-sm text-muted">
          No orders yet. Book a service or enroll in a course to see them here.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((order) => {
            const pay = paymentLabel(order.paymentStatus);
            const titles = order.items.map((i) => i.title).join(", ");
            return (
              <li
                key={order._id}
                className="rounded-2xl border border-rose-100/80 bg-white px-4 py-4 sm:px-5 sm:py-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{titles || "Order"}</p>
                    <p className="mt-1 text-xs text-muted">
                      {new Date(order.createdAt).toLocaleString("en-IN")} · Ref{" "}
                      {order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-ink">{formatPrice(order.subtotal)}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${pay.className}`}>
                    {pay.text}
                  </span>
                  <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-semibold uppercase text-mauve-deep">
                    {orderLabel(order.status)}
                  </span>
                </div>
                {order.paymentStatus === "awaiting" ? (
                  <p className="mt-3 text-xs text-amber-800">
                    Complete UPI payment and submit your transaction ID from checkout to finish this order.
                  </p>
                ) : null}
                {order.paymentReference ? (
                  <p className="mt-2 text-xs text-muted">
                    UPI ref: <span className="font-mono text-ink">{order.paymentReference}</span>
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
