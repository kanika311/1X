import { IMG } from "@/lib/images";
import type { ServiceIconKey } from "@/lib/service-icons";

export type ServiceDomain = "cyber" | "physio";
export type CyberCategory = "courses" | "services";
export type PhysioCategory = "therapy";
export type ServiceCategory = CyberCategory | PhysioCategory;

export type ServiceOffering = {
  slug: string;
  domain: ServiceDomain;
  category: ServiceCategory;
  title: string;
  description: string;
  duration: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  iconKey: ServiceIconKey;
  bestseller?: boolean;
  benefits: string[];
  faq: { q: string; a: string }[];
  cta: string;
};

export type CategoryMeta = {
  domain: ServiceDomain;
  category: ServiceCategory;
  title: string;
  subtitle: string;
  overview: string;
  benefits: string[];
  image: string;
  faq: { q: string; a: string }[];
};

export const PHYSIO_TECHNIQUES = [
  "Manual therapy",
  "Dry needling",
  "Taping",
  "IASTM",
  "Cupping",
  "Therapeutic exercises",
] as const;

const cyberCourses: Omit<ServiceOffering, "domain" | "category">[] = [
  {
    slug: "ethical-hacking",
    title: "Ethical Hacking",
    description: "Master offensive security with hands-on labs and certification-aligned curriculum.",
    duration: "12 weeks",
    price: 24999,
    rating: 4.9,
    reviews: 428,
    image: '/ethicalHacking.jpeg',
    iconKey: "zap",
    bestseller: true,
    benefits: ["Live red-team labs", "CEH-aligned modules", "Capstone report"],
    faq: [{ q: "Beginner friendly?", a: "Foundational modules cover prerequisites." }],
    cta: "Enroll now",
  },
  {
    slug: "soc-analyst",
    title: "SOC Analyst",
    description: "SIEM workflows, threat hunting, and incident response for modern SOCs.",
    duration: "10 weeks",
    price: 21999,
    rating: 4.8,
    reviews: 312,
    image: '/soc.jpeg',
    iconKey: "monitor",
    bestseller: true,
    benefits: ["Splunk & Sentinel", "Alert triage", "SOC simulation"],
    faq: [{ q: "Certificate?", a: "Yes — upon capstone completion." }],
    cta: "Enroll now",
  },
  {
    slug: "penetration-testing",
    title: "Penetration Testing",
    description: "End-to-end pentest methodology from scoping to executive deliverables.",
    duration: "14 weeks",
    price: 28999,
    rating: 4.9,
    reviews: 267,
    image: IMG.course,
    iconKey: "layers",
    benefits: ["Web & network focus", "OWASP Top 10", "Client-ready reports"],
    faq: [{ q: "Payment plans?", a: "EMI options available at checkout." }],
    cta: "Enroll now",
  },
  {
    slug: "network-security",
    title: "Network Security",
    description: "Design secure networks, firewalls, segmentation, and zero-trust foundations.",
    duration: "8 weeks",
    price: 18999,
    rating: 4.7,
    reviews: 198,
    image: '/NetworkSecurity.jpeg',
    iconKey: "shield",
    benefits: ["Firewall labs", "VPN & IDS", "Architecture reviews"],
    faq: [{ q: "Labs included?", a: "Cloud lab access for full program duration." }],
    cta: "Enroll now",
  },
  {
    slug: "cyber-forensics",
    title: "Cyber Forensics",
    description: "Digital evidence collection, chain of custody, and forensic tooling.",
    duration: "11 weeks",
    price: 23999,
    rating: 4.8,
    reviews: 156,
    image: '/cyber.jpeg',
    iconKey: "eye",
    bestseller: true,
    benefits: ["Disk & memory forensics", "Legal admissibility", "Case portfolio"],
    faq: [{ q: "Tools covered?", a: "Industry-standard forensic suites and workflows." }],
    cta: "Enroll now",
  },
];

