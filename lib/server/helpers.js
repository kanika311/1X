export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export function productOfferingId(product) {
  return `${product.domain}/${product.category}/${product.slug}`;
}

export function cartKeyForProduct(product) {
  const type = product.category === "courses" ? "course" : "service";
  return `${type}:${productOfferingId(product)}`;
}

/** Static site catalog id: domain/category/slug — also accepts slug-only */
export function parseOfferingPath(productId) {
  if (!productId || typeof productId !== "string") return null;
  const trimmed = productId.trim().replace(/^\/+/, "");
  const parts = trimmed.split("/").filter(Boolean);
  if (parts.length === 1) {
    return { domain: null, category: null, slug: parts[0], offeringId: parts[0] };
  }
  if (parts.length !== 3) return null;
  const [domain, category, slug] = parts;
  if (!domain || !category || !slug) return null;
  const offeringId = `${domain}/${category}/${slug}`;
  return { domain, category, slug, offeringId };
}

/**
 * Digits-only phone for login/register.
 * Strips the Indian country code / trunk prefix so that +91XXXXXXXXXX,
 * 91XXXXXXXXXX, 0XXXXXXXXXX and XXXXXXXXXX all normalize to the same number.
 */
export function normalizePhone(value) {
  let digits = String(value ?? "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  if (digits.length < 10 || digits.length > 15) return null;
  return digits;
}

export function catalogCartKey(offeringId) {
  const parsed = parseOfferingPath(offeringId);
  if (!parsed) return null;
  const type = parsed.category === "courses" ? "course" : "service";
  return `${type}:${parsed.offeringId}`;
}
