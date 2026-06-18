import { IMG } from "@/lib/images";

export type LegalSection = { heading: string; body: string };
export type LegalDoc = { title: string; intro: string; sections: LegalSection[] };
export type ContactContent = {
  headline: string;
  subheadline: string;
  address: string;
  email: string;
  phone: string;
  whatsapp: string;
  linkedin: string;
};

export type AboutContent = {
  storyParagraph1: string;
  storyParagraph2: string;
  visionTitle: string;
  visionText: string;
};

export type FounderContent = {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
};

export type HeroSlide = {
  mediaType: "image" | "video";
  src: string;
  alt: string;
};

export type VideoSliderItem = {
  title: string;
  subtitle: string;
  videoSrc: string;
  posterSrc: string;
};

export type PaymentContent = {
  upiId: string;
  upiPayeeName: string;
  qrImage: string;
};

export type SiteContent = {
  key: string;
  about: AboutContent;
  founder?: FounderContent;
  homeHeroSlides?: HeroSlide[];
  homeVideoSlides?: VideoSliderItem[];
  contact: ContactContent;
  payment?: PaymentContent;
  privacy: LegalDoc;
  terms: LegalDoc;
  updatedAt?: string;
};

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  { mediaType: "image", src: "/cyber.png", alt: "Cybersecurity" },
  { mediaType: "image", src: IMG.about, alt: "Wellness studio" },
  { mediaType: "image", src: "/LOGO.jpeg", alt: "1X" },
];

export const DEFAULT_FOUNDER: FounderContent = {
  eyebrow: "About the founder",
  title: "Dr. Ayxh, Founder of 1X",
  body: `Raised across multiple cultures and faiths, she grew up seeing how safety, identity, and dignity intersect. That perspective shaped everything.

With degrees in business, tech, medicine, and fashion, Ayxh brings a rare mix: the precision of a doctor + physiotherapist, the mindset of an ethical hacker, and the eye of a designer. She speaks multiple languages. She is a Polymath and Builder.

She built 1X to reimagine security — not as guards and gates, but as luxury + care. High-trust protection meets therapy, wellness, and human-first service. Because safety should feel as good as it looks.

She started 1X with one vision: security and therapy that feel luxurious, not intimidating. Services built on discretion, empathy, and cutting-edge tech — so clients feel protected, not policed.`,
  image: "",
};

export const DEFAULT_ABOUT: AboutContent = {
  storyParagraph1:
    "Dr. Ayxh founded 1X to unite two worlds: luxury physiotherapy that restores movement and confidence, and rigorous cybersecurity that opens doors in a high-demand industry. Every service we provide reflects the same standard — premium, personal, and outcome-driven.",
  storyParagraph2:
    "Alignment in the body, encryption in the code. Balance is everything.\nFixing your posture and your passwords. You need both — that's why you have 1X by Dr. Ayxh.",
  visionTitle: "Vision",
  visionText:
    "A world where wellness and digital literacy are equally accessible, delivered with the care of a luxury brand and the rigor of experts.",
};

export const DEFAULT_PAYMENT: PaymentContent = {
  upiId: process.env.NEXT_PUBLIC_UPI_ID || "ayeshaaahmedsinghrockzzz@okhdfcbank",
  upiPayeeName: process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || "Dr. Ayxh Abram",
  qrImage: "",
};

export const DEFAULT_CONTACT: ContactContent = {
  headline: "Get in touch",
  subheadline: "Book a 1-on-1 consult/collab with Dr. Ayxh.",
  address: "1X Wellness & Cyber Campus, Based on Kolkata, Pune, Noida and working globally",
  email: "dr.ayxhbusiness@gmail.com",
  phone: "+91 6289672438",
  whatsapp: "+91 6289672438",
  linkedin: "",
};

export function resolveHeroSlides(content: SiteContent | null): HeroSlide[] {
  const slides = content?.homeHeroSlides?.filter((s) => s.src?.trim()) ?? [];
  return slides.length > 0 ? slides : DEFAULT_HERO_SLIDES;
}

export function resolveVideoSlides(content: SiteContent | null): VideoSliderItem[] {
  return (
    content?.homeVideoSlides
      ?.map((item) => ({
        title: item.title?.trim() ?? "",
        subtitle: item.subtitle?.trim() ?? "",
        videoSrc: item.videoSrc?.trim() ?? "",
        posterSrc: item.posterSrc?.trim() ?? "",
      }))
      .filter((item) => item.videoSrc) ?? []
  );
}

export function resolveFounderFields(content: SiteContent | null): FounderContent {
  if (content === null) {
    return DEFAULT_FOUNDER;
  }

  const f = content.founder ?? ({} as Partial<FounderContent>);
  return {
    eyebrow: f.eyebrow?.trim() || DEFAULT_FOUNDER.eyebrow,
    title: f.title?.trim() || DEFAULT_FOUNDER.title,
    body: f.body?.trim() || DEFAULT_FOUNDER.body,
    image: f.image?.trim() ?? "",
  };
}

export function resolvePaymentFields(content: SiteContent | null): PaymentContent {
  if (content === null) {
    return DEFAULT_PAYMENT;
  }

  const p = content.payment ?? ({} as Partial<PaymentContent>);
  return {
    upiId: p.upiId?.trim() || DEFAULT_PAYMENT.upiId,
    upiPayeeName: p.upiPayeeName?.trim() || DEFAULT_PAYMENT.upiPayeeName,
    qrImage: p.qrImage?.trim() ?? "",
  };
}

/** Uses API values when content exists; empty strings stay empty. Defaults only when API returned null. */
export function resolveContactFields(content: SiteContent | null): ContactContent {
  if (content === null) {
    return DEFAULT_CONTACT;
  }

  const c = content.contact ?? ({} as Partial<ContactContent>);
  return {
    headline: c.headline?.trim() || DEFAULT_CONTACT.headline,
    subheadline: c.subheadline?.trim() ?? "",
    address: c.address?.trim() || DEFAULT_CONTACT.address,
    email: c.email?.trim() || DEFAULT_CONTACT.email,
    phone: c.phone?.trim() || DEFAULT_CONTACT.phone,
    whatsapp: c.whatsapp?.trim() || DEFAULT_CONTACT.whatsapp,
    linkedin: c.linkedin?.trim() ?? "",
  };
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function fetchSiteContent(): Promise<SiteContent | null> {
  try {
    const res = await fetch(`${API}/site-content`, { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return null;
    return (data.content as SiteContent) || null;
  } catch {
    return null;
  }
}

