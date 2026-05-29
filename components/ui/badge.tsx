import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-mauve px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}
