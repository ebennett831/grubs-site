import { absoluteUrl, getSiteUrl } from "@/lib/utils/site";
import {
  type GalleryWithPhotos,
  type Photographer,
  type SiteSettings,
} from "@/types/sanity";

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

export function buildGallerySchema(gallery: GalleryWithPhotos) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: gallery.title,
    description: gallery.description,
    url: absoluteUrl(`/gallery/${gallery.slug}`),
    image: gallery.photos.map((photo) => photo.image).filter(Boolean),
  };
}
