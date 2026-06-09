import type { IconType } from "react-icons";
import {
  FiActivity,
  FiAward,
  FiCalendar,
  FiCreditCard,
  FiHeart,
  FiHome,
  FiShield,
  FiUsers,
} from "react-icons/fi";

import type { FaqItem } from "@/lib/normalize-faq";

export type FaqCategory = {
  id: string;
  label: string;
  icon: IconType;
  items: FaqItem[];
};

export const HEALTHCARE_FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "appointments",
    label: "Appointments & Booking",
    icon: FiCalendar,
    items: [
      {
        q: "How do I book an appointment?",
        a: "You can book online through our Services page, call our clinic, or message us on WhatsApp. Choose your preferred service, select a time slot, and our team will confirm your appointment within a few hours.",
      },
      {
        q: "Can I reschedule my appointment?",
        a: "Yes. Reschedule at least 24 hours before your session at no charge. Contact us via phone or WhatsApp and we'll find the next available slot that suits you.",
      },
      {
        q: "Do you offer online consultations?",
        a: "Yes. We offer secure video consultations for assessment, exercise guidance, and follow-up care. You'll receive a private link before your session — ideal if you travel often or prefer remote support.",
      },
      {
        q: "What booking slots are available?",
        a: "Slots are open Monday to Saturday, 7 AM – 7 PM IST. In-clinic, home visit, and online appointments are offered daily — message us on WhatsApp for same-week availability.",
      },
    ],
  },
  {
    id: "treatment",
    label: "Treatment & Results",
    icon: FiActivity,
    items: [
      {
        q: "How many sessions will I need?",
        a: "This depends on your condition, goals, and how your body responds. Many clients notice improvement within 4–6 sessions; chronic or post-surgical cases may need 8–12 weeks. Your physiotherapist will outline a clear plan after your first assessment.",
      },
      {
        q: "When will I start seeing results?",
        a: "Some clients feel relief after the first session — especially for muscle tension or posture issues. Lasting change usually builds over 2–4 weeks with consistent treatment and home exercises. We track progress at every visit.",
      },
      {
        q: "Is physiotherapy painful?",
        a: "Treatment should not cause sharp or lasting pain. You may feel mild soreness after manual therapy or new exercises — similar to post-workout stiffness. We always work within your comfort level and adjust techniques to your tolerance.",
      },
    ],
  },
  {
    id: "safety",
    label: "Safety & Eligibility",
    icon: FiShield,
    items: [
      {
        q: "Is this treatment safe for seniors?",
        a: "Yes. Our geriatric and general physiotherapy programs use low-impact, clinician-supervised techniques tailored to age, mobility, and medical history. We progress gradually and coordinate with your doctor when needed.",
      },
      {
        q: "Can I continue treatment if I have diabetes or high blood pressure?",
        a: "In most cases, yes — physiotherapy can support circulation, balance, and overall wellness. We review your medical history at intake and adapt intensity, duration, and exercise selection. Please share recent reports or medications at your first visit.",
      },
      {
        q: "Are treatments customized for individual needs?",
        a: "Every plan is personalized. After a full assessment — movement, strength, pain levels, and lifestyle — your physiotherapist designs a program specific to your body, goals, and daily routine.",
      },
    ],
  },
  {
    id: "pricing",
    label: "Pricing & Insurance",
    icon: FiCreditCard,
    items: [
      {
        q: "What are the consultation charges?",
        a: "Initial assessments and follow-up session fees are listed on each service page. Pricing reflects session length, clinician expertise, and whether care is in-clinic, at home, or online. Contact us for a quote tailored to your needs.",
      },
      {
        q: "What are the session fees?",
        a: "Session fees are listed in INR on each service page. Initial assessments may cost more than follow-ups. Multi-session packages lower the per-visit rate — ask about 5- and 10-session bundles when you book.",
      },
      {
        q: "Do you offer package plans?",
        a: "Yes. Multi-session packages offer better value for ongoing rehab, sports recovery, and senior wellness programs. Ask about 5-session and 10-session bundles when you book — we'll recommend the right plan for your goals.",
      },
      {
        q: "Do you offer gift cards?",
        a: "Yes. 1X gift cards cover therapy sessions, courses, and membership tiers. Buy from our Gift Cards page and share with family or friends — they make thoughtful wellness gifts.",
      },
      {
        q: "Can I use a gift card to book?",
        a: "Yes. Apply your gift card at checkout when purchasing a service or course online. For appointment bookings, share your gift card code on WhatsApp and our team will redeem it against your session.",
      },
      {
        q: "Is insurance accepted?",
        a: "We provide detailed invoices and clinical notes for reimbursement where your insurer allows outpatient physiotherapy. Coverage varies by provider and policy — we recommend confirming with your insurer before starting treatment.",
      },
    ],
  },
  {
    id: "home-visits",
    label: "Home Visits",
    icon: FiHome,
    items: [
      {
        q: "Do you provide home physiotherapy services?",
        a: "Yes. Home visits are available for seniors, post-operative clients, and anyone with limited mobility. A licensed physiotherapist brings equipment and conducts assessment and treatment in the comfort of your home.",
      },
      {
        q: "Which locations do you cover?",
        a: "We serve Kolkata, Pune, Noida, and surrounding areas, with select coverage in Delhi NCR. Availability depends on clinician schedules — message us with your pin code and we'll confirm home visit options for your area.",
      },
    ],
  },
  {
    id: "geriatric",
    label: "Geriatric Physiotherapy",
    icon: FiUsers,
    items: [
      {
        q: "How can physiotherapy help older adults?",
        a: "Physiotherapy improves strength, flexibility, and confidence in daily movement — helping seniors stay independent longer. Programs address pain, stiffness, recovery after illness, and safe activity after hospital stays.",
      },
      {
        q: "Can physiotherapy improve balance and prevent falls?",
        a: "Yes. Balance training, gait correction, and strength work are core parts of geriatric care. We assess fall risk and teach practical strategies — from getting out of a chair safely to navigating stairs and uneven surfaces.",
      },
      {
        q: "Is the program suitable for people with arthritis?",
        a: "Absolutely. Gentle joint mobilization, supported strengthening, and heat or manual therapy can reduce stiffness and improve function. We avoid aggravating flare-ups and pace activity to your comfort.",
      },
      {
        q: "Can seniors with limited mobility participate?",
        a: "Yes. Sessions are adapted for wheelchairs, walkers, and bed-bound clients where needed. We use seated exercises, assisted transfers, and caregiver guidance so progress is safe and achievable at any mobility level.",
      },
    ],
  },
  {
    id: "trust",
    label: "Trust & Your First Visit",
    icon: FiAward,
    items: [
      {
        q: "Are treatments performed by licensed physiotherapists?",
        a: "All sessions are delivered by qualified, licensed physiotherapists under Dr. Ayxh's clinical standards. We follow evidence-based protocols and maintain professional documentation for every client.",
      },
      {
        q: "What should I bring to my first appointment?",
        a: "Bring a government ID, any recent X-rays or MRI reports, a list of medications, comfortable clothing, and shoes you wear daily. If you have insurance, bring your policy details for billing support.",
      },
      {
        q: "How do I know if this service is right for me?",
        a: "Book a consultation or message us with your symptoms and goals. We'll honestly advise whether physiotherapy fits your situation, suggest the right program, or refer you to another specialist if needed — no pressure to commit.",
      },
    ],
  },
];

