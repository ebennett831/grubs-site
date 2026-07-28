import { colorInput } from "@sanity/color-input";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { buildDeskStructure } from "./src/sanity/desk-structure";
import { schema } from "./src/sanity/schemas";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  "";
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "";
const singletonTypes = [
  "homePageSettings",
  "aboutPageSettings",
  "photographer",
  "siteSettings",
];

export default defineConfig({
  name: "default",
  title: "Photography Portfolio CMS",
  projectId,
  dataset,
  plugins: [
    colorInput(),
    structureTool({
      structure: buildDeskStructure,
    }),
  ],
  schema,
  document: {
    newDocumentOptions: (previous, { creationContext }) => {
      if (creationContext.type !== "global") {
        return previous;
      }

      return previous.filter(
        (templateItem) => !singletonTypes.includes(templateItem.templateId),
      );
    },
    actions: (previous, context) => {
      if (!singletonTypes.includes(context.schemaType)) {
        return previous;
      }

      return previous.filter(
        ({ action }) =>
          action && ["publish", "discardChanges", "restore"].includes(action),
      );
    },
  },
});
