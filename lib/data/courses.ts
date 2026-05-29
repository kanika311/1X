import { IMG } from "@/lib/images";

export type Course = {
  slug: string;
  title: string;
  duration: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  bestseller?: boolean;
  description: string;
  highlights: string[];
  curriculum: string[];
};

export const courses: Course[] = [
  {
    slug: "ethical-hacking",
    title: "Ethical Hacking",
    duration: "12 weeks",
    rating: 4.9,
    reviews: 428,
    price: 24999,
    image: IMG.course,
    bestseller: true,
    description:
      "Master offensive security with hands-on labs, real-world scenarios, and industry-aligned certification prep.",
    highlights: ["Live red-team labs", "CEH-aligned modules", "Capstone penetration report"],
    curriculum: ["Reconnaissance", "Exploitation", "Post-exploitation", "Reporting"],
  },
  {
    slug: "soc-analyst",
    title: "SOC Analyst",
    duration: "10 weeks",
    rating: 4.8,
    reviews: 312,
    price: 21999,
    image: IMG.courseAlt,
    bestseller: true,
    description:
      "Learn SIEM workflows, threat hunting, and incident response for modern security operations centers.",
    highlights: ["Splunk & Sentinel basics", "Alert triage playbooks", "24/7 SOC simulation"],
    curriculum: ["Log analysis", "Detection engineering", "Incident handling", "Threat intel"],
  },
  {
    slug: "penetration-testing",
    title: "Penetration Testing",
    duration: "14 weeks",
    rating: 4.9,
    reviews: 267,
    price: 28999,
    image: IMG.course,
    description:
      "End-to-end pentest methodology from scoping to executive-ready deliverables.",
    highlights: ["Web & network focus", "OWASP Top 10 deep dive", "Client-ready reports"],
    curriculum: ["Scoping", "Vulnerability assessment", "Exploitation", "Remediation"],
  },
  {
    slug: "network-security",
    title: "Network Security",
    duration: "8 weeks",
    rating: 4.7,
    reviews: 198,
    price: 18999,
    image: IMG.courseAlt,
    description:
      "Design secure networks, firewalls, segmentation, and zero-trust foundations.",
    highlights: ["Firewall labs", "VPN & IDS", "Architecture reviews"],
    curriculum: ["TCP/IP security", "Perimeter defense", "Monitoring", "Hardening"],
  },
  {
    slug: "cyber-forensics",
    title: "Cyber Forensics",
    duration: "11 weeks",
    rating: 4.8,
    reviews: 156,
    price: 23999,
    image: IMG.course,
    bestseller: true,
    description:
      "Digital evidence collection, chain of custody, and forensic tooling for investigators.",
    highlights: ["Disk & memory forensics", "Legal admissibility", "Case study portfolio"],
    curriculum: ["Evidence handling", "Tooling", "Malware triage", "Court-ready docs"],
  },
];

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}
