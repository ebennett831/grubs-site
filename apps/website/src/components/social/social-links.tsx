import { SocialIcon } from "@/components/social/social-icon";
import { normalizeSocialLinks } from "@/lib/utils/social-links";
import { type SocialLink } from "@/types/sanity";

type SocialLinksProps = {
  links: SocialLink[] | undefined;
  variant: "footer" | "about";
  tone?: "dark" | "light";
  className?: string;
};

const variantListClasses: Record<SocialLinksProps["variant"], string> = {
  footer: "grid gap-x-8 sm:grid-cols-2",
  about: "grid gap-x-10 sm:grid-cols-2",
};

const toneLinkClasses: Record<NonNullable<SocialLinksProps["tone"]>, string> = {
  dark: "border-cream/20 text-cream/82 hover:border-cream/65 hover:text-cream focus-visible:outline-cream",
  light:
    "border-charcoal/25 text-charcoal/82 hover:border-charcoal/70 hover:text-charcoal focus-visible:outline-accent",
};

export function SocialLinks({
  links,
  variant,
  tone = variant === "footer" ? "dark" : "light",
  className,
}: SocialLinksProps) {
  const normalizedLinks = normalizeSocialLinks(links, variant);

  if (!normalizedLinks.length) {
    return null;
  }

  return (
    <ul className={`${variantListClasses[variant]} ${className ?? ""}`.trim()}>
      {normalizedLinks.map((item) => (
        <li key={item.key}>
          <a
            href={item.href}
            target={item.isExternal ? "_blank" : undefined}
            rel={item.isExternal ? "noreferrer noopener" : undefined}
            className={`group relative flex min-h-14 w-full items-center gap-4 border-b py-3 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 ${toneLinkClasses[tone]}`}
            aria-label={
              item.platform === "email"
                ? "Email the photographer"
                : `${item.label} (opens in a new tab)`
            }
          >
            <span
              className="flex size-7 shrink-0 items-center justify-center transition-transform duration-200 ease-out group-hover:-translate-y-0.5"
              aria-hidden="true"
            >
              <SocialIcon platform={item.platform} />
            </span>
            <span
              className={
                variant === "footer"
                  ? "text-sm tracking-[0.1em] uppercase"
                  : "font-serif-display text-xl"
              }
            >
              {item.label}
            </span>
            <span
              className="ml-auto text-current opacity-45 transition-[transform,opacity] duration-200 ease-out group-hover:translate-x-1 group-hover:opacity-80"
              aria-hidden="true"
            >
              {item.platform === "email" ? "-\u003e" : "\u2197"}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
