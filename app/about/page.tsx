import type { Metadata } from "next";

import { AboutHeroSlider } from "@/components/about/about-hero-slider";
import { SoftImage } from "@/components/ui/soft-image";
import { IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "About",
  description: "Meet Dr. Ayxh — bridging premium physiotherapy and cybersecurity.",
};

export default function AboutPage() {
  return (
    <article>
      <AboutHeroSlider />

      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <p className="font-serif text-2xl leading-relaxed text-ink md:text-3xl">
          Where clinical excellence meets digital defense — one vision for whole-person wellness.
        </p>
        <p className="mt-10 text-base leading-relaxed text-muted">
          Dr. Ayesha founded 1X to unite two worlds: luxury physiotherapy that restores movement and confidence, and
          rigorous cybersecurity that opens doors in a high-demand industry. Every service we provide reflects the same
          standard — premium, personal, and outcome-driven.
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
          Alignment in the body, encryption in the code. Balance is everything.
          <br />
          Fixing your posture and your passwords. You need both — that&apos;s why you have 1X by Dr. Ayxh.
        </p>
      </section>
    </article>
  );
}
