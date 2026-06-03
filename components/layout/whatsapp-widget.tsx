"use client";

import { RiWhatsappLine } from "react-icons/ri";

import { DEFAULT_WHATSAPP_MESSAGE, founderWhatsAppHref } from "@/lib/contact";

export function WhatsAppWidget() {
  const href = founderWhatsAppHref(DEFAULT_WHATSAPP_MESSAGE);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[80] sm:bottom-8 sm:right-8">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with Dr. Ayxh"
        className="pointer-events-auto flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.45)] transition-transform hover:scale-105 hover:bg-[#20bd5a] sm:size-16"
      >
        <RiWhatsappLine className="size-8 sm:size-9" aria-hidden />
      </a>
    </div>
  );
}
