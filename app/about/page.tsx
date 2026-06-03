import { redirect } from "next/navigation";

/** Home and About are one landing — see `/` */
export default function AboutPage() {
  redirect("/");
}
