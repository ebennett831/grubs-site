"use client";

import Image from "next/image";

import { motion, useReducedMotion } from "framer-motion";

import { getSanityImageUrl, hasSanityImage } from "@/lib/sanity/image";
import { getTrimmedString } from "@/lib/utils/content";
import { type Photo } from "@/types/sanity";

interface PhotoGridProps {
  photos?: Array<Photo | null | undefined> | null;
  density?: number;
  centerIncompleteRows?: boolean;
}

const centeredRowLayouts = {
  1: {
    container: "flex flex-wrap items-start justify-center gap-8",
    item: "w-full max-w-full shrink-0 sm:h-96 sm:w-auto lg:h-[28rem]",
    sizes: "(max-width: 1024px) 100vw, 50vw",
  },
  2: {
    container: "flex flex-wrap items-start justify-center gap-6",
    item: "w-full max-w-full shrink-0 sm:h-80 sm:w-auto lg:h-96",
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  },
  3: {
    container: "flex flex-wrap items-start justify-center gap-5",
    item: "w-full max-w-full shrink-0 sm:h-64 sm:w-auto lg:h-72",
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
  },
  4: {
    container: "flex flex-wrap items-start justify-center gap-4",
    item: "w-full max-w-full shrink-0 sm:h-56 sm:w-auto lg:h-64",
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw",
  },
  5: {
    container: "flex flex-wrap items-start justify-center gap-4",
    item: "w-full max-w-full shrink-0 sm:h-48 sm:w-auto lg:h-56",
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 17vw",
  },
  6: {
    container: "flex flex-wrap items-start justify-center gap-3",
    item: "w-full max-w-full shrink-0 sm:h-44 sm:w-auto lg:h-48",
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 25vw, 15vw",
  },
  7: {
    container: "flex flex-wrap items-start justify-center gap-3",
    item: "w-full max-w-full shrink-0 sm:h-40 sm:w-auto lg:h-44",
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 25vw, 13vw",
  },
  8: {
    container: "flex flex-wrap items-start justify-center gap-3",
    item: "w-full max-w-full shrink-0 sm:h-36 sm:w-auto lg:h-40",
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 20vw, 12vw",
  },
} as const;

export function PhotoGrid({
  photos,
  density = 3,
  centerIncompleteRows = false,
}: PhotoGridProps) {
  const shouldReduceMotion = useReducedMotion();
  const normalizedDensity = Number.isFinite(density)
    ? Math.min(8, Math.max(1, Math.round(density)))
    : 3;
  const displayPhotos = (photos ?? []).filter((photo): photo is Photo =>
    Boolean(photo && hasSanityImage(photo.image)),
  );

  if (!displayPhotos.length) {
    return null;
  }

  const layoutClasses =
    normalizedDensity <= 1
      ? "columns-1 sm:columns-1 lg:columns-2 xl:columns-2 gap-8"
      : normalizedDensity === 2
        ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-3 gap-6"
        : normalizedDensity === 3
          ? "columns-1 sm:columns-2 lg:columns-4 xl:columns-4 gap-5"
          : normalizedDensity === 4
            ? "columns-1 sm:columns-3 lg:columns-5 xl:columns-5 gap-4"
            : normalizedDensity === 5
              ? "columns-1 sm:columns-3 lg:columns-6 xl:columns-6 gap-4"
              : normalizedDensity === 6
                ? "columns-1 sm:columns-4 lg:columns-7 xl:columns-7 gap-3"
                : normalizedDensity === 7
                  ? "columns-1 sm:columns-4 lg:columns-8 xl:columns-8 gap-3"
                  : "columns-1 sm:columns-5 lg:columns-9 xl:columns-9 gap-3";
  const centeredLayout =
    centeredRowLayouts[normalizedDensity as keyof typeof centeredRowLayouts];
  const containerClassName = centerIncompleteRows
    ? centeredLayout.container
    : `${layoutClasses} [column-fill:_balance]`;

  return (
    <div className={containerClassName}>
      {displayPhotos.map((photo, index) => {
        const image = photo.image;

        if (!hasSanityImage(image)) {
          return null;
        }

        const dimensions = image?.dimensions;
        const lqip = image?.lqip;
        const width =
          typeof dimensions?.width === "number" && dimensions.width > 0
            ? dimensions.width
            : 1600;
        const height =
          typeof dimensions?.height === "number" && dimensions.height > 0
            ? dimensions.height
            : 2000;
        const imageUrl = getSanityImageUrl(image, (builder) =>
          builder.width(1200).fit("max").quality(80).auto("format"),
        );
        const photoKey = `${
          getTrimmedString(photo._id) || image.asset._ref || "photo"
        }-${index}`;

        if (!imageUrl) {
          return null;
        }

        const hash = photoKey
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
            key={photoKey}
            className={`group bg-charcoal/10 break-inside-avoid overflow-hidden ${
              centerIncompleteRows ? centeredLayout.item : "mb-6"
            }`}
            style={
              centerIncompleteRows
                ? { aspectRatio: `${width} / ${height}` }
                : undefined
            }
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
            <motion.div
              className={centerIncompleteRows ? "h-full w-full" : undefined}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src={imageUrl}
                alt={
                  getTrimmedString(photo.altText) ||
                  getTrimmedString(photo.title) ||
                  ""
                }
                width={width}
                height={height}
                loading="lazy"
                sizes={
                  centerIncompleteRows
                    ? centeredLayout.sizes
                    : "(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 25vw"
                }
                placeholder={lqip ? "blur" : "empty"}
                blurDataURL={lqip ?? undefined}
                className={
                  centerIncompleteRows
                    ? "h-full w-full object-contain"
                    : "h-auto w-full"
                }
              />
            </motion.div>
          </motion.figure>
        );
      })}
    </div>
  );
}
