import fs from "fs";
import path from "path";

const root = path.join(process.cwd(), "app", "api");

function opts(flags) {
  const parts = [];
  if (flags.auth) parts.push("auth: true");
  if (flags.admin) parts.push("admin: true");
  if (flags.optionalAuth) parts.push("optionalAuth: true");
  return parts.length ? `, { ${parts.join(", ")} }` : "";
}

function writeRoute(rel, imports, exports) {
  const dir = path.join(root, rel);
  fs.mkdirSync(dir, { recursive: true });
  const content = `import { createRoute } from "@/lib/api/route-bridge";\n${imports}\n\n${exports}\nexport const dynamic = "force-dynamic";\n`;
  fs.writeFileSync(path.join(dir, "route.ts"), content);
}

// Products
writeRoute(
  "products",
  `import * as products from "@/services/productController.js";`,
  `export const GET = createRoute(products.listProducts, { optionalAuth: true });\nexport const POST = createRoute(products.createProduct, { admin: true });`,
);
writeRoute(
  "products/[id]",
  `import * as products from "@/services/productController.js";`,
  `export const GET = createRoute(products.getProduct, { optionalAuth: true });\nexport const PUT = createRoute(products.updateProduct, { admin: true });\nexport const DELETE = createRoute(products.deleteProduct, { admin: true });`,
);

// Offers
writeRoute(
  "offers",
  `import * as offers from "@/services/offerController.js";`,
  `export const GET = createRoute(offers.listOffers, { optionalAuth: true });\nexport const POST = createRoute(offers.createOffer, { admin: true });`,
);
writeRoute(
  "offers/repair-membership",
  `import * as offers from "@/services/offerController.js";`,
  `export const POST = createRoute(offers.repairMembershipOffers, { admin: true });`,
);
writeRoute(
  "offers/[id]",
  `import * as offers from "@/services/offerController.js";`,
  `export const GET = createRoute(offers.getOffer, { optionalAuth: true });\nexport const PUT = createRoute(offers.updateOffer, { admin: true });\nexport const DELETE = createRoute(offers.deleteOffer, { admin: true });`,
);

// Cart
writeRoute(
  "cart",
  `import * as cart from "@/services/cartController.js";`,
  `export const GET = createRoute(cart.getCart, { auth: true });\nexport const POST = createRoute(cart.addToCart, { auth: true });`,
);
writeRoute("cart/clear", `import * as cart from "@/services/cartController.js";`, `export const DELETE = createRoute(cart.clearCart, { auth: true });`);
writeRoute("cart/remove-items", `import * as cart from "@/services/cartController.js";`, `export const POST = createRoute(cart.removeCartItems, { auth: true });`);
writeRoute("cart/sync", `import * as cart from "@/services/cartController.js";`, `export const PUT = createRoute(cart.syncCart, { auth: true });`);
writeRoute("cart/[cartKey]", `import * as cart from "@/services/cartController.js";`, `export const DELETE = createRoute(cart.removeFromCart, { auth: true });`);

// Wishlist
writeRoute(
  "wishlist",
  `import * as wishlist from "@/services/wishlistController.js";`,
  `export const GET = createRoute(wishlist.getWishlist, { auth: true });\nexport const POST = createRoute(wishlist.addToWishlist, { auth: true });`,
);
writeRoute("wishlist/sync", `import * as wishlist from "@/services/wishlistController.js";`, `export const PUT = createRoute(wishlist.syncWishlist, { auth: true });`);
writeRoute("wishlist/[productId]", `import * as wishlist from "@/services/wishlistController.js";`, `export const DELETE = createRoute(wishlist.removeFromWishlist, { auth: true });`);

// Orders
writeRoute("orders", `import * as orders from "@/services/orderController.js";`, `export const POST = createRoute(orders.createOrder);`);
writeRoute("orders/mine", `import * as orders from "@/services/orderController.js";`, `export const GET = createRoute(orders.listMyOrders, { auth: true });`);
writeRoute(
  "orders/[id]/confirm-payment",
  `import * as orders from "@/services/orderController.js";`,
  `export const POST = createRoute(orders.submitOrderPayment);\nexport const PATCH = createRoute(orders.submitOrderPayment);`,
);

