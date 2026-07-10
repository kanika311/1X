import { Order } from "@/models/Order.js";
import { User } from "@/models/User.js";
import { ApiError, normalizePhone } from "@/lib/server/helpers.js";
import { resolveOrderLineItem } from "@/lib/server/resolveOfferingPrice.js";
import { verifySpinPromoCode } from "@/lib/server/spin-promo.js";
import { sanitizeText } from "@/lib/server/sanitize.js";
import { logAdminAction } from "@/lib/server/security-log.js";

function phoneDigits(value) {
  return String(value ?? "").replace(/\D/g, "");
}

function phonesMatch(a, b) {
  const da = phoneDigits(a);
  const db = phoneDigits(b);
  if (!da || !db || da.length < 10 || db.length < 10) return false;
  if (da === db) return true;
  return da.slice(-10) === db.slice(-10);
}

async function resolveUserPhone(user) {
  const stored = user.number || user.phone || "";
  if (phoneDigits(stored).length >= 10) return stored;

  const order = await Order.findOne({ user: user._id })
    .sort({ createdAt: -1 })
    .select("customerPhone")
    .lean();
  if (order?.customerPhone && phoneDigits(order.customerPhone).length >= 10) {
    return order.customerPhone;
  }

  const anyOrder = await Order.findOne({
    user: user._id,
    customerPhone: { $exists: true, $ne: "" },
  })
    .sort({ createdAt: -1 })
    .select("customerPhone")
    .lean();
  return anyOrder?.customerPhone || stored;
}

function customerDto(fields) {
  return {
    id: fields.id ?? null,
    name: fields.name || "",
    number: fields.number || "",
    phone: fields.phone || fields.number || "",
    email: fields.email || "",
    registeredAt: fields.registeredAt ?? null,
    orderCount: fields.orderCount ?? 0,
    lastOrderAt: fields.lastOrderAt ?? null,
    totalSpent: fields.totalSpent ?? 0,
    source: fields.source,
    active: fields.active ?? true,
  };
}

function formatOrder(doc) {
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    ...o,
    itemCount: o.items?.reduce((n, i) => n + (i.quantity || 1), 0) ?? 0,
  };
}

function orderBelongsToUser(order, user) {
  if (!user || !order.user) return false;
  return String(order.user) === String(user._id);
}

export async function createOrder(req, res) {
  if (!req.user) {
    throw new ApiError(401, "Sign in to place an order");
  }

  const { customerName, customerEmail, customerPhone, items, notes } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  const normalized = [];
  for (const item of items) {
    normalized.push(await resolveOrderLineItem(item));
  }

  const lineSubtotal = normalized.reduce((sum, i) => sum + i.price * i.quantity, 0);

  let promoCode = String(req.body.promoCode || "").trim().toUpperCase();
  let discountPercent = 0;
  let discountAmount = 0;

  const verifiedSpin = promoCode ? verifySpinPromoCode(req.user._id, promoCode) : null;
  if (verifiedSpin) {
    discountPercent = verifiedSpin.percent;
    discountAmount = Math.min(
      lineSubtotal,
      Math.round((lineSubtotal * discountPercent) / 100),
    );
    promoCode = verifiedSpin.code;
  } else {
    promoCode = "";
  }

  const subtotal = Math.max(0, lineSubtotal - discountAmount);
  if (subtotal <= 0) {
    throw new ApiError(400, "Order total must be greater than zero");
  }

  const linkedUser = req.user._id;
  const normalizedPhone = customerPhone ? normalizePhone(customerPhone) || phoneDigits(customerPhone) : "";
  const accountPhone = req.user.number ? normalizePhone(req.user.number) || req.user.number : "";

  const order = await Order.create({
    user: linkedUser,
    customerName: (customerName || req.user.name || "").trim(),
    customerEmail: (customerEmail || req.user.email || "").trim().toLowerCase(),
    customerPhone: normalizedPhone || accountPhone || (customerPhone || "").trim(),
    items: normalized,
    lineSubtotal,
    promoCode: promoCode || undefined,
    discountPercent: discountPercent || undefined,
    discountAmount: discountAmount || undefined,
    subtotal,
    notes: sanitizeText(notes, 2000),
    status: "pending",
    paymentStatus: "awaiting",
  });

  res.status(201).json({ success: true, order: formatOrder(order) });
}

