import { createRoute } from "@/lib/api/route-bridge";
import * as contact from "@/services/contactInquiryController.js";

export const POST = createRoute(contact.submitContactInquiry, {
  rateLimit: { windowMs: 15 * 60_000, max: 10, keyPrefix: "contact:submit" },
});
export const GET = createRoute(contact.listContactInquiries, { admin: true });
export const dynamic = "force-dynamic";
