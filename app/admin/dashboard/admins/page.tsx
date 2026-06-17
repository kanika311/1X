"use client";

import { Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";

import { AdminPasswordField } from "@/components/admin/password-field";
import { ApiError, apiFetch, type AdminAccount } from "@/lib/api";
import { getStoredAdmin } from "@/lib/auth";

const inputClass =
  "mt-1 w-full rounded-lg border border-rose-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-mauve";

const schema = Yup.object({
  name: Yup.string().min(2).required("Name is required"),
  email: Yup.string().email("Enter a valid email").optional(),
  number: Yup.string().test("phone", "Enter a valid 10-digit phone", (value) => {
    if (!value?.trim()) return true;
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  }),
  password: Yup.string().min(6).required("Password is required"),
}).test("contact", "Email or phone is required", (values) => {
  return Boolean(values?.email?.trim() || values?.number?.trim());
});

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);
  const currentAdminId = getStoredAdmin()?.id;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch<{ admins: AdminAccount[] }>("/admin/admins");
      setAdmins(data.admins ?? []);
    } catch (e) {
      setAdmins([]);
      setError(e instanceof Error ? e.message : "Could not load admins");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function removeAdmin(admin: AdminAccount) {
    if (
      !window.confirm(
        `Remove admin "${admin.name}"? They will no longer be able to sign in.`,
      )
    ) {
      return;
    }

    setRemovingId(admin.id);
    setError("");
    setSuccess("");
    try {
      await apiFetch(`/admin/admins/${admin.id}`, { method: "DELETE" });
      setSuccess(`${admin.name} was removed.`);
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not remove admin");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">Admin users</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Create or remove admin accounts. Public registration is disabled — only signed-in admins can manage
        teammates.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-ink">Create admin</h2>
          <Formik
            initialValues={{ name: "", email: "", number: "", password: "" }}
            validationSchema={schema}
            onSubmit={async (values, { resetForm, setSubmitting }) => {
              setError("");
              setSuccess("");
              try {
                await apiFetch("/admin/admins", {
                  method: "POST",
                  body: {
                    name: values.name.trim(),
                    email: values.email.trim() || undefined,
                    number: values.number.trim() || undefined,
                    password: values.password,
                  },
                });
                setSuccess("Admin account created.");
                resetForm();
                await load();
              } catch (e) {
                setError(e instanceof ApiError ? e.message : "Could not create admin");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase text-muted">Name</label>
                  <input name="name" className={inputClass} value={values.name} onChange={handleChange} onBlur={handleBlur} />
                  {touched.name && errors.name ? <p className="mt-1 text-xs text-red-500">{errors.name}</p> : null}
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-muted">Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    className={inputClass}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.email && errors.email ? <p className="mt-1 text-xs text-red-500">{errors.email}</p> : null}
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-muted">Phone</label>
                  <input
                    name="number"
                    type="tel"
                    placeholder="10-digit mobile (optional if email set)"
                    className={inputClass}
                    value={values.number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.number && errors.number ? (
                    <p className="mt-1 text-xs text-red-500">{String(errors.number)}</p>
                  ) : null}
                </div>
                <AdminPasswordField
                  label="Password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && errors.password ? String(errors.password) : undefined}
                />
                {typeof errors === "object" && "contact" in errors && errors.contact ? (
                  <p className="text-xs text-red-500">{String(errors.contact)}</p>
                ) : null}
                {error ? <p className="text-sm text-red-500">{error}</p> : null}
                {success ? <p className="text-sm text-green-600">{success}</p> : null}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-mauve-deep px-6 py-2.5 text-sm font-semibold uppercase text-white disabled:opacity-60"
                >
                  {isSubmitting ? "Creating…" : "Create admin"}
                </button>
              </form>
            )}
          </Formik>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-ink">Existing admins</h2>
          {loading ? (
            <p className="mt-6 text-sm text-muted">Loading…</p>
          ) : admins.length === 0 ? (
            <p className="mt-6 text-sm text-muted">No admin accounts yet.</p>
          ) : (
            <ul className="mt-6 divide-y divide-rose-50">
              {admins.map((admin) => {
                const isSelf = admin.id === currentAdminId;
                return (
                  <li key={admin.id} className="flex items-start justify-between gap-4 py-4 first:pt-0">
                    <div className="min-w-0">
                      <p className="font-medium text-ink">
                        {admin.name}
                        {isSelf ? (
                          <span className="ml-2 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-mauve-deep">
                            You
                          </span>
                        ) : null}
                      </p>
                      {admin.email ? <p className="mt-1 text-sm text-muted">{admin.email}</p> : null}
                      {admin.number ? <p className="text-sm text-muted">{admin.number}</p> : null}
                      <p className="mt-1 text-xs text-subtle">Added {formatDate(admin.createdAt)}</p>
                    </div>
                    {!isSelf ? (
                      <button
                        type="button"
                        disabled={removingId === admin.id}
                        onClick={() => void removeAdmin(admin)}
                        className="shrink-0 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold uppercase text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        {removingId === admin.id ? "Removing…" : "Remove"}
                      </button>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
