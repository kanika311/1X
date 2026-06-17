import fs from "fs";
import path from "path";
import multer from "multer";

import { getPublicBaseUrl, publicUploadUrl as buildPublicUploadUrl } from "@/lib/server/mediaUrl.js";
import { ensureUploadDir } from "@/lib/server/ensure-upload-dir.js";

/** Stored under public/uploads for Next.js static serving */
export const UPLOAD_DIR = process.env.UPLOAD_DIR?.trim()
  ? path.isAbsolute(process.env.UPLOAD_DIR)
    ? process.env.UPLOAD_DIR
    : path.join(process.cwd(), process.env.UPLOAD_DIR)
  : path.join(process.cwd(), "public", "uploads");

ensureUploadDir(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-z0-9-]/gi, "-")
      .slice(0, 48) || "image";
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

export const imageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype);
    if (!ok) return cb(new Error("Only JPEG, PNG, WebP, or GIF images are allowed"));
    cb(null, true);
  },
});

/** @deprecated import from utils/mediaUrl.js — kept for backwards compatibility */
export function publicUploadUrl(filename, req) {
  return buildPublicUploadUrl(filename, req);
}

export { getPublicBaseUrl };
