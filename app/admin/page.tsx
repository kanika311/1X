import { redirect } from "next/navigation";

import { ADMIN } from "@/lib/admin/routes";

export default function AdminHome() {
  redirect(ADMIN.login);
}
