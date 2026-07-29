# Photography Portfolio Monorepo

This repository is split into two independently deployable apps:

- `apps/website`: public Next.js portfolio deployed to Cloudflare Workers (OpenNext)
- `apps/studio`: Sanity Studio deployed to Sanity Hosting

Both apps point to the same Sanity project and dataset.

## One-click Website Deployment

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ebennett831/grubs-site/tree/master/apps/website)

This is the easiest handoff for a new Cloudflare account. The link starts from
the public repository and provisions the R2 cache bucket and Durable Object
declared by the website. Account-specific custom domains are intentionally not
committed.

See [`apps/website/README.md`](apps/website/README.md) for the short deployment
walkthrough and custom-domain follow-up.

Cloudflare setup rules:

- Set the **Path** field to `/apps/website`.
- The Worker project name can be any valid name; the build synchronizes the
  OpenNext self-service binding automatically.

## Repository Structure

```txt
apps/
	website/
		src/
		public/
		next.config.ts
		open-next.config.ts
		wrangler.jsonc
		package.json
	studio/
		src/sanity/
		sanity.config.ts
		sanity.cli.ts
		package.json
package.json
```

## Workspace Commands

From repo root:

```bash
npm ci
npm run dev:website
npm run dev:studio
npm run build
npm run lint
```

## Environment Variables

Copy the committed `.env.example` in each app to an ignored `.env` for local
development. Never put secrets in a `NEXT_PUBLIC_*` or `SANITY_STUDIO_*`
variable.

### Website (`apps/website/.env`)

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-02-01
SANITY_API_READ_TOKEN=
```

`SANITY_API_READ_TOKEN` is not needed for the current public dataset and should
remain blank. If the dataset is made private later, configure it only as a
Cloudflare Worker runtime secret. Do not place secrets in `.env` when creating
an OpenNext production artifact because build-time environment values are
compiled into that artifact.

### Studio (`apps/studio/.env`)

```bash
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_API_VERSION=2025-02-01
SANITY_STUDIO_HOSTNAME=your-studio-hostname
```

Use the same project ID and dataset in both apps.

## Website Deployment (Cloudflare Workers)

Website app path: `apps/website`

This app uses Next.js with `@opennextjs/cloudflare` on Cloudflare Workers. It is
not a Pages static-output deployment. Use Node.js 22 for builds.

For a manual first deployment, authenticate Wrangler and create the configured
R2 incremental-cache bucket:

```bash
npx wrangler login
npx wrangler r2 bucket create grubs-site-opennext-cache
```

Configure these public values in the Cloudflare build environment and as Worker
runtime variables:

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SANITY_API_VERSION
```

`NEXT_PUBLIC_SITE_URL` must be the final HTTPS site origin when the production
artifact is built. Do not configure `SANITY_API_READ_TOKEN` for the current
public dataset.

Validate without deploying:

```bash
npm ci
npm run build:website
cd apps/website
npx opennextjs-cloudflare build
```

Deploy manually only when ready:

```bash
cd apps/website
npx opennextjs-cloudflare deploy -- --keep-vars
```

For Git-connected Cloudflare Workers Builds:

- Production branch: `master`
- Root directory: `apps/website`
- Build command: `npx opennextjs-cloudflare build`
- Deploy command: `npx opennextjs-cloudflare deploy -- --keep-vars`
- Node version: `22`
- Output directory: none

Only the website app is built and deployed to Cloudflare.

## Studio Deployment (Sanity Hosting)

Studio app path: `apps/studio`

```bash
cd apps/studio
npx sanity login
npm run build
npm run deploy -- --schema-required
```

The first deployment prompts for the Sanity-hosted Studio name. Afterward,
verify that the exact `https://<host>.sanity.studio` origin appears in the
project CORS list with credentials enabled. Keep `http://localhost:3333` with
credentials for local Studio development. The public website performs Sanity
queries server-side, so its origin does not currently require Sanity CORS.
Avoid wildcard CORS origins.

This deploys Studio independently and can later be mapped to a custom domain
such as `studio.example.com`.

## Content Editing Guide

For a non-technical walkthrough of day-to-day content updates, see:

- `apps/studio/EDITOR_GUIDE.md`
