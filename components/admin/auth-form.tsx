"use client";

import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

import { AdminPasswordField } from "@/components/admin/password-field";
import { adminLogin } from "@/lib/auth";
import { ADMIN } from "@/lib/admin/routes";

const inputClass =
  "mt-1 w-full rounded-lg border border-rose-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-mauve";

const schema = Yup.object({
  identifier: Yup.string()
    .required("Email or phone is required")
    .test("identifier", "Enter a valid email or 10-digit phone number", (value) => {
      const v = (value || "").trim();
      if (!v) return false;
      if (v.includes("@")) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      const digits = v.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15;
    }),
  password: Yup.string().min(6).required("Password is required"),
});

export function AuthForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-rose-100 bg-white p-8 shadow-lg">
        <h1 className="text-center font-serif text-2xl text-ink">Admin sign in</h1>
        <p className="mt-2 text-center text-sm text-muted">1X · Dr. Ayxh CRM</p>

        <Formik
          initialValues={{ identifier: "", password: "" }}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting }) => {
            setError("");
            try {
              await adminLogin(values.identifier, values.password);
              router.replace(ADMIN.dashboard);
            } catch (e) {
              const msg = e instanceof Error ? e.message : "Authentication failed";
              setError(msg);
              setSubmitting(false);
            }
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase text-muted">Email or phone</label>
                <input
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  placeholder="admin@example.com or 10-digit mobile"
                  className={inputClass}
                  value={values.identifier}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.identifier && errors.identifier ? (
                  <p className="mt-1 text-xs text-red-500">{String(errors.identifier)}</p>
                ) : null}
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase text-muted">Password</label>
                  <Link href={ADMIN.forgotPassword} className="text-xs font-medium text-mauve-deep hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <AdminPasswordField
                  name="password"
                  autoComplete="current-password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && errors.password ? String(errors.password) : undefined}
                />
              </div>
              {error ? <p className="text-sm text-red-500">{error}</p> : null}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-mauve-deep py-3 text-sm font-semibold uppercase text-white disabled:opacity-60"
              >
                {isSubmitting ? "Please wait…" : "Sign in"}
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
