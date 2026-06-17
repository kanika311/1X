import mongoose from "mongoose";

import { registerModel } from "@/lib/db/register-model.js";

const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    productIds: [{ type: String }],
  },
  { timestamps: true },
);

export const Wishlist = registerModel("Wishlist", wishlistSchema);
