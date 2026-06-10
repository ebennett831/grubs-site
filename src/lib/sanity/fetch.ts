import { type QueryParams } from "next-sanity";

import { hasValidSanityEnv, sanityClient } from "@/lib/sanity/client";

export async function fetchSanity<T>(query: string, params: QueryParams = {}) {
  if (!hasValidSanityEnv) {
    return null as T | null;
  }

  try {
    return await sanityClient.fetch<T>(query, params, {
      next: {
        revalidate: 120,
      },
    });
  } catch {
    return null as T | null;
  }
}
