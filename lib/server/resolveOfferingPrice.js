import mongoose from "mongoose";

import { getOffering } from "@/lib/data/service-catalog";
import { ApiError, cartKeyForProduct, parseOfferingPath, productOfferingId } from "@/lib/server/helpers.js";
import { Offer } from "@/models/Offer.js";
import { Product } from "@/models/Product.js";

async function resolveProduct(productId) {
  const key = String(productId ?? "").trim();
  if (mongoose.Types.ObjectId.isValid(key)) {
    const p = await Product.findOne({ _id: key, active: true });
    if (p) return p;
  }
  if (key.includes("/")) {
    const [domain, category, slug] = key.split("/");
    return Product.findOne({ domain, category, slug, active: true });
  }
  return Product.findOne({ slug: key.toLowerCase(), active: true });
}

/** Resolve catalog price server-side — never trust client-supplied amounts. */
export async function resolveOrderLineItem(item) {
  let type = "course";
  if (item.type === "service") type = "service";
  if (item.type === "membership") type = "membership";

  const offeringId = String(item.offeringId || "").trim();
  const cartKey = String(item.cartKey || "").trim();
  const quantity = Math.max(1, Number(item.quantity) || 1);

  if (type === "membership") {
    const slug = offeringId.includes("/") ? offeringId.split("/").pop() : offeringId;
    if (!slug) throw new ApiError(400, "Membership tier is required");

    const offer = await Offer.findOne({ slug, active: true });
    if (!offer || !Number.isFinite(offer.price) || offer.price <= 0) {
      throw new ApiError(400, "This membership tier is not available for purchase");
    }

    return {
      cartKey: cartKey || `membership:${offer.slug}`,
      offeringId: offeringId || offer.slug,
      type: "membership",
      title: offer.title,
      price: offer.price,
      quantity,
      image: String(offer.image || ""),
      duration: "",
    };
  }

  const pid = offeringId || cartKey.split(":").slice(1).join(":");
  if (!pid) throw new ApiError(400, "Each cart item must reference a product");

  const product = await resolveProduct(pid);
  if (product) {
    if (!Number.isFinite(product.price) || product.price <= 0) {
      throw new ApiError(400, `"${product.title}" is not available for purchase`);
    }
    return {
      cartKey: cartKey || cartKeyForProduct(product),
      offeringId: productOfferingId(product),
      type: product.category === "courses" ? "course" : "service",
      title: product.title,
      price: product.price,
      quantity,
      image: String(product.image || ""),
      duration: String(product.duration || ""),
    };
  }

  const catalog = parseOfferingPath(pid);
  if (!catalog?.domain || !catalog?.category || !catalog?.slug) {
    throw new ApiError(400, `Product not found: ${pid}`);
  }

  const offering = getOffering(catalog.domain, catalog.category, catalog.slug);
  if (!offering || !Number.isFinite(offering.price) || offering.price <= 0) {
    throw new ApiError(400, `Product not found: ${pid}`);
  }

  const resolvedType = catalog.category === "courses" ? "course" : "service";
  return {
    cartKey: cartKey || `${resolvedType}:${catalog.offeringId}`,
    offeringId: catalog.offeringId,
    type: resolvedType,
    title: offering.title,
    price: offering.price,
    quantity,
    image: String(offering.image || ""),
    duration: String(offering.duration || ""),
  };
}
