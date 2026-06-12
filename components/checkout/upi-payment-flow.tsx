"use client";

import { QRCodeSVG } from "qrcode.react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiCheck, FiX } from "react-icons/fi";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { resolveApiMediaUrl } from "@/lib/media-url";
import { placeOrder, submitOrderPayment, type OrderItemPayload } from "@/lib/orders-api";
import {
  DEFAULT_PAYMENT,
  fetchSiteContent,
  resolvePaymentFields,
  type PaymentContent,
} from "@/lib/site-content-api";
import { buildUpiPayUrl } from "@/lib/upi";
import { cn, formatPrice } from "@/lib/utils";

const inputClass =
  "mt-1 w-full rounded-lg border border-rose-100 bg-white/90 px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-subtle focus:border-mauve focus:ring-2 focus:ring-mauve/15";

export type CheckoutLineItem = OrderItemPayload;

type Props = {
  items: CheckoutLineItem[];
  /** Amount to pay (after promo) */
  subtotal: number;
  orderLabel: string;
  lineSubtotal?: number;
  promoCode?: string;
  discountPercent?: number;
  discountAmount?: number;
  /** Called after payment confirmed — receives cartKeys to remove from bag */
  onSuccess?: (purchasedCartKeys?: string[]) => void | Promise<void>;
  /** Cart line keys paid in this checkout (cleared from bag on success) */
  purchasedCartKeys?: string[];
  triggerLabel?: string;
  className?: string;
  layout?: "inline" | "modal";
};

const STEPS = ["Your details", "UPI payment", "Done"] as const;

