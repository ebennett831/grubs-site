import { GalleryCard } from "@/components/gallery/gallery-card";
import { Container } from "@/components/ui/container";
import { type Gallery } from "@/types/sanity";

interface FeaturedGalleriesSectionProps {
  galleries: Gallery[];
}

export function FeaturedGalleriesSection({
  galleries,
}: FeaturedGalleriesSectionProps) {
  return (
    <section className="py-14 sm:py-18 lg:py-24">
      <Container>
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-serif-display text-charcoal text-4xl sm:text-5xl">
            Featured Galleries
          </h2>
          <p className="text-charcoal/70 hidden text-sm tracking-[0.2em] uppercase sm:block">
            Curated Stories
          </p>
        </div>

        {galleries.length ? (
          <div className="grid gap-10 lg:grid-cols-2">
            {galleries.map((gallery, index) => (
              <GalleryCard
                key={gallery._id}
                gallery={gallery}
                priority={index < 2}
              />
            ))}
          </div>
        ) : (
          <p className="text-charcoal/70">
            No featured galleries published yet.
          </p>
        )}
      </Container>
    </section>
  );
}
