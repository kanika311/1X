"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { SoftImage } from "@/components/ui/soft-image";
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
      <div className="relative h-[min(88vh,820px)] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${slide.mediaType}-${slide.src}-${index}`}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {slide.mediaType === "video" ? (
              <video
                src={mediaSrc}
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <SoftImage
                src={mediaSrc}
                alt={slide.alt || "Home hero slide"}
                overlay="hero"
                rounded="none"
                priority
                sizes="100vw"
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-4xl flex-col items-center justify-end px-4 pb-14 pt-20 text-center sm:px-6">
          <p className="eyebrow text-white/90">Our story</p>
          <h1 className="mt-3 text-4xl text-white md:text-5xl lg:text-6xl">Dr. Ayxh</h1>
          <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-white/85">Founder · 1X</p>
        </div>

        {slides.length > 1 ? (
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button
                key={`${s.src}-${i}`}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-1 rounded-full transition-all ${i === index ? "w-10 bg-white" : "w-4 bg-white/45"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
