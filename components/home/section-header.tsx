import Link from "next/link";

export function SectionHeader({
  eyebrow,
  title,
  href,
  linkLabel = "View all",
}: {
  eyebrow: string;
  title: string;
  href: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
      <div className="text-center sm:text-left">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-2 font-serif text-3xl text-ink md:text-4xl">{title}</h2>
      </div>
      <Link
        href={href}
        className="text-xs font-semibold uppercase tracking-wide text-ink underline-offset-4 hover:text-mauve-deep hover:underline"
      >
        {linkLabel}
      </Link>
    </div>
  );
}
