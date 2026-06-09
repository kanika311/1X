import { resolveApiMediaUrl } from "@/lib/media-url";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export type Testimonial = {
  _id: string;
  fullName: string;
  email: string;
  photo: string;
  serviceUsed: string;
  rating: number;
  message: string;
  serviceDate: string;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  createdAt: string;
};

export type TestimonialSubmitPayload = {
  fullName: string;
  email: string;
  serviceUsed: string;
  rating: number;
  message: string;
  serviceDate: string;
  consent: boolean;
  photo?: File | null;
};

function formatTestimonial(t: Testimonial): Testimonial {
  return { ...t, photo: t.photo ? resolveApiMediaUrl(t.photo) : "" };
}

export async function fetchApprovedTestimonials(limit = 20): Promise<Testimonial[]> {
  try {
    const res = await fetch(`${API}/testimonials?limit=${limit}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    const list = (data.testimonials || []) as Testimonial[];
    return list.map(formatTestimonial);
  } catch {
    return [];
  }
}

export async function submitTestimonial(
  payload: TestimonialSubmitPayload,
): Promise<{ success: boolean; message: string }> {
  const form = new FormData();
  form.append("fullName", payload.fullName);
  form.append("email", payload.email);
  form.append("serviceUsed", payload.serviceUsed);
  form.append("rating", String(payload.rating));
  form.append("message", payload.message);
  form.append("serviceDate", payload.serviceDate);
  form.append("consent", String(payload.consent));
  if (payload.photo) form.append("photo", payload.photo);

  const res = await fetch(`${API}/testimonials`, { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Could not submit testimonial. Please try again.");
  }
  return { success: true, message: data.message || "Thank you for sharing your experience!" };
}