function StepDots({ step, compact }: { step: number; compact?: boolean }) {
  return (
    <div className={cn("flex items-center justify-center", compact ? "gap-1" : "gap-2")}>
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-1.5">
          <span
            className={cn(
              "flex items-center justify-center rounded-full font-semibold transition-colors",
              compact ? "size-5 text-[10px]" : "size-7 text-xs",
              i <= step ? "bg-white text-mauve-deep" : "bg-white/20 text-white/70",
            )}
          >
            {i < step ? <FiCheck className={compact ? "text-[10px]" : "text-sm"} /> : i + 1}
          </span>
          {i < STEPS.length - 1 ? (
            <span className={cn("h-px", compact ? "w-3" : "w-6", i < step ? "bg-white/80" : "bg-white/25")} />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function CheckoutHeader({
  step,
  subtotal,
  orderLabel,
  onClose,
  showClose,
  compact,
}: {
  step: number;
  subtotal: number;
  orderLabel: string;
  onClose?: () => void;
  showClose?: boolean;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="relative shrink-0 rounded-t-2xl bg-gradient-to-r from-mauve-deep via-mauve to-rose-400 px-3 py-2.5 pr-11 text-white">
        {showClose ? (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close"
          >
            <FiX className="text-base" />
          </button>
        ) : null}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium uppercase tracking-wider text-rose-100/90">Checkout</p>
            <h2 id="upi-checkout-title" className="truncate f text-sm leading-tight">
              {orderLabel}
            </h2>
          </div>
          <p className="shrink-0  text-xl leading-none">{formatPrice(subtotal)}</p>
        </div>
        <div className="mt-2">
          <StepDots step={step} compact />
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-mauve-deep via-mauve to-rose-400 px-6 pb-8 pt-6 text-white">
      {showClose ? (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
          aria-label="Close"
        >
          <FiX className="text-lg" />
        </button>
      ) : null}
      <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-rose-100/90">
        Membership checkout
      </p>
      <h2 id="upi-checkout-title" className="mt-2 text-center  text-2xl">
        {orderLabel}
      </h2>
      <p className="mt-3 text-center  text-4xl tracking-tight">{formatPrice(subtotal)}</p>
      <p className="mt-1 text-center text-xs text-rose-100/80">One-time payment via UPI</p>
      <div className="mt-6">
        <StepDots step={step} />
      </div>
    </div>
  );
}

export function UpiPaymentFlow({
  items,
  subtotal,
  orderLabel,
  lineSubtotal,
  promoCode,
  discountPercent = 0,
  discountAmount = 0,
  onSuccess,
  purchasedCartKeys = [],
  triggerLabel = "Place order",
  className,
  layout = "inline",
}: Props) {
  const { session } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(layout === "inline");
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState<PaymentContent>(DEFAULT_PAYMENT);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchSiteContent()
      .then((content) => setPayment(resolvePaymentFields(content)))
      .catch(() => setPayment(DEFAULT_PAYMENT));
  }, []);

  useEffect(() => {
    if (!session) return;
    setName((n) => n || session.name);
    setPhone((p) => p || session.number);
  }, [session]);

  useEffect(() => {
    if (!open || layout !== "modal") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, layout]);

  function closeModal() {
    if (submitting) return;
    setOpen(false);
    setError("");
    if (layout === "modal") {
      setStep(0);
      setOrderId(null);
    }
  }

  function reset() {
    setStep(0);
    setOrderId(null);
    setPaymentReference("");
    setPaymentConfirmed(false);
    setError("");
    if (layout === "modal") setOpen(false);
  }

  async function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const promoNote =
        promoCode && discountPercent > 0
          ? `Promo ${promoCode} (${discountPercent}% off, −${formatPrice(discountAmount)})`
          : "";
      const data = await placeOrder({
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        notes: [notes.trim(), promoNote, orderLabel].filter(Boolean).join(" · "),
        items: items.map((item) => ({ ...item, quantity: item.quantity ?? 1 })),
        ...(promoCode && discountPercent > 0
          ? { promoCode, discountPercent, discountAmount }
          : {}),
      });
      setOrderId(data.order._id);
      setStep(1);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not create order";
      setError(msg === "Invalid value" ? "Could not save order — check phone and email, then try again." : msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePaymentDone() {
    if (!orderId) return;
    if (!paymentConfirmed) {
      setError("Please confirm you have paid via UPI before submitting.");
      return;
    }
    if (paymentReference.trim().length < 4) {
      setError("Enter your UPI transaction ID or reference number from your payment app.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await submitOrderPayment(orderId, paymentReference);
      setStep(2);
      const keys =
        purchasedCartKeys.length > 0
          ? purchasedCartKeys
          : items.map((i) => i.cartKey).filter(Boolean);
      await Promise.resolve(onSuccess?.(keys));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not confirm payment");
    } finally {
      setSubmitting(false);
    }
  }

  const upiUrl = buildUpiPayUrl(subtotal, orderLabel, {
    upiId: payment.upiId,
    payeeName: payment.upiPayeeName,
  });
  const qrImageUrl = payment.qrImage ? resolveApiMediaUrl(payment.qrImage) : "";
  const isModal = layout === "modal";
  const qrSize = isModal ? 128 : 180;

  const body = (
    <div className={cn(isModal ? "px-4 py-3" : "px-6 py-6 sm:px-8 sm:py-7")}>
      {step === 2 ? (
        <div className="text-center">
          <div
            className={cn(
              "mx-auto flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600",
              isModal ? "size-10" : "size-14",
            )}
          >
            <FiCheck className={isModal ? "text-xl" : "text-2xl"} />
          </div>
          <h3 className={cn("text-ink", isModal ? "mt-2 text-lg" : "mt-4 text-2xl")}>
            Thank you, {name.split(" ")[0]}
          </h3>
          <p className={cn("leading-relaxed text-muted", isModal ? "mt-1 text-xs" : "mt-2 text-sm")}>
            Your payment details were submitted. Our team will verify your UPI transfer and confirm your order
            shortly.
          </p>
          {orderId ? (
            <p className="mt-2 inline-block rounded-full bg-rose-50 px-3 py-1 text-[10px] font-medium text-ink">
              Ref: {orderId.slice(-8).toUpperCase()}
            </p>
          ) : null}
          {layout === "modal" ? (
            <Button type="button" size="sm" className="mt-4 w-full" onClick={reset}>
              Close
            </Button>
          ) : null}
        </div>
      ) : step === 1 ? (
        <div className={cn(isModal ? "space-y-2.5" : "space-y-5")}>
          <p className={cn("text-center text-muted", isModal ? "text-xs" : "text-sm")}>
            Scan & pay {formatPrice(subtotal)} via UPI
          </p>

          <div
            className={cn(
              "mx-auto rounded-xl border border-rose-100 bg-gradient-to-b from-slate-50 to-white shadow-soft",
              isModal ? "max-w-[220px] p-3" : "max-w-[280px] p-6",
            )}
          >
            <div className={cn("flex items-center gap-2", isModal ? "mb-2" : "mb-4 gap-3")}>
              <div
                className={cn(
                  "flex items-center justify-center rounded-full bg-gradient-to-br from-rose-200 to-mauve/40 text-mauve-deep",
                  isModal ? "size-8 text-sm" : "size-11 text-lg",
                )}
              >
                1X
              </div>
              <div className="min-w-0">
                <p className={cn("truncate font-semibold text-ink", isModal ? "text-xs" : "text-sm")}>
                  {payment.upiPayeeName}
                </p>
                <p className="truncate text-[10px] text-muted">{payment.upiId}</p>
              </div>
            </div>
            <div className={cn("flex justify-center rounded-lg bg-white", isModal ? "p-2" : "p-4")}>
              {qrImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrImageUrl}
                  alt="UPI payment QR code"
                  width={qrSize}
                  height={qrSize}
                  className="rounded-md object-contain"
                />
              ) : (
                <QRCodeSVG value={upiUrl} size={qrSize} level="M" includeMargin />
              )}
            </div>
          </div>

          {!isModal ? (
            <p className="text-center text-xs text-muted">PhonePe · Google Pay · Paytm · any UPI app</p>
          ) : null}

          <div className={cn("rounded-xl border border-rose-100 bg-rose-50/40", isModal ? "p-3" : "p-4")}>
            <label className="text-xs font-medium text-ink">UPI transaction ID / reference</label>
            <input
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              placeholder="e.g. 123456789012"
              className={inputClass}
              autoComplete="off"
            />
            <label className="mt-3 flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={paymentConfirmed}
                onChange={(e) => setPaymentConfirmed(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 rounded border-rose-200"
              />
              <span className="text-xs leading-relaxed text-muted">
                I confirm I have paid <strong className="text-ink">{formatPrice(subtotal)}</strong> via UPI using the
                QR code above.
              </span>
            </label>
          </div>

          {error ? (
            <p className="rounded-lg border border-red-100 bg-red-50 px-2 py-1.5 text-center text-xs text-red-600">
              {error}
            </p>
          ) : null}

          <Button
            type="button"
            className="w-full"
            size={isModal ? "default" : "lg"}
            disabled={submitting || !paymentConfirmed || paymentReference.trim().length < 4}
            onClick={() => void handlePaymentDone()}
          >
            {submitting ? "Submitting…" : "Submit payment for verification"}
          </Button>
          <p className="text-center text-[10px] leading-relaxed text-subtle">
            Only submit after paying in your UPI app. Orders stay pending until we verify your transfer.
          </p>
          <button
            type="button"
            className="w-full text-center text-xs text-muted transition hover:text-mauve-deep"
            onClick={() => {
              setStep(0);
              setPaymentReference("");
              setPaymentConfirmed(false);
              setError("");
            }}
          >
            ← Edit details
          </button>
        </div>
      ) : (
        <>
          {session ? (
            <p
              className={cn(
                "rounded-lg border border-rose-100 bg-rose-50/60 text-center text-muted",
                isModal ? "mb-2 px-3 py-1.5 text-xs" : "mb-4 px-4 py-2.5 text-sm",
              )}
            >
              Signed in as <span className="font-medium text-ink">{session.name}</span>
            </p>
          ) : null}

          <form onSubmit={handleDetailsSubmit} className={cn(isModal ? "space-y-2" : "space-y-4")}>
            {isModal ? (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-ink">Full name</label>
                  <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-medium text-ink">Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                    placeholder="10-digit mobile"
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium text-ink">Full name</label>
                  <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink">Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                    placeholder="10-digit mobile number"
                  />
                </div>
              </>
            )}
            <div>
              <label className={cn("font-medium text-ink", isModal ? "text-xs" : "text-sm")}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            {!isModal ? (
              <div>
                <label className="text-sm font-medium text-ink">
                  Notes <span className="font-normal text-muted">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={inputClass}
                  placeholder="Any message for our team"
                />
              </div>
            ) : null}
            {error ? (
              <p className="rounded-lg border border-red-100 bg-red-50 px-2 py-1.5 text-xs text-red-600">{error}</p>
            ) : null}
            <div className={cn("flex gap-2", isModal ? "pt-0.5" : "gap-3 pt-2")}>
              {layout === "modal" ? (
                <Button type="button" variant="outline" size="sm" className="flex-1" onClick={closeModal}>
                  Cancel
                </Button>
              ) : (
                <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={submitting} className="flex-1" size={isModal ? "default" : "lg"}>
                {submitting ? "Please wait…" : "Continue"}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );

  const card = (
    <div
      className={cn(
        "flex flex-col overflow-hidden border border-rose-100/80 bg-white shadow-glow",
        isModal ? "max-h-[calc(100dvh-2rem)] rounded-2xl" : "rounded-3xl",
        layout === "inline" && "rounded-3xl border border-rose-100 bg-rose-50/30",
        className,
      )}
    >
      <CheckoutHeader
        step={step}
        subtotal={subtotal}
        orderLabel={orderLabel}
        showClose={isModal}
        onClose={closeModal}
        compact={isModal}
      />
      <div className={cn(isModal && "min-h-0 shrink")}>{body}</div>
    </div>
  );

  if (layout === "modal") {
    return (
      <>
        <Button type="button" className={cn("w-full", className)} onClick={() => setOpen(true)}>
          {triggerLabel}
        </Button>
        {mounted
          ? createPortal(
              <AnimatePresence>
                {open ? (
                  <motion.div
                    key="upi-checkout-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/55 p-3 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="upi-checkout-title"
                    onClick={closeModal}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 24, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 16, scale: 0.98 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full max-w-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {card}
                    </motion.div>
                  </motion.div>
                ) : null}
              </AnimatePresence>,
              document.body,
            )
          : null}
      </>
    );
  }

  if (!open) {
    return (
      <div className={className}>
        <div className="rounded-2xl border border-rose-100 bg-white/80 px-5 py-4">
          {lineSubtotal != null && discountAmount > 0 ? (
            <>
              <div className="flex justify-between text-sm text-muted">
                <span>Subtotal</span>
                <span>{formatPrice(lineSubtotal)}</span>
              </div>
              <div className="mt-1 flex justify-between text-sm text-emerald-700">
                <span>Promo ({promoCode})</span>
                <span>−{formatPrice(discountAmount)}</span>
              </div>
            </>
          ) : null}
          <div className="mt-1 flex items-center justify-between">
            <span className="text-sm text-muted">Order total</span>
            <span className=" text-2xl text-ink">{formatPrice(subtotal)}</span>
          </div>
        </div>
        <Button variant="default" className="mt-6 w-full" size="lg" onClick={() => setOpen(true)}>
          {triggerLabel}
        </Button>
      </div>
    );
  }

  return card;
}
