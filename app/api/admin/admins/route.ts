import { createRoute } from "@/lib/api/route-bridge";
import * as admin from "@/services/adminController.js";

export const GET = createRoute(admin.listAdmins, { admin: true });
export const POST = createRoute(admin.createAdmin, { admin: true });
export const dynamic = "force-dynamic";
