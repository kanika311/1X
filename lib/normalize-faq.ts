export type FaqItem = { q: string; a: string };

/** Fix API/DB FAQ stored as broken strings or partial objects. */
export function normalizeFaqList(raw: unknown): FaqItem[] {
  if (!Array.isArray(raw)) return [];

  const out: FaqItem[] = [];
  for (const item of raw) {
    const parsed = parseFaqItem(item);
    if (parsed) out.push(parsed);
  }
  return out;
}

function parseFaqItem(item: unknown): FaqItem | null {
  if (!item) return null;

  if (typeof item === "object" && item !== null) {
    const obj = item as Record<string, unknown>;
    const q = String(obj.q ?? obj.question ?? "").trim();
    const a = String(obj.a ?? obj.answer ?? "").trim();
    if (q && a) return { q, a };
  }

  if (typeof item === "string") {
    const trimmed = item.trim();
    const jsonMatch = trimmed.match(/^\{[\s\S]*\}$/);
    if (jsonMatch) {
      try {
        return parseFaqItem(JSON.parse(trimmed));
      } catch {
        /* fall through */
      }
    }
    const inline = trimmed.match(/q:\s*["']?([^"',\n]+)["']?\s*,\s*a:\s*["']?(.+?)["']?\s*$/i);
    if (inline) return { q: inline[1].trim(), a: inline[2].trim() };
  }

  return null;
}
