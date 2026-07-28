import Image from "next/image";
import Link from "next/link";

import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { Container } from "@/components/ui/container";
import { fetchSanity } from "@/lib/sanity/fetch";
import { getSanityImageUrl, hasSanityImage } from "@/lib/sanity/image";
import {
  homePageSettingsQuery,
  homepageFallbackPhotosQuery,
  siteSettingsQuery,
} from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  buildOrganizationSchema,
  buildWebsiteSchema,
  serializeStructuredData,
} from "@/lib/seo/structured-data";
import {
  getSafeLinkHref,
  getTrimmedString,
  isExternalHref,
} from "@/lib/utils/content";
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
  return [photo.title, photo.location, photo.dateTaken]
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
}

function getPhotoKey(photo: Photo, index: number) {
  return `${
    getTrimmedString(photo._id) ||
    getTrimmedString(photo.image?.asset?._ref) ||
    "featured-photo"
  }-${index}`;
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

  if (!hasSanityImage(image)) {
    return null;
  }

  const width =
    typeof image.dimensions?.width === "number" && image.dimensions.width > 0
      ? image.dimensions.width
      : layout.requestWidth;
  const height =
    typeof image.dimensions?.height === "number" && image.dimensions.height > 0
      ? image.dimensions.height
      : Math.round((layout.requestWidth * 3) / 2);
  const captionParts = getCaptionParts(photo);
  const imageUrl = getSanityImageUrl(image, (builder) =>
    builder.width(layout.requestWidth).fit("max").quality(82).auto("format"),
  );
  const alt =
    getTrimmedString(photo.altText) || getTrimmedString(photo.title) || "";
  const caption = getTrimmedString(photo.caption);

  if (!imageUrl) {
    return null;
  }

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
          blurDataURL={image?.lqip ?? undefined}
          className="h-auto w-full"
        />
        {caption || captionParts.length ? (
          <figcaption className="text-charcoal/62 mt-3 max-w-[64ch] space-y-1 text-xs leading-6 sm:text-sm">
            {caption ? <p>{caption}</p> : null}
            {captionParts.length ? <p>{captionParts.join(" | ")}</p> : null}
          </figcaption>
        ) : null}
      </figure>
    </RevealOnScroll>
  );
}

