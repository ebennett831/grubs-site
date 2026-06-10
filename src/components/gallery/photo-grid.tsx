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

  const getAspectRatio = (photo: Photo) => {
    const dimensions = photo.image?.dimensions;

    if (!dimensions || !dimensions.width || !dimensions.height) {
      return 4 / 5;
    }

    return dimensions.width / dimensions.height;
  };

  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [column-fill:_balance]">
      {photos.map((photo) => {
        const aspectRatio = getAspectRatio(photo);
        const image = photo.image;
        const imageRef = image?.asset?._ref?.trim();
        const imageUrl = imageRef
          ? urlFor(image!)
              .width(1600)
              .auto("format")
              .url()
          : null;

        return (
          <figure key={photo._id} className="group mb-6 break-inside-avoid overflow-hidden bg-charcoal/10">
            <div className="relative overflow-hidden" style={{ aspectRatio }}>
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
