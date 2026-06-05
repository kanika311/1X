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

export const CHAT_REPLIES = {
  pricing:
    "Course fees vary by program. Please visit our Courses section to view current pricing, offers, and enrollment details, or contact us for personalized guidance.",

  therapy:
    "Book physiotherapy sessions from ₹1,999. Sports Therapy, Pain Relief, and Rehabilitation plans are available. Visit our Services page to schedule an appointment.",

  contact:
    `Reach us at ${CHAT_EMAIL} or use our Contact page. Our team typically responds within 24 hours.`,

  demo:
    "Free demo classes are available every Saturday for Cybersecurity and Wellness programs. Contact us to reserve your seat.",

  consult:
    "Dr. Ayxh offers wellness and cybersecurity consultations on Tuesdays and Thursdays from 4 PM to 7 PM IST.",

  cert:
    "All professional courses include an industry-aligned certificate upon successful completion and project evaluation.",

  gift:
    "Explore our Gift Cards page for wellness sessions, course vouchers, and exclusive member benefits.",

  feedback:
    `We value your feedback! Please use our Contact page or email ${CHAT_EMAIL} to share your suggestions and experience.`,

  default: CHAT_GREETING,
} as const;

/**
 * Used for typed messages
 */
export function getChatReply(text: string): string {
  const lower = text.toLowerCase().trim();

  if (
    lower.includes("price") ||
    lower.includes("pricing") ||
    lower.includes("course") ||
    lower.includes("fees")
  ) {
    return CHAT_REPLIES.pricing;
  }

  if (
    lower.includes("therapy") ||
    lower.includes("book") ||
    lower.includes("appointment")
  ) {
    return CHAT_REPLIES.therapy;
  }

  if (
    lower.includes("contact") ||
    lower.includes("support") ||
    lower.includes("email")
  ) {
    return CHAT_REPLIES.contact;
  }

  if (
    lower.includes("demo") ||
    lower.includes("class")
  ) {
    return CHAT_REPLIES.demo;
  }

  if (
    lower.includes("consult") ||
    lower.includes("consultation")
  ) {
    return CHAT_REPLIES.consult;
  }

  if (
    lower.includes("certificate") ||
    lower.includes("cert")
  ) {
    return CHAT_REPLIES.cert;
  }

  if (
    lower.includes("gift") ||
    lower.includes("card")
  ) {
    return CHAT_REPLIES.gift;
  }

  if (
    lower.includes("feedback") ||
    lower.includes("review") ||
    lower.includes("suggestion")
  ) {
    return CHAT_REPLIES.feedback;
  }

  return CHAT_REPLIES.default;
}

/**
 * Used for quick action buttons
 */
export function getQuickActionReply(key: string): string {
  return (
    CHAT_REPLIES[key as keyof typeof CHAT_REPLIES] ||
    CHAT_REPLIES.default
  );
}