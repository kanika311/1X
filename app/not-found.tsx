import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-serif text-6xl text-ink">404</p>
      <p className="mt-4 text-sm text-muted">This page could not be found.</p>
      <Link href="/" className="mt-8">
        <Button>Return home</Button>
      </Link>
    </div>
  );
}
