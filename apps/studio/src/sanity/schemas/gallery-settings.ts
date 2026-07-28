import { defineField, defineType } from "sanity";

import { GalleryDensitySlider } from "../inputs/gallery-density-slider";

export const gallerySettingsSchema = defineType({
  name: "gallerySettings",
  title: "Photo Grid Display",
  description:
    "Controls image density on /photography and inside individual galleries.",
  type: "document",
  fields: [
    defineField({
      name: "density",
      title: "Gallery Density",
      description:
        "Controls the image-column density on the Photography page and inside galleries.",
      type: "number",
      initialValue: 3,
      validation: (rule) => rule.min(1).max(8).warning(),
      components: {
        input: GalleryDensitySlider,
      },
    }),
  ],
  preview: {
    select: {
      density: "density",
    },
    prepare({ density }) {
      return {
        title: "Photo Grid Display",
        subtitle:
          typeof density === "number"
            ? `Density ${density} of 8`
            : "Using the website default",
      };
    },
  },
});
