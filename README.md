# Photography Portfolio Monorepo

This repository is split into two independently deployable apps:

- `apps/website`: public Next.js portfolio deployed to Cloudflare Workers (OpenNext)
- `apps/studio`: Sanity Studio deployed to Sanity Hosting

Both apps point to the same Sanity project and dataset.

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
npm install
npm run dev:website
npm run dev:studio
npm run build
npm run lint
```

## Environment Variables

### Website (`apps/website/.env`)

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-02-01
SANITY_API_READ_TOKEN=
```

### Studio (`apps/studio/.env`)

```bash
SANITY_STUDIO_PROJECT_ID=
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_API_VERSION=2025-02-01
```

Use the same project ID and dataset in both apps.

## Website Deployment (Cloudflare Workers)

Website app path: `apps/website`

Local build/deploy:

```bash
npm run build:website
npm run deploy:website
```

Direct commands:

```bash
cd apps/website
npx @opennextjs/cloudflare build
npx @opennextjs/cloudflare deploy
```

Cloudflare Workers Builds settings:

- Root directory: `apps/website`
- Build command: `npx @opennextjs/cloudflare build`
- Deploy command: `npx @opennextjs/cloudflare deploy`

Only the website app is built and deployed to Cloudflare.

## Studio Deployment (Sanity Hosting)

Studio app path: `apps/studio`

```bash
cd apps/studio
npm run dev
npm run deploy
```

This deploys Studio independently and can later be mapped to a custom domain like `studio.example.com`.

## Content Editing Guide

For a non-technical walkthrough of day-to-day content updates, see:

- `apps/studio/EDITOR_GUIDE.md`
