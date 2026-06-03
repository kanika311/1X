"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { FiArrowUp } from "react-icons/fi";

import { ChatHeader } from "@/components/chatbot/chat-header";
import { CHAT_QUICK_ACTIONS } from "@/lib/chatbot";

export type ChatMessage = { role: "bot" | "user"; text: string };

type Props = {
  messages: ChatMessage[];
  typing: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSend: (text: string) => void;
  onClose?: () => void;
  showQuickActions?: boolean;
  showEmailInHeader?: boolean;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
};

export function ChatPanel({
  messages,
  typing,
  input,
  onInputChange,
  onSend,
  onClose,
  showQuickActions = true,
  showEmailInHeader = false,
  footer,
  className = "",
  bodyClassName = "",
}: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <div className={`flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)] ${className}`}>
      <ChatHeader onClose={onClose} showEmail={showEmailInHeader} />

      <div className={`flex-1 space-y-3 overflow-y-auto bg-white px-4 py-4 ${bodyClassName}`}>
        {messages.map((m, i) => (
          <div
            key={`${i}-${m.text.slice(0, 8)}`}
            className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              m.role === "user"
                ? "ml-auto bg-[#f3c6d0] text-ink"
                : "mr-auto bg-[#ebe4f7] text-ink"
            }`}
          >
            {m.text}
          </div>
        ))}
        {typing ? (
          <div className="mr-auto flex w-fit gap-1 rounded-2xl bg-[#ebe4f7] px-4 py-3">
            <span className="size-1.5 animate-bounce rounded-full bg-ink/35" />
            <span className="size-1.5 animate-bounce rounded-full bg-ink/35 [animation-delay:0.15s]" />
            <span className="size-1.5 animate-bounce rounded-full bg-ink/35 [animation-delay:0.3s]" />
          </div>
        ) : null}
        <div ref={endRef} />
      </div>

      {showQuickActions ? (
        <div className="flex flex-wrap gap-1.5 border-t border-rose-100/80 bg-white px-3 py-2">
          {CHAT_QUICK_ACTIONS.map(({ label, key }) => (
            <button
              key={key}
              type="button"
              onClick={() => onSend(label)}
              className="rounded-full bg-rose-50/80 px-2.5 py-1 text-[10px] font-medium text-ink hover:bg-[#f3c6d0]/50"
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}

      {footer}

      <form
        className="flex items-center gap-2 rounded-b-3xl bg-[#f3c6d0] px-3 py-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSend(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type a message…"
          className="min-w-0 flex-1 rounded-full border-0 bg-white px-4 py-2.5 text-sm text-ink outline-none placeholder:text-subtle"
        />
        <button
          type="submit"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-[#e8a0b0] shadow-sm transition-colors hover:text-mauve-deep"
          aria-label="Send message"
        >
          <FiArrowUp className="text-lg stroke-[2.5]" />
        </button>
      </form>
    </div>
  );
}
