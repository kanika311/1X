"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { SoftImage } from "@/components/ui/soft-image";
import { FALLBACK_IMAGE } from "@/lib/image-fallback";
import { IMG } from "@/lib/images";
import {
  DEFAULT_HERO_SLIDES,
  fetchSiteContent,
  resolveHeroSlides,
  type HeroSlide,
} from "@/lib/site-content-api";
import { resolveApiMediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";

const AUTO_SLIDE_MS = 4000;

const HERO_IMAGE_FALLBACKS = [FALLBACK_IMAGE, "/LOGO.jpeg", "/cybersecurity.jpeg", IMG.about];

type AboutHeroSliderProps = {
  initialSlides?: HeroSlide[];
};

const slideTransition = {
  duration: 0.9,
  ease: [0.45, 0, 0.15, 1] as const,
};

function SlideMedia({ slide, mediaSrc }: { slide: HeroSlide; mediaSrc: string }) {
  if (slide.mediaType === "video") {
    return (
      <>
        <video
          src={mediaSrc}
          className="absolute inset-0 h-full w-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-rose-50/10"
          aria-hidden
        />
      </>
    );
  }

  return (
    <>
      <SoftImage
        src={mediaSrc}
        alt={slide.alt || "Home hero slide"}
        overlay="none"
        rounded="none"
        priority
        sizes="100vw"
        fallbackChain={HERO_IMAGE_FALLBACKS}
        className="absolute inset-0 h-full w-full"
        imageClassName="object-cover object-center !min-h-full !min-w-full !scale-[1.12] sm:!scale-[1.06] blur-[2px] sm:blur-[3px]"
      />
      {/* Soft dreamy pink wash — full bleed (even on mobile) */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-50/55 via-rose-50/30 to-peach-100/45 backdrop-blur-[2px]"
        aria-hidden
      />
    </>
  );
}

export function AboutHeroSlider({ initialSlides }: AboutHeroSliderProps) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides ?? DEFAULT_HERO_SLIDES);
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (initialSlides) {
      setSlides(initialSlides.length > 0 ? initialSlides : DEFAULT_HERO_SLIDES);
      return;
    }
    fetchSiteContent()
      .then((content) => setSlides(resolveHeroSlides(content)))
      .catch(() => setSlides(DEFAULT_HERO_SLIDES));
  }, [initialSlides]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry?.isIntersecting ?? false),
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const count = slides.length;

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const goPrev = useCallback(() => goTo(index - 1), [index, goTo]);
  const goNext = useCallback(() => goTo(index + 1), [index, goTo]);

  useEffect(() => {
    if (count < 2 || !isVisible) return;
    const t = setInterval(() => goNext(), AUTO_SLIDE_MS);
    return () => clearInterval(t);
  }, [count, goNext, isVisible]);

  if (count === 0) return null;

  const slide = slides[index] ?? slides[0];
  const mediaSrc = resolveApiMediaUrl(slide.src);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-cream">
      <div className="relative h-[calc(100dvh-72px)] min-h-[520px] w-full md:h-[min(88vh,820px)] md:min-h-0">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={`${index}-${slide.src}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={slideTransition}
            className="absolute inset-0 overflow-hidden"
          >
            <SlideMedia slide={slide} mediaSrc={mediaSrc} />
          </motion.div>
        </AnimatePresence>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[45%] bg-gradient-to-t from-black/60 via-black/25 to-transparent"
          aria-hidden
        />

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              className={cn(
                "absolute left-3 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full",
                "border border-white/30 bg-white/90 text-ink shadow-glow backdrop-blur-sm transition",
                "hover:bg-white hover:text-mauve-deep sm:left-5 sm:size-12",
              )}
              aria-label="Previous slide"
            >
              <FiChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className={cn(
                "absolute right-3 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full",
                "border border-white/30 bg-white/90 text-ink shadow-glow backdrop-blur-sm transition",
                "hover:bg-white hover:text-mauve-deep sm:right-5 sm:size-12",
              )}
              aria-label="Next slide"
            >
              <FiChevronRight className="size-6" />
            </button>
          </>
        ) : null}

        <div className="pointer-events-none absolute inset-0 z-10 flex h-full flex-col items-center justify-end px-4 pb-14 pt-16 text-center sm:px-6 sm:pb-16">
          <p className="eyebrow text-white/95">Our story</p>
          <h1 className="mt-3 text-4xl text-white drop-shadow-sm md:text-5xl lg:text-6xl">Dr. Ayxh</h1>
          <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-white/90">Founder · 1X</p>
        </div>

        {count > 1 ? (
          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button
                key={`${s.src}-${i}`}
                type="button"
                onClick={() => goTo(i)}
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
