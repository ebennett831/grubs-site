import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/container";
import { fetchSanity } from "@/lib/sanity/fetch";
import { getSanityImageUrl, hasSanityImage } from "@/lib/sanity/image";
import {
  photoByIdentifierQuery,
  siteSettingsQuery,
} from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { getTrimmedString } from "@/lib/utils/content";
import { type Photo, type SiteSettings } from "@/types/sanity";

interface PhotoPageProps {
  params: Promise<{
    identifier: string;
  }>;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

function formatPhotoDate(value: string | null | undefined) {
  const date = getTrimmedString(value);

  if (!date) {
    return null;
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);

  return Number.isNaN(parsedDate.getTime())
    ? null
    : dateFormatter.format(parsedDate);
}

async function getPhoto(identifier: string | null) {
  if (!identifier) {
    return null;
  }

  return fetchSanity<Photo>(photoByIdentifierQuery, { identifier });
}

export default async function PhotoPage({ params }: PhotoPageProps) {
  const { identifier: rawIdentifier } = await params;
  const identifier = getTrimmedString(rawIdentifier);
  const photo = await getPhoto(identifier);

  if (!photo || !hasSanityImage(photo.image)) {
    notFound();
  }

  const image = photo.image;
  const imageUrl = getSanityImageUrl(image, (builder) =>
    builder
      .ignoreImageParams()
      .width(2000)
      .fit("max")
      .quality(84)
      .auto("format"),
  );

  if (!imageUrl) {
    notFound();
  }

  const width =
    typeof image.dimensions?.width === "number" && image.dimensions.width > 0
      ? image.dimensions.width
      : 1600;
  const height =
    typeof image.dimensions?.height === "number" && image.dimensions.height > 0
      ? image.dimensions.height
      : 2000;
  const altText = getTrimmedString(photo.altText) || "";
  const title = getTrimmedString(photo.title);
  const caption = getTrimmedString(photo.caption);
  const location = getTrimmedString(photo.location);
  const dateTaken = formatPhotoDate(photo.dateTaken);
  const hasSupportingMetadata = Boolean(caption || location || dateTaken);
  const hasVisibleMetadata = Boolean(title || hasSupportingMetadata);

  return (
    <article className="py-10 sm:py-14 lg:py-18">
      <Container className="max-w-[90rem]">
        <Link
          href="/photography"
          className="text-charcoal/60 hover:text-charcoal focus-visible:outline-accent inline-flex min-h-11 items-center gap-2 text-xs tracking-[0.2em] uppercase transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 sm:text-sm"
        >
          <span aria-hidden="true">{"\u2190"}</span>
          Photography
        </Link>

        {!title ? <h1 className="sr-only">Photograph</h1> : null}

        <div className="mt-8 flex w-full justify-center sm:mt-10 lg:mt-12">
          <Image
            src={imageUrl}
            alt={altText}
            width={width}
            height={height}
            priority
            fetchPriority="high"
            sizes="(max-width: 639px) calc(100vw - 2.5rem), (max-width: 1535px) calc(100vw - 4rem), 1400px"
            placeholder={image.lqip ? "blur" : "empty"}
            blurDataURL={image.lqip ?? undefined}
            className="h-auto max-h-[86svh] w-auto max-w-full object-contain"
          />
        </div>

        {hasVisibleMetadata ? (
          <section
            aria-label="Photo information"
            className={`mx-auto mt-10 max-w-6xl border-t border-black/15 pt-8 sm:mt-14 sm:pt-10 lg:mt-16 ${
              title && hasSupportingMetadata
                ? "grid gap-8 lg:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)] lg:gap-16"
                : ""
            }`}
          >
            {title ? (
              <h1 className="font-serif-display text-charcoal max-w-xl text-4xl leading-[0.98] sm:text-5xl">
                {title}
              </h1>
            ) : null}

            {hasSupportingMetadata ? (
              <div className={title ? "" : "max-w-3xl"}>
                {caption ? (
                  <p className="font-serif-display text-charcoal/82 max-w-[42rem] text-xl leading-[1.55] sm:text-2xl">
                    {caption}
                  </p>
                ) : null}

                {location || dateTaken ? (
                  <dl
                    className={`grid gap-x-10 gap-y-6 sm:grid-cols-2 ${
                      caption ? "mt-8 border-t border-black/12 pt-7" : ""
                    }`}
                  >
                    {location ? (
                      <div>
                        <dt className="text-charcoal/52 text-[11px] tracking-[0.2em] uppercase">
                          Location
                        </dt>
                        <dd className="text-charcoal/78 mt-2 text-sm leading-6 sm:text-base">
                          {location}
                        </dd>
                      </div>
                    ) : null}
                    {dateTaken ? (
                      <div>
                        <dt className="text-charcoal/52 text-[11px] tracking-[0.2em] uppercase">
                          Date
                        </dt>
                        <dd className="text-charcoal/78 mt-2 text-sm leading-6 sm:text-base">
                          {dateTaken}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                ) : null}
              </div>
            ) : null}
          </section>
        ) : null}
      </Container>
    </article>
  );
}

export async function generateMetadata({ params }: PhotoPageProps) {
  const { identifier: rawIdentifier } = await params;
  const identifier = getTrimmedString(rawIdentifier);
  const [photo, siteSettings] = await Promise.all([
    getPhoto(identifier),
    fetchSanity<SiteSettings>(siteSettingsQuery),
  ]);

  return buildMetadata({
    title: getTrimmedString(photo?.title) || "Photograph",
    description:
      getTrimmedString(photo?.caption) ||
      getTrimmedString(photo?.location) ||
      "An individual photograph from the portfolio.",
    pathname: identifier
      ? `/photos/${encodeURIComponent(identifier)}`
      : "/photography",
    siteSettings,
  });
}
