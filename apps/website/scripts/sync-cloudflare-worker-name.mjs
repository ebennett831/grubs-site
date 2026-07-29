import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const configFlagIndex = process.argv.indexOf("--config");
const configPath = resolve(
  configFlagIndex >= 0 && process.argv[configFlagIndex + 1]
    ? process.argv[configFlagIndex + 1]
    : "wrangler.jsonc",
);
const workerName = (
  process.env.WRANGLER_CI_OVERRIDE_NAME ??
  process.env.CLOUDFLARE_WORKER_NAME ??
  ""
).trim();

if (!workerName) {
  console.log(
    "No Cloudflare CI Worker name detected; keeping the Wrangler defaults.",
  );
  process.exit(0);
}

const source = await readFile(configPath, "utf8");
const serializedName = JSON.stringify(workerName);
const namePattern = /^(\s*"name"\s*:\s*)"[^"]*"/m;
const selfReferencePattern =
  /("binding"\s*:\s*"WORKER_SELF_REFERENCE"\s*,\s*\r?\n\s*"service"\s*:\s*)"[^"]*"/;

if (!namePattern.test(source)) {
  throw new Error(`Could not find the Worker name in ${configPath}.`);
}

if (!selfReferencePattern.test(source)) {
  throw new Error(
    `Could not find the WORKER_SELF_REFERENCE service in ${configPath}.`,
  );
}

const updated = source
  .replace(namePattern, (_match, prefix) => `${prefix}${serializedName}`)
  .replace(
    selfReferencePattern,
    (_match, prefix) => `${prefix}${serializedName}`,
  );

if (updated !== source) {
  await writeFile(configPath, updated, "utf8");
}

console.log(`Configured Wrangler for Cloudflare Worker "${workerName}".`);
