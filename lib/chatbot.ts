export const CHAT_HEADER = "1X Assistant";
export const CHAT_NAME = "Dr. Ayxh";
export const CHAT_TAGLINE = "Let's interact";
export const CHAT_EMAIL = "dr.ayxhbusiness@gmail.com";

export const CHAT_GREETING =
  "Hi! I'm Dr. Ayxh. Let's interact — tap a quick question below or ask about courses, therapy, gift cards, or bookings.";

export const CHAT_QUICK_ACTIONS = [
  { label: "Course pricing", key: "pricing" },
  { label: "Therapy booking", key: "therapy" },
  { label: "Contact support", key: "contact" },
  { label: "Demo classes", key: "demo" },
  { label: "Consultation", key: "consult" },
  { label: "Certificates", key: "cert" },
  { label: "Gift cards", key: "gift" },
  { label: "Feedback", key: "feedback" },
] as const;

export const CHAT_REPLIES: Record<string, string> = {
  pricing:
    "Cyber courses start at ₹18,999. Ethical Hacking and SOC Analyst are our bestsellers. Visit /services for full pricing.",
  therapy:
    "Book physiotherapy from ₹1,999 per session. Sports Therapy and Pain Relief are most popular. Head to /services to reserve.",
  contact:
    `Reach us at ${CHAT_EMAIL} or use the Contact page for appointments. We respond within 24 hours.`,
  demo:
    "Free demo classes run every Saturday for SOC Analyst and Posture Correction. Register via the Contact form.",
  consult:
    "Dr. Ayxh offers hybrid wellness + cyber career consultations on Tue & Thu, 4–7 PM IST.",
  cert:
    "All courses include industry-aligned certificates upon completion and capstone project review.",
  gift:
    "Gift cards and founding member benefits are on our Gift Cards page — exclusive wellness and cyber perks.",
  feedback:
    `Thank you for wanting to share feedback! Tell us what you loved or what we can improve — use the Contact page or email ${CHAT_EMAIL}. We read every message.`,
  default: CHAT_GREETING,
};

export function getChatReply(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("price") || lower.includes("cost")) return CHAT_REPLIES.pricing;
  if (lower.includes("therapy") || lower.includes("book")) return CHAT_REPLIES.therapy;
  if (lower.includes("contact") || lower.includes("email")) return CHAT_REPLIES.contact;
  if (lower.includes("demo")) return CHAT_REPLIES.demo;
  if (lower.includes("consult")) return CHAT_REPLIES.consult;
  if (lower.includes("cert")) return CHAT_REPLIES.cert;
  if (lower.includes("gift")) return CHAT_REPLIES.gift;
  if (lower.includes("feedback") || lower.includes("review") || lower.includes("suggest"))
    return CHAT_REPLIES.feedback;
  return CHAT_REPLIES.default;
}
