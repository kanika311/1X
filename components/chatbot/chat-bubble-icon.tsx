/** Outline speech bubble for the launcher FAB */
export function ChatBubbleIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 11.5c0 3.59-3.58 6.5-8 6.5-.86 0-1.68-.12-2.44-.34L5 20l1.28-3.84C4.56 14.68 4 13.14 4 11.5 4 7.91 7.58 5 12 5s8 2.91 8 6.5z" />
    </svg>
  );
}
