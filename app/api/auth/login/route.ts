import { createRoute } from "@/lib/api/route-bridge";
import * as auth from "@/services/authController.js";

export const POST = createRoute(auth.login, {
  rateLimit: { windowMs: 15 * 60_000, max: 12, keyPrefix: "auth:login" },
});
export const dynamic = "force-dynamic";
