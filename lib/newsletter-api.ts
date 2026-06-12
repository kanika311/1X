const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API}/newsletter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim(), source: "footer" }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Could not sign up. Please try again.");
  }

  return {
    success: true,
    message: data.message || "Thank you — you're on the list.",
  };
}
