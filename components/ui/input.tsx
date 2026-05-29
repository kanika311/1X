import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-ink/15 bg-white px-4 text-base text-ink placeholder:text-subtle shadow-inner-soft transition-colors focus-visible:border-mauve/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200/80",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
