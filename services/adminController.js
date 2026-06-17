import { User } from "@/models/User.js";
import { Product } from "@/models/Product.js";
import { Offer } from "@/models/Offer.js";
import { Cart } from "@/models/Cart.js";
import { Wishlist } from "@/models/Wishlist.js";
import { Order } from "@/models/Order.js";
import { ApiError, normalizePhone } from "@/lib/server/helpers.js";

export async function dashboardStats(_req, res) {
  const [products, offers, users, carts, wishlists, orders, pendingOrders] = await Promise.all([
    Product.countDocuments(),
    Offer.countDocuments(),
    User.countDocuments({ role: "user" }),
    Cart.countDocuments(),
    Wishlist.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({ status: "pending" }),
  ]);
  res.json({
    success: true,
    stats: {
      products,
      activeProducts: await Product.countDocuments({ active: true }),
      offers,
      activeOffers: await Offer.countDocuments({ active: true }),
      users,
      carts,
      wishlists,
      orders,
      pendingOrders,
    },
  });
}

export async function listAdmins(_req, res) {
  const admins = await User.find({ role: "admin" })
    .select("name number email createdAt")
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    success: true,
    admins: admins.map((a) => ({
      id: a._id,
      name: a.name,
      number: a.number || "",
      email: a.email || "",
      createdAt: a.createdAt,
    })),
  });
}

export async function createAdmin(req, res) {
  const { name, number, email, password } = req.body;

  if (!String(name || "").trim()) {
    throw new ApiError(400, "Name is required");
  }
  if (!password || String(password).length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const normalizedEmail = email ? String(email).trim().toLowerCase() : "";
  const normalizedNumber = number ? normalizePhone(number) : null;

  if (!normalizedEmail && !normalizedNumber) {
    throw new ApiError(400, "Email or phone is required");
  }
  if (normalizedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new ApiError(400, "Enter a valid email");
  }
  if (normalizedEmail && (await User.findOne({ email: normalizedEmail }))) {
    throw new ApiError(409, "Email already registered");
  }
  if (normalizedNumber && (await User.findOne({ number: normalizedNumber }))) {
    throw new ApiError(409, "Phone already registered");
  }

  const user = await User.create({
    name: String(name).trim(),
    ...(normalizedEmail ? { email: normalizedEmail } : {}),
    ...(normalizedNumber ? { number: normalizedNumber } : {}),
    password,
    role: "admin",
  });

  res.status(201).json({
    success: true,
    admin: {
      id: user._id,
      name: user.name,
      number: user.number || "",
      email: user.email || "",
      createdAt: user.createdAt,
    },
  });
}

export async function deleteAdmin(req, res) {
  const { id } = req.params;

  if (String(req.user._id) === String(id)) {
    throw new ApiError(400, "You cannot delete your own account while signed in");
  }

  const adminCount = await User.countDocuments({ role: "admin" });
  if (adminCount <= 1) {
    throw new ApiError(400, "Cannot delete the only admin account");
  }

  const user = await User.findOne({ _id: id, role: "admin" });
  if (!user) {
    throw new ApiError(404, "Admin not found");
  }

  await user.deleteOne();

  res.json({ success: true, message: "Admin removed" });
}
