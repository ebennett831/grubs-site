# Photography Portfolio Website

This folder is a self-contained Next.js portfolio configured for Cloudflare
Workers with OpenNext. It reads published content from Sanity and uses an R2
bucket for the Next.js incremental cache.

## One-click Cloudflare deployment

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ebennett831/grubs-site/tree/master/apps/website)

The button deliberately points to `apps/website`. In Cloudflare's current setup
screen, set **Path** to `/apps/website`. Use the same path when importing this
monorepo through Cloudflare's normal Git setup.

During setup:

1. Sign in to Cloudflare and connect a GitHub account.
2. Choose the Cloudflare account that will own the site.
3. Choose any valid Worker project name.
4. Set the build command to `npx opennextjs-cloudflare build`.
5. Set the deploy command to
   `npx opennextjs-cloudflare deploy -- --keep-vars`.
6. Confirm the supplied Sanity project, dataset, and API version.
7. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS site URL.
8. Deploy.

Cloudflare reads `wrangler.jsonc` and creates the R2 incremental-cache bucket
and Durable Object binding during setup. The configuration intentionally has no
custom-domain route, so it works in accounts that do not own
`bennettethan.com`.

Before every build, `scripts/sync-cloudflare-worker-name.mjs` reads the Worker
name selected by Cloudflare CI and updates both the Wrangler Worker name and its
self-service binding. First-time deployments therefore work with any valid
project name instead of requiring `grubs-site`.

If the final URL is not known yet, deploy to the generated `workers.dev` URL,
then update `NEXT_PUBLIC_SITE_URL` in the Worker's variables and trigger one
more deployment. This value controls canonical URLs, the sitemap, and social
metadata.

To add a domain later, open the Worker in Cloudflare and use
**Settings → Domains & Routes → Add Custom Domain**. Cloudflare manages its DNS
record and TLS certificate. The domain must already be in the deploying
Cloudflare account.

## Sanity access

The included Sanity identifiers are public configuration, not credentials. The
website reads published content from the public dataset and does not require a
Sanity token.

Editing access is separate. Invite each editor to the Sanity project instead of
sharing a password or personal token.

## Local development

Copy `.env.example` to `.env`, replace `NEXT_PUBLIC_SITE_URL` with
`http://localhost:3000`, and run:

```bash
npm install
npm run dev
```

## Manual deployment

Use Node.js 22 or newer:

```bash
npm install
npx wrangler login
npx wrangler r2 bucket create grubs-site-opennext-cache
npm run deploy
```

The manual R2 command is unnecessary when using the one-click button because
Cloudflare provisions declared resources as part of that flow.
