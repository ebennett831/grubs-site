"use client";

import Image from "next/image";
import Link from "next/link";

import { motion, useReducedMotion } from "framer-motion";

import { getSanityImageUrl, hasSanityImage } from "@/lib/sanity/image";
import { getTrimmedString } from "@/lib/utils/content";
import { type Gallery } from "@/types/sanity";

interface GalleriesGridProps {
  galleries?: Array<Gallery | null | undefined> | null;
}

export function GalleriesGrid({ galleries }: GalleriesGridProps) {
  const shouldReduceMotion = useReducedMotion();
  const displayGalleries = (galleries ?? []).filter(
    (gallery): gallery is Gallery => {
      const slug = getTrimmedString(gallery?.slug?.current);
      const title = getTrimmedString(gallery?.title);
      const description = getTrimmedString(gallery?.description);
      const hasCover = hasSanityImage(gallery?.coverPhoto?.image);
      const hasPhotos =
        typeof gallery?.photoCount === "number" && gallery.photoCount > 0;

      return Boolean(
        gallery && slug && (title || description || hasCover || hasPhotos),
      );
    },
  );

  if (!displayGalleries.length) {
    return null;
  }

  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            delayChildren: shouldReduceMotion ? 0 : 0.03,
            staggerChildren: shouldReduceMotion ? 0 : 0.045,
          },
        },
      }}
    >
      {displayGalleries.map((gallery, index) => {
        const galleryPath = getTrimmedString(gallery.slug?.current);
        const galleryTitle = getTrimmedString(gallery.title) || "Gallery";
        const galleryDescription = getTrimmedString(gallery.description);
        const coverImage = gallery.coverPhoto?.image;
        const imageUrl = getSanityImageUrl(coverImage, (builder) =>
          builder.width(1400).fit("max").quality(82).auto("format"),
        );
        const lqip = coverImage?.lqip;
        const imageWidth =
          typeof coverImage?.dimensions?.width === "number" &&
          coverImage.dimensions.width > 0
            ? coverImage.dimensions.width
            : 1800;
        const imageHeight =
          typeof coverImage?.dimensions?.height === "number" &&
          coverImage.dimensions.height > 0
            ? coverImage.dimensions.height
            : 2200;
        const photoCount =
          typeof gallery.photoCount === "number" && gallery.photoCount > 0
            ? gallery.photoCount
            : null;

        if (!galleryPath) {
          return null;
        }

        return (
          <motion.div
            key={`${getTrimmedString(gallery._id) || galleryPath || "gallery"}-${index}`}
            variants={{
              hidden: {
                opacity: 0,
                y: shouldReduceMotion ? 0 : 14,
                scale: shouldReduceMotion ? 1 : 0.985,
              },
              show: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: "tween",
                  ease: [0.22, 1, 0.36, 1],
                  duration: 0.42,
                },
              },
            }}
          >
            <Link
              href={`/galleries/${encodeURIComponent(galleryPath)}`}
              className="border-charcoal/65 group focus-visible:border-accent-surface focus-visible:outline-accent hover:border-accent-surface block overflow-hidden border bg-white transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              {imageUrl ? (
                <div className="relative aspect-[4/5] overflow-hidden bg-black/5">
                  <Image
                    src={imageUrl}
                    alt={
                      getTrimmedString(gallery.coverPhoto?.altText) ||
                      galleryTitle
                    }
                    width={imageWidth}
                    height={imageHeight}
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    placeholder={lqip ? "blur" : "empty"}
                    blurDataURL={lqip ?? undefined}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_35%),linear-gradient(to_top,rgba(17,24,39,0.8),rgba(17,24,39,0.08)_55%,transparent)]" />

                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <div className="space-y-1">
                      <h2 className="font-serif-display text-3xl leading-tight">
                        {galleryTitle}
                      </h2>
                      {photoCount ? (
                        <p className="text-sm tracking-[0.2em] text-white/70 uppercase">
                          {photoCount} {photoCount === 1 ? "photo" : "photos"}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 p-5 sm:p-6">
                  <p className="text-charcoal/55 text-[11px] tracking-[0.22em] uppercase">
                    Gallery
                  </p>
                  <h2 className="font-serif-display text-charcoal text-3xl leading-tight">
                    {galleryTitle}
                  </h2>
                  {photoCount ? (
                    <p className="text-charcoal/55 text-xs tracking-[0.18em] uppercase">
                      {photoCount} {photoCount === 1 ? "photo" : "photos"}
                    </p>
                  ) : null}
                </div>
              )}

              {galleryDescription ? (
                <div className="border-charcoal/20 space-y-2 border-t p-5">
                  <p className="text-charcoal/70 line-clamp-3 text-sm leading-7">
                    {galleryDescription}
                  </p>
                </div>
              ) : null}
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
