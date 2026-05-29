import { IMG } from "@/lib/images";

export type TherapyService = {
  slug: string;
  title: string;
  duration: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  therapist: string;
  bestseller?: boolean;
  description: string;
  highlights: string[];
  includes: string[];
};

export const services: TherapyService[] = [
  {
    slug: "sports-therapy",
    title: "Sports Therapy",
    duration: "60 min",
    rating: 4.9,
    reviews: 512,
    price: 2499,
    image: IMG.service,
    therapist: "Dr. Ayesha",
    bestseller: true,
    description:
      "Performance-focused recovery for athletes — mobility, strength, and injury prevention.",
    highlights: ["Movement screening", "Manual therapy", "Return-to-play plan"],
    includes: ["Assessment", "Hands-on treatment", "Home exercise program"],
  },
  {
    slug: "pain-relief",
    title: "Pain Relief",
    duration: "45 min",
    rating: 4.8,
    reviews: 689,
    price: 1999,
    image: IMG.serviceAlt,
    therapist: "Dr. Ayesha",
    bestseller: true,
    description:
      "Evidence-based protocols for chronic and acute pain — back, neck, and joint focus.",
    highlights: ["Dry needling optional", "Posture correction", "Pain education"],
    includes: ["Consultation", "Targeted therapy", "Follow-up guidance"],
  },
  {
    slug: "rehabilitation",
    title: "Rehabilitation",
    duration: "60 min",
    rating: 4.9,
    reviews: 401,
    price: 2799,
    image: IMG.service,
    therapist: "Dr. Ayesha",
    description:
      "Post-surgery and injury rehab with progressive loading and functional milestones.",
    highlights: ["Personalized phases", "Strength rebuilding", "Progress tracking"],
    includes: ["Initial assessment", "Guided exercises", "Recovery roadmap"],
  },
  {
    slug: "home-consultation",
    title: "Home Consultation",
    duration: "90 min",
    rating: 4.7,
    reviews: 234,
    price: 3499,
    image: IMG.serviceAlt,
    therapist: "Dr. Ayesha",
    description:
      "Premium at-home physiotherapy for busy professionals and limited-mobility clients.",
    highlights: ["Delhi NCR coverage", "Full equipment kit", "Family caregiver tips"],
    includes: ["Home visit", "Treatment session", "Environment assessment"],
  },
  {
    slug: "posture-correction",
    title: "Posture Correction",
    duration: "50 min",
    rating: 4.8,
    reviews: 367,
    price: 2199,
    image: IMG.service,
    therapist: "Dr. Ayesha",
    bestseller: true,
    description:
      "Desk-worker programs for spinal alignment, ergonomics, and long-term habit change.",
    highlights: ["Workstation audit", "Core activation", "Stretching protocol"],
    includes: ["Posture analysis", "Corrective exercises", "Digital follow-up"],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
