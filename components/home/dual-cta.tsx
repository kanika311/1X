import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SoftImage } from "@/components/ui/soft-image";
import { IMG } from "@/lib/images";

export function DualCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="grid gap-4 overflow-hidden rounded-3xl shadow-soft md:grid-cols-2 md:gap-0">
        <div className="relative min-h-[340px]">
          <SoftImage src={IMG.heroCyber} alt="Cybersecurity courses" overlay="cta" rounded="none" sizes="50vw" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white md:p-12">
            <p className="eyebrow !text-rose-100">Cyber</p>
            <h3 className="mt-2 font-serif text-3xl leading-tight">Start Learning</h3>
            <Link href="/courses" className="mt-6">
              <Button variant="luxury" className="bg-white/95 text-ink hover:bg-white">
                Explore Courses
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative min-h-[340px]">
          <SoftImage src={IMG.heroWellness} alt="Physiotherapy" overlay="cta" rounded="none" sizes="50vw" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white md:p-12">
            <p className="eyebrow !text-rose-100">Wellness</p>
            <h3 className="mt-2 font-serif text-3xl leading-tight">Book Therapy</h3>
            <Link href="/services" className="mt-6">
              <Button variant="luxury" className="bg-white/95 text-ink hover:bg-white">
                View Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
