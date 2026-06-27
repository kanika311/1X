import { createRoute } from "@/lib/api/route-bridge";
import * as auth from "@/services/authController.js";

export const POST = createRoute(auth.userResetPassword);
export const dynamic = "force-dynamic";
