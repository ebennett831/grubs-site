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

1. Set all environment variables in your deployment platform.
2. Build command: `npm run build`
3. Start command: `npm run start`
4. Ensure Node runtime supports Next.js 15 requirements.
5. Validate that security headers from `next.config.ts` are preserved by edge/CDN config.
6. Set `NEXT_PUBLIC_SITE_URL` to the production domain for canonical URLs, sitemap, and OG metadata.

## Notes

- Content is sourced from Sanity queries; no portfolio data is hardcoded.
- Contact form is server-validated with Zod and includes honeypot spam protection architecture.
- Routing and components are structured for future private galleries, print store, blog, booking, newsletter, and analytics extensions.
