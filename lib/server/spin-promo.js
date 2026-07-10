import crypto from "crypto";

function spinDay() {
  return new Date().toISOString().slice(0, 10);
}

/** Issue a server-signed spin promo code bound to user + day + percent. */
export function issueSpinPromoCode(userId, percent) {
  const p = Math.min(5, Math.max(1, Math.round(Number(percent) || 1)));
  const sig = crypto
    .createHmac("sha256", process.env.JWT_SECRET)
    .update(`${userId}:${p}:${spinDay()}`)
    .digest("hex")
    .slice(0, 4)
    .toUpperCase();
  return `SPIN${p}-${sig}`;
}

/** Verify promo code was issued for this user today. */
export function verifySpinPromoCode(userId, code) {
  const normalized = String(code || "").trim().toUpperCase();
  const match = normalized.match(/^SPIN([1-5])-([A-Z0-9]{4})$/);
  if (!match) return null;
  const percent = Number(match[1]);
  const expected = issueSpinPromoCode(userId, percent);
  if (expected !== normalized) return null;
  return { percent, code: expected };
}

export function pickWeightedSpinPercent() {
  const weights = [
    { percent: 1, weight: 28 },
    { percent: 2, weight: 26 },
    { percent: 3, weight: 22 },
    { percent: 4, weight: 14 },
    { percent: 5, weight: 10 },
  ];
  const total = weights.reduce((s, w) => s + w.weight, 0);
  let roll = Math.random() * total;
  for (const { percent, weight } of weights) {
    roll -= weight;
    if (roll <= 0) return percent;
  }
  return 1;
}
