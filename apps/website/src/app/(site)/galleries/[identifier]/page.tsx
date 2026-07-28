import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PhotoGrid } from "@/components/gallery/photo-grid";
import { Container } from "@/components/ui/container";
import { fetchSanity } from "@/lib/sanity/fetch";
import { getSanityImageUrl, hasSanityImage } from "@/lib/sanity/image";
import {
  galleryByIdentifierQuery,
  gallerySettingsQuery,
  siteSettingsQuery,
} from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { getTrimmedString } from "@/lib/utils/content";
import {
  type GallerySettings,
  type GalleryWithPhotos,
  type SiteSettings,
} from "@/types/sanity";

interface GalleryPageProps {
  params: Promise<{
    identifier: string;
  }>;
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { identifier: rawIdentifier } = await params;
  const identifier = getTrimmedString(rawIdentifier);

  if (!identifier) {
    notFound();
  }

  const [gallery, gallerySettings] = await Promise.all([
    fetchSanity<GalleryWithPhotos>(galleryByIdentifierQuery, { identifier }),
    fetchSanity<GallerySettings>(gallerySettingsQuery),
  ]);

  if (!gallery) {
    notFound();
  }

  const galleryTitle = getTrimmedString(gallery.title) || "Gallery";
  const galleryDescription = getTrimmedString(gallery.description);
  const coverImage = gallery.coverPhoto?.image;
  const coverImageUrl = getSanityImageUrl(coverImage, (builder) =>
    builder.width(1800).fit("max").quality(82).auto("format"),
  );
  const coverAlt =
    getTrimmedString(gallery.coverPhoto?.altText) || galleryTitle;
  const photos = (gallery.photos ?? []).filter(
    (photo) => photo && hasSanityImage(photo.image),
  );

  return (
    <section className="py-14 sm:py-18 lg:py-24">
      <Container className="max-w-none space-y-10">
        <Link
          href="/galleries"
          className="text-charcoal/60 hover:text-charcoal focus-visible:outline-accent inline-flex items-center gap-2 text-sm tracking-[0.2em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <span aria-hidden="true">{"\u2190"}</span>
          Back to Galleries
        </Link>

        <div className="space-y-6 text-center">
          <h1 className="font-serif-display text-charcoal text-5xl sm:text-6xl">
            {galleryTitle}
          </h1>
          {galleryDescription ? (
            <p className="text-charcoal/70 mx-auto max-w-3xl text-sm leading-7 sm:text-base">
              {galleryDescription}
            </p>
          ) : null}
        </div>

        {coverImageUrl ? (
          <div className="relative mx-auto aspect-[16/10] w-full max-w-4xl overflow-hidden bg-black/5 sm:aspect-[16/9]">
            <Image
              src={coverImageUrl}
              alt={coverAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              placeholder={coverImage?.lqip ? "blur" : "empty"}
              blurDataURL={coverImage?.lqip ?? undefined}
              className="object-cover"
            />
          </div>
        ) : null}

        {photos.length ? (
          <PhotoGrid
            photos={photos}
            density={gallerySettings?.density ?? undefined}
          />
        ) : null}
      </Container>
    </section>
  );
}

export async function generateMetadata({ params }: GalleryPageProps) {
  const { identifier: rawIdentifier } = await params;
  const identifier = getTrimmedString(rawIdentifier);
  const siteSettings = await fetchSanity<SiteSettings>(siteSettingsQuery);
  const gallery = identifier
    ? await fetchSanity<GalleryWithPhotos>(galleryByIdentifierQuery, {
        identifier,
      })
    : null;

  return buildMetadata({
    title: getTrimmedString(gallery?.title) || "Gallery",
    description: getTrimmedString(gallery?.description) || "A photo gallery.",
    pathname: identifier
      ? `/galleries/${encodeURIComponent(identifier)}`
      : "/galleries",
    siteSettings,
  });
}
