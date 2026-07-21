import Link from "next/link";

import { normalizeSocialLinks } from "@/lib/utils/social-links";
import { type SocialLink } from "@/types/sanity";

type SocialLinksProps = {
  links: SocialLink[] | undefined;
  variant: "footer" | "about";
  className?: string;
};

const variantListClasses: Record<SocialLinksProps["variant"], string> = {
  footer: "grid gap-2 sm:grid-cols-2",
  about: "grid gap-3 sm:grid-cols-2",
};

const variantLinkClasses: Record<SocialLinksProps["variant"], string> = {
  footer:
    "group inline-flex min-h-11 items-center justify-between border-b border-charcoal/25 py-2 text-sm tracking-[0.08em] uppercase text-charcoal/80 transition-colors duration-200 hover:border-charcoal hover:text-charcoal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
  about:
    "group inline-flex min-h-11 items-center justify-between border-b border-charcoal/25 py-2 text-base text-charcoal/88 transition-colors duration-200 hover:border-charcoal hover:text-charcoal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
};

export function SocialLinks({ links, variant, className }: SocialLinksProps) {
  const normalizedLinks = normalizeSocialLinks(links, variant);

  if (!normalizedLinks.length) {
    return null;
  }

  return (
    <ul className={`${variantListClasses[variant]} ${className ?? ""}`.trim()}>
      {normalizedLinks.map((item) => (
        <li key={item.key}>
          <Link
            href={item.href}
            target={item.isExternal ? "_blank" : undefined}
            rel={item.isExternal ? "noreferrer noopener" : undefined}
            className={variantLinkClasses[variant]}
            aria-label={
              item.platform === "email"
                ? "Email the photographer"
                : `Follow on ${item.label}`
            }
          >
            <span>{item.label}</span>
            <span
              className="text-charcoal/45 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            >
              -&gt;
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
