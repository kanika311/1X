"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheck } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { OfferCountdown } from "@/components/offers/offer-countdown";
import { SoftImage } from "@/components/ui/soft-image";
import { IMG } from "@/lib/images";
import { cn } from "@/lib/utils";

function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-relaxed text-muted">{description}</p> : null}
    </div>
  );
}

function BenefitList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm text-ink md:text-base">
          <FiCheck className="mt-0.5 shrink-0 text-mauve" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function OfferCard({
  title,
  description,
  children,
  className,
  highlight,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        "glass rounded-3xl border p-6 shadow-soft transition-all duration-500 hover:shadow-glow sm:p-8",
        highlight ? "border-mauve/30 bg-gradient-to-br from-rose-50/90 via-white to-peach-100/80" : "border-rose-100/90",
        className,
      )}
    >
      <h3 className="font-serif text-xl text-ink md:text-2xl">{title}</h3>
      {description ? <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{description}</p> : null}
      {children}
    </motion.div>
  );
}

function OffersHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <SoftImage src={IMG.heroBlend} alt="" overlay="hero" rounded="none" priority sizes="100vw" className="min-h-[70vh]" />
      </div>
      <div className="pointer-events-none absolute -right-20 top-10 size-96 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="relative mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="eyebrow">
          Member exclusives
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-4 font-serif text-4xl leading-tight text-ink md:text-6xl"
        >
          Exclusive Founding Member Offers
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg"
        >
          Join the first 100 members and unlock premium benefits, exclusive rewards, daily wellness access, and
          member-only discounts.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Link href="/contact" className="mt-10 inline-block">
            <Button size="lg" variant="default">
              Become a Founding Member <FiArrowRight />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function FoundingMembership() {
  const benefits = [
    "Access to exclusive member rewards",
    "Priority booking access",
    "Insider discounts",
    "Special promotional offers",
    "Community member benefits",
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Founding member program" title="Your Premium Membership Card" />
      <div className="mx-auto mt-12 max-w-lg">
        <OfferCard highlight title="Founding Member Card">
          <div className="mt-6 rounded-2xl border border-rose-100 bg-gradient-to-br from-mauve-deep via-mauve to-rose-400 p-8 text-white shadow-glow">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-100">1X · Dr. Ayesha</p>
            <p className="mt-8 font-serif text-3xl">Founding Member</p>
            <p className="mt-2 text-sm text-rose-100">Premium wellness & cyber access</p>
            <div className="mt-10 flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-rose-100">One-time fee</p>
                <p className="font-serif text-4xl">$5</p>
              </div>
              <div className="size-12 rounded-full border border-white/30 bg-white/10" />
            </div>
          </div>
          <BenefitList items={benefits} />
          <Link href="/contact" className="mt-8 block">
            <Button className="w-full">Get Your Membership Card</Button>
          </Link>
        </OfferCard>
      </div>
    </section>
  );
}

function First100Offer() {
  const spotsLeft = 27;
  const benefits = [
    "Exclusive Insider Discount",
    "Founding Member Status",
    "Priority Access to New Services",
    "Premium Member Rewards",
  ];

  return (
    <section className="bg-gradient-to-b from-rose-50/70 via-cream to-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <OfferCard highlight title="Limited to First 100 Members" className="mx-auto max-w-3xl">
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-rose-200/80 bg-white/60 px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-mauve">Spots remaining</p>
              <p className="font-serif text-3xl text-ink">{spotsLeft}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Offer ends in</p>
              <OfferCountdown />
              <p className="text-[10px] uppercase tracking-wide text-subtle">Days · Hrs · Min · Sec</p>
            </div>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-rose-100">
            <div className="h-full w-[73%] rounded-full bg-gradient-to-r from-mauve to-rose-400" />
          </div>
          <p className="mt-2 text-center text-xs text-muted">73% claimed — join before spots fill</p>
          <BenefitList items={benefits} />
          <Link href="/contact" className="mt-8 block">
            <Button variant="luxury" className="w-full">
              Claim Founding Member Spot
            </Button>
          </Link>
        </OfferCard>
      </div>
    </section>
  );
}

function DailyWellness() {
  const cards = [
    { title: "One Free Session Every Day", desc: "365 days of complimentary wellness access for members." },
    { title: "Morning Access Hours", desc: "Start your day with guided recovery and movement." },
    { title: "7:00 AM – 10:00 AM", desc: "Exclusive morning window reserved for founding members." },
    { title: "Member Exclusive Access", desc: "Priority entry before public booking opens." },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Daily wellness" title="365 Days of Wellness" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <OfferCard key={card.title} title={card.title} description={card.desc} className="text-center">
            <div className="mx-auto mt-4 flex size-12 items-center justify-center rounded-2xl bg-rose-50 font-serif text-xl text-mauve">
              {i + 1}
            </div>
          </OfferCard>
        ))}
      </div>
    </section>
  );
}

