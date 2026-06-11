import {defineField, defineType} from "sanity";

export const gallerySchema = defineType({
  name: "gallery",
  title: "Galleries",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "coverPhoto",
      title: "Cover Photo",
      type: "reference",
      weak: true,
      to: [{type: "photo"}],
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      hidden: () => true,
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
      subtitle: "sortOrder",
    },
    prepare(selection) {
      return {
        title: selection.title,
        subtitle: typeof selection.subtitle === "number" ? `Order ${selection.subtitle}` : "Gallery",
      };
    },
  },
});