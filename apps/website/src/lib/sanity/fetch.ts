import { type QueryParams } from "next-sanity";

import { hasValidSanityEnv, sanityClient } from "@/lib/sanity/client";

export async function fetchSanity<T>(query: string, params: QueryParams = {}, revalidate = 0) {
  if (!hasValidSanityEnv) {
    return null as T | null;
  }

  try {
    return await sanityClient.fetch<T>(query, params, {
      next: {
        revalidate,
      },
    });
  } catch {
    return null as T | null;
  }
}
