import { getSiteUrl } from "@/lib/utils/site";
import { normalizeSocialLinks } from "@/lib/utils/social-links";
import { getSafeEmailHref, getTrimmedString } from "@/lib/utils/content";
import { type SiteSettings } from "@/types/sanity";

export function buildOrganizationSchema(siteSettings: SiteSettings | null) {
  const normalizedSocialLinks = normalizeSocialLinks(siteSettings?.socialLinks);
  const sameAs = [
    ...new Set(
      normalizedSocialLinks
        .filter((item) => item.isExternal)
        .map((item) => item.href),
    ),
  ];
  const emailHref = getSafeEmailHref(siteSettings?.contactEmail);
  const email = emailHref?.slice("mailto:".length);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: getTrimmedString(siteSettings?.siteTitle) ?? "Photography Portfolio",
    url: getSiteUrl(),
    ...(email ? { email } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function buildWebsiteSchema(siteSettings: SiteSettings | null) {
  const description = getTrimmedString(siteSettings?.siteDescription);

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: getTrimmedString(siteSettings?.siteTitle) ?? "Photography Portfolio",
    url: getSiteUrl(),
    ...(description ? { description } : {}),
  };
}

export function serializeStructuredData(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
