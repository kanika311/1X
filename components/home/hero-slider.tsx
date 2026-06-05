"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { SoftImage } from "@/components/ui/soft-image";
import { IMG } from "@/lib/images";

const SLIDES = [
  {
    image: IMG.heroBlend,
    eyebrow: "Wellness × Cyber",
    title: "Secure Your Future. Heal Your Life.",
    subtitle: "Premium cybersecurity courses and luxury physiotherapy — one destination.",
  },
  {
    image: IMG.heroCyber,
    eyebrow: "Cyber Academy",
    title: "Master Digital Defense",
    subtitle: "SOC, ethical hacking, and forensics — taught with care and clarity.",
  },
  {
    image: IMG.heroWellness,
    eyebrow: "Physiotherapy",
    title: "Recovery, Reimagined",
    subtitle: "Dr. Ayesha’s signature therapy programs for body and mind.",
  },
] as const;

export function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className="relative min-h-[min(88vh,860px)] overflow-hidden bg-cream">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.image}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <SoftImage src={slide.image} alt="" overlay="hero" rounded="none" priority sizes="100vw" />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute -right-16 top-16 size-96 rounded-full bg-rose-200/40 blur-3xl animate-float" />
      <div className="pointer-events-none absolute bottom-24 left-8 size-72 rounded-full bg-peach-100/90 blur-3xl" />

      <div className="relative mx-auto flex min-h-[min(88vh,860px)] max-w-7xl flex-col justify-center px-4 py-28 sm:px-6 lg:px-8">
        <motion.p
          key={`eyebrow-${index}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="eyebrow"
        >
          {slide.eyebrow}
        </motion.p>
        <motion.h1
          key={`title-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-4 max-w-2xl  text-[2.35rem] leading-[1.12] text-ink sm:text-5xl lg:text-6xl"
        >
          {slide.title}
        </motion.h1>
        <motion.p
          key={`sub-${index}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="mt-6 max-w-lg text-base leading-relaxed text-muted md:text-lg"
        >
          {slide.subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Link href="/services">
            <Button variant="default">Explore Services</Button>
          </Link>
          <Link href="/services">
            <Button variant="luxury">Book Therapy</Button>
          </Link>
        </motion.div>

        <div className="absolute bottom-10 left-4 flex gap-2 sm:left-8">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all ${i === index ? "w-10 bg-mauve" : "w-4 bg-rose-200"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
