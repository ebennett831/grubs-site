import { defineField, defineType } from "sanity";

export const photoSchema = defineType({
  name: "photo",
  title: "Photo",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "altText",
      title: "Alt Text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "reference",
      to: [{ type: "gallery" }],
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "cameraData", title: "Camera Data", type: "string" }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "altText",
      subtitle: "location",
      media: "image",
    },
  },
});
