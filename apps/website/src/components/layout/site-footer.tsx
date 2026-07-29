import { Container } from "@/components/ui/container";
import { SocialLinks } from "@/components/social/social-links";
import { normalizeSocialLinks } from "@/lib/utils/social-links";
import { getTrimmedString } from "@/lib/utils/content";
import { type SiteSettings } from "@/types/sanity";

interface SiteFooterProps {
  siteSettings: SiteSettings | null;
}

export function SiteFooter({ siteSettings }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();
  const hasFooterSocialLinks =
    normalizeSocialLinks(siteSettings?.socialLinks).length > 0;
  const eyebrow = getTrimmedString(siteSettings?.footerEyebrow);
  const heading = getTrimmedString(siteSettings?.footerHeading);
  const description = getTrimmedString(siteSettings?.footerDescription);
  const location = getTrimmedString(siteSettings?.footerLocation);
  const hasFooterMessage = Boolean(eyebrow || heading || description);

  const copyrightName =
    getTrimmedString(siteSettings?.footerCopyrightName) ||
    getTrimmedString(siteSettings?.siteTitle) ||
    "Photography Portfolio";

  return (
    <footer
      className={`bg-charcoal text-cream ${
        hasFooterMessage || hasFooterSocialLinks
          ? "py-20 sm:py-28 lg:py-32"
          : "py-12 sm:py-16"
      }`}
    >
      <Container
        className={
          hasFooterMessage || hasFooterSocialLinks
            ? "space-y-20 sm:space-y-24"
            : undefined
        }
      >
        {hasFooterMessage || hasFooterSocialLinks ? (
          <div
            className={
              hasFooterMessage && hasFooterSocialLinks
                ? "grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.72fr)] lg:items-start lg:gap-24 xl:gap-32"
                : ""
            }
          >
            {hasFooterMessage ? (
              <div className="max-w-3xl">
                <div
                  className="bg-accent-surface mb-7 h-px w-12"
                  aria-hidden="true"
                />
                {eyebrow ? (
                  <p className="text-cream/58 mb-5 text-xs tracking-[0.28em] uppercase">
                    {eyebrow}
                  </p>
                ) : null}
                {heading ? (
                  <h2 className="font-serif-display text-cream max-w-2xl text-4xl leading-[0.94] sm:text-5xl lg:text-6xl xl:text-7xl">
                    {heading}
                  </h2>
                ) : null}
                {description ? (
                  <p className="text-cream/68 mt-7 max-w-lg text-sm leading-7 sm:text-base">
                    {description}
                  </p>
                ) : null}
              </div>
            ) : null}

            {hasFooterSocialLinks ? (
              <nav
                aria-label="Social links"
                className={
                  hasFooterMessage
                    ? "lg:pt-8"
                    : "max-w-2xl lg:ml-auto lg:w-full"
                }
              >
                <SocialLinks links={siteSettings?.socialLinks} />
              </nav>
            ) : null}
          </div>
        ) : null}

        <div className="border-cream/15 text-cream/52 flex flex-col gap-2 border-t pt-6 text-xs tracking-[0.04em] sm:flex-row sm:items-center sm:justify-between sm:text-sm">
          <p>
            {"\u00A9"} {currentYear} {copyrightName}
          </p>
          {location ? <p>{location}</p> : null}
        </div>
      </Container>
    </footer>
  );
}
