/** Structured security event logging (server-side only). */
export function logSecurityEvent(event, details = {}) {
  const entry = {
    ts: new Date().toISOString(),
    event,
    ...details,
  };
  console.warn("[security]", JSON.stringify(entry));
}

export function logAuthFailure(reason, meta = {}) {
  logSecurityEvent("auth_failure", { reason, ...meta });
}

export function logAuthSuccess(userId, role, meta = {}) {
  logSecurityEvent("auth_success", { userId: String(userId), role, ...meta });
}

export function logAdminAction(action, adminId, meta = {}) {
  logSecurityEvent("admin_action", { action, adminId: String(adminId), ...meta });
}
