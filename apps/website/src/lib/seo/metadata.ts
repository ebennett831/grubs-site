import { type Metadata } from "next";

import { urlFor } from "@/lib/sanity/image";
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
  const siteTitle = siteSettings?.siteTitle ?? "Photography Portfolio";
  const siteDescription =
    description ??
    siteSettings?.siteDescription ??
    "A professional photography portfolio with editorial galleries.";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;

  const ogImage = siteSettings?.ogImage
    ? urlFor(siteSettings.ogImage)
        .width(1200)
        .height(630)
        .fit("crop")
        .auto("format")
        .url()
    : "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=1200&h=630&q=80";

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
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: siteDescription,
      images: [ogImage],
    },
  };
}