function FeaturedSequence({ photos }: { photos: Photo[] }) {
  if (photos.length === 1) {
    const photo = photos[0];
    return (
      <FeaturedPhoto
        photo={photo}
        layout={getPrimaryFeaturedLayout(photo, 0)}
        delay={0}
      />
    );
  }

  if (photos.length === 2) {
    return (
      <div className="grid gap-10 sm:grid-cols-2 sm:items-start sm:gap-6 lg:gap-10">
        {photos.map((photo, index) => (
          <FeaturedPhoto
            key={getPhotoKey(photo, index)}
            photo={photo}
            layout={{
              requestWidth: 1400,
              sizes:
                "(max-width: 640px) calc(100vw - 2.5rem), calc(50vw - 2.5rem)",
              wrapperClassName: index === 1 ? "sm:mt-12 lg:mt-18" : "",
            }}
            delay={index * 0.05}
          />
        ))}
      </div>
    );
  }

  if (photos.length === 3) {
    const [leadPhoto, ...pairedPhotos] = photos;
    return (
      <div>
        <FeaturedPhoto
          photo={leadPhoto}
          layout={getPrimaryFeaturedLayout(leadPhoto, 0)}
          delay={0}
        />
        <div className="mt-10 grid gap-10 sm:mt-14 sm:grid-cols-2 sm:items-start sm:gap-6 lg:mt-18 lg:gap-10">
          {pairedPhotos.map((photo, index) => (
            <FeaturedPhoto
              key={getPhotoKey(photo, index + 1)}
              photo={photo}
              layout={{
                requestWidth: 1400,
                sizes:
                  "(max-width: 640px) calc(100vw - 2.5rem), calc(50vw - 2.5rem)",
                wrapperClassName: index === 1 ? "sm:mt-12" : "",
              }}
              delay={(index + 1) * 0.05}
            />
          ))}
        </div>
      </div>
    );
  }

  const primaryPhotos = photos.slice(0, 4);
  const closingPhotos = photos.slice(4);

  return (
    <div>
      {primaryPhotos.map((photo, index) => (
        <FeaturedPhoto
          key={getPhotoKey(photo, index)}
          photo={photo}
          layout={getPrimaryFeaturedLayout(photo, index)}
          delay={index * 0.05}
        />
      ))}

      {closingPhotos.length ? (
        <div className="mt-12 grid gap-x-6 gap-y-10 sm:mt-16 sm:grid-cols-2 sm:gap-y-14 lg:mt-20 lg:gap-x-10">
          {closingPhotos.map((photo, index) => {
            const isOnlyClosingPhoto = closingPhotos.length === 1;
            const isUnpairedLastPhoto =
              closingPhotos.length % 2 === 1 &&
              index === closingPhotos.length - 1;
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
                key={getPhotoKey(photo, index + 4)}
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
  );
}

export default async function HomePage() {
  const [siteSettings, homePageSettings] = await Promise.all([
    fetchSanity<SiteSettings>(siteSettingsQuery),
    fetchSanity<HomePageSettings>(homePageSettingsQuery),
  ]);

  const curatedPhotos = (homePageSettings?.featuredPhotos ?? []).filter(
    (photo): photo is Photo => Boolean(photo && hasSanityImage(photo.image)),
  );
  const fallbackPhotos = curatedPhotos.length
    ? []
    : ((await fetchSanity<Photo[]>(homepageFallbackPhotosQuery)) ?? []);
  const featuredPhotos = (curatedPhotos.length ? curatedPhotos : fallbackPhotos)
    .filter((photo): photo is Photo =>
      Boolean(photo && hasSanityImage(photo.image)),
    )
    .slice(0, 8);

  const heroImage = homePageSettings?.heroImage;
  const heroImageUrl = getSanityImageUrl(heroImage, (builder) =>
    builder.width(2400).fit("max").quality(84).auto("format"),
  );
  const heroAlt = getTrimmedString(homePageSettings?.heroImageAlt) || "";
  const heroEyebrow = getTrimmedString(homePageSettings?.heroEyebrow);
  const heroTitle = getTrimmedString(homePageSettings?.heroTitle);
  const heroDescription = getTrimmedString(homePageSettings?.heroDescription);
  const ctaHref = getSafeLinkHref(homePageSettings?.ctaHref);
  const ctaLabel =
    getTrimmedString(homePageSettings?.ctaLabel) || "View photography";
  const hasHeroText = Boolean(
    heroEyebrow || heroTitle || heroDescription || ctaHref,
  );
  const hasHero = Boolean(heroImageUrl || hasHeroText);
  const siteIdentity =
    getTrimmedString(siteSettings?.siteTitle) || "Photography portfolio";

  const featuredEyebrow = getTrimmedString(homePageSettings?.featuredEyebrow);
  const featuredTitle = getTrimmedString(homePageSettings?.featuredTitle);
  const featuredDescription = getTrimmedString(
    homePageSettings?.featuredDescription,
  );
  const hasFeaturedIntro = Boolean(
    featuredEyebrow || featuredTitle || featuredDescription,
  );
  const galleriesLinkLabel =
    getTrimmedString(homePageSettings?.galleriesLinkLabel) || "Galleries";
  const galleriesLinkDescription = getTrimmedString(
    homePageSettings?.galleriesLinkDescription,
  );
  const photographyLinkLabel =
    getTrimmedString(homePageSettings?.photographyLinkLabel) || "Photography";
  const photographyLinkDescription = getTrimmedString(
    homePageSettings?.photographyLinkDescription,
  );
  const aboutLinkLabel =
    getTrimmedString(homePageSettings?.aboutLinkLabel) || "About";
  const aboutLinkDescription = getTrimmedString(
    homePageSettings?.aboutLinkDescription,
  );

  const organizationSchema = buildOrganizationSchema(siteSettings, null);
  const websiteSchema = buildWebsiteSchema(siteSettings);

  return (
    <>
      {!heroTitle ? <h1 className="sr-only">{siteIdentity}</h1> : null}

      {hasHero ? (
        <section
          className={
            heroImageUrl
              ? "relative isolate h-[80svh] min-h-[32rem] md:h-[90svh]"
              : "relative isolate flex min-h-[28rem] items-center py-20 sm:min-h-[34rem] sm:py-28"
          }
        >
          {heroImageUrl ? (
            <Image
              src={heroImageUrl}
              alt={heroAlt}
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              placeholder={heroImage?.lqip ? "blur" : "empty"}
              blurDataURL={heroImage?.lqip ?? undefined}
              className="object-cover"
            />
          ) : null}

          {heroImageUrl && hasHeroText ? (
            <div
              className="absolute inset-0 bg-[linear-gradient(to_top,rgba(24,21,19,0.68)_0%,rgba(24,21,19,0.22)_36%,rgba(24,21,19,0.04)_62%,rgba(24,21,19,0.24)_100%)]"
              aria-hidden="true"
            />
          ) : null}

          {hasHeroText ? (
            <Container
              className={`relative flex h-full ${
                heroImageUrl ? "items-end pb-12 sm:pb-16" : "items-center"
              }`}
            >
              <div
                className={`max-w-3xl space-y-4 sm:space-y-5 ${
                  heroImageUrl ? "text-white" : "text-charcoal"
                }`}
              >
                {heroEyebrow ? (
                  <p
                    className={`text-xs tracking-[0.28em] uppercase ${
                      heroImageUrl ? "text-white/85" : "text-charcoal/62"
                    }`}
                  >
                    {heroEyebrow}
                  </p>
                ) : null}
                {heroTitle ? (
                  <h1 className="font-serif-display text-4xl leading-[0.95] sm:text-6xl lg:text-7xl">
                    {heroTitle}
                  </h1>
                ) : null}
                {heroDescription ? (
                  <p
                    className={`max-w-xl text-sm leading-7 sm:text-base ${
                      heroImageUrl ? "text-white/88" : "text-charcoal/76"
                    }`}
                  >
                    {heroDescription}
                  </p>
                ) : null}
                {ctaHref ? (
                  ctaHref.startsWith("/") || ctaHref.startsWith("#") ? (
                    <Link
                      href={ctaHref}
                      className={`inline-flex min-h-11 items-center gap-2 border-b pb-1 text-sm tracking-[0.12em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${
                        heroImageUrl
                          ? "border-white/80 text-white hover:text-white/80 focus-visible:outline-white"
                          : "border-charcoal/70 text-charcoal hover:text-charcoal/65 focus-visible:outline-accent"
                      }`}
                    >
                      {ctaLabel}
                      <span aria-hidden="true">{"->"}</span>
                    </Link>
                  ) : (
                    <a
                      href={ctaHref}
                      target={isExternalHref(ctaHref) ? "_blank" : undefined}
                      rel={
                        isExternalHref(ctaHref)
                          ? "noreferrer noopener"
                          : undefined
                      }
                      className={`inline-flex min-h-11 items-center gap-2 border-b pb-1 text-sm tracking-[0.12em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${
                        heroImageUrl
                          ? "border-white/80 text-white hover:text-white/80 focus-visible:outline-white"
                          : "border-charcoal/70 text-charcoal hover:text-charcoal/65 focus-visible:outline-accent"
                      }`}
                    >
                      {ctaLabel}
                      <span aria-hidden="true">
                        {isExternalHref(ctaHref) ? "\u2197" : "->"}
                      </span>
                    </a>
                  )
                ) : null}
              </div>
            </Container>
          ) : null}
        </section>
      ) : null}

      {featuredPhotos.length ? (
        <section className="pt-14 pb-18 sm:pt-18 sm:pb-22 lg:pt-24 lg:pb-28">
          <Container className="max-w-none">
            {hasFeaturedIntro ? (
              <div className="max-w-2xl space-y-4 pb-12 sm:pb-16 lg:ml-[8%] lg:pb-20">
                {featuredEyebrow ? (
                  <p className="text-charcoal/70 text-xs tracking-[0.24em] uppercase">
                    {featuredEyebrow}
                  </p>
                ) : null}
                {featuredTitle ? (
                  <h2 className="font-serif-display text-charcoal text-4xl leading-tight sm:text-5xl">
                    {featuredTitle}
                  </h2>
                ) : null}
                {featuredDescription ? (
                  <p className="text-charcoal/75 max-w-2xl text-sm leading-7 sm:text-base">
                    {featuredDescription}
                  </p>
                ) : null}
              </div>
            ) : null}

            <FeaturedSequence photos={featuredPhotos} />
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
                  {galleriesLinkLabel}
                </span>
                {galleriesLinkDescription ? (
                  <span className="text-charcoal/58 block max-w-[22ch] text-xs leading-5 sm:text-sm">
                    {galleriesLinkDescription}
                  </span>
                ) : null}
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
                  {photographyLinkLabel}
                </span>
                {photographyLinkDescription ? (
                  <span className="text-charcoal/58 block max-w-[22ch] text-xs leading-5 sm:text-sm">
                    {photographyLinkDescription}
                  </span>
                ) : null}
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
                  {aboutLinkLabel}
                </span>
                {aboutLinkDescription ? (
                  <span className="text-charcoal/58 block max-w-[22ch] text-xs leading-5 sm:text-sm">
                    {aboutLinkDescription}
                  </span>
                ) : null}
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
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData(websiteSchema),
        }}
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
