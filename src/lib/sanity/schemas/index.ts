import { type SchemaTypeDefinition } from "sanity";

import { aboutPageSettingsSchema } from "@/lib/sanity/schemas/about-page-settings";
import { homePageSettingsSchema } from "@/lib/sanity/schemas/home-page-settings";
import { photographerSchema } from "@/lib/sanity/schemas/photographer";
import { photoSchema } from "@/lib/sanity/schemas/photo";
import { siteSettingsSchema } from "@/lib/sanity/schemas/site-settings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettingsSchema, homePageSettingsSchema, aboutPageSettingsSchema, photographerSchema, photoSchema],
};
