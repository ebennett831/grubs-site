import { useMemo } from "react";

import { useClient } from "sanity";

const apiVersion =
  process.env.SANITY_STUDIO_API_VERSION?.trim() || "2025-02-01";

export function usePublishedClient() {
  const sourceClient = useClient({ apiVersion });

  return useMemo(
    () => sourceClient.withConfig({ perspective: "published" }),
    [sourceClient],
  );
}
