import { getAuthToken } from "@/lib/api-client";

const API = process.env.NEXT_PUBLIC_API_URL;

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
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Could not place order");
  return data as { success: boolean; order: PlacedOrder };
}

export async function submitOrderPayment(orderId: string, paymentReference: string) {
  const res = await fetch(`${API}/orders/${orderId}/confirm-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentReference: paymentReference.trim() }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Could not update payment");
  return data as { success: boolean; order: PlacedOrder };
}

export async function fetchMyOrders(): Promise<UserOrder[]> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getAuthToken();
  if (!token) return [];

  const res = await fetch(`${API}/orders/mine`, {
    headers: { ...headers, Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return [];
  return (data.orders as UserOrder[]) || [];
}