const GERIATRIC_SLUGS = new Set([
  "geriatric-physiotherapy",
  "geriatric",
  "senior-wellness",
  "elderly-care",
]);

export function flattenFaqCategories(categories: FaqCategory[]): (FaqItem & { category: string; icon: IconType })[] {
  return categories.flatMap((cat) =>
    cat.items.map((item) => ({ ...item, category: cat.label, icon: cat.icon })),
  );
}

const TOP_FAQ_LIMIT = 8;

const GENERAL_PHYSIO_TOP_QUESTIONS = [
  "What are the session fees?",
  "Do you offer package plans?",
  "Do you offer gift cards?",
  "Can I use a gift card to book?",
  "What booking slots are available?",
  "How do I book an appointment?",
  "Can I reschedule my appointment?",
  "How do I know if this service is right for me?",
];

const GERIATRIC_TOP_QUESTIONS = [
  "What are the session fees?",
  "Do you offer package plans?",
  "Do you offer gift cards?",
  "Can I use a gift card to book?",
  "What booking slots are available?",
  "How do I book an appointment?",
  "Is this treatment safe for seniors?",
  "Can I reschedule my appointment?",
];

const CYBER_TOP_QUESTIONS = [
  "What are the course fees?",
  "Are payment plans available?",
  "Do you offer gift cards?",
  "Can I use a gift card to enroll?",
  "What class slots are available?",
  "How do I enroll in this course?",
  "Will I receive a certificate?",
  "Can I speak with someone before purchasing?",
];

