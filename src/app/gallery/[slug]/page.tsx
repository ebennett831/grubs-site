import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/container";
import { fetchSanity } from "@/lib/sanity/fetch";
import { urlFor } from "@/lib/sanity/image";
import {
  galleriesQuery,
  galleryBySlugQuery,
  siteSettingsQuery,
} from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildGallerySchema } from "@/lib/seo/structured-data";
import {
  type Gallery,
  type GalleryWithPhotos,
  type SiteSettings,
} from "@/types/sanity";

interface GalleryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ photo?: string }>;
}

export default async function GalleryDetailPage({
  params,
  searchParams,
}: GalleryPageProps) {
  const [{ slug }, { photo }] = await Promise.all([params, searchParams]);
  const gallery = await fetchSanity<GalleryWithPhotos>(galleryBySlugQuery, {
    slug,
  });

  if (!gallery) {
    notFound();
  }

  const selectedIndex = Number(photo ?? "0");
  const currentIndex = Number.isNaN(selectedIndex)
    ? 0
    : Math.min(Math.max(selectedIndex, 0), gallery.photos.length - 1);
  const currentPhoto = gallery.photos[currentIndex];

  const imageUrl = currentPhoto?.image
    ? urlFor(currentPhoto.image)
        .width(2200)
        .height(1600)
        .fit("max")
        .auto("format")
        .url()
    : null;

  const previousIndex = currentIndex > 0 ? currentIndex - 1 : null;
  const nextIndex =
    currentIndex < gallery.photos.length - 1 ? currentIndex + 1 : null;

  return (
    <section className="py-10 sm:py-14">
      <Container className="space-y-8">
        <header className="space-y-3">
          <p className="text-charcoal/65 text-xs tracking-[0.2em] uppercase">
            Gallery
          </p>
          <h1 className="font-serif-display text-charcoal text-4xl sm:text-5xl">
            {gallery.title}
          </h1>
          <p className="text-charcoal/80 max-w-3xl">{gallery.description}</p>
        </header>

        <div className="bg-charcoal/10 relative aspect-[16/11] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={currentPhoto?.altText ?? gallery.title}
              fill
              priority
              sizes="100vw"
              className="object-contain"
            />
          ) : (
            <div className="text-charcoal/60 flex h-full items-center justify-center text-sm">
              Select a photo from this gallery in Sanity.
            </div>
          )}
        </div>

        {currentPhoto ? (
          <dl className="grid gap-3 border-y border-black/10 py-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-charcoal/60">Location</dt>
              <dd className="text-charcoal">
                {currentPhoto.location ?? "Not specified"}
              </dd>
            </div>
            <div>
              <dt className="text-charcoal/60">Camera Data</dt>
              <dd className="text-charcoal">
                {currentPhoto.cameraData ?? "Not specified"}
              </dd>
            </div>
          </dl>
        ) : null}

        <nav
          aria-label="Photo navigation"
          className="flex items-center justify-between gap-4"
        >
          {previousIndex !== null ? (
            <Link
              href={`/gallery/${gallery.slug}?photo=${previousIndex}`}
              className="border-charcoal hover:bg-charcoal hover:text-cream focus-visible:outline-accent border px-4 py-2 text-xs tracking-[0.2em] uppercase focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              Previous
            </Link>
          ) : (
            <span className="text-charcoal/50 text-xs tracking-[0.2em] uppercase">
              Previous
            </span>
          )}

          <span className="text-charcoal/70 text-xs tracking-[0.2em] uppercase">
            {gallery.photos.length
              ? `${currentIndex + 1} / ${gallery.photos.length}`
              : "No photos"}
          </span>

          {nextIndex !== null ? (
            <Link
              href={`/gallery/${gallery.slug}?photo=${nextIndex}`}
              className="border-charcoal hover:bg-charcoal hover:text-cream focus-visible:outline-accent border px-4 py-2 text-xs tracking-[0.2em] uppercase focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              Next
            </Link>
          ) : (
            <span className="text-charcoal/50 text-xs tracking-[0.2em] uppercase">
              Next
            </span>
          )}
        </nav>
      </Container>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildGallerySchema(gallery)),
        }}
      />
    </section>
  );
}

export async function generateStaticParams() {
  const galleries = (await fetchSanity<Gallery[]>(galleriesQuery)) ?? [];
  return galleries.map((gallery) => ({ slug: gallery.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, siteSettings, gallery] = await Promise.all([
    params,
    fetchSanity<SiteSettings>(siteSettingsQuery),
    params.then(({ slug: pageSlug }) =>
      fetchSanity<GalleryWithPhotos>(galleryBySlugQuery, { slug: pageSlug }),
    ),
  ]);

  return buildMetadata({
    title: gallery?.title ?? "Gallery",
    description: gallery?.description ?? "Photography gallery",
    pathname: `/gallery/${slug}`,
    siteSettings,
  });
}
