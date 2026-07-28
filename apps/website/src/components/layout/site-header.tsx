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

const headerSizeOptions = {
  1: {
    container: "gap-1.5 py-2 sm:h-16 sm:gap-6 sm:py-0",
    navigation: "sm:gap-4 sm:text-[10px]",
    title: "text-xl sm:text-[1.4rem]",
  },
  2: {
    container: "gap-2 py-2.5 sm:h-[4.5rem] sm:gap-7 sm:py-0",
    navigation: "sm:gap-5 sm:text-[10px]",
    title: "text-[1.35rem] sm:text-[1.55rem]",
  },
  3: {
    container: "gap-2 py-3 sm:h-20 sm:gap-8 sm:py-0",
    navigation: "sm:gap-6 sm:text-[11px]",
    title: "text-2xl sm:text-[1.7rem]",
  },
  4: {
    container: "gap-2.5 py-3.5 sm:h-24 sm:gap-9 sm:py-0",
    navigation: "sm:gap-7 sm:text-[11px]",
    title: "text-[1.6rem] sm:text-[2rem]",
  },
  5: {
    container: "gap-3 py-4 sm:h-28 sm:gap-10 sm:py-0",
    navigation: "sm:gap-8 sm:text-xs",
    title: "text-[1.75rem] sm:text-[2.25rem]",
  },
} as const;

interface SiteHeaderProps {
  siteSettings: SiteSettings | null;
}

export function SiteHeader({ siteSettings }: SiteHeaderProps) {
  const siteTitle =
    getTrimmedString(siteSettings?.siteTitle) || "Photography Portfolio";
  const headerSize =
    typeof siteSettings?.headerSize === "number"
      ? Math.min(5, Math.max(1, Math.round(siteSettings.headerSize)))
      : 3;
  const sizeClasses =
    headerSizeOptions[headerSize as keyof typeof headerSizeOptions];

  return (
    <header className="bg-cream-deep/96 sticky top-0 z-20 backdrop-blur-md">
      <Container
        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${sizeClasses.container}`}
      >
        <Link
          href="/"
          className={`font-serif-display text-charcoal focus-visible:outline-accent max-w-full min-w-0 truncate leading-none transition-opacity duration-200 hover:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-4 ${sizeClasses.title}`}
        >
          {siteTitle}
        </Link>
        <nav
          aria-label="Primary"
          className={`text-charcoal/68 grid w-full grid-cols-3 items-center text-[9px] tracking-[0.04em] uppercase sm:flex sm:w-auto sm:justify-start sm:tracking-[0.08em] ${sizeClasses.navigation}`}
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
