export type LegalSection = { heading: string; body: string };
export type LegalDoc = { title: string; intro: string; sections: LegalSection[] };
export type ContactContent = {
  headline: string;
  subheadline: string;
  address: string;
  email: string;
  phone: string;
  whatsapp: string;
  linkedin: string;
};

export type SiteContent = {
  key: string;
  contact: ContactContent;
  privacy: LegalDoc;
  terms: LegalDoc;
  updatedAt?: string;
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function fetchSiteContent(): Promise<SiteContent | null> {
  try {
    const res = await fetch(`${API}/site-content`, { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return null;
    return (data.content as SiteContent) || null;
  } catch {
    return null;
  }
}

