import { type SchemaTypeDefinition } from "sanity";

import { aboutPageSettingsSchema } from "./about-page-settings";
import { gallerySchema } from "./gallery";
import { gallerySettingsSchema } from "./gallery-settings";
import { homePageSettingsSchema } from "./home-page-settings";
import { photographerSchema } from "./photographer";
import { photoSchema } from "./photo";
import { siteSettingsSchema } from "./site-settings";

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
