"use client";

import { useEffect, useState } from "react";
import { FiMail } from "react-icons/fi";

import { DEFAULT_CONTACT, fetchSiteContent } from "@/lib/site-content-api";
import { sanitizeMailtoHref } from "@/lib/safe-url";

export function FooterContact() {
  const [email, setEmail] = useState(DEFAULT_CONTACT.email);

  useEffect(() => {
    fetchSiteContent()
      .then((content) => {
        const e = content?.contact?.email?.trim();
        if (e) setEmail(e);
      })
      .catch(() => setEmail(DEFAULT_CONTACT.email));
  }, []);

  if (!email) return null;

  return (
    <div className="mt-6 flex justify-center">
      <a
        href={sanitizeMailtoHref(email)}
        className="inline-flex items-center gap-2 text-sm lowercase text-muted transition-colors hover:text-mauve-deep"
      >
        <FiMail className="size-4 shrink-0" aria-hidden />
        {email}
      </a>
    </div>
  );
}
