"use client";

import { useEffect, useState } from "react";
import { FiCheck, FiLinkedin, FiMail, FiMapPin, FiPhone } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitContactInquiry } from "@/lib/contact-inquiry-api";
import type { SiteContent } from "@/lib/site-content-api";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function ContactContent() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
  const contactEmail = c?.email?.trim() || "dr.ayxhbusiness@gmail.com";
  const contactPhone = c?.phone?.trim() || "+91 6289672438";
  const linkedin = c?.linkedin?.trim() || "";

  const phoneDigits = contactPhone.replace(/[^\d+]/g, "");
  const telHref = phoneDigits ? `tel:${phoneDigits}` : "#";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const result = await submitContactInquiry({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
      });
      setSuccess(result.message);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your message.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <header className="mb-14 text-center">
        <p className="eyebrow">{headline}</p>
      </header>

      <div className="grid gap-14 lg:grid-cols-2">
        <form className="glass space-y-5 rounded-2xl p-8 shadow-soft" onSubmit={(e) => void handleSubmit(e)}>
          <h2 className="text-xl text-ink">Send a message</h2>

          {success ? (
            <div
              role="status"
              className="flex items-start gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900"
            >
              <FiCheck className="mt-0.5 size-4 shrink-0" />
              <p>{success}</p>
            </div>
          ) : null}

          {error ? (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <Input
            name="name"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            name="phone"
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <textarea
            name="message"
            rows={5}
            placeholder="How can we help?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base text-ink outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-rose-200/80"
          />
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Sending…" : "Submit"}
          </Button>
        </form>

        <div className="space-y-10">
          <div>
            <h2 className="text-xl text-ink">{subheadline}</h2>
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
              <a href={`mailto:${contactEmail}`} className="hover:text-ink">
                {contactEmail}
              </a>
            </li>
            <li className="flex gap-3">
              <FiPhone className="shrink-0" />
              <a href={telHref} className="hover:text-ink">
                {contactPhone}
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
