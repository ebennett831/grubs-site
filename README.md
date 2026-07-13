# Photography Portfolio

A production-ready photography portfolio built with Next.js App Router, TypeScript, Tailwind CSS v4, and Sanity CMS.

## Stack

- Next.js 15 (App Router)
- React Server Components by default
- TypeScript
- Tailwind CSS v4
- Sanity CMS + next-sanity
- Zod for server-side validation
- ESLint + Prettier

## Project Structure

```txt
src/
├─ app/
│  ├─ page.tsx
│  ├─ work/
│  ├─ about/
│  ├─ contact/
│  ├─ gallery/[slug]/
│  ├─ robots.ts
│  └─ sitemap.ts
├─ components/
│  ├─ layout/
│  ├─ gallery/
│  ├─ sections/
│  └─ ui/
├─ lib/
│  ├─ sanity/
│  ├─ seo/
│  └─ utils/
├─ types/
├─ hooks/
└─ styles/
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000

NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-02-01

SANITY_API_READ_TOKEN=
```

## Sanity Setup

1. Create a Sanity project.
2. Add environment variables.
3. Run Studio locally:

```bash
npm run sanity:studio
```

Sanity schemas included:

- Photographer
- Galleries
- Photo
- Site Settings

The Studio now has two no-code tools:

- Gallery Manager lets you create galleries, choose a cover photo, and move galleries up or down with buttons.
- Bulk Photo Import lets you pick photo files, optionally drop them into a gallery, and automatically creates photo documents using the file name as the alt text.

If you upload the same file again, it updates the same document instead of creating a duplicate.

Photography is back to a single flat wall of all photos. The Galleries tab is where the grouped gallery view lives, with cover photos, titles, optional descriptions, and recent-first ordering.

Gallery order is controlled from the Gallery Manager buttons. New galleries default to most-recent-first behavior.

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Quality Checks

```bash
npm run lint
npm run build
npm run format
```

## Deployment (Cloudflare-Compatible)

This project is configured for Cloudflare Workers using OpenNext.

1. Authenticate Wrangler:

```bash
npx wrangler login
```

2. Set required secrets and vars (production):

```bash
npx wrangler secret put SANITY_API_READ_TOKEN
npx wrangler secret put SANITY_API_WRITE_TOKEN
```

Use `wrangler.jsonc` for non-secret `vars` when needed, and set `NEXT_PUBLIC_SITE_URL` to your production domain.

3. Preview in the Workers runtime locally:

```bash
npm run preview
```

4. Deploy to Cloudflare Workers:

```bash
npm run deploy
```

5. For Cloudflare Workers Builds CI/CD:

- Build command: `npx @opennextjs/cloudflare build`
- Deploy command: `npx @opennextjs/cloudflare deploy`
- Configure both `NEXT_PUBLIC_*` and non-public environment variables in Workers Builds settings.

Notes:

- The app uses the Node.js runtime path on Workers via `@opennextjs/cloudflare`.
- `export const runtime = "edge"` is not used, which is required for this adapter.
- Security headers are still defined in `next.config.ts` and should be verified after deployment.

## Notes

- Content is sourced from Sanity queries; no portfolio data is hardcoded.
- Contact form is server-validated with Zod and includes honeypot spam protection architecture.
- Routing and components are structured for future private galleries, print store, blog, booking, newsletter, and analytics extensions.
