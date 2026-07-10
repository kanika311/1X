import { createRoute } from "@/lib/api/route-bridge";
import * as spin from "@/services/spinController.js";

export const POST = createRoute(spin.issueSpinPromo, {
  auth: true,
  rateLimit: { windowMs: 60_000, max: 5, keyPrefix: "spin:issue" },
});
export const dynamic = "force-dynamic";
