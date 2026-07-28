import { defineField, defineType } from "sanity";

import { HeroTitleSizeSlider } from "../inputs/scale-slider";

export const homePageSettingsSchema = defineType({
  name: "homePageSettings",
  title: "Home Page",
  description: "Controls the content shown on the public homepage.",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "featured", title: "Featured work" },
  ],
  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      description: "Small label above the main hero heading.",
      type: "string",
      group: "hero",
      validation: (rule) => rule.max(30).warning(),
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      description: "Main homepage heading.",
      type: "string",
      group: "hero",
      validation: (rule) => rule.max(80).warning(),
    }),
    defineField({
      name: "heroTitleSize",
      title: "Hero Title Size",
      description:
        "Controls the responsive display size of the main hero heading. Level 3 is the default.",
      type: "number",
      group: "hero",
      initialValue: 3,
      validation: (rule) => rule.min(1).max(5).warning(),
      components: {
        input: HeroTitleSizeSlider,
      },
    }),
    defineField({
      name: "heroDescription",
      title: "Hero Description",
      description: "Optional short supporting paragraph under the hero title.",
      type: "text",
      rows: 4,
      group: "hero",
      validation: (rule) => rule.max(220).warning(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      description:
        "Optional full-width image shown at the top of the homepage. Leave empty to use the charcoal hero with the site accent rule.",
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
        rule
          .custom((value, context) => {
            const hasHeroImage = Boolean(
              (
                context.document as
                  | { heroImage?: { asset?: { _ref?: string } } }
                  | undefined
              )?.heroImage?.asset?._ref,
            );
            if (hasHeroImage && !value?.trim()) {
              return "Add alt text when a hero image is set.";
            }

            return true;
          })
          .warning(),
    }),
    defineField({
      name: "ctaLabel",
      title: "Hero CTA Label",
      description: "Button/link text (for example: View photography).",
      type: "string",
      group: "hero",
      validation: (rule) => rule.max(40).warning(),
    }),
    defineField({
      name: "ctaHref",
      title: "Hero CTA Link",
      description:
        "Use an existing site path such as /photography, /galleries, /galleries/gallery-slug, or /about.",
      type: "string",
      group: "hero",
      validation: (rule) =>
        rule.custom((value) => {
          if (!value?.trim()) {
            return true;
          }

          return /^\/(?!\/)/.test(value)
            ? true
            : "Use a local path with one leading slash, such as /photography.";
        }),
    }),
    defineField({
      name: "featuredEyebrow",
      title: "Featured Eyebrow",
      description: "Small label above the featured work heading.",
      type: "string",
      group: "featured",
      validation: (rule) => rule.max(40).warning(),
    }),
    defineField({
      name: "featuredTitle",
      title: "Featured Heading",
      description: "Main heading above the featured image sequence.",
      type: "string",
      group: "featured",
      validation: (rule) => rule.max(90).warning(),
    }),
    defineField({
      name: "featuredDescription",
      title: "Featured Description",
      description: "Optional short introduction to the featured photographs.",
      type: "text",
      rows: 3,
      group: "featured",
      validation: (rule) => rule.max(220).warning(),
    }),
    defineField({
      name: "featuredPhotos",
      title: "Featured Photos",
      description:
        "Choose and order 4-6 photographs for the strongest pacing. Up to 8 are supported; later images appear in a more compact closing grid.",
      type: "array",
      group: "featured",
      of: [
        {
          type: "reference",
          weak: true,
          to: [{ type: "photo" }],
          options: {
            disableNew: true,
          },
        },
      ],
      validation: (rule) => [
        rule
          .max(8)
          .warning("Up to 8 photos are recommended for homepage pacing."),
        rule.unique().warning("Repeated photos are usually unintentional."),
      ],
    }),
  ],
  preview: {
    select: {
      heroTitle: "heroTitle",
      heroImage: "heroImage",
      featuredPhotos: "featuredPhotos",
    },
    prepare(selection) {
      const featuredCount = Array.isArray(selection.featuredPhotos)
        ? selection.featuredPhotos.filter(Boolean).length
        : 0;
      const title =
        typeof selection.heroTitle === "string" && selection.heroTitle.trim()
          ? selection.heroTitle.trim()
          : "Home Page Settings";

      return {
        title,
        subtitle: `${featuredCount} featured photo${featuredCount === 1 ? "" : "s"}`,
        media: selection.heroImage,
      };
    },
  },
});
