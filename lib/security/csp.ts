const CLOUDINARY = "https://res.cloudinary.com";
const UNSPLASH = "https://images.unsplash.com";

function connectSources(): string {
  const sources = ["'self'"];
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (apiUrl) {
    try {
      const { origin } = new URL(apiUrl);
      if (origin && origin !== "'self'") sources.push(origin);
    } catch {
      /* ignore invalid URL */
    }
  }
  return sources.join(" ");
}

/** Build a strict, nonce-based CSP (no unsafe-inline / data: in script-src). */
export function buildContentSecurityPolicy(nonce: string, isDev: boolean): string {
  const devEval = isDev ? " 'unsafe-eval'" : "";

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${devEval}`,
    `style-src 'self' 'nonce-${nonce}'`,
    `img-src 'self' blob: data: ${CLOUDINARY} ${UNSPLASH}`,
    "font-src 'self'",
    `connect-src ${connectSources()}`,
    "media-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

/** Minimal CSP for JSON API responses (no scripts). */
export function buildApiContentSecurityPolicy(): string {
  return ["default-src 'none'", "frame-ancestors 'none'", "base-uri 'none'"].join("; ");
}

/** Security headers without CSP — safe to set on every response via next.config. */
export function buildBaselineSecurityHeaders(isProduction: boolean): Record<string, string> {
  const headers: Record<string, string> = {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "X-DNS-Prefetch-Control": "off",
    "Cross-Origin-Resource-Policy": "same-origin",
    "X-Frame-Options": "DENY",
  };

  if (isProduction) {
    headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload";
  }

  return headers;
}

export function buildSecurityHeaders(csp: string, isProduction = true): Record<string, string> {
  return {
    ...buildBaselineSecurityHeaders(isProduction),
    "Content-Security-Policy": csp,
  };
}

export function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
