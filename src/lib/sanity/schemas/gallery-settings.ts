import { defineField, defineType } from "sanity";

import { GalleryDensitySlider } from "@/lib/sanity/inputs/gallery-density-slider";

export const gallerySettingsSchema = defineType({
  name: "gallerySettings",
  title: "Gallery Settings",
  type: "document",
  fields: [
    defineField({
      name: "density",
      title: "Gallery Density",
      type: "number",
      initialValue: 2,
      validation: (rule) => rule.required().min(1).max(8),
      components: {
        input: GalleryDensitySlider,
      },
    }),
  ],
});
