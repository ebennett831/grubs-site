import { defineField, defineType } from "sanity";

export const aboutPageSettingsSchema = defineType({
  name: "aboutPageSettings",
  title: "About Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "biography", title: "Biography" },
    { name: "resume", title: "Resume" },
    { name: "socials", title: "Socials" },
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
      title: "Heading",
      description: "Main title shown on the About page.",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "intro",
      title: "Intro Paragraph",
      description: "Short introduction shown near the top.",
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
      name: "body",
      title: "Main Text",
      description: "Longer biography or artist statement.",
      type: "text",
      rows: 8,
      group: "biography",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "secondaryHeading",
      title: "Secondary Heading",
      description: "Optional heading above the biography text.",
      type: "string",
      group: "biography",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "availabilityStatement",
      title: "Availability Statement",
      description:
        "Optional short contact or availability statement near the page end.",
      type: "text",
      rows: 3,
      group: "biography",
      validation: (rule) => rule.max(220),
    }),
    defineField({
      name: "portraitImage",
      title: "Portrait Image",
      description: "Optional portrait displayed on the About page.",
      type: "image",
      group: "hero",
      options: { hotspot: true },
    }),
    defineField({
      name: "portraitImageAlt",
      title: "Portrait Alt Text",
      description: "Describe the portrait for screen readers.",
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

          if (hasPortrait && !value) {
            return "Add alt text when a portrait image is uploaded.";
          }

          return true;
        }),
    }),
    defineField({
      name: "resumeFile",
      title: "Resume",
      description:
        "Upload a PDF. This section stays hidden on the website until a file is uploaded.",
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
    defineField({
      name: "socialSectionHeading",
      title: "Social Section Heading",
      description: "Optional heading for the social links section.",
      type: "string",
      group: "socials",
      validation: (rule) => rule.max(60),
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
