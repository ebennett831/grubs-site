import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PhotoGrid } from "@/components/gallery/photo-grid";
import { Container } from "@/components/ui/container";
import { fetchSanity } from "@/lib/sanity/fetch";
import { urlFor } from "@/lib/sanity/image";
import { galleryByIdentifierQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { type Gallery, type Photo, type SiteSettings } from "@/types/sanity";

type GalleryWithPhotos = Gallery & {
  photos: Photo[];
};

interface GalleryPageProps {
  params: Promise<{
    identifier: string;
  }>;
}

export default async function GalleryPage({params}: GalleryPageProps) {
  const {identifier} = await params;
  const gallery = await fetchSanity<GalleryWithPhotos>(galleryByIdentifierQuery, {identifier});

  if (!gallery) {
    notFound();
  }

  return (
    <section className="py-14 sm:py-18 lg:py-24">
      <Container className="max-w-none space-y-10">
        <Link
          href="/galleries"
          className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-charcoal/60 transition-colors hover:text-charcoal focus-visible:outline-accent focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <span aria-hidden="true">←</span>
          Back to Galleries
        </Link>

        <div className="space-y-6 text-center">
          <h1 className="font-serif-display text-5xl text-charcoal sm:text-6xl">{gallery.title}</h1>
          {gallery.description ? (
            <p className="mx-auto max-w-3xl text-sm leading-7 text-charcoal/70 sm:text-base">
              {gallery.description}
            </p>
          ) : null}
        </div>

        {gallery.coverPhoto?.image ? (
          <div className="relative mx-auto aspect-[16/10] w-full max-w-4xl overflow-hidden rounded-2xl bg-black/5 sm:aspect-[16/9]">
            <Image
              src={urlFor(gallery.coverPhoto.image).width(1400).fit("max").quality(82).auto("format").url()}
              alt={gallery.coverPhoto.altText}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              placeholder={gallery.coverPhoto.image.lqip ? "blur" : "empty"}
              blurDataURL={gallery.coverPhoto.image.lqip}
              className="object-cover"
            />
          </div>
        ) : null}

        {gallery.photos.length ? (
          <PhotoGrid photos={gallery.photos} density={3} />
        ) : (
          <p className="text-charcoal/70">No photos in this gallery yet.</p>
        )}
      </Container>
    </section>
  );
}

export async function generateMetadata({params}: GalleryPageProps) {
  const {identifier} = await params;
  const siteSettings = await fetchSanity<SiteSettings>(siteSettingsQuery);
  const gallery = await fetchSanity<GalleryWithPhotos>(galleryByIdentifierQuery, {identifier});

  return buildMetadata({
    title: gallery?.title ?? "Gallery",
    description: gallery?.description ?? "A photo gallery.",
    pathname: `/galleries/${identifier}`,
    siteSettings,
  });
}