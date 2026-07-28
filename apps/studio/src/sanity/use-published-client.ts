import { useMemo } from "react";

import { useClient } from "sanity";

const apiVersion = "2025-02-01";

export function usePublishedClient() {
  const sourceClient = useClient({ apiVersion });

  return useMemo(
    () => sourceClient.withConfig({ perspective: "published" }),
    [sourceClient],
  );
}
