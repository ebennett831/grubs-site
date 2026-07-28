import { type Metadata } from "next";

import { getSanityImageUrl } from "@/lib/sanity/image";
import { getTrimmedString } from "@/lib/utils/content";
import { absoluteUrl } from "@/lib/utils/site";
import { type SiteSettings } from "@/types/sanity";

interface BuildMetadataInput {
  title?: string;
  description?: string;
  pathname?: string;
  siteSettings?: SiteSettings | null;
}

export function buildMetadata({
  title,
  description,
  pathname = "/",
  siteSettings,
}: BuildMetadataInput): Metadata {
  const siteTitle =
    getTrimmedString(siteSettings?.siteTitle) ?? "Photography Portfolio";
  const siteDescription =
    getTrimmedString(description) ??
    getTrimmedString(siteSettings?.siteDescription) ??
    "A professional photography portfolio with editorial galleries.";
  const pageTitle = getTrimmedString(title);
  const fullTitle = pageTitle ? `${pageTitle} | ${siteTitle}` : siteTitle;
  const ogImage = getSanityImageUrl(siteSettings?.ogImage, (imageBuilder) =>
    imageBuilder.width(1200).height(630).fit("crop").auto("format"),
  );

  const canonical = absoluteUrl(pathname);

  return {
    title: fullTitle,
    description: siteDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title: fullTitle,
      description: siteDescription,
      url: canonical,
      type: "website",
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: siteDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
