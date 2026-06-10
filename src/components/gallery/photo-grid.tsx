import Image from "next/image";

import { urlFor } from "@/lib/sanity/image";
import { type Photo } from "@/types/sanity";

interface PhotoGridProps {
  photos: Photo[];
}

export function PhotoGrid({ photos }: PhotoGridProps) {
  if (!photos.length) {
    return <p className="text-charcoal/70">No photographs published yet.</p>;
  }

  const columns = [[], [], []] as Photo[][];

  photos.forEach((photo, index) => {
    columns[index % columns.length].push(photo);
  });

  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [column-fill:_balance]">
      {columns.flat().map((photo) => {
        const imageUrl = photo.image
          ? urlFor(photo.image)
              .width(1400)
              .height(1800)
              .fit("crop")
              .auto("format")
              .url()
          : null;

        return (
          <figure key={photo._id} className="group mb-6 break-inside-avoid overflow-hidden bg-charcoal/10">
            <div className="relative aspect-[4/5] overflow-hidden">
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
          </figure>
        );
      })}
    </div>
  );
}
