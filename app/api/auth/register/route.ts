import { createRoute } from "@/lib/api/route-bridge";
import * as auth from "@/services/authController.js";

export const POST = createRoute(auth.register, {
  rateLimit: { windowMs: 15 * 60_000, max: 8, keyPrefix: "auth:register" },
});
export const dynamic = "force-dynamic";
