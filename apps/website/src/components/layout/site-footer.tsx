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
    normalizeSocialLinks(siteSettings?.socialLinks, "footer").length > 0;
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
    <footer>
      <div className="bg-accent-surface py-8 sm:py-10" aria-hidden="true">
        <Container>
          <div className="bg-accent-contrast/60 mx-auto h-px w-20 sm:w-24" />
        </Container>
      </div>

      <div className="bg-charcoal text-cream border-t border-white/10 py-16 sm:py-20 lg:py-24">
        <Container
          className={
            hasFooterMessage || hasFooterSocialLinks ? "space-y-16" : undefined
          }
        >
          {hasFooterMessage || hasFooterSocialLinks ? (
            <section
              className={
                hasFooterMessage && hasFooterSocialLinks
                  ? "grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(28rem,1.1fr)] lg:items-start lg:gap-20"
                  : ""
              }
            >
              {hasFooterMessage ? (
                <div className="space-y-5">
                  {eyebrow ? (
                    <p className="text-cream/58 text-xs tracking-[0.28em] uppercase">
                      {eyebrow}
                    </p>
                  ) : null}
                  {heading ? (
                    <h2 className="font-serif-display text-cream max-w-xl text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
                      {heading}
                    </h2>
                  ) : null}
                  {description ? (
                    <p className="text-cream/68 max-w-md leading-7">
                      {description}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {hasFooterSocialLinks ? (
                <nav
                  aria-label="Social links"
                  className={hasFooterMessage ? "lg:pt-2" : "max-w-4xl"}
                >
                  <SocialLinks
                    links={siteSettings?.socialLinks}
                    variant="footer"
                  />
                </nav>
              ) : null}
            </section>
          ) : null}

          <div className="border-cream/15 text-cream/58 flex flex-col gap-2 border-t pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p>
              {"\u00A9"} {currentYear} {copyrightName}
            </p>
            {location ? <p>{location}</p> : null}
          </div>
        </Container>
      </div>
    </footer>
  );
}
