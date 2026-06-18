"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { resolveApiMediaUrl, toUploadStoragePath } from "@/lib/media-url";
import { listMedia, uploadVideoFile, type MediaItem } from "@/lib/admin/upload";

const inputClass =
  "mt-1 w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm outline-none focus:border-mauve";

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i;

type Props = { label?: string; value: string; onChange: (url: string) => void };

export function VideoUploadField({ label = "Video", value, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);

  const previewSrc = value ? resolveApiMediaUrl(value) : "";

  const loadMedia = useCallback(async () => {
    try {
      const all = await listMedia();
      setMedia(all.filter((m) => VIDEO_EXT.test(m.filename)));
    } catch {
      setMedia([]);
    }
  }, []);

  useEffect(() => {
    if (libraryOpen) void loadMedia();
  }, [libraryOpen, loadMedia]);

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    try {
      onChange(await uploadVideoFile(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold uppercase text-muted">{label}</label>
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-rose-100 bg-ink">
          <video src={previewSrc} className="max-h-56 w-full object-cover" controls muted playsInline />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChange("");
            }}
            className="absolute right-2 top-2 rounded-md bg-white/90 px-2 py-1 text-xs"
          >
            Remove
          </button>
        </div>
      ) : null}
      <input
        className={inputClass}
        value={value}
        onChange={(e) => onChange(toUploadStoragePath(e.target.value))}
        onBlur={(e) => onChange(toUploadStoragePath(e.target.value))}
        placeholder="/video1.mp4 or /uploads/your-video.mp4"
      />
      <p className="text-[10px] text-muted">
        Upload MP4/WebM or paste a path like <code className="text-ink">/video1.mp4</code>
      </p>
      <div className="flex flex-wrap gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="rounded-lg bg-mauve-deep px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "Upload video"}
        </button>
        <button
          type="button"
          onClick={() => setLibraryOpen((o) => !o)}
          className="rounded-lg border border-rose-200 px-4 py-2 text-xs font-semibold"
        >
          Video library
        </button>
      </div>
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
      {libraryOpen ? (
        media.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {media.map((m) => (
              <button
                key={m.filename}
                type="button"
                onClick={() => {
                  onChange(m.path || toUploadStoragePath(m.url));
                  setLibraryOpen(false);
                }}
                className="rounded-lg border border-rose-100 p-2 text-left text-xs hover:bg-rose-50"
              >
                <video
                  src={resolveApiMediaUrl(m.path || m.url)}
                  className="mb-2 aspect-video w-full rounded-md object-cover"
                  muted
                  playsInline
                />
                <span className="line-clamp-1 text-muted">{m.filename}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted">No uploaded videos yet.</p>
        )
      ) : null}
    </div>
  );
}
