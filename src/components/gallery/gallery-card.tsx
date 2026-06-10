import Image from "next/image";
import Link from "next/link";

import { urlFor } from "@/lib/sanity/image";
import { type Gallery } from "@/types/sanity";

interface GalleryCardProps {
  gallery: Gallery;
  priority?: boolean;
}

export function GalleryCard({ gallery, priority = false }: GalleryCardProps) {
  const coverImageUrl = gallery.coverImage
    ? urlFor(gallery.coverImage)
        .width(1600)
        .height(1200)
        .fit("crop")
        .auto("format")
        .url()
    : null;

  return (
    <article className="group">
      <Link
        href={`/gallery/${gallery.slug}`}
        className="focus-visible:outline-accent block space-y-4 focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        <div className="bg-charcoal/10 relative aspect-[4/3] overflow-hidden">
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
              alt={gallery.title}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="text-charcoal/60 flex h-full items-center justify-center text-sm tracking-[0.2em] uppercase">
              Cover pending
            </div>
          )}
        </div>
        <div>
          <h3 className="font-serif-display text-charcoal text-2xl">
            {gallery.title}
          </h3>
          <p className="text-charcoal/75 mt-2 text-sm">{gallery.description}</p>
        </div>
      </Link>
    </article>
  );
}
