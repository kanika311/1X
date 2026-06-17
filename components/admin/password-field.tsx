"use client";

import { useState, type InputHTMLAttributes } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const inputClass =
  "mt-1 w-full rounded-lg border border-rose-200 bg-white px-3 py-2.5 pr-10 text-sm outline-none focus:border-mauve";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  error?: string;
};

export function AdminPasswordField({ label, error, className, ...props }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      {label ? <label className="text-xs font-semibold uppercase text-muted">{label}</label> : null}
      <div className={label ? "relative" : "relative mt-1"}>
        <input
          {...props}
          type={visible ? "text" : "password"}
          className={className ?? inputClass}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-ink"
          aria-label={visible ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {visible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
