import { z } from "zod";

const sanityEnvSchema = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_SANITY_DATASET: z.string().min(1),
  NEXT_PUBLIC_SANITY_API_VERSION: z.string().default("2025-02-01"),
  SANITY_API_READ_TOKEN: z.string().optional(),
});

const parsedSanityEnv = sanityEnvSchema.safeParse({
  NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
  NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  SANITY_API_READ_TOKEN: process.env.SANITY_API_READ_TOKEN,
});

export const hasValidSanityEnv = parsedSanityEnv.success;

export const sanityEnv = parsedSanityEnv.success
  ? parsedSanityEnv.data
  : {
      NEXT_PUBLIC_SANITY_PROJECT_ID: "",
      NEXT_PUBLIC_SANITY_DATASET: "",
      NEXT_PUBLIC_SANITY_API_VERSION: "2025-02-01",
      SANITY_API_READ_TOKEN: undefined,
    };
