import Image from "next/image";
import Link from "next/link";

import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { Container } from "@/components/ui/container";
import { fetchSanity } from "@/lib/sanity/fetch";
import { urlFor } from "@/lib/sanity/image";
import { allPhotosQuery, homePageSettingsQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildOrganizationSchema, buildWebsiteSchema } from "@/lib/seo/structured-data";
import { type HomePageSettings, type Photo, type SiteSettings } from "@/types/sanity";

type FeaturedWidthVariant = "wide" | "medium" | "narrow";

const FEATURED_VARIANTS: FeaturedWidthVariant[] = ["wide", "medium", "wide", "narrow", "wide", "medium"];

function getFeaturedWrapperClass(index: number) {
  const variant = FEATURED_VARIANTS[index % FEATURED_VARIANTS.length];

  if (variant === "medium") {
    return index % 2 === 0 ? "lg:ml-auto lg:w-[70%]" : "lg:mr-auto lg:w-[70%]";
  }

  if (variant === "narrow") {
    return index % 2 === 0 ? "lg:mr-auto lg:w-[52%]" : "lg:ml-auto lg:w-[52%]";
  }

  return "w-full";
}

function getFeaturedRequestWidth(index: number) {
  const variant = FEATURED_VARIANTS[index % FEATURED_VARIANTS.length];

  if (variant === "narrow") {
    return 1400;
  }

  if (variant === "medium") {
    return 1600;
  }

  return 2000;
}

function getFeaturedSizes(index: number) {
  const variant = FEATURED_VARIANTS[index % FEATURED_VARIANTS.length];

  if (variant === "narrow") {
    return "(max-width: 1024px) calc(100vw - 2.5rem), 52vw";
  }

  if (variant === "medium") {
    return "(max-width: 1024px) calc(100vw - 2.5rem), 70vw";
  }

  return "(max-width: 1024px) calc(100vw - 2.5rem), 92vw";
}

function getCaptionParts(photo: Photo) {
  return [photo.title, photo.location, photo.dateTaken].filter(Boolean);
}

