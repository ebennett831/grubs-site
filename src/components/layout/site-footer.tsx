import Link from "next/link";

import { Container } from "@/components/ui/container";
import { fetchSanity } from "@/lib/sanity/fetch";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { type SiteSettings } from "@/types/sanity";

export async function SiteFooter() {
  const siteSettings = await fetchSanity<SiteSettings>(siteSettingsQuery);

  return (
    <footer className="border-t border-black/10 py-8">
      <Container className="flex flex-col gap-4 text-sm text-black/70 sm:flex-row sm:items-center sm:justify-between">
        <p>{siteSettings?.siteTitle ?? "Photography Portfolio"}</p>
        <div className="flex gap-4">
          <Link
            href="/work"
            className="focus-visible:outline-accent hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            Work
          </Link>
          <Link
            href="/about"
            className="focus-visible:outline-accent hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="focus-visible:outline-accent hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            Contact
          </Link>
        </div>
      </Container>
    </footer>
  );
}
