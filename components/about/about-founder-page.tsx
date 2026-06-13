"use client";

import { useEffect, useState } from "react";

import {
  DEFAULT_FOUNDER,
  fetchSiteContent,
  resolveFounderFields,
  type FounderContent,
} from "@/lib/site-content-api";
import { resolveApiMediaUrl } from "@/lib/media-url";

export function AboutFounderPage({ initialFounder = DEFAULT_FOUNDER }: { initialFounder?: FounderContent }) {
  const [founder, setFounder] = useState<FounderContent>(initialFounder);

  useEffect(() => {
    fetchSiteContent()
      .then((content) => setFounder(resolveFounderFields(content)))
      .catch(() => setFounder(DEFAULT_FOUNDER));
  }, []);

  const paragraphs = founder.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const imageUrl = founder.image ? resolveApiMediaUrl(founder.image) : "";

  return (
    <article className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <header className="mb-12 text-center md:mb-16">
        <p className="eyebrow">{founder.eyebrow}</p>
        <h1 className="mt-3 text-3xl text-ink md:text-4xl lg:text-5xl">{founder.title}</h1>
      </header>

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(260px,360px)] lg:gap-14">
        <div className="space-y-6 text-base leading-relaxed text-muted md:text-lg">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-3xl border border-rose-100/80 bg-white shadow-soft">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt={founder.title} className="aspect-[4/5] w-full object-cover" />
            ) : (
              <div className="flex aspect-[4/5] flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-peach-100/60 p-8 text-center">
                <div className="flex size-24 items-center justify-center rounded-full bg-white text-2xl font-semibold text-mauve-deep shadow-soft">
                  DA
                </div>
                <p className="mt-4 text-sm text-muted">Founder photo — add in admin Site content</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}
