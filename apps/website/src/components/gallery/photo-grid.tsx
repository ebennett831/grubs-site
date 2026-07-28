"use client";

import Image from "next/image";

import { motion, useReducedMotion } from "framer-motion";

import { urlFor } from "@/lib/sanity/image";
import { type Photo } from "@/types/sanity";

interface PhotoGridProps {
  photos: Photo[];
  density?: number;
}

export function PhotoGrid({ photos, density = 2 }: PhotoGridProps) {
  const shouldReduceMotion = useReducedMotion();

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
        const lqip = image?.lqip;
        const width = dimensions?.width ?? 1600;
        const height = dimensions?.height ?? 2000;
        const imageUrl = imageRef
          ? urlFor(image!)
              .width(1200)
              .fit("max")
              .quality(80)
              .auto("format")
              .url()
          : null;
        const hash = photo._id
          .split("")
          .reduce(
            (accumulator, character) => accumulator + character.charCodeAt(0),
            0,
          );
        const entranceX = shouldReduceMotion ? 0 : ((hash % 3) - 1) * 24;
        const entranceY = shouldReduceMotion ? 0 : ((hash % 5) - 2) * 18;
        const entranceRotate = shouldReduceMotion ? 0 : ((hash % 7) - 3) * 1.5;
        const delay = shouldReduceMotion ? 0 : (hash % 10) * 0.035;

        return (
          <motion.figure
            key={photo._id}
            className="group bg-charcoal/10 mb-6 break-inside-avoid overflow-hidden"
            initial={
              shouldReduceMotion
                ? { opacity: 1, x: 0, y: 0, rotate: 0 }
                : {
                    opacity: 0,
                    x: entranceX,
                    y: entranceY,
                    rotate: entranceRotate,
                    scale: 0.98,
                  }
            }
            animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 140,
              damping: 24,
              mass: 0.9,
              delay,
            }}
          >
            {imageUrl ? (
              <motion.div
                whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={imageUrl}
                  alt={photo.altText}
                  width={width}
                  height={height}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 25vw"
                  placeholder={lqip ? "blur" : "empty"}
                  blurDataURL={lqip}
                  className="h-auto w-full"
                />
              </motion.div>
            ) : (
              <div className="text-charcoal/60 flex aspect-[4/5] items-center justify-center text-sm">
                Photo pending
              </div>
            )}
          </motion.figure>
        );
      })}
    </div>
  );
}
