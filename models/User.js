import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { registerModel } from "@/lib/db/register-model.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    // Email is unique per role (same email can exist once as admin and once as user)
    email: { type: String, trim: true, lowercase: true },
    number: { type: String, sparse: true, unique: true, trim: true },
  
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    /** Phone of member who referred this user (10-digit) */
    referredBy: { type: String, trim: true },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true },
);

// Unique email per role — only enforced when email is a non-empty string.
userSchema.index(
  { email: 1, role: 1 },
  { unique: true, partialFilterExpression: { email: { $type: "string" } } },
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const User = registerModel("User", userSchema);
