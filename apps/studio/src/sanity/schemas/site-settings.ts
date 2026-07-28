import { defineField, defineType } from "sanity";

import { HeaderSizeSlider } from "../inputs/scale-slider";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  description:
    "Global identity, social links, footer content, appearance, and search metadata.",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "appearance", title: "Appearance" },
    { name: "social", title: "Socials" },
    { name: "footer", title: "Footer" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site Title",
      description: "Website name shown in navigation and metadata.",
      type: "string",
      group: "identity",
      validation: (rule) => rule.max(70).warning(),
    }),
    defineField({
      name: "siteDescription",
      title: "Site Description",
      description: "Short summary used for search engines and social previews.",
      type: "text",
      rows: 5,
      group: "identity",
      validation: (rule) => rule.max(220).warning(),
    }),
    defineField({
      name: "accentColor",
      title: "Site Accent Color",
      description:
        "Optional. Choose the accent used for focus states, subtle page texture, rules, and hover details. Clear it to restore the default terracotta.",
      type: "color",
      group: "appearance",
      options: {
        disableAlpha: true,
        colorList: [
          { hex: "#9f5d3f" },
          { hex: "#b4772d" },
          { hex: "#48647a" },
          { hex: "#4f6753" },
          { hex: "#79566f" },
        ],
      },
    }),
    defineField({
      name: "headerSize",
      title: "Header Size",
      description:
        "Controls the height of the global header and the size of the site name. Level 3 is the default.",
      type: "number",
      group: "appearance",
      initialValue: 3,
      validation: (rule) => rule.min(1).max(5).warning(),
      components: {
        input: HeaderSizeSlider,
      },
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      description:
        "Primary public email used by contact prompts. Add an Email item under Social Links to show it in the footer or About page.",
      type: "string",
      group: "identity",
      validation: (rule) =>
        rule.custom((value) => {
          if (!value?.trim()) {
            return true;
          }

          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
            ? true
            : "Enter a valid email address.";
        }),
    }),
    defineField({
      name: "footerEyebrow",
      title: "Footer Eyebrow",
      description: "Short pre-heading above the footer heading.",
      type: "string",
      group: "footer",
      validation: (rule) => rule.max(40).warning(),
    }),
    defineField({
      name: "footerHeading",
      title: "Footer Heading",
      description: "Main footer heading.",
      type: "string",
      group: "footer",
      validation: (rule) => rule.max(120).warning(),
    }),
    defineField({
      name: "footerDescription",
      title: "Footer Description",
      description: "Optional short availability statement.",
      type: "text",
      rows: 3,
      group: "footer",
      validation: (rule) => rule.max(220).warning(),
    }),
    defineField({
      name: "footerLocation",
      title: "Footer Location",
      description: "Optional location shown in the footer's lower utility row.",
      type: "string",
      group: "footer",
      validation: (rule) => rule.max(100).warning(),
    }),
    defineField({
      name: "footerCopyrightName",
      title: "Footer Copyright Name",
      description:
        "Optional name used in the copyright line. Falls back to Site Title.",
      type: "string",
      group: "footer",
      validation: (rule) => rule.max(100).warning(),
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image",
      description: "Image used when sharing the site on social media.",
      type: "image",
      group: "seo",
      options: { hotspot: true },
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      description: "Small icon shown in browser tabs.",
      type: "image",
      group: "seo",
      options: { hotspot: true },
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      description:
        "Add each profile or email once, then choose whether it appears in the footer and/or About page. Drag items to set their display order.",
      type: "array",
      group: "social",
      of: [{ type: "socialLink" }],
    }),
  ],
  preview: {
    select: {
      title: "siteTitle",
      subtitle: "siteDescription",
      media: "favicon",
    },
    prepare(selection) {
      const title =
        typeof selection.title === "string" && selection.title.trim()
          ? selection.title.trim()
          : "Site Settings";
      const subtitle =
        typeof selection.subtitle === "string" && selection.subtitle.trim()
          ? selection.subtitle.trim()
          : "Global website settings";

      return {
        title,
        subtitle,
        media: selection.media,
      };
    },
  },
});
