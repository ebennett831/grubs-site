import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schema } from "./src/sanity/schemas";
import { bulkPhotoImportTool } from "./src/sanity/tools/bulk-photo-import";
import { bulkPhotoDeleteTool } from "./src/sanity/tools/bulk-photo-delete";
import { galleryManagerTool } from "./src/sanity/tools/gallery-manager";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "";

export default defineConfig({
  name: "default",
  title: "Photography Portfolio CMS",
  projectId,
  dataset,
  plugins: [structureTool(), galleryManagerTool(), bulkPhotoImportTool(), bulkPhotoDeleteTool(), visionTool()],
  schema,
});
