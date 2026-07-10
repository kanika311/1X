import { z } from "zod";

export const loginSchema = z
  .object({
    identifier: z.string().trim().optional(),
    number: z.string().trim().optional(),
    password: z.string().min(1, "Password is required"),
    scope: z.enum(["user", "admin"]).default("user"),
  })
  .refine((data) => Boolean(data.identifier?.trim() || data.number?.trim()), {
    message: "Email or phone is required",
    path: ["identifier"],
  });

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  number: z.string().trim().optional(),
  email: z.string().trim().email().optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  role: z.literal("user").optional(),
  referredBy: z.string().trim().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export const contactInquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(20).optional(),
  message: z.string().trim().min(3).max(5000),
});

export const testimonialSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  serviceUsed: z.string().trim().min(1).max(200),
  message: z.string().trim().min(20).max(5000),
  rating: z.coerce.number().int().min(1).max(5),
  serviceDate: z.string().trim().min(1),
  consent: z.union([z.boolean(), z.literal("true"), z.literal("on")]),
});

export const orderItemSchema = z.object({
  cartKey: z.string().trim().min(1),
  offeringId: z.string().trim().optional(),
  type: z.enum(["course", "service", "membership"]),
  title: z.string().trim().optional(),
  price: z.number().optional(),
  quantity: z.coerce.number().int().min(1).max(99).optional(),
  image: z.string().optional(),
  duration: z.string().optional(),
});

export const createOrderSchema = z.object({
  customerName: z.string().trim().max(120).optional(),
  customerEmail: z.string().trim().email().optional(),
  customerPhone: z.string().trim().max(20).optional(),
  items: z.array(orderItemSchema).min(1, "Cart is empty"),
  notes: z.string().trim().max(2000).optional(),
  promoCode: z.string().trim().max(32).optional(),
  discountPercent: z.coerce.number().min(0).max(5).optional(),
  discountAmount: z.coerce.number().min(0).optional(),
});

export const confirmPaymentSchema = z.object({
  paymentReference: z.string().trim().min(4).max(120),
});

export function parseBody<T>(schema: z.ZodSchema<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    const message = result.error.issues[0]?.message || "Invalid request body";
    throw new Error(message);
  }
  return result.data;
}
