import Image from "next/image";
import Link from "next/link";

import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { Container } from "@/components/ui/container";
import { fetchSanity } from "@/lib/sanity/fetch";
import { urlFor } from "@/lib/sanity/image";
import {
  homePageSettingsQuery,
  homepageFallbackPhotosQuery,
  siteSettingsQuery,
} from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  buildOrganizationSchema,
  buildWebsiteSchema,
} from "@/lib/seo/structured-data";
import {
  type HomePageSettings,
  type Photo,
  type SiteSettings,
} from "@/types/sanity";

type FeaturedLayout = {
  requestWidth: number;
  sizes: string;
  wrapperClassName: string;
};

const PRIMARY_FEATURED_LAYOUTS: FeaturedLayout[] = [
  {
    requestWidth: 2000,
    sizes: "(max-width: 640px) calc(100vw - 2.5rem), calc(100vw - 4rem)",
    wrapperClassName: "w-full",
  },
  {
    requestWidth: 1600,
    sizes:
      "(max-width: 640px) calc(100vw - 2.5rem), (max-width: 1024px) 72vw, 55vw",
    wrapperClassName:
      "mt-12 w-full sm:mt-16 sm:ml-auto sm:w-[72%] lg:mt-24 lg:w-[55%]",
  },
  {
    requestWidth: 1600,
    sizes:
      "(max-width: 640px) calc(100vw - 2.5rem), (max-width: 1024px) 78vw, 68vw",
    wrapperClassName: "mt-10 w-full sm:mt-12 sm:w-[78%] lg:mt-16 lg:w-[68%]",
  },
  {
    requestWidth: 2000,
    sizes:
      "(max-width: 640px) calc(100vw - 2.5rem), (max-width: 1024px) 92vw, 84vw",
    wrapperClassName:
      "mx-auto mt-14 w-full sm:mt-18 sm:w-[92%] lg:mt-22 lg:w-[84%]",
  },
];

const PORTRAIT_FEATURED_LAYOUTS: FeaturedLayout[] = [
  {
    requestWidth: 1600,
    sizes:
      "(max-width: 640px) calc(100vw - 2.5rem), (max-width: 1024px) 68vw, 56vw",
    wrapperClassName: "w-full sm:w-[68%] lg:w-[56%]",
  },
  {
    requestWidth: 1400,
    sizes:
      "(max-width: 640px) calc(100vw - 2.5rem), (max-width: 1024px) 62vw, 46vw",
    wrapperClassName:
      "mt-12 w-full sm:mt-16 sm:ml-auto sm:w-[62%] lg:mt-24 lg:w-[46%]",
  },
  {
    requestWidth: 1400,
    sizes:
      "(max-width: 640px) calc(100vw - 2.5rem), (max-width: 1024px) 62vw, 48vw",
    wrapperClassName: "mt-10 w-full sm:mt-12 sm:w-[62%] lg:mt-16 lg:w-[48%]",
  },
  {
    requestWidth: 1600,
    sizes:
      "(max-width: 640px) calc(100vw - 2.5rem), (max-width: 1024px) 64vw, 52vw",
    wrapperClassName:
      "mx-auto mt-14 w-full sm:mt-18 sm:w-[64%] lg:mt-22 lg:w-[52%]",
  },
];

function getPrimaryFeaturedLayout(photo: Photo, index: number) {
  const aspectRatio = photo.image?.dimensions?.aspectRatio;
  const isPortrait = typeof aspectRatio === "number" && aspectRatio < 0.9;

  return (isPortrait ? PORTRAIT_FEATURED_LAYOUTS : PRIMARY_FEATURED_LAYOUTS)[
    index
  ];
}

function getCaptionParts(photo: Photo) {
  return [photo.title, photo.location, photo.dateTaken].filter(Boolean);
}

