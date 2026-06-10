import { type MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/utils/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/photography",
    "/about",
    "/contact",
  ].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
    lastModified: new Date(),
  }));

  return staticRoutes;
}
