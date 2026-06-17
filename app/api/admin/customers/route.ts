import { createRoute } from "@/lib/api/route-bridge";
import * as orders from "@/services/orderController.js";

export const GET = createRoute(orders.listCustomers, { admin: true });
export const dynamic = "force-dynamic";
