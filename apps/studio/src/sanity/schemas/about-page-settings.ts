import { defineField, defineType } from "sanity";

export const aboutPageSettingsSchema = defineType({
  name: "aboutPageSettings",
  title: "About Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "biography", title: "Biography" },
    { name: "resume", title: "Resume" },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      description: "Small label shown above the main heading.",
      type: "string",
      group: "hero",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "pageTitle",
      title: "Main Heading",
      description:
        "Photographer name or primary heading shown beside the portrait.",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "intro",
      title: "Intro Paragraph",
      description:
        "Short positioning statement shown beside the portrait. Keep this concise.",
      type: "text",
      rows: 4,
      group: "hero",
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: "locationLine",
      title: "Location / Role Line",
      description: "Optional short line shown near the hero heading.",
      type: "string",
      group: "hero",
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: "portraitImage",
      title: "Portrait Image",
      description: "Main photograph shown at the top of the About page.",
      type: "image",
      group: "hero",
      options: { hotspot: true },
    }),
    defineField({
      name: "portraitImageAlt",
      title: "Portrait Alt Text",
      description:
        "Describe the person and visible context for screen-reader users.",
      type: "string",
      group: "hero",
      validation: (rule) =>
        rule.custom((value, context) => {
          const hasPortrait = Boolean(
            (
              context.document as
                | { portraitImage?: { asset?: { _ref?: string } } }
                | undefined
            )?.portraitImage?.asset?._ref,
          );

          if (hasPortrait && !value?.trim()) {
            return "Add alt text when a portrait image is uploaded.";
          }

          return true;
        }),
    }),
    defineField({
      name: "body",
      title: "Biography",
      description:
        "Longer biography or artist statement. Separate paragraphs with a blank line.",
      type: "text",
      rows: 8,
      group: "biography",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "secondaryHeading",
      title: "Biography Section Label",
      description: "Optional label above the longer biography.",
      type: "string",
      group: "biography",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "availabilityStatement",
      title: "Availability Statement",
      description:
        "Optional commissions or collaboration note shown near the page end.",
      type: "text",
      rows: 3,
      group: "biography",
      validation: (rule) => rule.max(220),
    }),
    defineField({
      name: "socialSectionHeading",
      title: "Social Section Label",
      description:
        "Optional label above social links sourced from Site Settings.",
      type: "string",
      group: "biography",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "resumeFile",
      title: "Resume PDF",
      description:
        "Upload a PDF. The resume section remains hidden until a file is provided.",
      type: "file",
      group: "resume",
      options: {
        accept: ".pdf",
      },
    }),
    defineField({
      name: "resumeLabel",
      title: "Resume Link Label",
      description: "Optional link text. Defaults to View resume.",
      type: "string",
      group: "resume",
      hidden: ({ document }) => !document?.resumeFile,
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "resumeDescription",
      title: "Resume Description",
      description: "Optional short text shown above the resume link.",
      type: "text",
      rows: 2,
      group: "resume",
      hidden: ({ document }) => !document?.resumeFile,
      validation: (rule) => rule.max(220),
    }),
  ],
  preview: {
    select: {
      title: "pageTitle",
      media: "portraitImage",
      hasResume: "resumeFile.asset",
    },
    prepare(selection) {
      return {
        title: selection.title || "About Page",
        subtitle: selection.hasResume
          ? "About page content · Resume added"
          : "About page content",
        media: selection.media,
      };
    },
  },
});
