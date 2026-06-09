"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { RiWhatsappLine } from "react-icons/ri";

import { Button } from "@/components/ui/button";
import { getTopHealthcareFaqs } from "@/lib/data/healthcare-faq";
import { founderWhatsAppHref } from "@/lib/contact";
import type { FaqItem } from "@/lib/normalize-faq";
import { cn } from "@/lib/utils";

type Props = {
  serviceTitle?: string;
  serviceSlug?: string;
  domain?: string;
  extraFaqs?: FaqItem[];
  bookHref?: string;
  bookLabel?: string;
};

export function HealthcareFaqSection({
  serviceTitle,
  serviceSlug,
  domain,
  extraFaqs = [],
  bookHref = "/contact",
  bookLabel = "Enroll now",
}: Props) {
  const items = useMemo(
    () =>
      getTopHealthcareFaqs({
        serviceTitle,
        slug: serviceSlug,
        domain,
        extraItems: extraFaqs,
        limit: 8,
      }),
    [serviceTitle, serviceSlug, domain, extraFaqs],
  );

  const [openId, setOpenId] = useState<string | null>(
    items[0] ? slugify(items[0].q) : null,
  );

  const whatsappHref = founderWhatsAppHref(
    `Hi Dr. Ayxh, I have a question about ${serviceTitle || "your services"} before booking.`,
  );

  return (
    <section className="bg-gradient-to-b from-rose-50/40 via-background to-background py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <header className="mb-12 text-center">
          <p className="eyebrow">Before you book</p>
          <h2 className="mt-3 text-3xl text-ink sm:text-4xl">Frequently asked questions</h2>
        
        </header>

        <div className="space-y-4">
          {items.map((item) => {
            const id = slugify(item.q);
            const isOpen = openId === id;
            const Icon = item.icon;

            return (
              <div
                key={id}
                className="overflow-hidden rounded-2xl border border-rose-100/80 bg-white/90 shadow-soft"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : id)}
                  className="flex w-full items-center gap-4 px-5 py-5 text-left transition-colors hover:bg-rose-50/30 sm:px-6 sm:py-6"
                  aria-expanded={isOpen}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-mauve-deep">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1 text-base font-medium leading-snug text-ink sm:text-lg">
                    {item.q}
                  </span>
                  <FiChevronDown
                    className={cn(
                      "size-5 shrink-0 text-muted transition-transform duration-300 ease-out",
                      isOpen && "rotate-180",
                    )}
                    aria-hidden
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-rose-50/90 px-5 pb-6 pl-[4.75rem] pr-6 pt-4 sm:px-6 sm:pb-7 sm:pl-[5.75rem]">
                        <p className="text-base leading-relaxed text-muted sm:text-[17px] sm:leading-8">
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* <div className="mt-14 rounded-2xl border border-rose-100/80 bg-gradient-to-br from-rose-50/90 via-white to-peach-50/50 px-6 py-10 text-center shadow-glow sm:px-10 sm:py-12">
          <h3 className="text-2xl text-ink sm:text-3xl">Still have questions?</h3>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted">
            Contact our team via WhatsApp or enroll now — we&apos;ll guide you personally.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-10 text-xs font-semibold uppercase tracking-wide text-white shadow-soft transition hover:bg-[#20bd5a]"
            >
              <RiWhatsappLine className="size-5" aria-hidden />
              WhatsApp
            </a>
            <Link href={bookHref}>
              <Button variant="default" size="lg" className="h-12 w-full px-10 sm:w-auto">
                {bookLabel}
              </Button>
            </Link>
          </div>
        </div> */}
      </div>
    </section>
  );
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
