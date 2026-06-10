import { defineField, defineType } from "sanity";

export const homePageSettingsSchema = defineType({
  name: "homePageSettings",
  title: "Home Page Settings",
  type: "document",
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero Eyebrow", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "heroTitle", title: "Hero Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "heroDescription", title: "Hero Description", type: "text", validation: (rule) => rule.required() }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "sectionTitle", title: "Photography Section Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "sectionDescription", title: "Photography Section Description", type: "text", validation: (rule) => rule.required() }),
    defineField({ name: "ctaLabel", title: "CTA Label", type: "string", validation: (rule) => rule.required() }),
  ],
});