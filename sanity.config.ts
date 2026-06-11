import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schema } from "@/lib/sanity/schemas";
import { bulkPhotoImportTool } from "@/lib/sanity/tools/bulk-photo-import";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "";

export default defineConfig({
  name: "default",
  title: "Photography Portfolio CMS",
  projectId,
  dataset,
  plugins: [structureTool(), bulkPhotoImportTool(), visionTool()],
  schema,
});
