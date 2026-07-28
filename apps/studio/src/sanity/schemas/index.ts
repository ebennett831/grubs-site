import { type SchemaTypeDefinition } from "sanity";

import { aboutPageSettingsSchema } from "./about-page-settings";
import { gallerySettingsSchema } from "./gallery-settings";
import { gallerySchema } from "./gallery";
import { homePageSettingsSchema } from "./home-page-settings";
import { photoSchema } from "./photo";
import { socialLinkSchema } from "./social-link";
import { siteSettingsSchema } from "./site-settings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    siteSettingsSchema,
    socialLinkSchema,
    homePageSettingsSchema,
    aboutPageSettingsSchema,
    gallerySettingsSchema,
    gallerySchema,
    photoSchema,
  ],
};
