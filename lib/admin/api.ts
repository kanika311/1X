import { getApiBaseUrl } from "@/lib/api-base";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function getToken() {
  return null;
}

export function setToken(_token: string | null) {
  /* Admin session is stored in httpOnly cookies. */
}

export function clearAdminSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("onex_admin_user");
  }
}

type ApiFetchOptions = Omit<RequestInit, "body"> & { body?: unknown };

async function refreshAdminSession(): Promise<boolean> {
  const res = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  return res.ok;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}) {
  const { body, headers, ...rest } = options;
  const h: HeadersInit = { "Content-Type": "application/json", ...(headers || {}) };

  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}${path}`, {
      ...rest,
      headers: h,
      credentials: "include",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      0,
      "Cannot reach API. Make sure `npm run dev` is running and open the same port shown in the terminal (usually http://localhost:3000).",
    );
  }

  if (res.status === 401) {
    const refreshed = await refreshAdminSession();
    if (refreshed) {
      res = await fetch(`${getApiBaseUrl()}${path}`, {
        ...rest,
        headers: h,
        credentials: "include",
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    }
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") clearAdminSession();
    const msg = data.message || "Request failed";
    throw new ApiError(res.status, msg);
  }
  return data as T;
}

export type AdminUser = { id: string; name: string; number?: string; email?: string; role: string };

export type AdminAccount = {
  id: string;
  name: string;
  number: string;
  email: string;
  createdAt: string;
};

export type Product = {
  _id: string;
  slug: string;
  domain: "cyber" | "physio";
  category: "courses" | "services" | "therapy";
  title: string;
  description: string;
  duration: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  iconKey: string;
  bestseller: boolean;
  benefits: string[];
  faq: { q: string; a: string }[];
  cta: string;
  active: boolean;
  offeringId?: string;
};

export type Customer = {
  id: string | null;
  name: string;
  number: string;
  email?: string;
  phone?: string;
  registeredAt: string | null;
  orderCount: number;
  lastOrderAt: string | null;
  totalSpent: number;
  source: "registered" | "guest";
  active?: boolean;
};

export type OrderItem = {
  cartKey: string;
  offeringId: string;
  type: "course" | "service" | "membership";
  title: string;
  price: number;
  quantity: number;
  image?: string;
  duration?: string;
};

export type Order = {
  _id: string;
  user?: { _id: string; name: string; number?: string; email?: string } | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus?: "awaiting" | "submitted" | "confirmed";
  paymentSubmittedAt?: string | null;
  paymentReference?: string;
  notes: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ContactInquiry = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  createdAt: string;
  updatedAt?: string;
};

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
  updatedAt?: string;
};

export type Offer = {
  _id: string;
  slug: string;
  offerType: "membership" | "promo";
  title: string;
  subtitle: string;
  description: string;
  cardTitle: string;
  price: number;
  contactPhone?: string;
  feeLabel: string;
  benefits: string[];
  discountLabel: string;
  discountPercent: number;
  promoCode: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  featured: boolean;
  sortOrder: number;
  active: boolean;
};
