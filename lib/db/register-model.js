import mongoose from "mongoose";

/** Safe model registration for Next.js hot reload (avoids OverwriteModelError). */
export function registerModel(name, schema) {
  if (mongoose.models[name]) {
    return mongoose.models[name];
  }
  return mongoose.model(name, schema);
}
