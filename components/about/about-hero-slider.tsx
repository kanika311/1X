"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { SoftImage } from "@/components/ui/soft-image";
import { IMG } from "@/lib/images";

const SLIDES = [
  {
    image: IMG.about,
    alt: "Wellness studio",
  },
  {
    image: "/cyber.png",
    alt: "Cybersecurity",
  },
  {
    image: '/LOGO.jpeg',
    alt: "1X",
  },
] as const;

export function AboutHeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className="relative h-[min(48vh,520px)] w-full overflow-hidden bg-cream">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.image}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <SoftImage src={slide.image} alt={slide.alt} overlay="hero" rounded="none" priority sizes="100vw" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

      <div className="relative mx-auto flex h-full max-w-4xl flex-col items-center justify-end px-4 pb-14 pt-20 text-center sm:px-6">
        <p className="eyebrow text-white/90">Our story</p>
        <h1 className="mt-3 font-serif text-4xl text-white md:text-5xl lg:text-6xl">Dr. Ayxh</h1>
        <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-white/85">Founder · 1X</p>
      </div>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all ${i === index ? "w-10 bg-white" : "w-4 bg-white/45"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
