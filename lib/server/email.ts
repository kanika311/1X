import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

export type PasswordResetEmailParams = {
  to: string;
  name?: string;
  resetUrl: string;
};

type ResetEmailContent = {
  subject: string;
  text: string;
  html: string;
};

let cachedTransporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null = null;

/** True when Gmail SMTP credentials are present in the environment. */
export function isEmailConfigured(): boolean {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.replace(/\s/g, "");
  return Boolean(user && pass);
}

function getEmailUser(): string {
  const user = process.env.EMAIL_USER?.trim();
  if (!user) {
    throw new Error("EMAIL_USER is not configured");
  }
  return user;
}

function getEmailPass(): string {
  const pass = process.env.EMAIL_PASS?.replace(/\s/g, "");
  if (!pass) {
    throw new Error("EMAIL_PASS is not configured");
  }
  return pass;
}

/** Gmail SMTP transporter (App Password authentication). */
export function getMailTransporter(): nodemailer.Transporter<SMTPTransport.SentMessageInfo> {
  if (cachedTransporter) return cachedTransporter;

  cachedTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: getEmailUser(),
      pass: getEmailPass(),
    },
  });

  return cachedTransporter;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildPasswordResetEmailContent({
  name,
  resetUrl,
}: {
  name?: string;
  resetUrl: string;
}): ResetEmailContent {
  const greeting = name?.trim() ? `Hi ${name.trim()},` : "Hi,";
  const subject = "Reset Your Password";

  const text = [
    greeting,
    "",
    "We received a request to reset your 1X · Dr. Ayxh admin password.",
    "",
    `Reset your password: ${resetUrl}`,
    "",
    "This link is valid for 1 hour.",
    "",
    "If you did not request a password reset, you can safely ignore this email.",
  ].join("\n");

  const safeGreeting = escapeHtml(greeting);
  const safeUrl = escapeHtml(resetUrl);

  const html = `
    <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#1a1a1a;line-height:1.6">
      <h2 style="color:#5c3d4a;margin-bottom:16px">Reset Your Password</h2>
      <p>${safeGreeting}</p>
      <p>We received a request to reset your <strong>1X · Dr. Ayxh</strong> admin password.</p>
      <p style="margin:28px 0">
        <a href="${safeUrl}" style="background:#5c3d4a;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block">
          Reset Password
        </a>
      </p>
      <p style="font-size:13px;color:#666">
        Or copy and paste this link into your browser:<br>
        <a href="${safeUrl}" style="color:#5c3d4a;word-break:break-all">${safeUrl}</a>
      </p>
      <p style="font-size:13px;color:#666;margin-top:20px">
        This link is valid for <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email.
      </p>
    </div>
  `.trim();

  return { subject, text, html };
}

/** Send the admin password-reset email via Gmail SMTP. */
export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: PasswordResetEmailParams): Promise<void> {
  if (!isEmailConfigured()) {
    console.error("[email] Gmail SMTP is not configured (EMAIL_USER / EMAIL_PASS missing)");
    throw new Error("Email service is not configured");
  }

  const transporter = getMailTransporter();
  const { subject, text, html } = buildPasswordResetEmailContent({ name, resetUrl });
  const from = process.env.EMAIL_FROM?.trim() || `"1X Admin" <${getEmailUser()}>`;

  try {
    await transporter.verify();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] Gmail SMTP verification failed:", message);
    throw new Error(`SMTP connection failed: ${message}`);
  }

  try {
    const info = await transporter.sendMail({ from, to, subject, text, html });
    console.info("[email] Password reset email sent", { to, messageId: info.messageId });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] Failed to send password reset email", { to, error: message });
    throw new Error(`Failed to send email: ${message}`);
  }
}