const cyberServices: Omit<ServiceOffering, "domain" | "category">[] = [
  {
    slug: "security-monitoring",
    title: "Security Monitoring",
    description: "24/7 managed detection and monitoring tailored to your environment.",
    duration: "Monthly",
    price: 39999,
    rating: 4.8,
    reviews: 44,
    image: IMG.heroCyber,
    iconKey: "monitor",
    benefits: ["SIEM tuning", "Alert correlation", "Monthly reports"],
    faq: [{ q: "Onboarding time?", a: "Typically 2–3 weeks for full integration." }],
    cta: "Subscribe",
  },
  {
    slug: "incident-response",
    title: "Incident Response",
    description: "Rapid containment, eradication, and recovery when incidents strike.",
    duration: "On demand",
    price: 74999,
    rating: 4.9,
    reviews: 38,
    image: IMG.course,
    iconKey: "zap",
    benefits: ["Retainer options", "Forensic support", "Post-incident review"],
    faq: [{ q: "Response SLA?", a: "Critical incidents: within 1 hour for retainer clients." }],
    cta: "Get support",
  },
  {
    slug: "threat-intelligence",
    title: "Threat Intelligence",
    description: "Actionable intel feeds and briefings aligned to your threat landscape.",
    duration: "Monthly",
    price: 29999,
    rating: 4.7,
    reviews: 29,
    image: IMG.courseAlt,
    iconKey: "trending-up",
    benefits: ["Sector-specific feeds", "Executive briefings", "IOC sharing"],
    faq: [{ q: "Integration?", a: "API feeds compatible with major SIEM platforms." }],
    cta: "Subscribe",
  },
  {
    slug: "security-operations",
    title: "Security Operations",
    description: "Fully managed security operations — detection, response, and continuous improvement.",
    duration: "Monthly",
    price: 89999,
    rating: 4.9,
    reviews: 31,
    image: '/securityOperations.jpeg',
    iconKey: "shield",
    bestseller: true,
    benefits: ["Dedicated analysts", "Playbook automation", "Quarterly reviews"],
    faq: [{ q: "Team size?", a: "Scaled to your environment and compliance needs." }],
    cta: "Contact us",
  },
];

