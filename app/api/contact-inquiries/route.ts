import { createRoute } from "@/lib/api/route-bridge";
import * as contact from "@/services/contactInquiryController.js";

export const POST = createRoute(contact.submitContactInquiry);
export const GET = createRoute(contact.listContactInquiries, { admin: true });
export const dynamic = "force-dynamic";
