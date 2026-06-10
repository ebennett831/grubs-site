import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { fetchSanity } from "@/lib/sanity/fetch";
import { photographerQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { buildMetadata } from "@/lib/seo/metadata";
import { type Photographer, type SiteSettings } from "@/types/sanity";

export default async function AboutPage() {
  const [photographer, siteSettings] = await Promise.all([
    fetchSanity<Photographer>(photographerQuery),
    fetchSanity<SiteSettings>(siteSettingsQuery),
  ]);

  const portraitUrl = photographer?.profileImage
    ? urlFor(photographer.profileImage)
        .width(1400)
        .height(1700)
        .fit("crop")
        .auto("format")
        .url()
    : null;

  return (
    <section className="py-14 sm:py-18 lg:py-24">
      <Container className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div className="space-y-6">
          <h1 className="font-serif-display text-charcoal text-5xl sm:text-6xl">
            About
          </h1>
          <p className="text-charcoal/80">
            {photographer?.bio ??
              "Publish photographer biography content in Sanity."}
          </p>

          <div className="space-y-2 text-sm">
            <p className="text-charcoal/70">Social</p>
            <ul className="flex flex-wrap gap-3">
              {(
                photographer?.socialLinks ??
                siteSettings?.socialLinks ??
                []
              ).map((item) => (
                <li key={`${item.platform}-${item.url}`}>
                  <Link
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="border-charcoal/30 hover:border-charcoal focus-visible:outline-accent border px-3 py-1 tracking-[0.16em] uppercase focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    {item.platform}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-charcoal/10 relative aspect-[4/5] overflow-hidden">
          {portraitUrl ? (
            <Image
              src={portraitUrl}
              alt={photographer?.name ?? "Photographer portrait"}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          ) : (
            <div className="text-charcoal/60 flex h-full items-center justify-center text-sm">
              Portrait pending
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

export async function generateMetadata() {
  const siteSettings = await fetchSanity<SiteSettings>(siteSettingsQuery);

  return buildMetadata({
    title: "About",
    description:
      "Meet the photographer and explore background, influences, and social links.",
    pathname: "/about",
    siteSettings,
  });
}
