import { type MetadataRoute } from "next";

import { fetchSanity } from "@/lib/sanity/fetch";
import { galleriesQuery } from "@/lib/sanity/queries";
import { absoluteUrl } from "@/lib/utils/site";
import { type Gallery } from "@/types/sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const galleries = (await fetchSanity<Gallery[]>(galleriesQuery)) ?? [];

  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/work",
    "/about",
    "/contact",
  ].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
    lastModified: new Date(),
  }));

  const galleryRoutes: MetadataRoute.Sitemap = galleries.map((gallery) => ({
    url: absoluteUrl(`/gallery/${gallery.slug}`),
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...galleryRoutes];
}
