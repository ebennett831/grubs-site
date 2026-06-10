import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { urlFor } from "@/lib/sanity/image";
import { type Photographer } from "@/types/sanity";

interface HeroSectionProps {
  photographer: Photographer | null;
}

export function HeroSection({ photographer }: HeroSectionProps) {
  const profileImageUrl = photographer?.profileImage
    ? urlFor(photographer.profileImage)
        .width(2000)
        .height(1400)
        .fit("crop")
        .auto("format")
        .url()
    : null;

  return (
    <section className="relative border-b border-black/10 py-12 sm:py-16 lg:py-20">
      <Container className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <div className="space-y-6">
          <p className="text-charcoal/70 text-xs tracking-[0.3em] uppercase">
            Fine Art Photography
          </p>
          <h1 className="font-serif-display text-charcoal text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
            {photographer?.name ?? "Professional Photography Portfolio"}
          </h1>
          <p className="text-charcoal/80 max-w-2xl text-base sm:text-lg">
            {photographer?.bio ??
              "Connect Sanity content to publish your story, featured galleries, and hero imagery."}
          </p>
          <Link
            href="/work"
            className="border-charcoal hover:bg-charcoal hover:text-cream focus-visible:outline-accent inline-flex border px-6 py-3 text-sm tracking-[0.2em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            View Work
          </Link>
        </div>
        <div className="bg-charcoal/10 relative aspect-[4/5] overflow-hidden">
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              alt={photographer?.name ?? "Photographer portrait"}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          ) : (
            <div className="text-charcoal/60 flex h-full items-center justify-center text-sm tracking-[0.2em] uppercase">
              Hero image pending
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
