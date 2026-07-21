import { defineField, defineType } from "sanity";

export const aboutPageSettingsSchema = defineType({
  name: "aboutPageSettings",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "pageTitle",
      title: "Heading",
      description: "Main title shown on the About page.",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "intro",
      title: "Intro Paragraph",
      description: "Short introduction shown near the top.",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: "body",
      title: "Main Text",
      description: "Longer biography or artist statement.",
      type: "text",
      rows: 8,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "portraitImage",
      title: "Portrait Image",
      description: "Optional portrait displayed on the About page.",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: "pageTitle",
      media: "portraitImage",
    },
    prepare(selection) {
      return {
        title: selection.title || "About Page",
        subtitle: "About page content",
        media: selection.media,
      };
    },
  },
});