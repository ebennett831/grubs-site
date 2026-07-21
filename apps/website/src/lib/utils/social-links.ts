import { type SocialLink, type SocialPlatform } from "@/types/sanity";

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

const EXTERNAL_PROTOCOLS = new Set(["https:"]);

type SocialVariant = "footer" | "about";

export interface NormalizedSocialLink {
  key: string;
  platform: SocialPlatform | "unknown";
  label: string;
  href: string;
  isExternal: boolean;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function normalizePlatform(
  platform: SocialLink["platform"],
): SocialPlatform | "unknown" {
  if (!platform) {
    return "unknown";
  }

  const value = platform.trim().toLowerCase();
  if (value === "twitter") {
    return "x";
  }

  const knownPlatforms = new Set<SocialPlatform>([
    "instagram",
    "linkedin",
    "email",
    "website",
    "x",
    "facebook",
    "youtube",
    "vimeo",
    "tiktok",
    "behance",
    "threads",
    "bluesky",
    "custom",
  ]);

  return knownPlatforms.has(value as SocialPlatform)
    ? (value as SocialPlatform)
    : "unknown";
}

function normalizeHref(
  platform: SocialPlatform | "unknown",
  url: string,
): string | null {
  const trimmed = url.trim();

  if (!trimmed) {
    return null;
  }

  if (platform === "email") {
    if (trimmed.toLowerCase().startsWith("mailto:")) {
      const address = trimmed.slice(7);
      return isValidEmail(address) ? `mailto:${address.trim()}` : null;
    }

    return isValidEmail(trimmed) ? `mailto:${trimmed}` : null;
  }

  try {
    const parsed = new URL(trimmed);
    if (!EXTERNAL_PROTOCOLS.has(parsed.protocol)) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

function getDefaultLabel(platform: SocialPlatform | "unknown") {
  return platform === "unknown" ? "Website" : PLATFORM_LABELS[platform];
}

function shouldShowInVariant(
  link: SocialLink,
  variant: SocialVariant,
  hasExplicitFlag: boolean,
) {
  if (variant === "footer") {
    if (hasExplicitFlag) {
      return link.showInFooter === true;
    }

    return link.showInFooter ?? true;
  }

  if (hasExplicitFlag) {
    return link.showOnAboutPage === true;
  }

  return link.showOnAboutPage ?? true;
}

export function normalizeSocialLinks(
  links: SocialLink[] | undefined,
  variant: SocialVariant,
): NormalizedSocialLink[] {
  if (!links?.length) {
    return [];
  }

  const hasExplicitFlag = links.some((link) =>
    variant === "footer"
      ? typeof link.showInFooter === "boolean"
      : typeof link.showOnAboutPage === "boolean",
  );

  const normalizedLinks = links
    .filter((link) => shouldShowInVariant(link, variant, hasExplicitFlag))
    .map((link, index) => {
      const platform = normalizePlatform(link.platform);
      const href = normalizeHref(platform, link.url ?? "");
      const rawLabel = link.label?.trim();

      if (!href) {
        return null;
      }

      return {
        key: link._key ?? `${platform}-${index}-${href}`,
        platform,
        label:
          rawLabel && rawLabel.length > 0
            ? rawLabel
            : getDefaultLabel(platform),
        href,
        isExternal: href.startsWith("https://"),
      } satisfies NormalizedSocialLink;
    })
    .filter((link): link is NormalizedSocialLink => Boolean(link));

  return normalizedLinks;
}
