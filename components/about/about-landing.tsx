"use client";

import { useEffect, useState } from "react";

import { AboutChatbotSection } from "@/components/about/about-chatbot-section";
import { AboutHeroSlider } from "@/components/about/about-hero-slider";
import {
  DEFAULT_ABOUT,
  fetchSiteContent,
  type AboutContent,
} from "@/lib/site-content-api";

function mergeAbout(raw?: Partial<AboutContent> | null): AboutContent {
  return {
    storyParagraph1: raw?.storyParagraph1?.trim() || DEFAULT_ABOUT.storyParagraph1,
    storyParagraph2: raw?.storyParagraph2?.trim() || DEFAULT_ABOUT.storyParagraph2,
    visionTitle: raw?.visionTitle?.trim() || DEFAULT_ABOUT.visionTitle,
    visionText: raw?.visionText?.trim() || DEFAULT_ABOUT.visionText,
  };
}

export function AboutLanding() {
  const [about, setAbout] = useState<AboutContent>(DEFAULT_ABOUT);

  useEffect(() => {
    fetchSiteContent()
      .then((content) => setAbout(mergeAbout(content?.about)))
      .catch(() => setAbout(DEFAULT_ABOUT));
  }, []);

  const storyLines = about.storyParagraph2.split("\n").filter(Boolean);

  return (
    <article>
      <AboutHeroSlider />

      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <p className="mt-10 text-center font-serif text-2xl italic leading-relaxed text-ink">
          {about.storyParagraph1}
        </p>
        <p className="mt-10 text-lg leading-relaxed text-muted">
          {storyLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < storyLines.length - 1 ? <br /> : null}
            </span>
          ))}
        </p>
      </section>

      <section className="bg-gradient-to-b from-rose-50/50 to-cream py-12 sm:py-20">
        <div className="mx-auto w-full max-w-xl px-4 sm:max-w-2xl sm:px-6 lg:max-w-3xl">
          <div className="rounded-3xl border border-rose-100/80 bg-white/60 p-6 shadow-soft sm:p-8">
            <h2 className="text-xl text-ink sm:text-2xl">{about.visionTitle}</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{about.visionText}</p>
          </div>
        </div>
      </section>

      <AboutChatbotSection />
    </article>
  );
}
