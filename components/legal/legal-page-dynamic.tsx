import { LegalPage } from "@/components/legal/legal-page";
import type { LegalDoc } from "@/lib/site-content-api";

type Props = {
  fallbackTitle: string;
  fallbackIntro: string;
  fallbackSections: { heading: string; body: string }[];
  doc?: LegalDoc | null;
};

export function LegalPageDynamic({ fallbackTitle, fallbackIntro, fallbackSections, doc }: Props) {
  const title = doc?.title?.trim() || fallbackTitle;
  const intro = doc?.intro?.trim() || fallbackIntro;
  const sections =
    doc?.sections && doc.sections.length > 0
      ? doc.sections.map((s) => ({ heading: s.heading || "", body: s.body || "" })).filter((s) => s.heading || s.body)
      : fallbackSections;

  return <LegalPage title={title} intro={intro} sections={sections} />;
}

