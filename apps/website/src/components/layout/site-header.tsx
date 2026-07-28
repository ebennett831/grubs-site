import Link from "next/link";

import { Container } from "@/components/ui/container";
import { getTrimmedString } from "@/lib/utils/content";
import { type SiteSettings } from "@/types/sanity";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/photography", label: "Photography" },
  { href: "/galleries", label: "Galleries" },
  { href: "/about", label: "About" },
];

interface SiteHeaderProps {
  siteSettings: SiteSettings | null;
}

export function SiteHeader({ siteSettings }: SiteHeaderProps) {
  const siteTitle =
    getTrimmedString(siteSettings?.siteTitle) || "Photography Portfolio";

  return (
    <header className="bg-cream/92 sticky top-0 z-20 backdrop-blur-md">
      <Container className="flex flex-col gap-2 py-3 sm:h-20 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-0">
        <Link
          href="/"
          className="font-serif-display text-charcoal focus-visible:outline-accent max-w-full min-w-0 truncate text-2xl leading-none transition-opacity duration-200 hover:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-4 sm:text-[1.7rem]"
        >
          {siteTitle}
        </Link>
        <nav
          aria-label="Primary"
          className="text-charcoal/68 grid w-full grid-cols-3 items-center text-[9px] tracking-[0.04em] uppercase sm:flex sm:w-auto sm:justify-start sm:gap-6 sm:text-[11px] sm:tracking-[0.08em]"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-charcoal focus-visible:outline-accent min-h-11 items-center text-center transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 sm:min-h-0 sm:justify-start sm:text-left sm:focus-visible:outline-offset-4 ${
                item.href === "/" ? "hidden sm:inline-flex" : "inline-flex"
              } ${
                item.href === "/photography"
                  ? "justify-start"
                  : item.href === "/about"
                    ? "justify-end"
                    : "justify-center"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
