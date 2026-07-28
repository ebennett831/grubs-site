import { SocialIcon } from "@/components/social/social-icon";
import { normalizeSocialLinks } from "@/lib/utils/social-links";
import { type SocialLink } from "@/types/sanity";

type SocialLinksProps = {
  links?: ReadonlyArray<SocialLink | null> | null;
  variant: "footer" | "about";
  tone?: "dark" | "light";
  className?: string;
};

const variantListClasses: Record<SocialLinksProps["variant"], string> = {
  footer: "",
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
  const isEditorialFooter = variant === "footer" && tone === "dark";

  if (!normalizedLinks.length) {
    return null;
  }

  return (
    <ul
      className={`${variantListClasses[variant]} ${
        isEditorialFooter
          ? "border-cream/18 border-t"
          : variant === "footer"
            ? "grid gap-x-8 sm:grid-cols-2"
            : ""
      } ${className ?? ""}`.trim()}
    >
      {normalizedLinks.map((item, index) => (
        <li key={`${item.key}-${index}`}>
          <a
            href={item.href}
            target={item.isExternal ? "_blank" : undefined}
            rel={item.isExternal ? "noreferrer noopener" : undefined}
            className={`group relative flex w-full items-center gap-4 border-b transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 ${
              isEditorialFooter ? "min-h-20 py-5" : "min-h-14 py-3"
            } ${toneLinkClasses[tone]}`}
            aria-label={
              item.platform === "email"
                ? "Email the photographer"
                : `${item.label} (opens in a new tab)`
            }
          >
            <span
              className={`flex shrink-0 items-center justify-center transition-[transform,opacity] duration-200 ease-out group-hover:-translate-y-0.5 ${
                isEditorialFooter
                  ? "size-6 opacity-55 group-hover:opacity-85"
                  : "size-7"
              }`}
              aria-hidden="true"
            >
              <SocialIcon platform={item.platform} />
            </span>
            <span
              className={
                isEditorialFooter
                  ? "font-serif-display min-w-0 text-2xl leading-none break-words sm:text-3xl"
                  : variant === "footer"
                    ? "text-sm tracking-[0.1em] uppercase"
                    : "font-serif-display text-xl"
              }
            >
              {item.label}
            </span>
            <span
              className="ml-auto shrink-0 text-sm text-current opacity-40 transition-[transform,opacity] duration-200 ease-out group-hover:translate-x-1 group-hover:opacity-80"
              aria-hidden="true"
            >
              {item.platform === "email" ? "\u2192" : "\u2197"}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
