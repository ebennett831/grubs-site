import { defineField, defineType } from "sanity";

const COMMON_SOCIAL_HOSTS: Record<string, string[]> = {
  instagram: ["instagram.com", "www.instagram.com"],
  linkedin: ["linkedin.com", "www.linkedin.com"],
  website: [],
  x: ["x.com", "www.x.com", "twitter.com", "www.twitter.com"],
  facebook: ["facebook.com", "www.facebook.com"],
  youtube: ["youtube.com", "www.youtube.com", "youtu.be"],
  vimeo: ["vimeo.com", "www.vimeo.com"],
  tiktok: ["tiktok.com", "www.tiktok.com"],
  behance: ["behance.net", "www.behance.net"],
  threads: ["threads.net", "www.threads.net"],
  bluesky: ["bsky.app", "www.bsky.app"],
};

function validateSocialUrl(url: unknown, platform: unknown) {
  if (!url || typeof url !== "string") {
    return "Add a link URL.";
  }

  const normalizedPlatform =
    typeof platform === "string" ? platform.toLowerCase() : "";
  const trimmed = url.trim();

  if (normalizedPlatform === "email") {
    if (trimmed.startsWith("mailto:")) {
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
      : "Use a valid email address or a mailto: link.";
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
    !allowedHosts.includes(parsedUrl.hostname.toLowerCase())
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
        "Use https:// links. For Email, you can enter an email address or mailto:address.",
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
      const footer = selection.showInFooter ? "Footer" : null;
      const about = selection.showOnAboutPage ? "About page" : null;
      const placement = [footer, about].filter(Boolean).join(" · ");

      return {
        title: selection.platform
          ? selection.platform.charAt(0).toUpperCase() +
            selection.platform.slice(1)
          : "Social Link",
        subtitle: [selection.label || selection.url, placement || "Hidden"]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
});
