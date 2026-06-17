import mongoose from "mongoose";

import { registerModel } from "@/lib/db/register-model.js";

const contactInquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    phone: { type: String, trim: true, default: "", maxlength: 30 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true },
);

contactInquirySchema.index({ createdAt: -1 });

export const ContactInquiry = registerModel("ContactInquiry", contactInquirySchema);
