"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiCheck, FiCopy, FiGift, FiX } from "react-icons/fi";

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

function segmentColor(pct: number, index: number) {
  if (pct <= 5) {
    return index % 2 === 0 ? "#e8c4d0" : "#d9a8b8";
  }
  return index % 2 === 0 ? "#fdf5f7" : "#fceee8";
}

function WheelDividers() {
  return (
    <svg viewBox="0 0 200 200" className="pointer-events-none absolute inset-0 size-full" aria-hidden>
      {Array.from({ length: SPIN_DISPLAY_SEGMENT_COUNT }).map((_, i) => {
        const angle = (i / SPIN_DISPLAY_SEGMENT_COUNT) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const x1 = 100 + 18 * Math.cos(rad);
        const y1 = 100 + 18 * Math.sin(rad);
        const x2 = 100 + 96 * Math.cos(rad);
        const y2 = 100 + 96 * Math.sin(rad);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="white"
            strokeWidth="1.25"
            opacity="0.65"
          />
        );
      })}
    </svg>
  );
}

function WheelPegs() {
  return (
    <svg viewBox="0 0 200 200" className="pointer-events-none absolute inset-0 size-full" aria-hidden>
      {Array.from({ length: SPIN_DISPLAY_SEGMENT_COUNT }).map((_, i) => {
        const angle = (i / SPIN_DISPLAY_SEGMENT_COUNT) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const x = 100 + 94 * Math.cos(rad);
        const y = 100 + 94 * Math.sin(rad);
        return <circle key={i} cx={x} cy={y} r="2.2" className="fill-white" opacity="0.9" />;
      })}
    </svg>
  );
}

function WheelLabels() {
  return (
    <svg viewBox="0 0 200 200" className="pointer-events-none absolute inset-0 size-full" aria-hidden>
      {SPIN_DISPLAY_PERCENTS.map((pct, i) => {
        const angle = ((i + 0.5) / SPIN_DISPLAY_SEGMENT_COUNT) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const x = 100 + 70 * Math.cos(rad);
        const y = 100 + 70 * Math.sin(rad);
        const isWin = pct <= 5;
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${angle + 90}, ${x}, ${y})`}
            className={cn(
              "text-[6.5px] font-bold sm:text-[7.5px]",
              isWin ? "fill-mauve-deep" : "fill-muted/70",
            )}
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

  const conicStops = SPIN_DISPLAY_PERCENTS.map((pct, i) => {
    const start = (i / SPIN_DISPLAY_SEGMENT_COUNT) * 100;
    const end = ((i + 1) / SPIN_DISPLAY_SEGMENT_COUNT) * 100;
    return `${segmentColor(pct, i)} ${start}% ${end}%`;
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
              <h3 className="text-xl">You won {won.percent}% off!</h3>
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
    <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
      {/* Wheel */}
      <div className="relative mx-auto w-full max-w-[22rem] sm:max-w-[26rem]">
        <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-rose-200/40 via-rose-100/20 to-peach-100/30 blur-2xl" />
        <div className="relative aspect-square">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-[10px] border-white bg-gradient-to-br from-rose-100 to-rose-50 shadow-glow" />
          <div className="absolute inset-3 rounded-full border border-rose-200/60" />

          {/* Pointer */}
          <div className="pointer-events-none absolute left-1/2 top-0 z-30 -translate-x-1/2">
            <div className="flex flex-col items-center">
              <div className="size-3 rounded-full border-2 border-white bg-mauve-deep shadow-md" />
              <div className="h-0 w-0 border-x-[10px] border-t-[16px] border-x-transparent border-t-mauve-deep drop-shadow-sm" />
            </div>
          </div>

          {/* Spinning disc */}
          <motion.div
            className="absolute inset-[14px] overflow-hidden rounded-full border-4 border-white shadow-soft"
            style={{ background: `conic-gradient(from -90deg, ${conicStops})` }}
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <WheelDividers />
            <WheelPegs />
            <WheelLabels />
          </motion.div>

          {/* Center hub */}
          <button
            type="button"
            disabled={spinning}
            onClick={spin}
            className={cn(
              "absolute left-1/2 top-1/2 z-20 flex size-[4.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full",
              "border-4 border-white bg-gradient-to-br from-mauve via-mauve-deep to-mauve text-xs font-bold tracking-widest text-white shadow-glow",
              "transition hover:scale-105 hover:shadow-[0_20px_48px_-12px_rgb(107_69_82/0.45)] disabled:scale-100 disabled:opacity-70",
            )}
            aria-label="Spin the wheel"
          >
            {spinning ? (
              <span className="animate-pulse">…</span>
            ) : (
              "SPIN"
            )}
          </button>
        </div>
      </div>

      {/* CTA panel */}
      <div className="flex flex-col justify-center">
        <div className="rounded-3xl border border-rose-100/90 bg-white/80 p-8 shadow-soft backdrop-blur-sm sm:p-10">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-rose-50 text-mauve-deep">
            <FiGift className="size-6" />
          </div>
          <p className="eyebrow mt-6">Try your luck</p>
          <h3 className="mt-2 font-serif text-3xl text-ink">Spin to win rewards</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Spin the wheel, copy your unique code, and apply it in your cart before checkout.
          </p>

          <Button
            type="button"
            className="mt-8 w-full px-8 py-6 text-sm font-semibold uppercase tracking-wider sm:w-auto"
            disabled={spinning}
            onClick={spin}
          >
            {spinning ? "Spinning…" : "Spin the wheel"}
          </Button>

          {won ? (
            <div className="mt-6 rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/80 to-white px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-subtle">Your last spin</p>
              <p className="mt-1 font-serif text-2xl text-mauve-deep">{won.percent}% off</p>
              <p className="mt-2 font-mono text-sm font-medium text-ink">{won.code}</p>
            </div>
          ) : (
            <p className="mt-6 text-xs text-subtle">One spin per session · codes valid on your next purchase</p>
          )}
        </div>
      </div>

      {mounted && resultModal ? createPortal(resultModal, document.body) : null}
    </div>
  );
}
