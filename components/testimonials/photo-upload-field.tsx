"use client";

import { useEffect, useRef, useState } from "react";
import { FiCamera, FiX } from "react-icons/fi";

type Props = {
  value: File | null;
  onChange: (file: File | null) => void;
};

export function PhotoUploadField({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  function handleFile(file: File | null) {
    if (!file) {
      onChange(null);
      return;
    }
    if (!/^image\/(jpeg|png|webp|gif)$/i.test(file.type)) return;
    if (file.size > 5 * 1024 * 1024) return;
    onChange(file);
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink">Profile photo</p>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="group relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-rose-200 bg-white/80 transition hover:border-rose-300 hover:bg-rose-50/50"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="size-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-1 text-muted">
              <FiCamera className="size-6" />
              <span className="text-[10px] uppercase tracking-wide">Upload</span>
            </div>
          )}
        </button>

        <div className="min-w-0 flex-1 text-sm text-muted">
          <p>Optional — helps visitors trust your review.</p>
          <p className="mt-1 text-xs">JPEG, PNG, WebP · max 5 MB</p>
          {value ? (
            <button
              type="button"
              onClick={() => {
                onChange(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="mt-2 inline-flex items-center gap-1 text-xs text-mauve-deep hover:underline"
            >
              <FiX className="size-3.5" /> Remove photo
            </button>
          ) : null}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
