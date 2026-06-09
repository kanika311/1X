/** Weighted discount — always 0–5% */
export const SPIN_WEIGHTS: { percent: number; weight: number }[] = [
  { percent: 0, weight: 28 },
  { percent: 1, weight: 26 },
  { percent: 2, weight: 22 },
  { percent: 3, weight: 14 },
  { percent: 4, weight: 7 },
  { percent: 5, weight: 5 },
];

/** Wheel labels — visual range 0% through 100% */
export const SPIN_DISPLAY_PERCENTS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const;

export const SPIN_DISPLAY_SEGMENT_COUNT = SPIN_DISPLAY_PERCENTS.length;

/** @deprecated use SPIN_DISPLAY_PERCENTS */
export const SPIN_SEGMENT_PERCENTS = SPIN_DISPLAY_PERCENTS;

/** @deprecated use SPIN_DISPLAY_SEGMENT_COUNT */
export const SPIN_SEGMENT_COUNT = SPIN_DISPLAY_SEGMENT_COUNT;

export function pickSpinDiscount(): number {
  const total = SPIN_WEIGHTS.reduce((s, w) => s + w.weight, 0);
  let roll = Math.random() * total;
  for (const { percent, weight } of SPIN_WEIGHTS) {
    roll -= weight;
    if (roll <= 0) return percent;
  }
  return 0;
}

/** Random slice for wheel animation (0–100% display only). */
export function pickDisplaySegmentIndex(): number {
  return Math.floor(Math.random() * SPIN_DISPLAY_SEGMENT_COUNT);
}

export function buildSpinCouponCode(percent: number): string {
  const p = Math.min(5, Math.max(0, Math.round(percent)));
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SPIN${p}-${suffix}`;
}

export const SPIN_STORAGE_KEY = "onex-last-spin";
export const CART_PROMO_KEY = "onex-cart-promo";

export type StoredSpin = {
  percent: number;
  code: string;
  at: string;
};

export type AppliedPromo = {
  code: string;
  percent: number;
};

export function loadLastSpin(): StoredSpin | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SPIN_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredSpin;
  } catch {
    return null;
  }
}

export function saveLastSpin(spin: StoredSpin) {
  localStorage.setItem(SPIN_STORAGE_KEY, JSON.stringify(spin));
}

export function loadCartPromo(): AppliedPromo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CART_PROMO_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppliedPromo;
  } catch {
    return null;
  }
}

export function saveCartPromo(promo: AppliedPromo | null) {
  if (!promo) localStorage.removeItem(CART_PROMO_KEY);
  else localStorage.setItem(CART_PROMO_KEY, JSON.stringify(promo));
}

export function parseSpinPromoCode(raw: string): { percent: number; code: string } | null {
  const code = raw.trim().toUpperCase();
  const match = code.match(/^SPIN([0-5])-([A-Z0-9]{4})$/);
  if (!match) return null;
  return { percent: Number(match[1]), code };
}

export function validateSpinPromoCode(input: string): { ok: true; promo: AppliedPromo } | { ok: false; error: string } {
  const parsed = parseSpinPromoCode(input);
  if (!parsed) {
    return { ok: false, error: "Enter a valid code like SPIN3-AB12 from your spin." };
  }

  if (parsed.percent < 1 || parsed.percent > 5) {
    return { ok: false, error: "This code has no discount. Spin again on Gift Cards for 1–5% off." };
  }

  const stored = loadLastSpin();
  if (!stored || stored.code.toUpperCase() !== parsed.code) {
    return { ok: false, error: "Code not recognized. Use the code from your latest spin on Gift Cards." };
  }

  if (stored.percent !== parsed.percent) {
    return { ok: false, error: "This promo code is invalid." };
  }

  return { ok: true, promo: { code: parsed.code, percent: parsed.percent } };
}

export function calcPromoDiscount(subtotal: number, percent: number): number {
  const p = Math.min(5, Math.max(0, percent));
  return Math.round((subtotal * p) / 100);
}

export function calcTotalAfterPromo(subtotal: number, percent: number): number {
  return Math.max(0, subtotal - calcPromoDiscount(subtotal, percent));
}
