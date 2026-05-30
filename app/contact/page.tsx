"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiInstagram, FiMail, FiMapPin, FiPhone } from "react-icons/fi";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <header className="mb-14 text-center">
        <p className="eyebrow">Get in touch</p>
        <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">Consult here for your Cybersecurity and Physiotherapy related queries</h1>
      </header>

      <div className="grid gap-14 lg:grid-cols-2">
        <form
          className="glass space-y-5 rounded-2xl p-8 shadow-soft"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thank you — we will respond within 24 hours.");
          }}
        >
          <h2 className="font-serif text-xl text-ink">Send a message</h2>
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
            <h2 className="font-serif text-xl text-ink"> Book a 1-on-1 consult with Dr. Ayxh.</h2>
            <p className="mt-3 text-sm text-muted">Slots: Mon–Sat, 7 AM – 7 PM IST</p>
            <Button variant="luxury" className="mt-6">
              Request booking
            </Button>
          </div>

          <ul className="space-y-4 text-sm text-muted">
            <li className="flex gap-3">
              <FiMapPin className="mt-0.5 shrink-0" />
              <span>1X Wellness & Cyber Campus, Based on Kolkata, Pune, Noida and working globally</span>
            </li>
            {/* <li className="flex gap-3">
              <FiPhone className="shrink-0" />
              <a href="tel:+919876543210" className="hover:text-ink">
                +91 
              </a>
            </li> */}
            <li className="flex gap-3">
              <FiMail className="shrink-0" />
              <a href="mailto:contact@1x-dr-ayesha.com" className="hover:text-ink">
               dr.ayxhbusiness@gmail.com
              </a>
            </li>
            {/* <li className="flex gap-3">
              <FiInstagram className="shrink-0" />
              <span>@1x.dr.ayxh</span>
            </li> */}
          </ul>

          {/* <div className="overflow-hidden rounded-xl border border-ink/10 bg-lavender-50/50">
            <div className="flex h-56 items-center justify-center text-sm text-subtle">
              Google Map — 1X Campus, New Delhi
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
