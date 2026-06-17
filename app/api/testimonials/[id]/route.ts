import { createRoute } from "@/lib/api/route-bridge";
import * as testimonials from "@/services/testimonialController.js";

export const PATCH = createRoute(testimonials.updateTestimonial, { admin: true });
export const DELETE = createRoute(testimonials.deleteTestimonial, { admin: true });
export const dynamic = "force-dynamic";
