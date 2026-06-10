import { getSiteUrl } from "@/lib/utils/site";
import { type Photographer, type SiteSettings } from "@/types/sanity";

export function buildOrganizationSchema(
  siteSettings: SiteSettings | null,
  photographer: Photographer | null,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name:
      siteSettings?.siteTitle ?? photographer?.name ?? "Photography Portfolio",
    url: getSiteUrl(),
    email: photographer?.email,
    sameAs: siteSettings?.socialLinks?.map((item) => item.url) ?? [],
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
