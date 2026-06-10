import Image from "next/image";
import Link from "next/link";

import { urlFor } from "@/lib/sanity/image";
import { type Photo } from "@/types/sanity";

interface PhotoGridProps {
  gallerySlug: string;
  photos: Photo[];
}

export function PhotoGrid({ gallerySlug, photos }: PhotoGridProps) {
  if (!photos.length) {
    return <p className="text-charcoal/70">No photographs published yet.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo, index) => {
        const imageUrl = photo.image
          ? urlFor(photo.image)
              .width(1400)
              .height(1800)
              .fit("crop")
              .auto("format")
              .url()
          : null;

        return (
          <article key={photo._id} className="group">
            <Link
              href={`/gallery/${gallerySlug}?photo=${index}`}
              className="focus-visible:outline-accent block focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <div className="bg-charcoal/10 relative aspect-[3/4] overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={photo.altText}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="text-charcoal/60 flex h-full items-center justify-center text-sm">
                    Photo pending
                  </div>
                )}
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
