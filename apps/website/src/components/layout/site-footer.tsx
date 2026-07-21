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
    <footer className="mt-20 border-t border-black/15 py-14 sm:py-18">
      <Container className="space-y-12">
        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <div className="space-y-4">
            <p className="text-charcoal/60 text-xs tracking-[0.28em] uppercase">
              {siteSettings?.footerEyebrow?.trim() || "Connect"}
            </p>
            <h2 className="font-serif-display text-charcoal max-w-xl text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
              {siteSettings?.footerHeading?.trim() || "Let's work together"}
            </h2>
            {siteSettings?.footerDescription?.trim() ? (
              <p className="text-charcoal/76 max-w-md leading-relaxed">
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

        <section className="text-charcoal/68 flex flex-col gap-2 border-t border-black/10 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            {"\u00A9"} {currentYear} {copyrightName}
          </p>
          {siteSettings?.footerLocation?.trim() ? (
            <p>{siteSettings.footerLocation}</p>
          ) : null}
        </section>
      </Container>
    </footer>
  );
}