function CommitmentReward() {
  const rewards = [
    "Up to $3000 Gift Card Giveaway",
    "Annual Recognition Program",
    "Exclusive VIP Rewards",
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Loyalty"
        title="Commitment Reward Program"
        description="Members who consistently attend sessions throughout the year become eligible for special annual reward programs."
      />
      <OfferCard highlight title="Annual VIP Recognition" className="mx-auto mt-12 max-w-2xl">
        <BenefitList items={rewards} />
        <p className="mt-6 rounded-2xl border border-rose-100 bg-rose-50/50 px-5 py-4 text-center text-sm text-muted">
          Attend regularly and unlock tiered rewards — the more you show up, the more you earn.
        </p>
      </OfferCard>
    </section>
  );
}

function SpinAndWin() {
  const rewards = [
    "Service Discounts",
    "Membership Upgrades",
    "Bonus Sessions",
    "Merchandise Gifts",
    "Exclusive Coupons",
  ];

  return (
    <section className="bg-gradient-to-b from-rose-50/60 to-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Interactive" title="Spin & Win Rewards" />
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <div className="relative mx-auto flex size-72 items-center justify-center sm:size-80">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-100 via-white to-peach-100 shadow-glow" />
            <div
              className="relative size-[88%] rounded-full border-4 border-white shadow-soft"
              style={{
                background: `conic-gradient(
                  #f3dce4 0deg 72deg,
                  #fceee8 72deg 144deg,
                  #e8c4d0 144deg 216deg,
                  #fdf5f7 216deg 288deg,
                  #efd4de 288deg 360deg
                )`,
              }}
            />
            <div className="absolute flex size-16 items-center justify-center rounded-full border-4 border-white bg-mauve font-serif text-sm text-white shadow-glow">
              SPIN
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-x-8 border-b-[14px] border-x-transparent border-b-mauve" />
          </div>
          <div>
            <p className="text-base text-muted">Members can spin to unlock surprise rewards:</p>
            <BenefitList items={rewards} />
            <Link href="/contact" className="mt-8 inline-block">
              <Button variant="outline">Spin as a Member</Button>
            </Link>
            <p className="mt-3 text-xs text-subtle">Wheel available after membership activation.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SpecialDiscounts() {
  const offers = [
    { title: "Up to 50% Off", desc: "Selected services for founding members." },
    { title: "Member Discounts", desc: "Insider pricing on courses and therapy." },
    { title: "Seasonal Promotions", desc: "Limited-time luxury wellness campaigns." },
    { title: "Referral Rewards", desc: "Earn when friends join through you." },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Savings" title="Special Discounts" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {offers.map((o) => (
          <OfferCard key={o.title} title={o.title} description={o.desc}>
            <Link href="/services" className="mt-6 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-mauve hover:text-mauve-deep">
              View services <FiArrowRight />
            </Link>
          </OfferCard>
        ))}
      </div>
    </section>
  );
}

function InviteFriends() {
  const benefits = [
    "Both receive additional discounts",
    "Bonus member rewards",
    "Referral benefits unlocked",
    "Extra loyalty points",
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <OfferCard highlight title="Invite Friends & Save Together" className="mx-auto max-w-3xl">
        <p className="mt-3 text-base text-muted">
          When a friend joins through your referral, you both unlock exclusive savings and loyalty rewards.
        </p>
        <div className="mt-8 flex items-center justify-center gap-6">
          <div className="flex size-20 items-center justify-center rounded-full border-2 border-rose-200 bg-rose-50 font-serif text-2xl text-mauve">
            You
          </div>
          <div className="flex size-10 items-center justify-center rounded-full bg-mauve text-white">+</div>
          <div className="flex size-20 items-center justify-center rounded-full border-2 border-dashed border-rose-300 bg-white font-serif text-2xl text-mauve">
            Friend
          </div>
        </div>
        <BenefitList items={benefits} />
        <Link href="/contact" className="mt-8 block">
          <Button className="w-full">Get Your Referral Link</Button>
        </Link>
      </OfferCard>
    </section>
  );
}

function MemberExtras() {
  const extras = [
    "Priority Consultation Access",
    "Premium Wellness Events",
    "Special Workshops",
    "Seasonal Bonuses",
    "Exclusive Member Promotions",
  ];

  return (
    <section className="bg-gradient-to-b from-cream to-rose-50/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Extras" title="Member Exclusive Extras" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {extras.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl border border-rose-100/90 bg-white/80 px-5 py-4 shadow-soft transition-all hover:shadow-glow"
            >
              <FiCheck className="shrink-0 text-mauve" />
              <span className="text-sm font-medium text-ink md:text-base">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OffersCta() {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-24 pt-8 text-center sm:px-6">
      <div className="glass rounded-3xl border border-rose-100 p-10 shadow-glow">
        <h2 className="font-serif text-3xl text-ink">Ready to join?</h2>
        <p className="mt-4 text-muted">Secure your founding member spot — limited to the first 100.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/contact">
            <Button size="lg">Become a Founding Member</Button>
          </Link>
          <Link href="/services">
            <Button size="lg" variant="outline">
              Explore Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function OffersLanding() {
  return (
    <div className="page-glow">
      <OffersHero />
      <FoundingMembership />
      <First100Offer />
      <DailyWellness />
      <CommitmentReward />
      <SpinAndWin />
      <SpecialDiscounts />
      <InviteFriends />
      <MemberExtras />
      <OffersCta />
    </div>
  );
}
