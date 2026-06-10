import { createClient } from "next-sanity";

import { hasValidSanityEnv, sanityEnv } from "@/lib/sanity/env";

export const sanityClient = createClient({
  projectId: sanityEnv.NEXT_PUBLIC_SANITY_PROJECT_ID || "missing-project-id",
  dataset: sanityEnv.NEXT_PUBLIC_SANITY_DATASET || "missing-dataset",
  apiVersion: sanityEnv.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: true,
  perspective: "published",
  token: sanityEnv.SANITY_API_READ_TOKEN,
});

export { hasValidSanityEnv };
