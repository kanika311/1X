/** Founder WhatsApp — direct contact */
export const FOUNDER_PHONE_DISPLAY = "+91 6289672438";
export const FOUNDER_PHONE_WA = "916289672438";

export const founderWhatsAppUrl = `https://wa.me/${FOUNDER_PHONE_WA}`;

export function founderWhatsAppHref(message?: string): string {
  const text = message?.trim();
  if (!text) return founderWhatsAppUrl;
  return `${founderWhatsAppUrl}?text=${encodeURIComponent(text)}`;
}

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hi Dr. Ayxh, I would like to get in touch regarding 1X services.";
