import { FooterContact } from "@/components/layout/footer-contact";
import { FooterNewsletter } from "@/components/layout/footer-newsletter";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-rose-100 bg-rose-50/60 text-mauve-deep">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <FooterNewsletter />
        <FooterContact />

        <p className="mt-10 text-xs lowercase text-subtle">
          © {year} 1x · dr. ayxh. all rights reserved.
        </p>
      </div>
    </footer>
  );
}
