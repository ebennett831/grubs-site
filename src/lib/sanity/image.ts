import { createImageUrlBuilder } from "@sanity/image-url";

import { sanityClient } from "@/lib/sanity/client";

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}
