"use client";

import { Formik } from "formik";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import * as Yup from "yup";

import { AdminPasswordField } from "@/components/admin/password-field";
import { resetAdminPassword } from "@/lib/auth";
import { ADMIN } from "@/lib/admin/routes";

const schema = Yup.object({
  password: Yup.string().min(6, "At least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-sm text-red-500">This reset link is invalid or missing a token.</p>
        <Link href={ADMIN.forgotPassword} className="mt-4 inline-block text-sm font-medium text-mauve-deep hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <p className="text-sm text-ink">Your password has been updated.</p>
        <button
          type="button"
          onClick={() => router.replace(ADMIN.login)}
          className="mt-6 w-full rounded-lg bg-mauve-deep py-3 text-sm font-semibold uppercase text-white"
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    <Formik
      initialValues={{ password: "", confirmPassword: "" }}
      validationSchema={schema}
      onSubmit={async (values, { setSubmitting }) => {
        setError("");
        try {
          await resetAdminPassword(token, values.password);
          setDone(true);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Could not reset password");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit} className="space-y-4">
          <AdminPasswordField
            label="New password"
            name="password"
            autoComplete="new-password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && errors.password ? String(errors.password) : undefined}
          />
          <AdminPasswordField
            label="Confirm password"
            name="confirmPassword"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              touched.confirmPassword && errors.confirmPassword
                ? String(errors.confirmPassword)
                : undefined
            }
          />
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-mauve-deep py-3 text-sm font-semibold uppercase text-white disabled:opacity-60"
          >
            {isSubmitting ? "Updating…" : "Update password"}
          </button>
        </form>
      )}
    </Formik>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-rose-100 bg-white p-8 shadow-lg">
        <h1 className="text-center font-serif text-2xl text-ink">Set new password</h1>
        <p className="mt-2 text-center text-sm text-muted">Choose a new password for your admin account.</p>

        <div className="mt-8">
          <Suspense fallback={<p className="text-center text-sm text-muted">Loading…</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          <Link href={ADMIN.login} className="font-medium text-mauve-deep hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
