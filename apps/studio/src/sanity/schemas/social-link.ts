import { defineField, defineType } from "sanity";

const COMMON_SOCIAL_HOSTS: Record<string, string[]> = {
  instagram: ["instagram.com"],
  linkedin: ["linkedin.com"],
  website: [],
  x: ["x.com", "twitter.com"],
  facebook: ["facebook.com"],
  youtube: ["youtube.com", "youtu.be"],
  vimeo: ["vimeo.com"],
  tiktok: ["tiktok.com"],
  behance: ["behance.net"],
  threads: ["threads.net"],
  bluesky: ["bsky.app"],
};

function validateSocialUrl(url: unknown, platform: unknown) {
  if (url === undefined || url === null || url === "") {
    return true;
  }

  if (typeof url !== "string") {
    return "Enter a text URL or email address.";
  }

  const normalizedPlatform =
    typeof platform === "string" ? platform.toLowerCase() : "";
  const trimmed = url.trim();

  if (!trimmed) {
    return true;
  }

  if (
    normalizedPlatform === "email" ||
    (!normalizedPlatform && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed))
  ) {
    if (trimmed.toLowerCase().startsWith("mailto:")) {
      const address = trimmed.replace(/^mailto:/i, "").trim();
      if (!address) {
        return "Add an email address after mailto:.";
      }

      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)
        ? true
        : "Enter a valid email address.";
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
      ? true
      : "Enter a valid email address.";
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(trimmed);
  } catch {
    return "Enter a valid URL starting with https://.";
  }

  if (parsedUrl.protocol !== "https:") {
    return "Only https:// links are allowed for social and website links.";
  }

  return true;
}

function validateSocialHost(url: unknown, platform: unknown) {
  if (typeof url !== "string" || typeof platform !== "string") {
    return true;
  }

  const trimmed = url.trim();
  const normalizedPlatform = platform.toLowerCase();
  const allowedHosts = COMMON_SOCIAL_HOSTS[normalizedPlatform];

  if (!trimmed || !allowedHosts?.length) {
    return true;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(trimmed);
  } catch {
    return true;
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  return allowedHosts.some(
    (host) => hostname === host || hostname.endsWith(`.${host}`),
  )
    ? true
    : `This URL does not look like ${normalizedPlatform}. Check the platform or use Custom.`;
}

export const socialLinkSchema = defineType({
  name: "socialLink",
  title: "Social Link",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: [
          { title: "Instagram", value: "instagram" },
          { title: "LinkedIn", value: "linkedin" },
          { title: "Email", value: "email" },
          { title: "Website", value: "website" },
          { title: "X", value: "x" },
          { title: "Facebook", value: "facebook" },
          { title: "YouTube", value: "youtube" },
          { title: "Vimeo", value: "vimeo" },
          { title: "TikTok", value: "tiktok" },
          { title: "Behance", value: "behance" },
          { title: "Threads", value: "threads" },
          { title: "Bluesky", value: "bluesky" },
          { title: "Custom", value: "custom" },
        ],
        layout: "dropdown",
      },
      validation: (rule) =>
        rule
          .custom((value) =>
            typeof value === "string" && value.trim()
              ? true
              : "Choose a platform so this link can be labeled and displayed.",
          )
          .warning(),
    }),
    defineField({
      name: "label",
      title: "Label",
      description:
        "Optional custom label. If empty, the platform name is used.",
      type: "string",
      validation: (rule) => rule.max(60).warning(),
    }),
    defineField({
      name: "url",
      title: "Link",
      description:
        "Use an https:// profile link. For Email, enter the address only; mailto: is added automatically.",
      type: "string",
      validation: (rule) => [
        rule.custom((value, context) => {
          return validateSocialUrl(
            value,
            (context.parent as { platform?: unknown } | undefined)?.platform,
          );
        }),
        rule
          .custom((value) =>
            typeof value === "string" && value.trim()
              ? true
              : "Add a link before enabling this social item.",
          )
          .warning(),
        rule
          .custom((value, context) =>
            validateSocialHost(
              value,
              (context.parent as { platform?: unknown } | undefined)?.platform,
            ),
          )
          .warning(),
      ],
    }),
    defineField({
      name: "showInFooter",
      title: "Show in footer",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      platform: "platform",
      label: "label",
      url: "url",
      showInFooter: "showInFooter",
    },
    prepare(selection) {
      const footer = selection.showInFooter !== false ? "Footer" : null;
      const platform =
        typeof selection.platform === "string" &&
        selection.platform.trim().length > 0
          ? selection.platform.trim()
          : "";
      const label =
        typeof selection.label === "string" && selection.label.trim()
          ? selection.label.trim()
          : null;
      const url =
        typeof selection.url === "string" && selection.url.trim()
          ? selection.url.trim()
          : null;

      return {
        title: platform
          ? platform.charAt(0).toUpperCase() + platform.slice(1)
          : "Unconfigured social link",
        subtitle: [label || url, footer || "Hidden"]
          .filter(Boolean)
          .join(" \u00B7 "),
      };
    },
  },
});
