import { defineField, defineType } from "sanity";

export const homePageSettingsSchema = defineType({
  name: "homePageSettings",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "featured", title: "Featured work" },
    { name: "navigation", title: "Navigation" },
  ],
  initialValue: {
    heroEyebrow: "PHOTOGRAPHY",
    heroTitle: "Photographs of people, places, and passing moments.",
    heroDescription: "A refined sequence of selected photographs.",
    ctaLabel: "View photography",
    ctaHref: "/photography",
    featuredEyebrow: "Featured work",
    featuredTitle: "Selected photographs",
    featuredDescription: "A collection of recent portraits, landscapes, and observations.",
    galleriesLinkLabel: "Galleries",
    galleriesLinkDescription: "View grouped bodies of work",
    photographyLinkLabel: "Photography",
    photographyLinkDescription: "Browse individual photographs",
    aboutLinkLabel: "About",
    aboutLinkDescription: "Learn about the photographer",
  },
  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      description: "Small label above the main hero heading.",
      type: "string",
      group: "hero",
      validation: (rule) => rule.max(30),
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      description: "Main homepage heading.",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "heroDescription",
      title: "Hero Description",
      description: "Optional short supporting paragraph under the hero title.",
      type: "text",
      rows: 4,
      group: "hero",
      validation: (rule) => rule.max(220),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      description: "Main full-width image shown at the top of the homepage.",
      type: "image",
      group: "hero",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroImageAlt",
      title: "Hero Image Alt Text",
      description: "Describe the photograph for screen readers.",
      type: "string",
      group: "hero",
      validation: (rule) =>
        rule.custom((value, context) => {
          const hasHeroImage = Boolean((context.document as { heroImage?: { asset?: { _ref?: string } } } | undefined)?.heroImage?.asset?._ref);
          if (hasHeroImage && !value) {
            return "Add alt text when a hero image is set.";
          }

          return true;
        }),
    }),
    defineField({
      name: "ctaLabel",
      title: "Hero CTA Label",
      description: "Button/link text (for example: View photography).",
      type: "string",
      group: "hero",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "ctaHref",
      title: "Hero CTA Link",
      description: "Use internal paths such as /photography, /galleries, or /about.",
      type: "string",
      group: "hero",
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) {
            return true;
          }

          return value.startsWith("/") ? true : "Use a path that starts with /.";
        }),
    }),
    defineField({
      name: "featuredEyebrow",
      title: "Featured Eyebrow",
      description: "Small label above the featured work heading.",
      type: "string",
      group: "featured",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "featuredTitle",
      title: "Featured Heading",
      description: "Main heading above the featured image sequence.",
      type: "string",
      group: "featured",
      validation: (rule) => rule.max(90),
    }),
    defineField({
      name: "featuredDescription",
      title: "Featured Description",
      description: "Optional short introduction to the featured photographs.",
      type: "text",
      rows: 3,
      group: "featured",
      validation: (rule) => rule.max(220),
    }),
    defineField({
      name: "featuredPhotos",
      title: "Featured Photos",
      description: "Choose and order the photographs shown on the homepage.",
      type: "array",
      group: "featured",
      of: [
        {
          type: "reference",
          to: [{ type: "photo" }],
          options: {
            disableNew: true,
          },
        },
      ],
      validation: (rule) => rule.max(8).unique(),
    }),
    defineField({
      name: "galleriesLinkLabel",
      title: "Galleries Label",
      type: "string",
      group: "navigation",
      validation: (rule) => rule.max(30),
    }),
    defineField({
      name: "galleriesLinkDescription",
      title: "Galleries Description",
      type: "string",
      group: "navigation",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "photographyLinkLabel",
      title: "Photography Label",
      type: "string",
      group: "navigation",
      validation: (rule) => rule.max(30),
    }),
    defineField({
      name: "photographyLinkDescription",
      title: "Photography Description",
      type: "string",
      group: "navigation",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "aboutLinkLabel",
      title: "About Label",
      type: "string",
      group: "navigation",
      validation: (rule) => rule.max(30),
    }),
    defineField({
      name: "aboutLinkDescription",
      title: "About Description",
      type: "string",
      group: "navigation",
      validation: (rule) => rule.max(120),
    }),
  ],
  preview: {
    select: {
      heroTitle: "heroTitle",
      heroImage: "heroImage",
      featuredPhotos: "featuredPhotos",
    },
    prepare(selection) {
      const featuredCount = Array.isArray(selection.featuredPhotos) ? selection.featuredPhotos.length : 0;

      return {
        title: selection.heroTitle || "Home Page Settings",
        subtitle: `${featuredCount} featured photo${featuredCount === 1 ? "" : "s"}`,
        media: selection.heroImage,
      };
    },
  },
});