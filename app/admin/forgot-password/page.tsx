"use client";

import { Formik } from "formik";
import Link from "next/link";
import { useState } from "react";
import * as Yup from "yup";

import { requestPasswordReset } from "@/lib/auth";
import { ADMIN } from "@/lib/admin/routes";

const inputClass =
  "mt-1 w-full rounded-lg border border-rose-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-mauve";

const schema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
});

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-rose-100 bg-white p-8 shadow-lg">
        <h1 className="text-center font-serif text-2xl text-ink">Forgot password</h1>
        <p className="mt-2 text-center text-sm text-muted">
          Enter the email on your admin account. We&apos;ll send a reset link.
        </p>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting }) => {
            setError("");
            setMessage("");
            try {
              const data = await requestPasswordReset(values.email.trim().toLowerCase());
              setMessage(data.message);
            } catch (e) {
              setError(e instanceof Error ? e.message : "Could not send reset link");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase text-muted">Email</label>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@example.com"
                  className={inputClass}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.email && errors.email ? (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                ) : null}
              </div>

              {message ? (
                <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-ink">
                  <p>{message}</p>
                </div>
              ) : null}
              {error ? <p className="text-sm text-red-500">{error}</p> : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-mauve-deep py-3 text-sm font-semibold uppercase text-white disabled:opacity-60"
              >
                {isSubmitting ? "Sending…" : "Send reset link"}
              </button>
            </form>
          )}
        </Formik>

        <p className="mt-6 text-center text-sm text-muted">
          <Link href={ADMIN.login} className="font-medium text-mauve-deep hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