// Site content
writeRoute(
  "site-content",
  `import * as site from "@/services/siteContentController.js";`,
  `export const GET = createRoute(site.getSiteContent);\nexport const PUT = createRoute(site.upsertSiteContent, { admin: true });`,
);

// Testimonials
writeRoute(
  "testimonials",
  `import * as testimonials from "@/services/testimonialController.js";`,
  `export const GET = createRoute(testimonials.listTestimonials, { optionalAuth: true });\nexport const POST = createRoute(testimonials.submitTestimonial);`,
);
writeRoute(
  "testimonials/[id]",
  `import * as testimonials from "@/services/testimonialController.js";`,
  `export const PATCH = createRoute(testimonials.updateTestimonial, { admin: true });\nexport const DELETE = createRoute(testimonials.deleteTestimonial, { admin: true });`,
);

// Contact
writeRoute(
  "contact-inquiries",
  `import * as contact from "@/services/contactInquiryController.js";`,
  `export const POST = createRoute(contact.submitContactInquiry);\nexport const GET = createRoute(contact.listContactInquiries, { admin: true });`,
);
writeRoute(
  "contact-inquiries/[id]",
  `import * as contact from "@/services/contactInquiryController.js";`,
  `export const PATCH = createRoute(contact.updateContactInquiry, { admin: true });\nexport const DELETE = createRoute(contact.deleteContactInquiry, { admin: true });`,
);

// Newsletter
writeRoute(
  "newsletter",
  `import * as newsletter from "@/services/newsletterController.js";`,
  `export const POST = createRoute(newsletter.subscribeNewsletter);\nexport const GET = createRoute(newsletter.listNewsletterSubscribers, { admin: true });`,
);
writeRoute(
  "newsletter/[id]",
  `import * as newsletter from "@/services/newsletterController.js";`,
  `export const DELETE = createRoute(newsletter.deleteNewsletterSubscriber, { admin: true });`,
);

// Admin
writeRoute("admin/stats", `import * as admin from "@/services/adminController.js";`, `export const GET = createRoute(admin.dashboardStats, { admin: true });`);
writeRoute(
  "admin/admins",
  `import * as admin from "@/services/adminController.js";`,
  `export const GET = createRoute(admin.listAdmins, { admin: true });\nexport const POST = createRoute(admin.createAdmin, { admin: true });`,
);
writeRoute("admin/admins/[id]", `import * as admin from "@/services/adminController.js";`, `export const DELETE = createRoute(admin.deleteAdmin, { admin: true });`);
writeRoute("admin/customers", `import * as orders from "@/services/orderController.js";`, `export const GET = createRoute(orders.listCustomers, { admin: true });`);
writeRoute("admin/customers/repair-phones", `import * as orders from "@/services/orderController.js";`, `export const POST = createRoute(orders.repairCustomerPhones, { admin: true });`);
writeRoute("admin/orders", `import * as orders from "@/services/orderController.js";`, `export const GET = createRoute(orders.listOrders, { admin: true });`);
writeRoute(
  "admin/orders/[id]",
  `import * as orders from "@/services/orderController.js";`,
  `export const GET = createRoute(orders.getOrder, { admin: true });\nexport const PATCH = createRoute(orders.updateOrderStatus, { admin: true });`,
);
writeRoute("admin/media", `import * as upload from "@/services/uploadController.js";`, `export const GET = createRoute(upload.listMedia, { admin: true });`);
writeRoute("admin/media/[filename]", `import * as upload from "@/services/uploadController.js";`, `export const DELETE = createRoute(upload.deleteMedia, { admin: true });`);

// Scaffold stubs for requested modules
const stubs = [
  "users",
  "services",
  "categories",
  "blogs",
  "faqs",
  "leads",
  "messages",
  "settings",
];
for (const name of stubs) {
  writeRoute(
    name,
    `import { NextResponse } from "next/server";`,
    `export async function GET() {\n  return NextResponse.json({ success: true, ${name}: [], message: "Module ready — connect to MongoDB collection" });\n}`,
  );
}

console.log("API routes generated");
