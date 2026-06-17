import { createRoute } from "@/lib/api/route-bridge";
import * as admin from "@/services/adminController.js";

export const DELETE = createRoute(admin.deleteAdmin, { admin: true });
export const dynamic = "force-dynamic";
