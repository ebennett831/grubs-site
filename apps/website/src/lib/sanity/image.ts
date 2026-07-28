import { createImageUrlBuilder, type ImageUrlBuilder } from "@sanity/image-url";

import { sanityClient } from "@/lib/sanity/client";
import { type SanityImage, type SanityImageWithAsset } from "@/types/sanity";

const builder = createImageUrlBuilder(sanityClient);

export function hasSanityImage(
  image: SanityImage | null | undefined,
): image is SanityImageWithAsset {
  return Boolean(image?.asset?._ref?.trim());
}

export function getSanityImageUrl(
  image: SanityImage | null | undefined,
  transform?: (imageBuilder: ImageUrlBuilder) => ImageUrlBuilder,
): string | null {
  if (!hasSanityImage(image)) {
    return null;
  }

  try {
    const imageBuilder = builder.image(image);
    return (transform ? transform(imageBuilder) : imageBuilder).url();
  } catch {
    return null;
  }
}
