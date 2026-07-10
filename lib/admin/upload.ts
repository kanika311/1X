import { ApiError } from "@/lib/api";
import { toUploadStoragePath } from "@/lib/media-url";
import { getApiBaseUrl } from "@/lib/api-base";

const API = getApiBaseUrl();

export type MediaItem = { filename: string; url: string; path?: string; createdAt: string; size: number };

export async function uploadImageFile(file: File): Promise<string> {
  return uploadMediaFile(file);
}

export async function uploadVideoFile(file: File): Promise<string> {
  return uploadMediaFile(file);
}

async function uploadMediaFile(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API}/admin/upload`, {
    method: "POST",
    credentials: "include",
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.message || "Upload failed");

  return toUploadStoragePath(data.path || data.url);
}

export async function listMedia(): Promise<MediaItem[]> {
  const res = await fetch(`${API}/admin/media`, { credentials: "include" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.message || "Could not load media");
  return (data.media as MediaItem[]).map((m) => ({
    ...m,
    path: toUploadStoragePath(m.path || m.url),
  }));
}
