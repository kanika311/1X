"use client";

import { useEffect, useState } from "react";
import { FiCheck, FiLinkedin, FiMail, FiMapPin, FiPhone, FiX } from "react-icons/fi";
import { RiWhatsappLine } from "react-icons/ri";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitContactInquiry } from "@/lib/contact-inquiry-api";
import { resolveContactFields, type SiteContent } from "@/lib/site-content-api";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type ContactContentProps = {
  initialContent?: SiteContent | null;
};

export function ContactContent({ initialContent = null }: ContactContentProps) {
  const [content, setContent] = useState<SiteContent | null>(initialContent);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    fetch(`${API}/site-content`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setContent(d?.content ?? null))
      .catch(() => {});
  }, []);

  const {
    headline,
    subheadline,
    address,
    email: contactEmail,
    phone: contactPhone,
    whatsapp,
    linkedin,
  } = resolveContactFields(content);

  const phoneDigits = contactPhone.replace(/[^\d+]/g, "");
  const telHref = phoneDigits ? `tel:${phoneDigits}` : "#";
  const whatsappDigits = (whatsapp || contactPhone).replace(/\D/g, "");

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
            {subheadline ? <h2 className="text-xl text-ink">{subheadline}</h2> : null}
            <p className={subheadline ? "mt-3 text-sm text-muted" : "text-sm text-muted"}>
              Slots: Mon–Sat, 7 AM – 7 PM IST
            </p>
            <Button variant="luxury" className="mt-6" onClick={() => setBookingOpen(true)}>
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

      {bookingOpen ? (
        <BookingModal whatsappDigits={whatsappDigits} onClose={() => setBookingOpen(false)} />
      ) : null}
    </div>
  );
}

type BookingModalProps = {
  whatsappDigits: string;
  onClose: () => void;
};

function BookingModal({ whatsappDigits, onClose }: BookingModalProps) {
  const [bName, setBName] = useState("");
  const [bPhone, setBPhone] = useState("");
  const [bService, setBService] = useState("Physiotherapy");
  const [bDate, setBDate] = useState("");
  const [bTime, setBTime] = useState("");
  const [bNotes, setBNotes] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function handleBookingSubmit(e: React.FormEvent) {
    e.preventDefault();

    const lines = [
      "Hi Dr. Ayxh, I would like to request a booking:",
      "",
      `Name: ${bName.trim() || "-"}`,
      `Phone: ${bPhone.trim() || "-"}`,
      `Service: ${bService}`,
      `Preferred date: ${bDate || "-"}`,
      `Preferred time: ${bTime || "-"}`,
    ];
    if (bNotes.trim()) {
      lines.push(`Notes: ${bNotes.trim()}`);
    }

    const text = encodeURIComponent(lines.join("\n"));
    const url = whatsappDigits
      ? `https://wa.me/${whatsappDigits}?text=${text}`
      : `https://wa.me/?text=${text}`;

    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-r from-mauve-deep via-mauve to-rose-400 px-5 py-4 pr-12 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full border border-white/25 bg-white/10 transition hover:bg-white/20"
            aria-label="Close"
          >
            <FiX />
          </button>
          <p className="text-[10px] uppercase tracking-wider text-rose-100/90">Request booking</p>
          <h3 className="text-xl">Book your session</h3>
        </div>

        <form className="space-y-4 px-5 py-5" onSubmit={handleBookingSubmit}>
          <Input
            name="bookingName"
            placeholder="Full name"
            value={bName}
            onChange={(e) => setBName(e.target.value)}
            required
          />
          <Input
            name="bookingPhone"
            type="tel"
            placeholder="Phone number"
            value={bPhone}
            onChange={(e) => setBPhone(e.target.value)}
            required
          />
          <div>
            <label className="text-xs font-semibold uppercase text-muted">Service</label>
            <select
              value={bService}
              onChange={(e) => setBService(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base text-ink outline-none focus-visible:ring-2 focus-visible:ring-rose-200/80"
            >
              <option>Physiotherapy</option>
              <option>Cybersecurity course</option>
              <option>Consultation</option>
              <option>Other</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase text-muted">Date</label>
              <Input
                name="bookingDate"
                type="date"
                value={bDate}
                onChange={(e) => setBDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted">Time</label>
              <Input
                name="bookingTime"
                type="time"
                value={bTime}
                onChange={(e) => setBTime(e.target.value)}
              />
            </div>
          </div>
          <textarea
            name="bookingNotes"
            rows={3}
            placeholder="Anything we should know? (optional)"
            value={bNotes}
            onChange={(e) => setBNotes(e.target.value)}
            className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base text-ink outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-rose-200/80"
          />
          <Button type="submit" className="w-full gap-2">
            <RiWhatsappLine className="size-5" />
            Send on WhatsApp
          </Button>
          <p className="text-center text-xs text-subtle">
            Opens WhatsApp with your booking details prefilled.
          </p>
        </form>
      </div>
    </div>
  );
}
