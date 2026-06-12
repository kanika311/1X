"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { SoftImage } from "@/components/ui/soft-image";
import { IMG } from "@/lib/images";

const OPTIONS = [
  {
    domain: "cyber",
    href: "/services/browse?domain=cyber",
    label: "Cybersecurity",
    subtitle: "Courses, labs & managed security services",
    image: '/soc.jpeg',
    alt: "Cybersecurity professional at work",
  },
  {
    domain: "physio",
    href: "/services/browse?domain=physio",
    label: "Physiotherapy",
    subtitle: "Luxury hands-on care by Dr. Ayxh",
    image: IMG.authPhysio,
    alt: "Physiotherapy and wellness session",
  },
] as const;

export function ServicesChooser() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12 text-center md:mb-16"
      >
        {/* <p className="eyebrow">Services</p> */}
        <h1 className="mt-3 text-3xl text-ink md:text-4xl lg:text-5xl">
          Which service do you want to explore?
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted md:text-base">
          Choose cybersecurity programs or physiotherapy care — both delivered with the 1X premium standard.
        </p>
      </motion.header>

      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        {OPTIONS.map((option, index) => (
          <motion.article
            key={option.domain}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="group overflow-hidden rounded-3xl border border-rose-100/80 bg-white shadow-soft"
          >
            <div className="relative min-h-[280px] sm:min-h-[320px]">
              <SoftImage
                src={option.image}
                alt={option.alt}
                overlay="cta"
                rounded="none"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/70 via-ink/25 to-transparent p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-100">1X by Dr. Ayxh</p>
                <h2 className="mt-2 text-2xl text-white md:text-3xl">{option.label}</h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/85">{option.subtitle}</p>
                <Link href={option.href} className="mt-6 inline-block w-full sm:w-auto">
                  <Button
                    variant="luxury"
                    className="w-full bg-white/95 text-ink hover:bg-white sm:w-auto"
                  >
                    Explore {option.label}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
