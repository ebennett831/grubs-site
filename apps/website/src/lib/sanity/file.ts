import { getSafeExternalHref } from "@/lib/utils/content";
import { type SanityFile } from "@/types/sanity";

export function getSanityFileUrl(
  file: SanityFile | null | undefined,
): string | null {
  const href = getSafeExternalHref(file?.asset?.url);

  return href?.startsWith("https://") ? href : null;
}
