import { type QueryParams } from "next-sanity";

import { hasValidSanityEnv, sanityClient } from "@/lib/sanity/client";

const DEFAULT_REVALIDATE_SECONDS = 60;
const isDevelopment = process.env.NODE_ENV === "development";

export async function fetchSanity<T>(
  query: string,
  params: QueryParams = {},
  revalidate: number = DEFAULT_REVALIDATE_SECONDS,
): Promise<T | null> {
  if (!hasValidSanityEnv) {
    return null;
  }

  if (isDevelopment) {
    return sanityClient.fetch<T | null>(query, params, {
      cache: "no-store",
    });
  }

  if (revalidate <= 0) {
    return sanityClient.fetch<T | null>(query, params);
  }

  return sanityClient.fetch<T | null>(query, params, {
    next: {
      revalidate,
    },
  });
}
