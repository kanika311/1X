import { createRoute } from "@/lib/api/route-bridge";
import * as contact from "@/services/contactInquiryController.js";

export const PATCH = createRoute(contact.updateContactInquiry, { admin: true });
export const DELETE = createRoute(contact.deleteContactInquiry, { admin: true });
export const dynamic = "force-dynamic";
