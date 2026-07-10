import { NextResponse } from "next/server";

import { createRoute } from "@/lib/api/route-bridge";
import * as auth from "@/services/authController.js";

export const POST = createRoute(auth.refreshSession, {
  rateLimit: { windowMs: 60_000, max: 30, keyPrefix: "auth:refresh" },
});
export const dynamic = "force-dynamic";
