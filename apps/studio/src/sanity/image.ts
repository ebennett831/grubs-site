import { createImageUrlBuilder } from "@sanity/image-url";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "";

const builder = createImageUrlBuilder({
  projectId,
  dataset,
});

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}
