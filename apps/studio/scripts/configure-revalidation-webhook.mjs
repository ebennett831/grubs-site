import { getCliClient } from "sanity/cli";

const webhookName =
  process.env.SANITY_WEBHOOK_NAME ?? "Published website cache revalidation";
const webhookUrl = process.env.SANITY_REVALIDATION_URL;
const webhookSecret = process.env.SANITY_REVALIDATE_SECRET;

if (!webhookUrl) {
  throw new Error(
    "SANITY_REVALIDATION_URL is required and must point to /api/revalidate.",
  );
}

if (!webhookSecret) {
  throw new Error("SANITY_REVALIDATE_SECRET is required.");
}

const parsedUrl = new URL(webhookUrl);

if (
  parsedUrl.protocol !== "https:" ||
  parsedUrl.pathname !== "/api/revalidate"
) {
  throw new Error(
    "SANITY_REVALIDATION_URL must be an HTTPS URL ending in /api/revalidate.",
  );
}

const client = getCliClient({ apiVersion: "2025-02-19" });
const { dataset, projectId } = client.config();

if (!projectId || !dataset) {
  throw new Error("The Studio project ID and dataset must be configured.");
}

const hooksPath = `/hooks/projects/${projectId}`;
const hooks = await client.request({
  method: "GET",
  uri: hooksPath,
});
const existingHook = hooks.find((hook) => hook.name === webhookName);

if (existingHook) {
  await client.request({
    method: "DELETE",
    uri: `${hooksPath}/${existingHook.id}`,
  });
}

await client.request({
  method: "POST",
  uri: hooksPath,
  body: {
    type: "document",
    name: webhookName,
    description:
      "Invalidates the public portfolio cache when published content changes.",
    url: parsedUrl.toString(),
    dataset,
    rule: {
      on: ["create", "update", "delete"],
      filter:
        '!(_id in path("drafts.**")) && _type in ["siteSettings", "homePageSettings", "aboutPageSettings", "gallerySettings", "photo", "gallery"]',
      projection: "{_id, _type}",
    },
    apiVersion: "v2025-02-19",
    httpMethod: "POST",
    includeDrafts: false,
    includeAllVersions: false,
    headers: {
      Authorization: `Bearer ${webhookSecret}`,
    },
    secret: webhookSecret,
    isDisabledByUser: false,
  },
});

console.log(`Configured "${webhookName}" for ${parsedUrl.origin}.`);
