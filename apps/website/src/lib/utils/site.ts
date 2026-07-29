import { getSafeExternalHref, getTrimmedString } from "./content";

const DEFAULT_SITE_URL = "http://localhost:3000";

export function getSiteUrl() {
  const configuredUrl = getSafeExternalHref(process.env.NEXT_PUBLIC_SITE_URL);

  if (!configuredUrl && process.env.NODE_ENV === "production") {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be set to a valid absolute URL for production.",
    );
  }

  return (configuredUrl ?? DEFAULT_SITE_URL).replace(/\/$/, "");
}

export function absoluteUrl(pathname: string) {
  const candidate = getTrimmedString(pathname) ?? "/";
  const normalizedPath =
    candidate.startsWith("/") && !candidate.startsWith("//")
      ? candidate
      : `/${candidate.replace(/^\/+/, "")}`;

  return new URL(normalizedPath, getSiteUrl()).toString();
}
