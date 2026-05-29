import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/80 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-mauve text-white shadow-soft hover:bg-mauve-deep hover:shadow-glow",
        outline: "border border-rose-200/90 bg-white/90 text-ink hover:border-rose-300 hover:bg-rose-50/80",
        ghost: "text-ink hover:bg-rose-50/80",
        luxury: "border border-rose-100 bg-gradient-to-r from-rose-50 via-white to-peach-100 text-ink shadow-soft hover:shadow-glow",
      },
      size: {
        default: "h-11 px-8",
        sm: "h-9 px-5 text-xs",
        lg: "h-12 px-10 text-xs",
        icon: "size-10 rounded-full p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = "Button";
