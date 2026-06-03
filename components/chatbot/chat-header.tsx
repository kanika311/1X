import Image from "next/image";
import { FiX } from "react-icons/fi";

import { CHAT_EMAIL, CHAT_HEADER, CHAT_NAME } from "@/lib/chatbot";
import { IMG } from "@/lib/images";

type Props = {
  className?: string;
  onClose?: () => void;
  showEmail?: boolean;
};

export function ChatHeader({ className = "", onClose, showEmail = false }: Props) {
  return (
    <div
      className={`flex items-center gap-3 rounded-t-3xl bg-[#f3c6d0] px-4 py-3.5 ${className}`}
    >
      <div className="relative size-11 shrink-0 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm">
        <Image src='/logo.jpeg' alt={CHAT_NAME} fill className="object-cover" sizes="44px" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/70">{CHAT_HEADER}</p>
        <p className="truncate text-sm font-semibold text-ink">{CHAT_NAME}</p>
        {showEmail ? (
          <a href={`mailto:${CHAT_EMAIL}`} className="truncate text-[11px] text-mauve-deep hover:underline">
            {CHAT_EMAIL}
          </a>
        ) : null}
      </div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#e8a0b0] shadow-sm transition-colors hover:text-mauve-deep"
          aria-label="Close chat"
        >
          <FiX className="text-lg" />
        </button>
      ) : null}
    </div>
  );
}
