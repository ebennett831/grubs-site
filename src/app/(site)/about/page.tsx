import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { fetchSanity } from "@/lib/sanity/fetch";
import { aboutPageSettingsQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { buildMetadata } from "@/lib/seo/metadata";
import { type AboutPageSettings, type SiteSettings } from "@/types/sanity";

export default async function AboutPage() {
  const [aboutPageSettings, siteSettings] = await Promise.all([
    fetchSanity<AboutPageSettings>(aboutPageSettingsQuery),
    fetchSanity<SiteSettings>(siteSettingsQuery),
  ]);

  const portraitUrl = aboutPageSettings?.portraitImage
    ? urlFor(aboutPageSettings.portraitImage).width(1400).height(1700).fit("crop").auto("format").url()
    : null;

  return (
    <section className="py-14 sm:py-18 lg:py-24">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div className="relative aspect-[4/5] overflow-hidden bg-charcoal/10 lg:order-first">
          {portraitUrl ? (
            <Image
              src={portraitUrl}
              alt={aboutPageSettings?.pageTitle ?? "About portrait"}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-charcoal/60">
              Portrait pending
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h1 className="font-serif-display text-5xl text-charcoal sm:text-6xl">
            {aboutPageSettings?.pageTitle ?? "About"}
          </h1>
          <p className="text-charcoal/80">{aboutPageSettings?.intro ?? "Publish custom about-page copy in Sanity."}</p>
          <p className="text-charcoal/75 max-w-2xl">{aboutPageSettings?.body ?? "Use this page for a separate story from the homepage so both can be rewritten independently."}</p>

          <div className="space-y-2 text-sm">
            <p className="text-charcoal/70">Social</p>
            <ul className="flex flex-wrap gap-3">
              {(siteSettings?.socialLinks ?? []).map((item) => (
                <li key={`${item.platform}-${item.url}`}>
                  <Link
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-charcoal/30 px-3 py-1 uppercase tracking-[0.16em] hover:border-charcoal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    {item.platform}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

export async function generateMetadata() {
  const siteSettings = await fetchSanity<SiteSettings>(siteSettingsQuery);

  return buildMetadata({
    title: "About",
    description: "Custom about page content for the photography site.",
    pathname: "/about",
    siteSettings,
  });
}