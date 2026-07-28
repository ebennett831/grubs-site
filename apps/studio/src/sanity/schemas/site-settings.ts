import { defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "social", title: "Social Links" },
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
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: "siteDescription",
      title: "Site Description",
      description: "Short summary used for search engines and social previews.",
      type: "text",
      rows: 5,
      group: "identity",
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      description:
        "Primary public email used by contact prompts. Add an Email item under Social Links to show it in the footer or About page.",
      type: "string",
      group: "identity",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "footerEyebrow",
      title: "Footer Eyebrow",
      description: "Short pre-heading above the footer heading.",
      type: "string",
      group: "footer",
      initialValue: "Connect",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "footerHeading",
      title: "Footer Heading",
      description: "Main footer heading.",
      type: "string",
      group: "footer",
      initialValue: "Let's work together",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "footerDescription",
      title: "Footer Description",
      description: "Optional short availability statement.",
      type: "text",
      rows: 3,
      group: "footer",
      initialValue:
        "Available for commissions, collaborations, and editorial work.",
      validation: (rule) => rule.max(220),
    }),
    defineField({
      name: "footerLocation",
      title: "Footer Location",
      description: "Optional location line shown below social links.",
      type: "string",
      group: "footer",
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: "footerCopyrightName",
      title: "Footer Copyright Name",
      description:
        "Optional name used in the copyright line. Falls back to Site Title.",
      type: "string",
      group: "footer",
      validation: (rule) => rule.max(100),
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
      return {
        title: selection.title || "Site Settings",
        subtitle: selection.subtitle || "Global website settings",
        media: selection.media,
      };
    },
  },
});