function FeaturedPhoto({
  photo,
  layout,
  delay,
}: {
  photo: Photo;
  layout: FeaturedLayout;
  delay: number;
}) {
  const image = photo.image;
  const hasImage = Boolean(image?.asset?._ref);

  if (!hasImage) {
    return null;
  }

  const width = image?.dimensions?.width ?? layout.requestWidth;
  const height =
    image?.dimensions?.height ?? Math.round((layout.requestWidth * 3) / 2);
  const captionParts = getCaptionParts(photo);
  const imageUrl = urlFor(image!)
    .width(layout.requestWidth)
    .fit("max")
    .quality(82)
    .auto("format")
    .url();
  const alt =
    photo.altText?.trim() || photo.title?.trim() || "Featured photograph";

  return (
    <RevealOnScroll className={layout.wrapperClassName} delay={delay}>
      <figure className="w-full">
        <Image
          src={imageUrl}
          alt={alt}
          width={width}
          height={height}
          sizes={layout.sizes}
          placeholder={image?.lqip ? "blur" : "empty"}
          blurDataURL={image?.lqip}
          className="h-auto w-full"
        />
        {photo.caption || captionParts.length ? (
          <figcaption className="text-charcoal/62 mt-3 max-w-[64ch] space-y-1 text-xs leading-6 sm:text-sm">
            {photo.caption ? <p>{photo.caption}</p> : null}
            {captionParts.length ? <p>{captionParts.join(" | ")}</p> : null}
          </figcaption>
        ) : null}
      </figure>
    </RevealOnScroll>
  );
}

