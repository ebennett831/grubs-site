import { defineField, defineType } from "sanity";

export const aboutPageSettingsSchema = defineType({
  name: "aboutPageSettings",
  title: "About Page Settings",
  type: "document",
  fields: [
    defineField({ name: "pageTitle", title: "Page Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "intro", title: "Intro", type: "text", validation: (rule) => rule.required() }),
    defineField({ name: "body", title: "Body", type: "text", validation: (rule) => rule.required() }),
    defineField({ name: "portraitImage", title: "Portrait Image", type: "image", options: { hotspot: true } }),
  ],
});