export async function submitOrderPayment(req, res) {
  if (!req.user) {
    throw new ApiError(401, "Sign in to confirm payment");
  }

  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");
  if (!orderBelongsToUser(order, req.user)) {
    throw new ApiError(403, "You can only confirm payment for your own orders");
  }
  if (order.status === "cancelled") {
    throw new ApiError(400, "This order was cancelled");
  }
  if (order.paymentStatus === "confirmed") {
    throw new ApiError(400, "Payment already confirmed for this order");
  }
  if (!Number.isFinite(order.subtotal) || order.subtotal <= 0) {
    throw new ApiError(400, "This order cannot be paid");
  }

  const paymentReference = String(req.body?.paymentReference ?? "").trim();
  if (paymentReference.length < 4) {
    throw new ApiError(400, "Enter your UPI transaction ID or reference number (at least 4 characters)");
  }

  order.paymentReference = paymentReference;
  order.paymentStatus = "submitted";
  order.paymentSubmittedAt = new Date();
  await order.save();
  res.json({ success: true, order: formatOrder(order) });
}

export async function listMyOrders(req, res) {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  res.json({
    success: true,
    orders: orders.map((o) => ({
      ...o,
      itemCount: o.items?.reduce((n, i) => n + (i.quantity || 1), 0) ?? 0,
    })),
  });
}

export async function listCustomers(_req, res) {
  const users = await User.find({ role: "user" })
    .select("name number email createdAt active")
    .sort({ createdAt: -1 })
    .lean();

  let orderStats = [];
  let guestStats = [];
  try {
    orderStats = await Order.aggregate([
      { $match: { user: { $ne: null } } },
      {
        $group: {
          _id: "$user",
          orderCount: { $sum: 1 },
          lastOrderAt: { $max: "$createdAt" },
          totalSpent: { $sum: "$subtotal" },
          phone: { $last: "$customerPhone" },
        },
      },
    ]);
    guestStats = await Order.aggregate([
      { $match: { user: null } },
      {
        $group: {
          _id: "$customerEmail",
          name: { $last: "$customerName" },
          phone: { $last: "$customerPhone" },
          orderCount: { $sum: 1 },
          lastOrderAt: { $max: "$createdAt" },
          totalSpent: { $sum: "$subtotal" },
        },
      },
      { $sort: { lastOrderAt: -1 } },
    ]);
  } catch {
    /* orders collection may be empty — still return registered users */
  }

  const statsByUser = new Map(orderStats.map((s) => [String(s._id), s]));

  const registered = await Promise.all(
    users.map(async (u) => {
      const stats = statsByUser.get(String(u._id));
      let number = String(u.number || "").trim();
      if (phoneDigits(number).length < 10 && stats?.phone && phoneDigits(stats.phone).length >= 10) {
        number = stats.phone;
      }
      if (phoneDigits(number).length < 10) {
        number = await resolveUserPhone(u);
      }
      return customerDto({
        id: String(u._id),
        name: u.name,
        number,
        phone: number,
        email: u.email || "",
        registeredAt: u.createdAt,
        orderCount: stats?.orderCount ?? 0,
        lastOrderAt: stats?.lastOrderAt ?? null,
        totalSpent: stats?.totalSpent ?? 0,
        source: "registered",
        active: u.active !== false,
      });
    }),
  );

  const guests = [];
  for (const g of guestStats) {
    const guestRow = customerDto({
      id: null,
      name: g.name,
      number: g.phone || "",
      phone: g.phone || "",
      email: g._id,
      registeredAt: null,
      orderCount: g.orderCount,
      lastOrderAt: g.lastOrderAt,
      totalSpent: g.totalSpent,
      source: "guest",
    });

    let match = registered.find((r) => phonesMatch(r.number, g.phone));
    if (!match && g.phone) {
      const tail = phoneDigits(g.phone).slice(-10);
      if (tail.length === 10) {
        const dbUser = await User.findOne({
          role: "user",
          number: new RegExp(`${tail}$`),
        }).lean();
        if (dbUser) {
          match = registered.find((r) => r.id === String(dbUser._id));
          if (match && !match.number) match.number = dbUser.number || g.phone;
        }
      }
    }
    if (match) {
      match.orderCount += guestRow.orderCount;
      match.totalSpent += guestRow.totalSpent;
      if (
        guestRow.lastOrderAt &&
        (!match.lastOrderAt || new Date(guestRow.lastOrderAt) > new Date(match.lastOrderAt))
      ) {
        match.lastOrderAt = guestRow.lastOrderAt;
      }
      if (!match.number && guestRow.number) match.number = guestRow.number;
      continue;
    }
    guests.push(guestRow);
  }

  const customers = [...registered, ...guests].sort((a, b) => {
    const aTime = a.lastOrderAt ? new Date(a.lastOrderAt).getTime() : 0;
    const bTime = b.lastOrderAt ? new Date(b.lastOrderAt).getTime() : 0;
    if (bTime !== aTime) return bTime - aTime;
    return new Date(b.registeredAt || 0).getTime() - new Date(a.registeredAt || 0).getTime();
  });

  res.json({ success: true, customers, registeredCount: registered.length });
}

