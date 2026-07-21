import Link from "next/link";

import { Container } from "@/components/ui/container";
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
  return (
    <header className="bg-cream/95 sticky top-0 z-20 border-b border-black/10 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-charcoal text-sm tracking-[0.2em] uppercase"
        >
          {siteSettings?.siteTitle ?? "Photography Portfolio"}
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-5 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-accent focus-visible:outline-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