export default async function HomePage() {
  const [siteSettings, homePageSettings, fallbackPhotos] = await Promise.all([
    fetchSanity<SiteSettings>(siteSettingsQuery),
    fetchSanity<HomePageSettings>(homePageSettingsQuery),
    fetchSanity<Photo[]>(homepageFallbackPhotosQuery),
  ]);

  const curatedPhotos = (homePageSettings?.featuredPhotos ?? []).filter(
    (photo): photo is Photo => Boolean(photo?.image?.asset?._ref),
  );
  const featuredPhotos = curatedPhotos.length
    ? curatedPhotos.slice(0, 8)
    : (fallbackPhotos ?? []).filter((photo) => photo?.image?.asset?._ref);
  const primaryFeaturedPhotos = featuredPhotos.slice(0, 4);
  const closingFeaturedPhotos = featuredPhotos.slice(4);

  const heroImage = homePageSettings?.heroImage;
  const hasHeroImage = Boolean(heroImage?.asset?._ref);
  const heroImageUrl = hasHeroImage
    ? urlFor(heroImage!).width(2400).fit("max").quality(84).auto("format").url()
    : null;
  const heroAlt =
    homePageSettings?.heroImageAlt?.trim() ||
    "Photograph featured on the homepage";

  const organizationSchema = buildOrganizationSchema(siteSettings, null);
  const websiteSchema = buildWebsiteSchema(siteSettings);

  return (
    <>
      <section className="relative isolate h-[80svh] min-h-[32rem] md:h-[90svh]">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={heroAlt}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            placeholder={heroImage?.lqip ? "blur" : "empty"}
            blurDataURL={heroImage?.lqip}
            className="object-cover"
          />
        ) : (
          <div className="bg-charcoal absolute inset-0" aria-hidden="true" />
        )}

        <div
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(24,21,19,0.68)_0%,rgba(24,21,19,0.22)_36%,rgba(24,21,19,0.04)_62%,rgba(24,21,19,0.24)_100%)]"
          aria-hidden="true"
        />

        <Container className="relative flex h-full items-end pb-12 sm:pb-16">
          <div className="max-w-2xl space-y-4 text-white sm:space-y-5">
            <p className="text-xs tracking-[0.28em] text-white/85 uppercase">
              {homePageSettings?.heroEyebrow ?? "PHOTOGRAPHY"}
            </p>
            <h1 className="font-serif-display text-4xl leading-[0.95] sm:text-6xl lg:text-7xl">
              {homePageSettings?.heroTitle ??
                "Photographs of people, places, and passing moments."}
            </h1>
            {homePageSettings?.heroDescription ? (
              <p className="max-w-xl text-sm leading-7 text-white/88 sm:text-base">
                {homePageSettings.heroDescription}
              </p>
            ) : null}
            <Link
              href={homePageSettings?.ctaHref || "/photography"}
              className="inline-flex items-center gap-2 border-b border-white/80 pb-1 text-sm tracking-[0.12em] text-white uppercase transition-colors hover:text-white/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {homePageSettings?.ctaLabel ?? "View photography"}
              <span aria-hidden="true">{"->"}</span>
            </Link>
          </div>
        </Container>
      </section>

      {featuredPhotos.length ? (
        <section className="pt-14 pb-18 sm:pt-18 sm:pb-22 lg:pt-24 lg:pb-28">
          <Container className="max-w-none">
            <div className="max-w-2xl space-y-4 pb-12 sm:pb-16 lg:ml-[8%] lg:pb-20">
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

            <div>
              {primaryFeaturedPhotos.map((photo, index) => (
                <FeaturedPhoto
                  key={photo._id}
                  photo={photo}
                  layout={getPrimaryFeaturedLayout(photo, index)}
                  delay={index * 0.05}
                />
              ))}

              {closingFeaturedPhotos.length ? (
                <div className="mt-12 grid gap-x-6 gap-y-10 sm:mt-16 sm:grid-cols-2 sm:gap-y-14 lg:mt-20 lg:gap-x-10">
                  {closingFeaturedPhotos.map((photo, index) => {
                    const isOnlyClosingPhoto =
                      closingFeaturedPhotos.length === 1;
                    const isUnpairedLastPhoto =
                      closingFeaturedPhotos.length % 2 === 1 &&
                      index === closingFeaturedPhotos.length - 1;
                    const wrapperClassName = isOnlyClosingPhoto
                      ? "sm:col-span-2 sm:ml-auto sm:w-[64%]"
                      : isUnpairedLastPhoto
                        ? "sm:col-start-2"
                        : "";
                    const sizes = isOnlyClosingPhoto
                      ? "(max-width: 640px) calc(100vw - 2.5rem), 64vw"
                      : "(max-width: 640px) calc(100vw - 2.5rem), calc(50vw - 2.5rem)";

                    return (
                      <FeaturedPhoto
                        key={photo._id}
                        photo={photo}
                        layout={{
                          requestWidth: isOnlyClosingPhoto ? 1600 : 1400,
                          sizes,
                          wrapperClassName,
                        }}
                        delay={index * 0.05}
                      />
                    );
                  })}
                </div>
              ) : null}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="border-t border-black/15 py-10 sm:py-12">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
          <div className="space-y-2">
            <p className="text-charcoal/60 text-xs tracking-[0.24em] uppercase">
              Continue exploring
            </p>
            <h2 className="font-serif-display text-charcoal text-3xl leading-none sm:text-4xl">
              More of the work
            </h2>
          </div>

          <nav
            aria-label="Explore more of the portfolio"
            className="grid border-t border-black/12 sm:grid-cols-3 sm:border-t-0"
          >
            <Link
              href="/galleries"
              className="group hover:text-charcoal/65 focus-visible:outline-charcoal flex min-h-24 items-start justify-between gap-4 border-b border-black/12 py-5 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 sm:min-h-32 sm:border-r sm:px-5 sm:first:pl-0"
            >
              <div className="space-y-2">
                <span className="font-serif-display block text-2xl leading-none sm:text-3xl">
                  {homePageSettings?.galleriesLinkLabel || "Galleries"}
                </span>
                <span className="text-charcoal/58 block max-w-[22ch] text-xs leading-5 sm:text-sm">
                  {homePageSettings?.galleriesLinkDescription ||
                    "View grouped bodies of work"}
                </span>
              </div>
              <span
                className="text-lg transition-transform duration-200 ease-out group-hover:translate-x-1"
                aria-hidden="true"
              >
                {"->"}
              </span>
            </Link>

            <Link
              href="/photography"
              className="group hover:text-charcoal/65 focus-visible:outline-charcoal flex min-h-24 items-start justify-between gap-4 border-b border-black/12 py-5 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 sm:min-h-32 sm:border-r sm:px-5"
            >
              <div className="space-y-2">
                <span className="font-serif-display block text-2xl leading-none sm:text-3xl">
                  {homePageSettings?.photographyLinkLabel || "Photography"}
                </span>
                <span className="text-charcoal/58 block max-w-[22ch] text-xs leading-5 sm:text-sm">
                  {homePageSettings?.photographyLinkDescription ||
                    "Browse individual photographs"}
                </span>
              </div>
              <span
                className="text-lg transition-transform duration-200 ease-out group-hover:translate-x-1"
                aria-hidden="true"
              >
                {"->"}
              </span>
            </Link>

            <Link
              href="/about"
              className="group hover:text-charcoal/65 focus-visible:outline-charcoal flex min-h-24 items-start justify-between gap-4 py-5 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 sm:min-h-32 sm:pl-5"
            >
              <div className="space-y-2">
                <span className="font-serif-display block text-2xl leading-none sm:text-3xl">
                  {homePageSettings?.aboutLinkLabel || "About"}
                </span>
                <span className="text-charcoal/58 block max-w-[22ch] text-xs leading-5 sm:text-sm">
                  {homePageSettings?.aboutLinkDescription ||
                    "Learn about the photographer"}
                </span>
              </div>
              <span
                className="text-lg transition-transform duration-200 ease-out group-hover:translate-x-1"
                aria-hidden="true"
              >
                {"->"}
              </span>
            </Link>
          </nav>
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
