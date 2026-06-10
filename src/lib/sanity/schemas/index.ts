import { type SchemaTypeDefinition } from "sanity";

import { gallerySchema } from "@/lib/sanity/schemas/gallery";
import { photographerSchema } from "@/lib/sanity/schemas/photographer";
import { photoSchema } from "@/lib/sanity/schemas/photo";
import { siteSettingsSchema } from "@/lib/sanity/schemas/site-settings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [photographerSchema, gallerySchema, photoSchema, siteSettingsSchema],
};
