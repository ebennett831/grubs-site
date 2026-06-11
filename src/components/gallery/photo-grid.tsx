import Image from "next/image";

import { urlFor } from "@/lib/sanity/image";
import { type Photo } from "@/types/sanity";

interface PhotoGridProps {
  photos: Photo[];
  density?: number;
}

export function PhotoGrid({ photos, density = 2 }: PhotoGridProps) {
  if (!photos.length) {
    return <p className="text-charcoal/70">No photographs published yet.</p>;
  }

  const layoutClasses =
    density <= 1
      ? "columns-1 sm:columns-1 lg:columns-2 xl:columns-2 gap-8"
      : density === 2
        ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-3 gap-6"
        : density === 3
          ? "columns-1 sm:columns-2 lg:columns-4 xl:columns-4 gap-5"
          : density === 4
            ? "columns-1 sm:columns-3 lg:columns-5 xl:columns-5 gap-4"
            : density === 5
              ? "columns-1 sm:columns-3 lg:columns-6 xl:columns-6 gap-4"
              : density === 6
                ? "columns-1 sm:columns-4 lg:columns-7 xl:columns-7 gap-3"
                : density === 7
                  ? "columns-1 sm:columns-4 lg:columns-8 xl:columns-8 gap-3"
                  : "columns-1 sm:columns-5 lg:columns-9 xl:columns-9 gap-3";

  return (
    <div className={`${layoutClasses} [column-fill:_balance]`}>
      {photos.map((photo) => {
        const image = photo.image;
        const imageRef = image?.asset?._ref?.trim();
        const dimensions = image?.dimensions;
        const width = dimensions?.width ?? 1600;
        const height = dimensions?.height ?? 2000;
        const imageUrl = imageRef
          ? urlFor(image!)
              .width(1600)
              .auto("format")
              .url()
          : null;

        return (
          <figure key={photo._id} className="group mb-6 break-inside-avoid overflow-hidden bg-charcoal/10">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={photo.altText}
                width={width}
                height={height}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 25vw"
                className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="text-charcoal/60 flex aspect-[4/5] items-center justify-center text-sm">
                Photo pending
              </div>
            )}
          </figure>
        );
      })}
    </div>
  );
}
