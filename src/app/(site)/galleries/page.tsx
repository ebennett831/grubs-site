import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { fetchSanity } from "@/lib/sanity/fetch";
import { urlFor } from "@/lib/sanity/image";
import { galleriesQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { type Gallery, type SiteSettings } from "@/types/sanity";

export default async function GalleriesPage() {
  const rawGalleries = await fetchSanity<Gallery[]>(galleriesQuery);
  const galleries = rawGalleries ?? [];

  return (
    <section className="py-14 sm:py-18 lg:py-24">
      <Container className="max-w-none">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <h1 className="font-serif-display text-5xl text-charcoal sm:text-6xl">Galleries</h1>
          <div className="h-px w-full max-w-3xl bg-black/10" aria-hidden="true" />
        </div>

        {galleries.length ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {galleries.map((gallery) => {
              const galleryPath = gallery.slug?.current || gallery._id;

              return (
                <Link
                  key={gallery._id}
                  href={`/galleries/${galleryPath}`}
                  className="group overflow-hidden border border-black/10 bg-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.12)] focus-visible:outline-accent focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-black/5">
                    {gallery.coverPhoto?.image ? (
                      <Image
                        src={urlFor(gallery.coverPhoto.image).width(1800).auto("format").url()}
                        alt={gallery.coverPhoto.altText}
                        width={gallery.coverPhoto.image.dimensions?.width ?? 1800}
                        height={gallery.coverPhoto.image.dimensions?.height ?? 2200}
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-black/50">
                        No cover photo
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white">
                      <div className="space-y-1">
                        <h2 className="font-serif-display text-3xl leading-tight">{gallery.title}</h2>
                        <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                          {gallery.photoCount ?? 0} photos
                        </p>
                      </div>

                      <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-sm transition-colors group-hover:bg-white group-hover:text-charcoal">
                        Open
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 p-5">
                    {gallery.description ? (
                      <p className="line-clamp-3 text-sm leading-7 text-charcoal/70">
                        {gallery.description}
                      </p>
                    ) : (
                      <p className="text-sm leading-7 text-charcoal/50">
                        Browse the full set of photos.
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-charcoal/70">No galleries published yet.</p>
        )}
      </Container>
    </section>
  );
}

export async function generateMetadata() {
  const siteSettings = await fetchSanity<SiteSettings>(siteSettingsQuery);

  return buildMetadata({
    title: "Galleries",
    description: "A browsable collection of photo galleries.",
    pathname: "/galleries",
    siteSettings,
  });
}