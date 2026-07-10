import { ApiError } from "@/lib/server/helpers.js";
import { issueSpinPromoCode, pickWeightedSpinPercent } from "@/lib/server/spin-promo.js";

export async function issueSpinPromo(req, res) {
  if (!req.user) throw new ApiError(401, "Sign in to spin");

  const percent = pickWeightedSpinPercent();
  const code = issueSpinPromoCode(req.user._id, percent);

  res.json({
    success: true,
    spin: {
      percent,
      code,
      at: new Date().toISOString(),
    },
  });
}
