import { createRoute } from "@/lib/api/route-bridge";
import * as auth from "@/services/authController.js";

export const GET = createRoute(auth.me, { auth: true });
export const dynamic = "force-dynamic";
