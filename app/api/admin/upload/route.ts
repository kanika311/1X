import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

import { connectDB } from "@/lib/db/mongoose";
import { UPLOAD_DIR } from "@/lib/server/middleware/upload.js";
import { ensureUploadDir } from "@/lib/server/ensure-upload-dir.js";
import { normalizeImageForStorage, publicUploadUrl } from "@/lib/server/mediaUrl.js";
import { createRoute, buildBridgeRequest, handleBridgeError } from "@/lib/api/route-bridge";
import * as upload from "@/services/uploadController.js";

export const dynamic = "force-dynamic";

export const POST = async (request: NextRequest) => {
  try {
    await connectDB();
    const form = await request.formData();
    const file = form.get("file");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    const isImage = /^image\/(jpeg|png|webp|gif)$/i.test(file.type);
    const isVideo = /^video\/(mp4|webm|quicktime|x-m4v)$/i.test(file.type);
    if (!isImage && !isVideo) {
      return NextResponse.json(
        { success: false, message: "Only images (JPEG, PNG, WebP, GIF) or videos (MP4, WebM, MOV) are allowed" },
        { status: 400 },
      );
    }

    const maxBytes = isVideo ? 80 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { success: false, message: isVideo ? "Video must be under 80 MB" : "Image must be under 5 MB" },
        { status: 400 },
      );
    }

    const original = (file as File).name || (isVideo ? "video.mp4" : "image.jpg");
    const ext = path.extname(original).toLowerCase() || ".jpg";
    const base = path
      .basename(original, ext)
      .replace(/[^a-z0-9-]/gi, "-")
      .slice(0, 48) || "image";
    const filename = `${Date.now()}-${base}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    ensureUploadDir(UPLOAD_DIR);
    await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

    const req = await buildBridgeRequest(request, {}, { user: null });
    req.file = { filename, mimetype: file.type, buffer };

    return NextResponse.json({
      success: true,
      url: publicUploadUrl(filename, req),
      path: normalizeImageForStorage(`/uploads/${filename}`),
      filename,
    });
  } catch (error) {
    return handleBridgeError(error);
  }
};

export const GET = createRoute(upload.listMedia, { admin: true });
