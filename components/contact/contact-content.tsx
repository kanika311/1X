"use client";

import { useEffect, useState } from "react";
import { FiLinkedin, FiMail, FiMapPin, FiPhone } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SiteContent } from "@/lib/site-content-api";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function ContactContent() {
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    fetch(`${API}/site-content`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setContent(d?.content || null))
      .catch(() => setContent(null));
  }, []);

  const c = content?.contact;
  const headline = c?.headline?.trim() || "Get in touch";
  const subheadline = c?.subheadline?.trim() || "Book a 1-on-1 consult/collab with Dr. Ayxh.";
  const address =
    c?.address?.trim() || "1X Wellness & Cyber Campus, Based on Kolkata, Pune, Noida and working globally";
  const email = c?.email?.trim() || "dr.ayxhbusiness@gmail.com";
  const phone = c?.phone?.trim() || "+91 6289672438";
  const linkedin = c?.linkedin?.trim() || "";

  const phoneDigits = phone.replace(/[^\d+]/g, "");
  const telHref = phoneDigits ? `tel:${phoneDigits}` : "#";

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <header className="mb-14 text-center">
        <p className="eyebrow">{headline}</p>
      </header>

      <div className="grid gap-14 lg:grid-cols-2">
        <form
          className="glass space-y-5 rounded-2xl p-8 shadow-soft"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thank you — we will respond within 24 hours.");
          }}
        >
          <h2 className=" text-xl text-ink">Send a message</h2>
          <Input name="name" placeholder="Full name" required />
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="phone" type="tel" placeholder="Phone" />
          <textarea
            name="message"
            rows={5}
            placeholder="How can we help?"
            required
            className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base text-ink outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-rose-200/80"
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>

        <div className="space-y-10">
          <div>
            <h2 className=" text-xl text-ink">{subheadline}</h2>
            <p className="mt-3 text-sm text-muted">Slots: Mon–Sat, 7 AM – 7 PM IST</p>
            <Button variant="luxury" className="mt-6">
              Request booking
            </Button>
          </div>

          <ul className="space-y-4 text-sm text-muted">
            <li className="flex gap-3">
              <FiMapPin className="mt-0.5 shrink-0" />
              <span>{address}</span>
            </li>
            <li className="flex gap-3">
              <FiMail className="shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-ink">
                {email}
              </a>
            </li>
            <li className="flex gap-3">
              <FiPhone className="shrink-0" />
              <a href={telHref} className="hover:text-ink">
                {phone}
              </a>
            </li>
            {linkedin ? (
              <li className="flex gap-3">
                <FiLinkedin className="shrink-0" />
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                  LinkedIn Profile
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  );
}

