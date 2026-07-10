const IMAGE_SIGNATURES = [
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: "image/gif", bytes: [0x47, 0x49, 0x46] },
  { mime: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] },
];

const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov", ".m4v"]);
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

export function detectImageMime(buffer) {
  if (!buffer || buffer.length < 4) return null;
  for (const sig of IMAGE_SIGNATURES) {
    if (sig.bytes.every((b, i) => buffer[i] === b)) return sig.mime;
  }
  if (buffer.length >= 12) {
    const webp = buffer.slice(8, 12).toString("ascii");
    if (webp === "WEBP") return "image/webp";
  }
  return null;
}

export function assertAllowedUpload({ buffer, ext, declaredMime, allowVideo = false }) {
  const normalizedExt = String(ext || "").toLowerCase();
  const isImageExt = IMAGE_EXTENSIONS.has(normalizedExt);
  const isVideoExt = VIDEO_EXTENSIONS.has(normalizedExt);

  if (!isImageExt && !(allowVideo && isVideoExt)) {
    throw new Error("File extension not allowed");
  }

  if (isImageExt) {
    const detected = detectImageMime(buffer);
    if (!detected) throw new Error("File content does not match a valid image");
    if (declaredMime && !declaredMime.toLowerCase().startsWith("image/")) {
      throw new Error("Declared MIME type does not match image content");
    }
    return { kind: "image", mime: detected };
  }

  return { kind: "video", mime: declaredMime || "video/mp4" };
}

export function safeUploadFilename(original, ext) {
  const normalizedExt = String(ext || "").toLowerCase();
  const base =
    String(original || "file")
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9-]/gi, "-")
      .slice(0, 48) || "file";
  return `${Date.now()}-${base}${normalizedExt}`;
}
