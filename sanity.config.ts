import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schema } from "@/lib/sanity/schemas";
import { bulkPhotoImportTool } from "@/lib/sanity/tools/bulk-photo-import";
import { bulkPhotoDeleteTool } from "@/lib/sanity/tools/bulk-photo-delete";
import { galleryManagerTool } from "@/lib/sanity/tools/gallery-manager";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "";

export default defineConfig({
  name: "default",
  title: "Photography Portfolio CMS",
  projectId,
  dataset,
  plugins: [structureTool(), galleryManagerTool(), bulkPhotoImportTool(), bulkPhotoDeleteTool(), visionTool()],
  schema,
});
