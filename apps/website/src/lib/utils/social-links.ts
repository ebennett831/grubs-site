import { type SocialLink, type SocialPlatform } from "@/types/sanity";

import {
  getSafeEmailHref,
  getSafeExternalHref,
  getTrimmedString,
  isExternalHref,
} from "./content";

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  email: "Email",
  website: "Website",
  x: "X",
  facebook: "Facebook",
  youtube: "YouTube",
  vimeo: "Vimeo",
  tiktok: "TikTok",
  behance: "Behance",
  threads: "Threads",
  bluesky: "Bluesky",
  custom: "Website",
};

const KNOWN_PLATFORMS = new Set<string>(Object.keys(PLATFORM_LABELS));

export interface NormalizedSocialLink {
  key: string;
  platform: SocialPlatform | "unknown";
  label: string;
  href: string;
  isExternal: boolean;
}

function isKnownPlatform(value: string): value is SocialPlatform {
  return KNOWN_PLATFORMS.has(value);
}

function normalizePlatform(
  platform: SocialLink["platform"],
): SocialPlatform | "unknown" {
  const value = getTrimmedString(platform)?.toLowerCase();

  if (!value) {
    return "unknown";
  }

  if (value === "twitter") {
    return "x";
  }

  return isKnownPlatform(value) ? value : "unknown";
}

function normalizeHref(
  platform: SocialPlatform | "unknown",
  url: string,
): string | null {
  if (platform === "email") {
    return getSafeEmailHref(url);
  }

  return getSafeExternalHref(url);
}

function getDefaultLabel(platform: SocialPlatform | "unknown") {
  return platform === "unknown" ? "Website" : PLATFORM_LABELS[platform];
}

export function normalizeSocialLink(
  link: SocialLink | null | undefined,
  index = 0,
): NormalizedSocialLink | null {
  if (!link || link.showInFooter === false) {
    return null;
  }

  const platform = normalizePlatform(link.platform);
  const href = normalizeHref(platform, link.url ?? "");

  if (!href) {
    return null;
  }

  const label =
    getTrimmedString(link.label) ??
    (platform === "email"
      ? href.replace(/^mailto:/i, "")
      : getDefaultLabel(platform));

  return {
    key: getTrimmedString(link._key) ?? `${platform}-${index}-${href}`,
    platform,
    label,
    href,
    isExternal: isExternalHref(href),
  };
}

export function normalizeSocialLinks(
  links: ReadonlyArray<SocialLink | null> | null | undefined,
): NormalizedSocialLink[] {
  if (!links?.length) {
    return [];
  }

  return links
    .map((link, index) => normalizeSocialLink(link, index))
    .filter((link): link is NormalizedSocialLink => Boolean(link));
}
