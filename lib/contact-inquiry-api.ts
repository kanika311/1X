const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export type ContactInquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

export async function submitContactInquiry(
  payload: ContactInquiryPayload,
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API}/contact-inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Could not send your message. Please try again.");
  }

  return {
    success: true,
    message: data.message || "Thank you — we will respond within 24 hours.",
  };
}
