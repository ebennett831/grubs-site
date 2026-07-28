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

type SocialVariant = "footer" | "about";

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

function shouldShowInVariant(link: SocialLink, variant: SocialVariant) {
  if (variant === "footer") {
    return link.showInFooter !== false;
  }

  return link.showOnAboutPage !== false;
}

export function normalizeSocialLink(
  link: SocialLink | null | undefined,
  variant: SocialVariant,
  index = 0,
): NormalizedSocialLink | null {
  if (!link || !shouldShowInVariant(link, variant)) {
    return null;
  }

  const platform = normalizePlatform(link.platform);
  const href = normalizeHref(platform, link.url ?? "");
  const label = getTrimmedString(link.label) ?? getDefaultLabel(platform);

  if (!href) {
    return null;
  }

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
  variant: SocialVariant,
): NormalizedSocialLink[] {
  if (!links?.length) {
    return [];
  }

  return links
    .map((link, index) => normalizeSocialLink(link, variant, index))
    .filter((link): link is NormalizedSocialLink => Boolean(link));
}
