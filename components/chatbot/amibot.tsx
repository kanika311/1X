"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiMessageCircle, FiSend, FiX } from "react-icons/fi";

type Message = { role: "bot" | "user"; text: string };

const FAQ = [
  { label: "Course pricing", key: "pricing" },
  { label: "Therapy booking", key: "therapy" },
  { label: "Contact support", key: "contact" },
  { label: "Demo classes", key: "demo" },
  { label: "Consultation", key: "consult" },
  { label: "Certificates", key: "cert" },
] as const;

const REPLIES: Record<string, string> = {
  pricing:
    "Cyber courses start at ₹18,999. Ethical Hacking and SOC Analyst are our bestsellers. Visit /courses for full pricing.",
  therapy:
    "Book physiotherapy from ₹1,999 per session. Sports Therapy and Pain Relief are most popular. Head to /services to reserve.",
  contact:
    "Reach us at contact@1x-dr-ayesha.com or use the Contact page for appointments. We respond within 24 hours.",
  demo:
    "Free demo classes run every Saturday for SOC Analyst and Posture Correction. Register via the Contact form.",
  consult:
    "Dr. Ayesha offers hybrid wellness + cyber career consultations on Tue & Thu, 4–7 PM IST.",
  cert:
    "All courses include industry-aligned certificates upon completion and capstone project review.",
  default:
    "Hi! I'm Ami, your 1X assistant. Tap a quick question below or ask about courses, therapy, or bookings.",
};

export function AmiBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: REPLIES.default },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const botReply = useCallback((text: string) => {
    setTyping(true);
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = REPLIES.default;
      if (lower.includes("price") || lower.includes("cost")) reply = REPLIES.pricing;
      else if (lower.includes("therapy") || lower.includes("book")) reply = REPLIES.therapy;
      else if (lower.includes("contact") || lower.includes("email")) reply = REPLIES.contact;
      else if (lower.includes("demo")) reply = REPLIES.demo;
      else if (lower.includes("consult")) reply = REPLIES.consult;
      else if (lower.includes("cert")) reply = REPLIES.cert;
      setMessages((m) => [...m, { role: "bot", text: reply }]);
      setTyping(false);
    }, 900);
  }, []);

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text: text.trim() }]);
    setInput("");
    botReply(text);
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[80] flex size-14 items-center justify-center rounded-full bg-ink text-white shadow-glow transition-transform hover:scale-105"
        aria-label={open ? "Close chat" : "Open Ami assistant"}
      >
        {open ? <FiX className="text-xl" /> : <FiMessageCircle className="text-xl" />}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className="glass fixed bottom-24 right-4 z-[80] flex h-[min(70vh,520px)] w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl shadow-glow sm:right-6"
          >
            <div className="border-b border-ink/8 bg-gradient-to-r from-lavender-50 to-sky-100 px-4 py-3">
              <p className="text-sm font-semibold text-ink">Ami</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-subtle">1X Assistant</p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div
                  key={`${i}-${m.text.slice(0, 8)}`}
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user" ? "ml-auto bg-ink text-white" : "bg-lavender-50 text-ink"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {typing ? (
                <div className="flex gap-1 rounded-2xl bg-lavender-50 px-3 py-2 w-fit">
                  <span className="size-1.5 animate-bounce rounded-full bg-ink/40" />
                  <span className="size-1.5 animate-bounce rounded-full bg-ink/40 [animation-delay:0.15s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-ink/40 [animation-delay:0.3s]" />
                </div>
              ) : null}
              <div ref={endRef} />
            </div>

            <div className="flex flex-wrap gap-2 border-t border-ink/8 p-3">
              {FAQ.map(({ label, key }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => send(label)}
                  className="rounded-full border border-ink/10 px-2.5 py-1 text-[10px] text-ink hover:bg-lavender-50"
                >
                  {label}
                </button>
              ))}
            </div>

            <form
              className="flex gap-2 border-t border-ink/8 p-3"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Ami…"
                className="flex-1 rounded-full bg-white px-3 py-2 text-sm outline-none ring-1 ring-ink/10"
              />
              <button type="submit" className="flex size-9 items-center justify-center rounded-full bg-ink text-white" aria-label="Send">
                <FiSend />
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
