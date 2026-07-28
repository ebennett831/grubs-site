import Link from "next/link";

import { Container } from "@/components/ui/container";
import { getTrimmedString } from "@/lib/utils/content";
import { type SiteSettings } from "@/types/sanity";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/photography", label: "Photography" },
  { href: "/galleries", label: "Galleries" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

interface SiteHeaderProps {
  siteSettings: SiteSettings | null;
}

export function SiteHeader({ siteSettings }: SiteHeaderProps) {
  const siteTitle =
    getTrimmedString(siteSettings?.siteTitle) || "Photography Portfolio";

  return (
    <header className="bg-cream/95 sticky top-0 z-20 border-b border-black/10 backdrop-blur-sm">
      <Container className="flex flex-col gap-3 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-0">
        <Link
          href="/"
          className="text-charcoal text-xs tracking-[0.2em] uppercase sm:text-sm"
        >
          {siteTitle}
        </Link>
        <nav
          aria-label="Primary"
          className="grid w-full grid-cols-5 items-center gap-1 text-[10px] sm:flex sm:w-auto sm:justify-start sm:gap-5 sm:text-sm"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-accent focus-visible:outline-accent text-center transition-colors first:text-left last:text-right focus-visible:outline-2 focus-visible:outline-offset-4 sm:text-left"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
