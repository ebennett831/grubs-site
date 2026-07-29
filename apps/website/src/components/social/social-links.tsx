import { SocialIcon } from "@/components/social/social-icon";
import { normalizeSocialLinks } from "@/lib/utils/social-links";
import { type SocialLink } from "@/types/sanity";

type SocialLinksProps = {
  links?: ReadonlyArray<SocialLink | null> | null;
  className?: string;
};

export function SocialLinks({ links, className }: SocialLinksProps) {
  const normalizedLinks = normalizeSocialLinks(links);

  if (!normalizedLinks.length) {
    return null;
  }

  return (
    <ul className={`border-cream/18 border-t ${className ?? ""}`.trim()}>
      {normalizedLinks.map((item, index) => (
        <li key={`${item.key}-${index}`}>
          <a
            href={item.href}
            target={item.isExternal ? "_blank" : undefined}
            rel={item.isExternal ? "noreferrer noopener" : undefined}
            className="border-cream/20 text-cream/82 hover:border-cream/65 hover:text-cream focus-visible:outline-cream group relative flex min-h-20 w-full items-center gap-4 border-b py-5 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4"
            aria-label={
              item.platform === "email"
                ? `Send email to ${item.label}`
                : `${item.label} (opens in a new tab)`
            }
          >
            <span
              className="flex size-6 shrink-0 items-center justify-center opacity-55 transition-[transform,opacity] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:opacity-85"
              aria-hidden="true"
            >
              <SocialIcon platform={item.platform} />
            </span>
            <span className="font-serif-display min-w-0 text-2xl leading-none break-words sm:text-3xl">
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
