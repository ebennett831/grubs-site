import { type SchemaTypeDefinition } from "sanity";

import { aboutPageSettingsSchema } from "@/lib/sanity/schemas/about-page-settings";
import { gallerySchema } from "@/lib/sanity/schemas/gallery";
import { gallerySettingsSchema } from "@/lib/sanity/schemas/gallery-settings";
import { homePageSettingsSchema } from "@/lib/sanity/schemas/home-page-settings";
import { photographerSchema } from "@/lib/sanity/schemas/photographer";
import { photoSchema } from "@/lib/sanity/schemas/photo";
import { siteSettingsSchema } from "@/lib/sanity/schemas/site-settings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    siteSettingsSchema,
    gallerySettingsSchema,
    homePageSettingsSchema,
    aboutPageSettingsSchema,
    photographerSchema,
    gallerySchema,
    photoSchema,
  ],
};
