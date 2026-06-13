"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiCheck, FiCopy, FiX } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import {
  buildSpinCouponCode,
  displaySegmentIndexForPercent,
  loadLastSpin,
  pickSpinDiscount,
  saveLastSpin,
  SPIN_DISPLAY_PERCENTS,
  SPIN_DISPLAY_SEGMENT_COUNT,
  type StoredSpin,
} from "@/lib/spin-rewards";
import { cn } from "@/lib/utils";

const DEG_PER_SEGMENT = 360 / SPIN_DISPLAY_SEGMENT_COUNT;
const WHEEL_COLORS = ["#f3dce4", "#fceee8", "#e8c4d0", "#fdf5f7", "#efd4de", "#f5d6e0"];

function WheelLabels() {
  return (
    <svg viewBox="0 0 200 200" className="pointer-events-none absolute inset-0 size-full">
      {SPIN_DISPLAY_PERCENTS.map((pct, i) => {
        const angle = ((i + 0.5) / SPIN_DISPLAY_SEGMENT_COUNT) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const x = 100 + 62 * Math.cos(rad);
        const y = 100 + 62 * Math.sin(rad);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-mauve-deep text-[8px] font-bold sm:text-[9px]"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            {pct}%
          </text>
        );
      })}
    </svg>
  );
}

export function SpinWheel() {
  const [mounted, setMounted] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [won, setWon] = useState<StoredSpin | null>(null);
  const [copied, setCopied] = useState(false);

  const conicStops = SPIN_DISPLAY_PERCENTS.map((_, i) => {
    const start = (i / SPIN_DISPLAY_SEGMENT_COUNT) * 100;
    const end = ((i + 1) / SPIN_DISPLAY_SEGMENT_COUNT) * 100;
    return `${WHEEL_COLORS[i % WHEEL_COLORS.length]} ${start}% ${end}%`;
  }).join(", ");

  useEffect(() => {
    setMounted(true);
    setWon(loadLastSpin());
  }, []);

  const spin = useCallback(() => {
    if (spinning) return;

    const percent = pickSpinDiscount();
    const index = displaySegmentIndexForPercent(percent);
    const segmentCenter = index * DEG_PER_SEGMENT + DEG_PER_SEGMENT / 2;
    const extraTurns = 5 + Math.floor(Math.random() * 3);
    const target = rotation + extraTurns * 360 + (360 - segmentCenter);

    setSpinning(true);
    setRotation(target);

    window.setTimeout(() => {
      const code = buildSpinCouponCode(percent);
      const stored: StoredSpin = { percent, code, at: new Date().toISOString() };
      saveLastSpin(stored);
      setWon(stored);
      setSpinning(false);
      setResultOpen(true);
    }, 4200);
  }, [rotation, spinning]);

  const copyCode = async () => {
    if (!won?.code) return;
    try {
      await navigator.clipboard.writeText(won.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const resultModal =
    mounted && resultOpen && won ? (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/55 p-3 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setResultOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-r from-mauve-deep via-mauve to-rose-400 px-4 py-3 pr-10 text-white">
              <button
                type="button"
                onClick={() => setResultOpen(false)}
                className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full border border-white/25 bg-white/10"
                aria-label="Close"
              >
                <FiX />
              </button>
              <p className="text-[10px] uppercase tracking-wider text-rose-100/90">Spin & Win</p>
              <h3 className=" text-xl">You won {won.percent}% off!</h3>
            </div>
            <div className="px-4 py-4 text-center">
              <p className="text-sm text-muted">Use this code in your cart before checkout.</p>
              <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 font-mono text-lg font-semibold text-ink">{won.code}</p>
              <Button type="button" className="mt-4 w-full" onClick={() => void copyCode()}>
                {copied ? (
                  <>
                    <FiCheck /> Copied
                  </>
                ) : (
                  <>
                    <FiCopy /> Copy code
                  </>
                )}
              </Button>
              <Link href="/cart" className="mt-2 block" onClick={() => setResultOpen(false)}>
                <Button type="button" variant="outline" className="w-full">
                  Go to cart & apply
                </Button>
              </Link>
              <Button type="button" variant="outline" size="sm" className="mt-2 w-full" onClick={() => setResultOpen(false)}>
                Done
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    ) : null;

  return (
    <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
      <div className="relative mx-auto flex size-72 items-center justify-center sm:size-80">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-100 via-white to-peach-100 shadow-glow" />
        <motion.div
          className="relative size-[88%] rounded-full border-4 border-white shadow-soft"
          style={{ background: `conic-gradient(from -90deg, ${conicStops})` }}
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <WheelLabels />
        </motion.div>
        <button
          type="button"
          disabled={spinning}
          onClick={spin}
          className={cn(
            "absolute z-10 flex size-16 items-center justify-center rounded-full border-4 border-white bg-mauve text-sm text-white shadow-glow transition",
            "hover:bg-mauve-deep disabled:opacity-70",
          )}
          aria-label="Spin the wheel"
        >
          {spinning ? "…" : "SPIN"}
        </button>
        <div className="pointer-events-none absolute -top-2 left-1/2 z-20 -translate-x-1/2 border-x-8 border-b-[14px] border-x-transparent border-b-mauve" />
      </div>

      <div>
        {/* <p className="text-base text-muted">
          Six slices from <strong>0% to 5% off</strong>. Spin, copy your code, then apply it in the cart.
        </p> */}
        <Button type="button" className="mt-6" disabled={spinning} onClick={spin}>
          {spinning ? "Spinning…" : "Spin the wheel"}
        </Button>
        {won ? (
          <p className="mt-3 text-xs text-muted">
            Last spin:{" "}
            <span className="font-medium text-ink">
              {won.percent}% off · {won.code}
            </span>
          </p>
        ) : null}
      </div>

      {mounted && resultModal ? createPortal(resultModal, document.body) : null}
    </div>
  );
}
