import Link from "next/link";

type Props = {
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
};

export function LegalPage({ title, intro, sections }: Props) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
      <p className="eyebrow">1X · Dr. Ayxh</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">{title}</h1>
      <p className="mt-6 text-base leading-relaxed text-muted">{intro}</p>
      <div className="mt-12 space-y-10">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-serif text-xl text-ink">{s.heading}</h2>
            <p className="mt-3 text-base leading-relaxed text-muted">{s.body}</p>
          </section>
        ))}
      </div>
      <p className="mt-14 text-sm text-muted">
        Questions?{" "}
        <Link href="/contact" className="font-medium text-mauve-deep hover:underline">
          Contact us
        </Link>
        {" · "}
        <Link href="/collaboration" className="font-medium text-mauve-deep hover:underline">
          Business collaboration
        </Link>
      </p>
    </article>
  );
}
