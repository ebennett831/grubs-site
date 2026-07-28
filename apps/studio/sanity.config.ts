import { colorInput } from "@sanity/color-input";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { buildDeskStructure } from "./src/sanity/desk-structure";
import { schema } from "./src/sanity/schemas";
import {
  isCanonicalSingletonDocument,
  singletonSchemaTypes,
} from "./src/sanity/singletons";
import { bulkPhotoDeleteTool } from "./src/sanity/tools/bulk-photo-delete";
import { bulkPhotoImportTool } from "./src/sanity/tools/bulk-photo-import";
import { galleryManagerTool } from "./src/sanity/tools/gallery-manager";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  "";
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "";
export default defineConfig({
  name: "default",
  title: "Photography Portfolio CMS",
  projectId,
  dataset,
  plugins: [
    colorInput(),
    structureTool({
      name: "structure",
      title: "Structure",
      structure: buildDeskStructure,
    }),
    galleryManagerTool(),
    bulkPhotoImportTool(),
    bulkPhotoDeleteTool(),
  ],
  schema,
  document: {
    newDocumentOptions: (previous, { creationContext }) => {
      if (creationContext.type !== "global") {
        return previous;
      }

      return previous.filter(
        (templateItem) => !singletonSchemaTypes.has(templateItem.templateId),
      );
    },
    actions: (previous, context) => {
      if (
        !isCanonicalSingletonDocument(context.schemaType, context.documentId)
      ) {
        return previous;
      }

      return previous.filter(
        ({ action }) =>
          action && ["publish", "discardChanges", "restore"].includes(action),
      );
    },
  },
});
