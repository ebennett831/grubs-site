import { defineField, defineType } from "sanity";

export const gallerySchema = defineType({
  name: "gallery",
  title: "Gallery",
  description:
    "A public collection shown on /galleries and at its generated gallery URL.",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: "Public name for this gallery.",
      type: "string",
      validation: (rule) =>
        rule
          .custom((value) =>
            value?.trim()
              ? true
              : "Add a title before linking this gallery publicly.",
          )
          .warning(),
    }),
    defineField({
      name: "description",
      title: "Description",
      description: "Optional short intro shown on gallery cards.",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "coverPhoto",
      title: "Cover Photo",
      description: "Optional photo used as the gallery thumbnail.",
      type: "reference",
      weak: true,
      to: [{ type: "photo" }],
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description:
        "Optional URL segment. Add one when this gallery is ready to be linked publicly.",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "sortOrder",
      title: "Order",
      type: "number",
      initialValue: () => Date.now(),
      hidden: () => true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      description: "description",
      media: "coverPhoto.image",
    },
    prepare(selection) {
      const description =
        typeof selection.description === "string" &&
        selection.description.trim()
          ? selection.description.trim()
          : "Gallery";

      return {
        title:
          typeof selection.title === "string" && selection.title.trim()
            ? selection.title
            : "Untitled gallery",
        subtitle: description,
        media: selection.media,
      };
    },
  },
});