const CYBER_TOP_ANSWERS: Record<string, string> = {
  "What are the course fees?":
    "Course fees are listed in INR on each program page. Pricing reflects program length, lab access, and certification.",
 
  "Do you offer gift cards?":
    "Yes. 1X gift cards can be used toward courses and membership tiers. Purchase from our Gift Cards page.",
  "Can I use a gift card to enroll?":
    "Yes. Redeem your gift card at checkout when enrolling online, or share your code on WhatsApp and we'll apply it to your registration.",
  "What class slots are available?":
    "Live cohorts and 1-on-1 mentor slots run Monday to Saturday. Batch timings are shared at enrollment — contact us for the next available intake.",
  "How do I enroll in this course?":
    "Select the course, add it to your cart, and complete checkout — or contact us on WhatsApp for guided enrollment. Our team confirms your seat within 24 hours.",
  "Will I receive a certificate?":
    "Yes. Industry-aligned certificates are awarded after successful completion of coursework and capstone evaluation.",
  "Can I speak with someone before purchasing?":
    "Absolutely. WhatsApp our team or book a consultation call. We'll answer questions about curriculum, fees, and schedules.",
};

function isGeriatricService(slug: string, serviceTitle: string) {
  return GERIATRIC_SLUGS.has(slug) || /geriatric|senior|elderly/i.test(serviceTitle);
}

function pickByQuestions(
  pool: (FaqItem & { category: string; icon: IconType })[],
  questions: string[],
  limit: number,
) {
  const map = new Map(pool.map((item) => [item.q.toLowerCase(), item]));
  const picked: (FaqItem & { category: string; icon: IconType })[] = [];

  for (const q of questions) {
    const item = map.get(q.toLowerCase());
    if (item) picked.push(item);
    if (picked.length >= limit) break;
  }

  for (const item of pool) {
    if (picked.length >= limit) break;
    if (!picked.some((p) => p.q.toLowerCase() === item.q.toLowerCase())) {
      picked.push(item);
    }
  }

  return picked.slice(0, limit);
}

/** Curated 6–8 FAQs for quick scanning before booking or purchase. */
export function getTopHealthcareFaqs(options?: {
  serviceTitle?: string;
  slug?: string;
  domain?: string;
  extraItems?: FaqItem[];
  limit?: number;
}): (FaqItem & { icon: IconType })[] {
  const limit = options?.limit ?? TOP_FAQ_LIMIT;
  const extras = options?.extraItems ?? [];
  const slug = (options?.slug ?? "").toLowerCase();

  if (options?.domain !== "physio") {
    const cyberPool = CYBER_TOP_QUESTIONS.map((q) => ({
      q,
      a: CYBER_TOP_ANSWERS[q] ?? "",
      category: "Enrollment",
      icon: FiAward,
    })).filter((item) => item.a);

    const merged = [...extras.map((item) => ({ ...item, category: "FAQ", icon: FiAward })), ...cyberPool];
    const seen = new Set<string>();
    const unique: (FaqItem & { category: string; icon: IconType })[] = [];
    for (const item of merged) {
      const key = item.q.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(item);
    }
    return pickByQuestions(unique, CYBER_TOP_QUESTIONS, limit).map(({ category: _c, ...item }) => item);
  }

  const geriatric = isGeriatricService(slug, options?.serviceTitle ?? "");
  let categories = HEALTHCARE_FAQ_CATEGORIES;
  if (!geriatric) {
    categories = categories.filter((c) => c.id !== "geriatric");
  }

  const pool = flattenFaqCategories(categories);
  const seen = new Set(pool.map((f) => f.q.toLowerCase()));

  for (const item of extras) {
    const key = item.q.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      pool.unshift({
        ...item,
        category: options?.serviceTitle ? `${options.serviceTitle}` : "About this service",
        icon: FiHeart,
      });
    }
  }

  const order = geriatric ? GERIATRIC_TOP_QUESTIONS : GENERAL_PHYSIO_TOP_QUESTIONS;
  return pickByQuestions(pool, order, limit).map(({ category: _c, ...item }) => item);
}
