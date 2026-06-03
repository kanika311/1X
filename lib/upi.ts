export const UPI_PAYEE_NAME =
  process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || "Dr. Ayxh Abram";

export const UPI_ID =
  process.env.NEXT_PUBLIC_UPI_ID || "ayeshaaahmedsinghrockzzz@okhdfcbank";

/** UPI deep link — amount pre-filled for PhonePe / GPay / Paytm scan */
export function buildUpiPayUrl(amount: number, note: string) {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: UPI_PAYEE_NAME,
    am: String(Number(amount).toFixed(2)),
    cu: "INR",
    tn: note.slice(0, 80),
  });
  return `upi://pay?${params.toString()}`;
}
