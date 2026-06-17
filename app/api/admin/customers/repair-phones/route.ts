import { createRoute } from "@/lib/api/route-bridge";
import * as orders from "@/services/orderController.js";

export const POST = createRoute(orders.repairCustomerPhones, { admin: true });
export const dynamic = "force-dynamic";
