import type { Metadata } from "next";

import { SoftImage } from "@/components/ui/soft-image";
import { IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "About",
  description: "Meet Dr. Ayesha — bridging premium physiotherapy and cybersecurity education.",
};

export default function AboutPage() {
  return (
    <article>
      <section className="relative min-h-[50vh] overflow-hidden">
        <SoftImage src={IMG.about} alt="Dr. Ayesha wellness studio" overlay="hero" rounded="none" priority sizes="100vw" className="min-h-[50vh]" />
        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-32 text-center sm:px-6">
          <p className="eyebrow">Our story</p>
          <h1 className="mt-4 font-serif text-4xl text-ink md:text-6xl">Dr. Ayesha</h1>
          <p className="mt-2 text-sm font-medium uppercase tracking-wide text-muted">Founder · 1X</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <p className="font-serif text-2xl leading-relaxed text-ink md:text-3xl">
          Where clinical excellence meets digital defense — one vision for whole-person wellness.
        </p>
        <p className="mt-10 text-base leading-relaxed text-muted">
          Dr. Ayesha founded 1X to unite two worlds: luxury physiotherapy that restores movement and confidence, and
          rigorous cybersecurity education that opens doors in a high-demand industry. Every course and therapy session
          reflects the same standard — premium, personal, and outcome-driven.
        </p>
      </section>

      <section className="bg-gradient-to-b from-rose-50/50 to-cream py-20">
        <div className="mx-auto grid max-w-5xl gap-12 px-4 md:grid-cols-2 md:gap-16 sm:px-6">
          <div className="rounded-3xl border border-rose-100/80 bg-white/60 p-8 shadow-soft">
            <h2 className="font-serif text-2xl text-ink">Mission</h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Empower individuals to heal physically and grow professionally — through evidence-based therapy and
              industry-aligned cyber training.
            </p>
          </div>
          <div className="rounded-3xl border border-rose-100/80 bg-white/60 p-8 shadow-soft">
            <h2 className="font-serif text-2xl text-ink">Vision</h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              A world where wellness and digital literacy are equally accessible, delivered with the care of a luxury
              brand and the rigor of experts.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <div className="relative mx-auto aspect-[3/4] max-w-xs shadow-glow">
          <SoftImage src={IMG.drAyesha} alt="Dr. Ayesha" overlay="card" rounded="3xl" sizes="320px" />
        </div>
        <p className="mt-10 text-base leading-relaxed text-muted">
          Board-certified physiotherapist and cybersecurity program director — Dr. Ayesha personally oversees curriculum
          design and clinical protocols at 1X.
        </p>
      </section>
    </article>
  );
}