export default async function HomePage() {
  const [siteSettings, homePageSettings, allPhotos] = await Promise.all([
    fetchSanity<SiteSettings>(siteSettingsQuery),
    fetchSanity<HomePageSettings>(homePageSettingsQuery),
    fetchSanity<Photo[]>(allPhotosQuery),
  ]);

  const curatedPhotos = homePageSettings?.featuredPhotos ?? [];
  const fallbackPhotos = allPhotos?.slice(0, 6) ?? [];
  const featuredPhotos = curatedPhotos.length ? curatedPhotos.slice(0, 8) : fallbackPhotos;

  const heroImage = homePageSettings?.heroImage;
  const hasHeroImage = Boolean(heroImage?.asset?._ref);
  const heroImageWidth = heroImage?.dimensions?.width ?? 2400;
  const heroImageHeight = heroImage?.dimensions?.height ?? 1600;
  const heroImageUrl = hasHeroImage
    ? urlFor(heroImage!).width(2400).fit("max").quality(84).auto("format").url()
    : null;
  const heroAlt = homePageSettings?.heroImageAlt?.trim() || "Photograph featured on the homepage";

  const organizationSchema = buildOrganizationSchema(siteSettings, null);
  const websiteSchema = buildWebsiteSchema(siteSettings);

  return (
    <>
      <section className="relative isolate min-h-[32rem] h-[80svh] md:h-[90svh]">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={heroAlt}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            width={heroImageWidth}
            height={heroImageHeight}
            placeholder={heroImage?.lqip ? "blur" : "empty"}
            blurDataURL={heroImage?.lqip}
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-charcoal" aria-hidden="true" />
        )}

        <div
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(24,21,19,0.68)_0%,rgba(24,21,19,0.22)_36%,rgba(24,21,19,0.04)_62%,rgba(24,21,19,0.24)_100%)]"
          aria-hidden="true"
        />

        <Container className="relative flex h-full items-end pb-12 sm:pb-16">
          <div className="max-w-2xl space-y-4 text-white sm:space-y-5">
            <p className="text-xs tracking-[0.28em] uppercase text-white/85">
              {homePageSettings?.heroEyebrow ?? "PHOTOGRAPHY"}
            </p>
            <h1 className="font-serif-display text-4xl leading-[0.95] sm:text-6xl lg:text-7xl">
              {homePageSettings?.heroTitle ?? "Photographs of people, places, and passing moments."}
            </h1>
            {homePageSettings?.heroDescription ? (
              <p className="max-w-xl text-sm leading-7 text-white/88 sm:text-base">
                {homePageSettings.heroDescription}
              </p>
            ) : null}
            <Link
              href={homePageSettings?.ctaHref || "/photography"}
              className="inline-flex items-center gap-2 border-b border-white/80 pb-1 text-sm tracking-[0.12em] uppercase text-white transition-colors hover:text-white/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {homePageSettings?.ctaLabel ?? "View photography"}
              <span aria-hidden="true">{"->"}</span>
            </Link>
          </div>
        </Container>
      </section>

      {featuredPhotos.length ? (
        <section className="py-14 sm:py-18 lg:py-24">
          <Container className="max-w-none">
            <div className="mx-auto max-w-3xl space-y-4 pb-14 sm:pb-18">
              <p className="text-charcoal/70 text-xs tracking-[0.24em] uppercase">
                {homePageSettings?.featuredEyebrow ?? "Featured work"}
              </p>
              <h2 className="font-serif-display text-charcoal text-4xl leading-tight sm:text-5xl">
                {homePageSettings?.featuredTitle ?? "Selected photographs"}
              </h2>
              {homePageSettings?.featuredDescription ? (
                <p className="text-charcoal/75 max-w-2xl text-sm leading-7 sm:text-base">
                  {homePageSettings.featuredDescription}
                </p>
              ) : null}
            </div>

            <div className="space-y-12 sm:space-y-14 lg:space-y-18">
              {featuredPhotos.map((photo, index) => {
                const image = photo.image;
                const hasImage = Boolean(image?.asset?._ref);
                if (!hasImage) {
                  return null;
                }

                const requestWidth = getFeaturedRequestWidth(index);
                const width = image?.dimensions?.width ?? requestWidth;
                const height = image?.dimensions?.height ?? Math.round((requestWidth * 3) / 2);
                const captionParts = getCaptionParts(photo);
                const imageUrl = urlFor(image!)
                  .width(requestWidth)
                  .fit("max")
                  .quality(82)
                  .auto("format")
                  .url();

                return (
                  <RevealOnScroll key={photo._id} delay={index * 0.06}>
                    <figure className={`w-full px-1 sm:px-2 ${getFeaturedWrapperClass(index)}`}>
                      <Image
                        src={imageUrl}
                        alt={photo.altText}
                        width={width}
                        height={height}
                        sizes={getFeaturedSizes(index)}
                        placeholder={image?.lqip ? "blur" : "empty"}
                        blurDataURL={image?.lqip}
                        className="h-auto w-full"
                      />
                      {(photo.caption || captionParts.length) ? (
                        <figcaption className="text-charcoal/62 mt-3 space-y-1 text-xs leading-6 sm:text-sm">
                          {photo.caption ? <p>{photo.caption}</p> : null}
                          {captionParts.length ? <p>{captionParts.join(" | ")}</p> : null}
                        </figcaption>
                      ) : null}
                    </figure>
                  </RevealOnScroll>
                );
              })}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="border-t border-black/15 py-16 sm:py-20">
        <Container className="max-w-none">
          <div className="mb-8 space-y-2">
            <p className="text-charcoal/65 text-xs tracking-[0.24em] uppercase">Explore</p>
          </div>

          <div className="grid gap-0">
            <Link
              href="/galleries"
              className="group grid grid-cols-[1fr_auto] items-center gap-6 border-b border-black/10 py-6 transition-colors hover:bg-black/[0.025] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
            >
              <div className="space-y-1">
                <p className="font-serif-display text-3xl leading-none sm:text-4xl">
                  {homePageSettings?.galleriesLinkLabel || "Galleries"}
                </p>
                <p className="text-charcoal/68 text-sm sm:text-base">
                  {homePageSettings?.galleriesLinkDescription || "View grouped bodies of work"}
                </p>
              </div>
              <span className="text-2xl transition-transform duration-300 ease-out group-hover:translate-x-1.5" aria-hidden="true">
                {"->"}
              </span>
            </Link>

            <Link
              href="/photography"
              className="group grid grid-cols-[1fr_auto] items-center gap-6 border-b border-black/10 py-6 transition-colors hover:bg-black/[0.025] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
            >
              <div className="space-y-1">
                <p className="font-serif-display text-3xl leading-none sm:text-4xl">
                  {homePageSettings?.photographyLinkLabel || "Photography"}
                </p>
                <p className="text-charcoal/68 text-sm sm:text-base">
                  {homePageSettings?.photographyLinkDescription || "Browse individual photographs"}
                </p>
              </div>
              <span className="text-2xl transition-transform duration-300 ease-out group-hover:translate-x-1.5" aria-hidden="true">
                {"->"}
              </span>
            </Link>

            <Link
              href="/about"
              className="group grid grid-cols-[1fr_auto] items-center gap-6 py-6 transition-colors hover:bg-black/[0.025] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
            >
              <div className="space-y-1">
                <p className="font-serif-display text-3xl leading-none sm:text-4xl">
                  {homePageSettings?.aboutLinkLabel || "About"}
                </p>
                <p className="text-charcoal/68 text-sm sm:text-base">
                  {homePageSettings?.aboutLinkDescription || "Learn about the photographer"}
                </p>
              </div>
              <span className="text-2xl transition-transform duration-300 ease-out group-hover:translate-x-1.5" aria-hidden="true">
                {"->"}
              </span>
            </Link>
          </div>
        </Container>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}

export async function generateMetadata() {
  const siteSettings = await fetchSanity<SiteSettings>(siteSettingsQuery);

  return buildMetadata({
    siteSettings,
    pathname: "/",
  });
}