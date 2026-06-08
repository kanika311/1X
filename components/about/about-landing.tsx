import { AboutChatbotSection } from "@/components/about/about-chatbot-section";
import { AboutHeroSlider } from "@/components/about/about-hero-slider";
import { SoftImage } from "@/components/ui/soft-image";
import { IMG } from "@/lib/images";

export function AboutLanding() {
  return (
    <article>
      <AboutHeroSlider />

      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        {/* <p className="font-serif text-2xl leading-relaxed text-ink md:text-3xl">
          Where clinical excellence meets digital defense — one vision for whole-person wellness.
        </p> */}
          <p className="mt-10 text-cente  text-2xl leading-relaxed text-ink font-serif italic">
          Dr. Ayxh founded 1X to unite two worlds: luxury physiotherapy that restores movement and confidence, and
          rigorous cybersecurity that opens doors in a high-demand industry. Every service we provide reflects the same
          standard — premium, personal, and outcome-driven.
        </p>
        <p className="mt-18 text-lg text-base leading-relaxed text-mutedleading-relaxed ">
          Alignment in the body, encryption in the code. Balance is everything.
          <br />
          Fixing your posture and your passwords. You need both — that&apos;s why you have 1X by Dr. Ayxh.
        </p>
      
      </section>

      <section className="bg-gradient-to-b from-rose-50/50 to-cream py-12 sm:py-20">
        <div className="mx-auto w-full max-w-xl px-4 sm:max-w-2xl sm:px-6 lg:max-w-3xl">
          <div className="rounded-3xl border border-rose-100/80 bg-white/60 p-6 shadow-soft sm:p-8">
            <h2 className="text-xl text-ink sm:text-2xl">Vision</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              A world where wellness and digital literacy are equally accessible, delivered with the care of a luxury
              brand and the rigor of experts.
            </p>
          </div>
        </div>
      </section>

      <AboutChatbotSection />

      {/* <section className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <div className="relative mx-auto aspect-[3/4] max-w-xs shadow-glow">
          <SoftImage src={IMG.drAyesha} alt="Dr. Ayxh" overlay="card" rounded="3xl" sizes="320px" />
        </div>
      </section> */}
    </article>
  );
}