const physioTherapy: Omit<ServiceOffering, "domain" | "category">[] = [
  {
    slug: "orthopedic-musculoskeletal",
    title: "Orthopedic & Musculoskeletal Physiotherapy",
    description:
      "For joint pain, back pain, neck pain, arthritis, post-fracture stiffness, and sports injuries. Focus on restoring movement and reducing pain.",
    duration: "45–60 min",
    price: 2199,
    rating: 4.9,
    reviews: 542,
    image: IMG.service,
    iconKey: "activity",
    bestseller: true,
    benefits: ["Joint & spine care", "Pain reduction", "Mobility restoration", "Manual therapy"],
    faq: [{ q: "What conditions?", a: "Arthritis, back/neck pain, post-fracture stiffness, and sports injuries." }],
    cta: "Book now",
  },
  {
    slug: "neurological-rehabilitation",
    title: "Neurological Rehabilitation",
    description:
      "For stroke recovery, Parkinson's, spinal cord injuries, and nerve-related conditions. Improve balance, coordination, and independence.",
    duration: "60 min",
    price: 2499,
    rating: 4.9,
    reviews: 318,
    image: IMG.serviceAlt,
    iconKey: "target",
    benefits: ["Balance training", "Coordination drills", "Independence goals", "Neuro rehab protocols"],
    faq: [{ q: "Stroke recovery?", a: "Phased programs aligned with your neurologist and recovery timeline." }],
    cta: "Book now",
  },
  {
    slug: "sports-injury-management",
    title: "Sports Injury Management & Performance Rehab",
    description:
      "Assessment, treatment, and return-to-sport programs for athletes. Includes injury prevention and performance enhancement.",
    duration: "60 min",
    price: 2699,
    rating: 4.9,
    reviews: 487,
    image: IMG.service,
    iconKey: "award",
    bestseller: true,
    benefits: ["Return-to-sport plans", "Injury prevention", "Performance enhancement", "Athlete screening"],
    faq: [{ q: "For all sports?", a: "Programs tailored to your sport, position, and competition schedule." }],
    cta: "Book now",
  },
  {
    slug: "post-surgical-rehabilitation",
    title: "Post-Surgical Rehabilitation",
    description:
      "Structured recovery plans after knee replacement, ACL surgery, spine surgery, or fracture fixation. Get back to daily life safely.",
    duration: "60 min",
    price: 2799,
    rating: 4.9,
    reviews: 401,
    image: IMG.authPhysio,
    iconKey: "trending-up",
    benefits: ["Phased recovery", "Surgeon-aligned protocols", "Safe progression", "Home exercise plans"],
    faq: [{ q: "After ACL or knee replacement?", a: "Yes — milestone-based rehab from week one post-op." }],
    cta: "Book now",
  },
  {
    slug: "posture-ergonomic-correction",
    title: "Posture & Ergonomic Correction",
    description:
      "For tech neck, desk-job stiffness, scoliosis, and poor posture. Includes workstation assessment and corrective exercises.",
    duration: "50 min",
    price: 1999,
    rating: 4.8,
    reviews: 367,
    image: IMG.serviceAlt,
    iconKey: "user-check",
    bestseller: true,
    benefits: ["Workstation assessment", "Tech neck relief", "Corrective exercises", "Ergonomic guidance"],
    faq: [{ q: "Desk workers?", a: "Ideal for remote and office professionals with chronic stiffness." }],
    cta: "Book now",
  },
  {
    slug: "pain-management",
    title: "Pain Management",
    description:
      "Non-surgical relief for chronic back pain, sciatica, frozen shoulder, and tennis elbow using manual therapy, dry needling, and modalities.",
    duration: "45 min",
    price: 1999,
    rating: 4.8,
    reviews: 689,
    image: IMG.service,
    iconKey: "heart",
    bestseller: true,
    benefits: ["Dry needling", "Manual therapy", "Modalities", "Non-surgical relief"],
    faq: [{ q: "Techniques used?", a: "Manual therapy, dry needling, cupping, IASTM, and therapeutic exercises." }],
    cta: "Book now",
  },
  {
    slug: "geriatric-physiotherapy",
    title: "Geriatric Physiotherapy",
    description:
      "Gentle programs for seniors to improve strength, balance, mobility, and fall prevention.",
    duration: "45 min",
    price: 1799,
    rating: 4.8,
    reviews: 224,
    image: IMG.serviceAlt,
    iconKey: "shield",
    benefits: ["Fall prevention", "Balance work", "Gentle strengthening", "Mobility support"],
    faq: [{ q: "Safe for seniors?", a: "Low-impact, clinician-supervised programs for all fitness levels." }],
    cta: "Book now",
  },
  {
    slug: "womens-health-physiotherapy",
    title: "Women's Health Physiotherapy",
    description:
      "Pre/post-natal care, pelvic floor rehab, and post-surgical recovery for women.",
    duration: "50 min",
    price: 2299,
    rating: 4.9,
    reviews: 276,
    image: IMG.authPhysio,
    iconKey: "heart",
    benefits: ["Pelvic floor rehab", "Pre/post-natal care", "Post-surgical support", "Private sessions"],
    faq: [{ q: "Post-natal?", a: "Safe return-to-activity programs after delivery or C-section." }],
    cta: "Book now",
  },
  {
    slug: "cardio-pulmonary-rehabilitation",
    title: "Cardio-Pulmonary Rehabilitation",
    description:
      "Breathing exercises and endurance training for asthma, COPD, and post-COVID recovery.",
    duration: "45 min",
    price: 1899,
    rating: 4.7,
    reviews: 198,
    image: IMG.service,
    iconKey: "activity",
    benefits: ["Breathing exercises", "Endurance training", "COPD support", "Post-COVID rehab"],
    faq: [{ q: "Asthma or COPD?", a: "Graduated programs to improve lung capacity and daily stamina." }],
    cta: "Book now",
  },
  {
    slug: "home-visit-physiotherapy",
    title: "Home Visit Physiotherapy",
    description:
      "Personalized sessions at your home for patients with mobility issues or busy schedules.",
    duration: "60–90 min",
    price: 3499,
    rating: 4.8,
    reviews: 234,
    image: IMG.serviceAlt,
    iconKey: "home",
    benefits: ["Delhi NCR visits", "Full equipment kit", "Mobility-friendly", "Flexible scheduling"],
    faq: [{ q: "Coverage?", a: "Delhi NCR — contact us for availability in your area." }],
    cta: "Book visit",
  },
  {
    slug: "tele-physiotherapy",
    title: "Tele-Physiotherapy / Online Consults",
    description:
      "Exercise guidance, posture checks, and rehab plans via video call.",
    duration: "30–45 min",
    price: 1299,
    rating: 4.7,
    reviews: 312,
    image: IMG.heroWellness,
    iconKey: "monitor",
    benefits: ["Video consults", "Posture checks", "Home exercise plans", "Follow-up support"],
    faq: [{ q: "How does it work?", a: "Book a slot — you'll receive a secure video link before your session." }],
    cta: "Book online",
  },
];

