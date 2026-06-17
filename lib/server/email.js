import nodemailer from "nodemailer";

function buildResetContent({ name, resetUrl }) {
  const subject = "Reset your 1X Admin password";
  const text = [
    `Hi ${name},`,
    "",
    "We received a request to reset your admin password.",
    `Reset your password: ${resetUrl}`,
    "",
    "This link expires in 1 hour.",
    "",
    "If you did not request this, you can ignore this email.",
  ].join("\n");

  const html = `
    <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#1a1a1a">
      <h2 style="color:#5c3d4a">Reset your password</h2>
      <p>Hi ${name},</p>
      <p>We received a request to reset your <strong>1X · Dr. Ayxh</strong> admin password.</p>
      <p style="margin:28px 0">
        <a href="${resetUrl}" style="background:#5c3d4a;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:600">
          Reset password
        </a>
      </p>
      <p style="font-size:13px;color:#666">Or copy this link:<br><a href="${resetUrl}">${resetUrl}</a></p>
      <p style="font-size:13px;color:#666">This link expires in 1 hour. If you did not request a reset, ignore this email.</p>
    </div>
  `;

  return { subject, text, html };
}

async function sendViaResend({ to, from, subject, html, text }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: from || "1X Admin <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Resend error ${res.status}`);
  }

  return true;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = String(process.env.SMTP_PASS || "").replace(/\s/g, "");
  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
}

export async function sendPasswordResetEmail({ to, name, resetUrl }) {
  const { subject, text, html } = buildResetContent({ name, resetUrl });
  const from = process.env.SMTP_FROM || process.env.RESEND_FROM || process.env.SMTP_USER;

  if (process.env.RESEND_API_KEY) {
    try {
      await sendViaResend({ to, from: from || "1X Admin <onboarding@resend.dev>", subject, html, text });
      return { dev: false, provider: "resend" };
    } catch (err) {
      console.error("[password-reset] Resend failed:", err.message);
      throw err;
    }
  }

  const transporter = getTransporter();

  if (!transporter) {
    console.log("[password-reset] No email provider configured. Reset link:", resetUrl);
    return { dev: true, resetUrl };
  }

  try {
    await transporter.verify();
  } catch (err) {
    console.error("[password-reset] SMTP verify failed:", err.message);
    throw new Error(`SMTP connection failed: ${err.message}`);
  }

  await transporter.sendMail({ from, to, subject, text, html });
  return { dev: false, provider: "smtp" };
}
