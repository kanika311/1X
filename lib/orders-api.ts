import { getApiBaseUrl } from "@/lib/api-base";

const API = getApiBaseUrl();

async function apiFetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Request failed");
  return data as T;
}

export type OrderItemPayload = {
  cartKey: string;
  offeringId: string;
  type: "course" | "service" | "membership";
  title: string;
  price: number;
  quantity?: number;
  image?: string;
  duration?: string;
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

export type UserOrder = {
  _id: string;
  subtotal: number;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "awaiting" | "submitted" | "confirmed";
  paymentReference?: string;
  paymentSubmittedAt?: string | null;
  items: OrderItem[];
  itemCount: number;
  promoCode?: string;
  discountAmount?: number;
  createdAt: string;
};

export type PlacedOrder = {
  _id: string;
  subtotal: number;
  status: string;
  paymentStatus: string;
};

export type PlaceOrderPayload = {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItemPayload[];
  notes?: string;
  promoCode?: string;
  discountPercent?: number;
  discountAmount?: number;
};

export async function placeOrder(payload: PlaceOrderPayload) {
  return apiFetchJson<{ success: boolean; order: PlacedOrder }>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function submitOrderPayment(orderId: string, paymentReference: string) {
  return apiFetchJson<{ success: boolean; order: PlacedOrder }>(`/orders/${orderId}/confirm-payment`, {
    method: "POST",
    body: JSON.stringify({ paymentReference: paymentReference.trim() }),
  });
}

export async function fetchMyOrders(): Promise<UserOrder[]> {
  try {
    const data = await apiFetchJson<{ orders: UserOrder[] }>("/orders/mine", { cache: "no-store" });
    return data.orders || [];
  } catch {
    return [];
  }
}