function withMeta(
  items: Omit<ServiceOffering, "domain" | "category">[],
  domain: ServiceDomain,
  category: ServiceCategory,
): ServiceOffering[] {
  return items.map((item) => ({ ...item, domain, category }));
}

export const offerings: ServiceOffering[] = [
  ...withMeta(cyberCourses, "cyber", "courses"),
  ...withMeta(cyberServices, "cyber", "services"),
  ...withMeta(physioTherapy, "physio", "therapy"),
];

export const categoryMeta: CategoryMeta[] = [
  {
    domain: "cyber",
    category: "courses",
    title: "Cybersecurity Courses",
    subtitle: "Industry-aligned programs with live labs and certificates",
    overview:
      "From ethical hacking to SOC operations — immersive courses designed for career transformation in cybersecurity.",
    benefits: ["Hands-on labs", "Certificate on completion", "Career support", "Expert mentors"],
    image: IMG.course,
    faq: [
      { q: "Beginner friendly?", a: "Foundational tracks available for every program." },
      { q: "Payment plans?", a: "EMI options for select courses." },
    ],
  },
  {
    domain: "cyber",
    category: "services",
    title: "Cybersecurity Services",
    subtitle: "Managed detection, response, and operations",
    overview:
      "Always-on security services — monitoring, incident response, threat intelligence, and full security operations.",
    benefits: ["24/7 coverage options", "Retainer flexibility", "Integrated tooling", "Dedicated teams"],
    image: IMG.heroCyber,
    faq: [
      { q: "SLA options?", a: "Tiered SLAs based on criticality and retainer level." },
      { q: "Integration?", a: "Works with your existing SIEM and ticketing stack." },
    ],
  },
  {
    domain: "physio",
    category: "therapy",
    title: "Physiotherapy Services",
    subtitle: "Expert hands-on care by Dr. Ayesha",
    overview:
      "Comprehensive physiotherapy across orthopedics, neurology, sports, post-surgical rehab, pain management, women's health, geriatric care, and more — in clinic, at home, or online.",
    benefits: [
      "Manual therapy & dry needling",
      "Personalized rehab plans",
      "Home & tele sessions",
      "Evidence-based techniques",
    ],
    image: IMG.service,
    faq: [
      { q: "Techniques used?", a: "Manual therapy, dry needling, taping, IASTM, cupping, and therapeutic exercises." },
      { q: "Same-week booking?", a: "Most slots available Mon–Sat, 10 AM – 7 PM IST." },
    ],
  },
];

export const DOMAIN_LABELS: Record<ServiceDomain, string> = {
  cyber: "Cybersecurity",
  physio: "Physiotherapy",
};

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  courses: "Courses",
  services: "Services",
  therapy: "Physiotherapy",
};

export const CYBER_SECTIONS: { key: CyberCategory; label: string }[] = [
  { key: "courses", label: "Courses" },
  { key: "services", label: "Services" },
];

export const PHYSIO_SECTIONS: { key: PhysioCategory; label: string }[] = [
  { key: "therapy", label: "Our Services" },
];

export function offeringPath(o: Pick<ServiceOffering, "domain" | "category" | "slug">) {
  return `/services/${o.domain}/${o.category}/${o.slug}`;
}

export function categoryPath(domain: ServiceDomain, category: ServiceCategory) {
  return `/services/${domain}/${category}`;
}

export function offeringId(o: Pick<ServiceOffering, "domain" | "category" | "slug">) {
  return `${o.domain}/${o.category}/${o.slug}`;
}

export function getOffering(domain: string, category: string, slug: string) {
  return offerings.find((o) => o.domain === domain && o.category === category && o.slug === slug);
}

export function getCategoryMeta(domain: ServiceDomain, category: ServiceCategory) {
  return categoryMeta.find((c) => c.domain === domain && c.category === category);
}

export function getOfferingsByDomain(domain: ServiceDomain) {
  return offerings.filter((o) => o.domain === domain);
}

export function getOfferingsByCategory(domain: ServiceDomain, category: ServiceCategory) {
  return offerings.filter((o) => o.domain === domain && o.category === category);
}
