import { getSiteUrl } from "@/lib/utils/site";
import { normalizeSocialLinks } from "@/lib/utils/social-links";
import { type Photographer, type SiteSettings } from "@/types/sanity";

export function buildOrganizationSchema(
  siteSettings: SiteSettings | null,
  photographer: Photographer | null,
) {
  const sameAs = normalizeSocialLinks(siteSettings?.socialLinks ?? [], "footer")
    .filter((item) => item.isExternal)
    .map((item) => item.href);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name:
      siteSettings?.siteTitle ?? photographer?.name ?? "Photography Portfolio",
    url: getSiteUrl(),
    email: siteSettings?.contactEmail ?? photographer?.email,
    sameAs,
  };
}

export function buildWebsiteSchema(siteSettings: SiteSettings | null) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteSettings?.siteTitle ?? "Photography Portfolio",
    url: getSiteUrl(),
    description: siteSettings?.siteDescription,
  };
}
