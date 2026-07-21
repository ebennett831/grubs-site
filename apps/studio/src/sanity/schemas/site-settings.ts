import { defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site Title",
      description: "Website name shown in navigation and metadata.",
      type: "string",
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: "siteDescription",
      title: "Site Description",
      description: "Short summary used for search engines and social previews.",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image",
      description: "Image used when sharing the site on social media.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      description: "Small icon shown in browser tabs.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      description: "Optional links shown for social profiles.",
      type: "array",
      of: [
        {
          type: "object",
          preview: {
            select: {
              title: "platform",
              subtitle: "url",
            },
          },
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
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
