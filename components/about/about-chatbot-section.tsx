"use client";

import { useCallback, useState } from "react";
import { FiMessageCircle } from "react-icons/fi";

import { ChatPanel, type ChatMessage } from "@/components/chatbot/chat-panel";
import {
  CHAT_GREETING,
  CHAT_NAME,
  getChatReply,
} from "@/lib/chatbot";

const FEATURES = [
  "Instant answers on courses & therapy pricing",
  "Quick booking & demo class info",
  "Gift card & membership guidance",
  "Feedback & support — we read every message",
] as const;

export function AboutChatbotSection() {
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "bot", text: CHAT_GREETING }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const botReply = useCallback((text: string) => {
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: getChatReply(text) }]);
      setTyping(false);
    }, 700);
  }, []);

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text: text.trim() }]);
    setInput("");
    botReply(text);
  }

  return (
    <section className="bg-gradient-to-b from-lavender-50/40 to-cream py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center">
          <p className="eyebrow">1X Assistant</p>
          <h2 className="mt-2 font-serif text-3xl text-ink md:text-4xl">
            Chat with {CHAT_NAME}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted">
            Let&apos;s interact — explore courses, therapy, gift cards, and bookings here or from the chat button on
            every page.
          </p>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <li
              key={f}
              className="flex items-center gap-3 rounded-2xl border border-rose-100/80 bg-white/70 px-4 py-3 text-sm text-ink"
            >
              <FiMessageCircle className="shrink-0 text-mauve" />
              {f}
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-10 max-w-md">
          <ChatPanel
            messages={messages}
            typing={typing}
            input={input}
            onInputChange={setInput}
            onSend={send}
            showEmailInHeader
            bodyClassName="max-h-72"
          />
        </div>

        {/*         <p className="mt-6 text-center text-xs text-muted">
          Prefer WhatsApp? Use the green button at the bottom-right to message Dr. Ayxh directly.
        </p> */}
      </div>
    </section>
  );
}
