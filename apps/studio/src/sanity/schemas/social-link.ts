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
  if (!url || typeof url !== "string") {
    return "Add a link URL.";
  }

  const normalizedPlatform =
    typeof platform === "string" ? platform.toLowerCase() : "";
  const trimmed = url.trim();

  if (normalizedPlatform === "email") {
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

  const allowedHosts = COMMON_SOCIAL_HOSTS[normalizedPlatform];
  if (
    allowedHosts &&
    allowedHosts.length > 0 &&
    !allowedHosts.some((host) => {
      const hostname = parsedUrl.hostname.toLowerCase();
      return hostname === host || hostname.endsWith(`.${host}`);
    })
  ) {
    return `This URL does not look like ${normalizedPlatform}.`;
  }

  return true;
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
      initialValue: "instagram",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      title: "Label",
      description:
        "Optional custom label. If empty, the platform name is used.",
      type: "string",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "url",
      title: "Link",
      description:
        "Use an https:// profile link. For Email, enter the address only; mailto: is added automatically.",
      type: "string",
      validation: (rule) =>
        rule.required().custom((value, context) => {
          return validateSocialUrl(
            value,
            (context.parent as { platform?: unknown } | undefined)?.platform,
          );
        }),
    }),
    defineField({
      name: "showInFooter",
      title: "Show in footer",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "showOnAboutPage",
      title: "Show on About page",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      platform: "platform",
      label: "label",
      url: "url",
      showInFooter: "showInFooter",
      showOnAboutPage: "showOnAboutPage",
    },
    prepare(selection) {
      const footer = selection.showInFooter !== false ? "Footer" : null;
      const about = selection.showOnAboutPage !== false ? "About page" : null;
      const placement = [footer, about].filter(Boolean).join(" \u00B7 ");

      return {
        title: selection.platform
          ? selection.platform.charAt(0).toUpperCase() +
            selection.platform.slice(1)
          : "Social Link",
        subtitle: [selection.label || selection.url, placement || "Hidden"]
          .filter(Boolean)
          .join(" \u00B7 "),
      };
    },
  },
});
