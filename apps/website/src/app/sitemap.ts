import { type MetadataRoute } from "next";

import { fetchSanity } from "@/lib/sanity/fetch";
import { sitemapEntriesQuery } from "@/lib/sanity/queries";
import { absoluteUrl } from "@/lib/utils/site";

type SitemapEntry = {
  identifier: string;
  updatedAt?: string;
};

type SitemapEntries = {
  galleries: SitemapEntry[];
  photos: SitemapEntry[];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/photography",
    "/galleries",
    "/about",
  ].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
    lastModified: new Date(),
  }));

  const entries = await fetchSanity<SitemapEntries>(sitemapEntriesQuery);
  const photoRoutes: MetadataRoute.Sitemap = (entries?.photos ?? []).map(
    ({ identifier, updatedAt }) => ({
      url: absoluteUrl(`/photos/${encodeURIComponent(identifier)}`),
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: updatedAt,
    }),
  );
  const galleryRoutes: MetadataRoute.Sitemap = (entries?.galleries ?? []).map(
    ({ identifier, updatedAt }) => ({
      url: absoluteUrl(`/galleries/${encodeURIComponent(identifier)}`),
      changeFrequency: "monthly",
      priority: 0.7,
      lastModified: updatedAt,
    }),
  );

  return [...staticRoutes, ...galleryRoutes, ...photoRoutes];
}
