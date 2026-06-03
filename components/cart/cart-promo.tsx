"use client";

import { useEffect, useState } from "react";
import { FiCheck, FiTag, FiX } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import {
  loadCartPromo,
  loadLastSpin,
  saveCartPromo,
  validateSpinPromoCode,
  type AppliedPromo,
} from "@/lib/spin-rewards";
import { cn, formatPrice } from "@/lib/utils";

type Props = {
  subtotal: number;
  onPromoChange: (promo: AppliedPromo | null) => void;
};

export function CartPromo({ subtotal, onPromoChange }: Props) {
  const [input, setInput] = useState("");
  const [applied, setApplied] = useState<AppliedPromo | null>(null);
  const [error, setError] = useState("");
  const [hint, setHint] = useState("");

  useEffect(() => {
    const saved = loadCartPromo();
    if (saved) {
      setApplied(saved);
      setInput(saved.code);
      onPromoChange(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once
  }, []);

  useEffect(() => {
    const last = loadLastSpin();
    if (last?.percent && last.percent > 0 && !applied) {
      setHint(`Your spin code: ${last.code} (${last.percent}% off)`);
      setInput(last.code);
    }
  }, [applied]);

  function apply() {
    setError("");
    const result = validateSpinPromoCode(input);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setApplied(result.promo);
    saveCartPromo(result.promo);
    onPromoChange(result.promo);
  }

  function remove() {
    setApplied(null);
    setError("");
    saveCartPromo(null);
    onPromoChange(null);
  }

  const discount = applied ? Math.round((subtotal * applied.percent) / 100) : 0;

  return (
    <div className="mt-6 rounded-2xl border border-rose-100 bg-white/90 p-4 shadow-soft">
      <div className="flex items-center gap-2 text-sm font-semibold text-ink">
        <FiTag className="text-mauve" />
        Promo code
      </div>
      {hint && !applied ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}

      {applied ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-emerald-50/80 px-3 py-2">
          <span className="text-sm text-ink">
            <FiCheck className="mr-1 inline text-emerald-600" />
            {applied.code} — <strong>{applied.percent}% off</strong> (−{formatPrice(discount)})
          </span>
          <button
            type="button"
            onClick={remove}
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted hover:text-mauve-deep"
          >
            <FiX /> Remove
          </button>
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            placeholder="SPIN3-AB12"
            className="min-w-0 flex-1 rounded-lg border border-rose-100 px-3 py-2 font-mono text-sm uppercase outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/15"
          />
          <Button type="button" variant="outline" className="shrink-0" onClick={apply}>
            Apply
          </Button>
        </div>
      )}

      {error ? <p className={cn("mt-2 text-xs text-red-600")}>{error}</p> : null}
    </div>
  );
}
