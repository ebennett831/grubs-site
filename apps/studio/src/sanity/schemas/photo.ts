import { defineField, defineType } from "sanity";

export const photoSchema = defineType({
  name: "photo",
  title: "Photo",
  description:
    "A photograph that can appear in the main photography grid, a gallery, or featured homepage work.",
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
              (
                context.document as
                  | { image?: { asset?: { _ref?: string } } }
                  | undefined
              )?.image?.asset?._ref,
            );
            if (hasImage && !value?.trim()) {
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
      validation: (rule) => rule.max(100).warning(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      description: "Optional caption shown under featured photos.",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(220).warning(),
    }),
    defineField({
      name: "location",
      title: "Location",
      description: "Optional place where the photo was taken.",
      type: "string",
      validation: (rule) => rule.max(80).warning(),
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
      const title =
        typeof selection.title === "string" && selection.title.trim()
          ? selection.title.trim()
          : null;
      const altText =
        typeof selection.altText === "string" && selection.altText.trim()
          ? selection.altText.trim()
          : null;
      const previewTitle = title || altText || "Untitled photo";
      const subtitleParts = [
        selection.location,
        selection.dateTaken,
        selection.galleryTitle,
      ].filter(
        (value): value is string =>
          typeof value === "string" && value.trim().length > 0,
      );

      return {
        title: previewTitle,
        subtitle: subtitleParts.length ? subtitleParts.join(" | ") : "Photo",
        media: selection.media,
      };
    },
  },
});
