import { defineField, defineType } from "sanity";

export const photographerSchema = defineType({
  name: "photographer",
  title: "Photographer",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Display Name",
      description: "Name shown on profile and structured data.",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "bio",
      title: "Biography",
      description: "Main photographer biography text.",
      type: "text",
      rows: 8,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "profileImage",
      title: "Profile Image",
      description: "Optional profile image used on the About page.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      description: "Optional social profiles.",
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
    defineField({
      name: "email",
      title: "Email",
      description: "Public contact email address.",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "profileImage",
    },
  },
});
