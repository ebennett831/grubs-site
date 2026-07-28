import { Container } from "@/components/ui/container";
import { SocialLinks } from "@/components/social/social-links";
import { normalizeSocialLinks } from "@/lib/utils/social-links";
import { type SiteSettings } from "@/types/sanity";

interface SiteFooterProps {
  siteSettings: SiteSettings | null;
}

export function SiteFooter({ siteSettings }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();
  const hasFooterSocialLinks =
    normalizeSocialLinks(siteSettings?.socialLinks, "footer").length > 0;

  const copyrightName =
    siteSettings?.footerCopyrightName?.trim() ||
    siteSettings?.siteTitle?.trim() ||
    "Photography Portfolio";

  return (
    <footer className="bg-charcoal text-cream border-t border-white/10 py-16 sm:py-20 lg:py-24">
      <Container className="space-y-16">
        <section className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(28rem,1.1fr)] lg:items-start lg:gap-20">
          <div className="space-y-5">
            <p className="text-cream/58 text-xs tracking-[0.28em] uppercase">
              {siteSettings?.footerEyebrow?.trim() || "Connect"}
            </p>
            <h2 className="font-serif-display text-cream max-w-xl text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
              {siteSettings?.footerHeading?.trim() || "Let's work together"}
            </h2>
            {siteSettings?.footerDescription?.trim() ? (
              <p className="text-cream/68 max-w-md leading-7">
                {siteSettings.footerDescription}
              </p>
            ) : null}
          </div>

          {hasFooterSocialLinks ? (
            <nav aria-label="Social links" className="lg:pt-2">
              <SocialLinks links={siteSettings?.socialLinks} variant="footer" />
            </nav>
          ) : null}
        </section>

        <div className="border-cream/15 text-cream/58 flex flex-col gap-2 border-t pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            {"\u00A9"} {currentYear} {copyrightName}
          </p>
          {siteSettings?.footerLocation?.trim() ? (
            <p>{siteSettings.footerLocation}</p>
          ) : null}
        </div>
      </Container>
    </footer>
  );
}
