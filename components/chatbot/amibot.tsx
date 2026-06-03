"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";

import { ChatBubbleIcon } from "@/components/chatbot/chat-bubble-icon";
import { ChatPanel, type ChatMessage } from "@/components/chatbot/chat-panel";
import { CHAT_GREETING, CHAT_NAME, getChatReply } from "@/lib/chatbot";

export function AmiBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "bot", text: CHAT_GREETING }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const botReply = useCallback((text: string) => {
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: getChatReply(text) }]);
      setTyping(false);
    }, 900);
  }, []);

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text: text.trim() }]);
    setInput("");
    botReply(text);
  }

  return (
    <>
      <AnimatePresence>
        {!open ? (
          <motion.button
            type="button"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-[80] flex size-14 items-center justify-center rounded-full bg-[#f3c6d0] text-white shadow-[0_4px_24px_rgba(0,0,0,0.25)] transition-transform hover:scale-105"
            aria-label={`Open ${CHAT_NAME} assistant`}
          >
            <ChatBubbleIcon className="size-7 " />
          </motion.button>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="fixed bottom-6 right-4 z-[80] flex h-[min(72vh,560px)] w-[min(92vw,400px)] flex-col sm:right-6"
          >
            <ChatPanel
              className="h-full"
              messages={messages}
              typing={typing}
              input={input}
              onInputChange={setInput}
              onSend={send}
              onClose={() => setOpen(false)}
              showEmailInHeader={false}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
