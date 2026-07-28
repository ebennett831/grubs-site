import { defineField, defineType } from "sanity";

export const photographerSchema = defineType({
  name: "photographer",
  title: "Photographer Profile",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "legacy", title: "Legacy" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Display Name",
      description: "Name shown on profile and structured data.",
      type: "string",
      group: "identity",
      validation: (rule) => rule.max(80).warning(),
    }),
    defineField({
      name: "bio",
      title: "Biography",
      description: "Main photographer biography text.",
      type: "text",
      rows: 8,
      group: "identity",
    }),
    defineField({
      name: "profileImage",
      title: "Profile Image",
      description: "Optional profile image used on the About page.",
      type: "image",
      group: "identity",
      options: { hotspot: true },
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links (Legacy)",
      description: "Deprecated. Use Site Settings -> Social Links instead.",
      type: "array",
      group: "legacy",
      hidden: true,
      of: [{ type: "socialLink" }],
    }),
    defineField({
      name: "email",
      title: "Email (Legacy)",
      description: "Deprecated. Use Site Settings -> Contact Email instead.",
      type: "string",
      group: "legacy",
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "profileImage",
    },
    prepare(selection) {
      return {
        title:
          typeof selection.title === "string" && selection.title.trim()
            ? selection.title
            : "Photographer Profile",
        media: selection.media,
      };
    },
  },
});
