import { type QueryParams } from "next-sanity";

import { hasValidSanityEnv, sanityClient } from "@/lib/sanity/client";

const DEFAULT_REVALIDATE_SECONDS = 60;

export async function fetchSanity<T>(
  query: string,
  params: QueryParams = {},
  revalidate: number = DEFAULT_REVALIDATE_SECONDS,
) {
  if (!hasValidSanityEnv) {
    return null as T | null;
  }

  try {
    if (revalidate <= 0) {
      return await sanityClient.fetch<T>(query, params);
    }

    return await sanityClient.fetch<T>(query, params, {
      next: {
        revalidate,
      },
    });
  } catch {
    return null as T | null;
  }
}