/** Save missing phone on user accounts from their orders */
export async function repairCustomerPhones(_req, res) {
  const users = await User.find({ role: "user" });
  let fixed = 0;
  for (const u of users) {
    if (phoneDigits(u.number).length >= 10) continue;
    const phone = await resolveUserPhone(u);
    const normalized = normalizePhone(phone) || phoneDigits(phone);
    if (normalized.length < 10) continue;
    await User.updateOne({ _id: u._id }, { $set: { number: normalized } });
    fixed += 1;
  }
  res.json({ success: true, message: `Updated ${fixed} user phone(s)`, fixed });
}

/** Admin activates / deactivates a registered customer. A deactivated user cannot sign in. */
export async function setCustomerStatus(req, res) {
  const { id } = req.params;
  const active = req.body.active === true || req.body.active === "true";

  const user = await User.findById(id).select("role");
  if (!user || user.role !== "user") {
    throw new ApiError(404, "Customer not found");
  }

  await User.updateOne({ _id: id }, { $set: { active } });

  res.json({
    success: true,
    message: active ? "Customer activated." : "Customer deactivated.",
    active,
  });
}

export async function listOrders(req, res) {
  const { status, email, phone, userId, limit = 100 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (userId) filter.user = userId;
  if (email) filter.customerEmail = String(email).toLowerCase();
  if (phone) {
    const digits = String(phone).replace(/\D/g, "").slice(0, 15);
    if (digits) filter.customerPhone = { $regex: digits.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") };
  }

  const safeLimit = Math.min(200, Math.max(1, Number(limit) || 100));

  const orders = await Order.find(filter)
    .populate("user", "name number email")
    .sort({ createdAt: -1 })
    .limit(safeLimit)
    .lean();

  res.json({
    success: true,
    total: orders.length,
    orders: orders.map((o) => ({
      ...o,
      itemCount: o.items?.reduce((n, i) => n + (i.quantity || 1), 0) ?? 0,
    })),
  });
}

export async function getOrder(req, res) {
  const order = await Order.findById(req.params.id).populate("user", "name number email");
  if (!order) throw new ApiError(404, "Order not found");
  res.json({ success: true, order: formatOrder(order) });
}

export async function updateOrderStatus(req, res) {
  const { status } = req.body;
  if (!["pending", "confirmed", "cancelled"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");
  order.status = status;
  if (status === "confirmed") order.paymentStatus = "confirmed";
  if (status === "cancelled" && order.paymentStatus === "awaiting") {
    order.paymentStatus = "awaiting";
  }
  await order.save();
  logAdminAction("order_status_update", req.user._id, {
    orderId: String(order._id),
    status,
  });
  res.json({ success: true, order: formatOrder(order) });
}
