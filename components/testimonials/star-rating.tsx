"use client";

import { useState } from "react";
import { FiStar } from "react-icons/fi";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
};

const sizes = { sm: "size-5", md: "size-7", lg: "size-8" };

export function StarRating({ value, onChange, size = "md", readOnly = false }: Props) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div
      className="flex items-center gap-1"
      role={readOnly ? "img" : "radiogroup"}
      aria-label={`${value} out of 5 stars`}
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= display;
        const icon = (
          <FiStar
            className={cn(
              sizes[size],
              "transition-colors",
              filled ? "fill-rose-400 text-rose-400" : "text-rose-200",
            )}
          />
        );

        if (readOnly) {
          return <span key={star}>{icon}</span>;
        }

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === value}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            className="rounded-full p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
            onClick={() => onChange?.(star)}
            onMouseEnter={() => setHover(star)}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}
