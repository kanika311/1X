"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import {
  DEFAULT_HERO_SLIDES,
  fetchSiteContent,
  resolveHeroSlides,
  type HeroSlide,
} from "@/lib/site-content-api";
import { resolveApiMediaUrl } from "@/lib/media-url";

type AboutHeroSliderProps = {
  initialSlides?: HeroSlide[];
};

const slideTransition = {
  duration: 1,
  ease: [0.45, 0, 0.15, 1] as const,
};

function SlideMedia({ slide, mediaSrc }: { slide: HeroSlide; mediaSrc: string }) {
  if (slide.mediaType === "video") {
    return (
      <video
        src={mediaSrc}
        className="absolute inset-0 h-full w-full object-cover object-center"
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  return (
    <Image
      src={mediaSrc}
      alt={slide.alt || "Home hero slide"}
      fill
      priority
      sizes="100vw"
      className="object-cover object-center"
    />
  );
}

export function AboutHeroSlider({ initialSlides }: AboutHeroSliderProps) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides ?? DEFAULT_HERO_SLIDES);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (initialSlides) {
      setSlides(initialSlides);
      return;
    }
    fetchSiteContent()
      .then((content) => setSlides(resolveHeroSlides(content)))
      .catch(() => setSlides(DEFAULT_HERO_SLIDES));
  }, [initialSlides]);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[index] ?? slides[0];
  const mediaSrc = resolveApiMediaUrl(slide.src) || slide.src;

  return (
    <section className="relative w-full overflow-hidden bg-cream">
      <div className="relative h-[calc(100dvh-72px)] min-h-[520px] w-full md:h-[min(88vh,820px)] md:min-h-0">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={slideTransition}
            className="absolute inset-0"
          >
            <SlideMedia slide={slide} mediaSrc={mediaSrc} />
          </motion.div>
        </AnimatePresence>

        {/* Bottom fade only — keeps text readable, no image blur or pink wash */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[40%] bg-gradient-to-t from-black/55 via-black/20 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-end px-4 pb-14 pt-16 text-center sm:px-6 sm:pb-16">
          <p className="eyebrow text-white/95">Our story</p>
          <h1 className="mt-3 text-4xl text-white drop-shadow-sm md:text-5xl lg:text-6xl">Dr. Ayxh</h1>
          <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-white/90">Founder · 1X</p>
        </div>

        {slides.length > 1 ? (
          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button
                key={`${s.src}-${i}`}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-1 rounded-full transition-all duration-500 ease-out ${
                  i === index ? "w-10 bg-white" : "w-4 bg-white/45 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
