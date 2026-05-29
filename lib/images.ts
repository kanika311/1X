/** Soft, wellness-forward Unsplash photos — lower q for a gentler feel */
const u = (id: string, w: number, h: number, q = 72) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=${q}&auto=format`;

export const IMG = {
  /** Yoga studio — calm, light */
  heroBlend: u("1518611012118-696072aa579a", 1920, 1080),
  /** Meditation / stretch — soft wellness */
  heroWellness: u("1544367567-0f2fcb009e0b", 1920, 1080),
  /** Bright minimal workspace — gentle cyber tone */
  heroCyber: u("1497366216548-37526070297c", 1920, 1080),
  /** Spa / hands-on care */
  authPhysio: u("1540555700478-4be289fbecef", 1200, 1600),
  /** Soft desk & learning */
  authCyber: u("1515377908693-425088a18ee4", 1200, 1600),
  /** Wellness movement */
  course: u("1571019614242-c5c5dee9f50b", 800, 1000),
  /** Pilates / reformer — feminine studio */
  courseAlt: u("1593811169691-097ac550d8a0", 800, 1000),
  /** Yoga & therapy */
  service: u("1518611012118-696072aa579a", 800, 1000),
  /** Peaceful stretch */
  serviceAlt: u("1544367567-0f2fcb009e0b", 800, 1000),
  /** Meditation hero */
  about: u("1506126613408-eca07ce68773", 1400, 900),
  testimonial: u("1573497015587-b0659b7b0e0b", 600, 600),
  drAyesha: u("1573497015587-b0659b7b0e0b", 800, 1000),
} as const;
