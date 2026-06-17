import { createRoute } from "@/lib/api/route-bridge";
import * as admin from "@/services/adminController.js";

export const GET = createRoute(admin.dashboardStats, { admin: true });
export const dynamic = "force-dynamic";
