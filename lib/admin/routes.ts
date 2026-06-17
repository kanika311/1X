/** Admin panel URL paths for the unified onex app. */
export const ADMIN = {
  home: "/admin",
  login: "/admin/login",
  forgotPassword: "/admin/forgot-password",
  resetPassword: "/admin/reset-password",
  dashboard: "/admin/dashboard",
  products: "/admin/dashboard/products",
  productsNew: "/admin/dashboard/products/new",
  product: (id: string) => `/admin/dashboard/products/${encodeURIComponent(id)}`,
  offers: "/admin/dashboard/offers",
  offersNew: (tier?: string) =>
    tier ? `/admin/dashboard/offers/new?tier=${encodeURIComponent(tier)}` : "/admin/dashboard/offers/new",
  offer: (id: string) => `/admin/dashboard/offers/${encodeURIComponent(id)}`,
  siteContent: "/admin/dashboard/site-content",
  contactInquiries: "/admin/dashboard/contact-inquiries",
  newsletter: "/admin/dashboard/newsletter",
  testimonials: "/admin/dashboard/testimonials",
  admins: "/admin/dashboard/admins",
  customers: "/admin/dashboard/customers",
  orders: "/admin/dashboard/orders",
  order: (id: string) => `/admin/dashboard/orders/${encodeURIComponent(id)}`,
  ordersForCustomer: (c: { id?: string | null; number?: string; email?: string }) => {
    if (c.id) return `/admin/dashboard/orders?userId=${encodeURIComponent(c.id)}`;
    if (c.number) return `/admin/dashboard/orders?phone=${encodeURIComponent(c.number)}`;
    if (c.email) return `/admin/dashboard/orders?email=${encodeURIComponent(c.email)}`;
    return "/admin/dashboard/orders";
  },
} as const;
