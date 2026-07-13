"use client";

import Image from "next/image";
import Link from "next/link";

import {motion, useReducedMotion} from "framer-motion";

import {urlFor} from "@/lib/sanity/image";
import {type Gallery} from "@/types/sanity";

interface GalleriesGridProps {
  galleries: Gallery[];
}

export function GalleriesGrid({galleries}: GalleriesGridProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!galleries.length) {
    return <p className="text-charcoal/70">No galleries published yet.</p>;
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
      {galleries.map((gallery) => {
        const galleryPath = gallery.slug?.current || gallery._id;
        const coverImage = gallery.coverPhoto?.image;
        const imageUrl = coverImage?.asset?._ref ? urlFor(coverImage).width(1800).auto("format").url() : null;

        return (
          <motion.div
            key={gallery._id}
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
              href={`/galleries/${galleryPath}`}
              className="group block overflow-hidden border border-black/10 bg-white shadow-[0_1px_0_rgba(255,255,255,0.6)] transition-shadow duration-300 hover:shadow-[0_18px_50px_rgba(0,0,0,0.12)] focus-visible:outline-accent focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-black/5">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={gallery.coverPhoto?.altText || gallery.title}
                    width={coverImage?.dimensions?.width ?? 1800}
                    height={coverImage?.dimensions?.height ?? 2200}
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-black/50">
                    No cover photo
                  </div>
                )}

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_35%),linear-gradient(to_top,rgba(17,24,39,0.8),rgba(17,24,39,0.08)_55%,transparent)]" />

                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] backdrop-blur-sm">
                      Gallery
                    </span>
                    <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-sm transition-colors group-hover:bg-white/20">
                      Open
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h2 className="font-serif-display text-3xl leading-tight">{gallery.title}</h2>
                    <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                      {gallery.photoCount ?? 0} photos
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 p-5">
                {gallery.description ? (
                  <p className="line-clamp-3 text-sm leading-7 text-charcoal/70">{gallery.description}</p>
                ) : (
                  <p className="text-sm leading-7 text-charcoal/50">Browse the full set of photos.</p>
                )}
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}