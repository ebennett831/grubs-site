import { defineField, defineType } from "sanity";

export const photoSchema = defineType({
  name: "photo",
  title: "Photos",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      description: "Upload the photo file.",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "altText",
      title: "Alt Text",
      description: "Describe what is visible in the photo for accessibility.",
      type: "string",
      validation: (rule) =>
        rule
          .custom((value, context) => {
            const hasImage = Boolean(
              (context.document as { image?: { asset?: { _ref?: string } } } | undefined)?.image?.asset?._ref,
            );
            if (hasImage && !value) {
              return "Add alt text for published accessibility.";
            }

            return true;
          })
          .warning(),
    }),
    defineField({
      name: "title",
      title: "Title",
      description: "Optional short title used in captions and Studio lists.",
      type: "string",
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      description: "Optional caption shown under featured photos.",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(220),
    }),
    defineField({
      name: "location",
      title: "Location",
      description: "Optional place where the photo was taken.",
      type: "string",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "dateTaken",
      title: "Date Taken",
      description: "Optional capture date.",
      type: "date",
      options: {
        dateFormat: "YYYY-MM-DD",
      },
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      description: "Optional gallery this photo belongs to.",
      type: "reference",
      weak: true,
      to: [{ type: "gallery" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      altText: "altText",
      location: "location",
      dateTaken: "dateTaken",
      galleryTitle: "gallery.title",
      media: "image",
    },
    prepare(selection) {
      const previewTitle = selection.title || selection.altText || "Untitled photo";
      const subtitleParts = [selection.location, selection.dateTaken, selection.galleryTitle].filter(Boolean);

      return {
        title: previewTitle,
        subtitle: subtitleParts.length ? subtitleParts.join(" | ") : "Photo",
        media: selection.media,
      };
    },
  },
});
