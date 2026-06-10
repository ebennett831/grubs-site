import { GalleryCard } from "@/components/gallery/gallery-card";
import { Container } from "@/components/ui/container";
import { fetchSanity } from "@/lib/sanity/fetch";
import { galleriesQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { type Gallery, type SiteSettings } from "@/types/sanity";

export default async function WorkPage() {
  const galleries = (await fetchSanity<Gallery[]>(galleriesQuery)) ?? [];

  return (
    <section className="py-14 sm:py-18 lg:py-24">
      <Container>
        <div className="mb-10 flex flex-col gap-3">
          <h1 className="font-serif-display text-charcoal text-5xl sm:text-6xl">
            Work
          </h1>
          <p className="text-charcoal/75 max-w-2xl">
            Published galleries are ordered through Sanity. Filter architecture
            is intentionally prepared through metadata fields and can be
            expanded without refactoring this route.
          </p>
        </div>

        {galleries.length ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {galleries.map((gallery) => (
              <GalleryCard key={gallery._id} gallery={gallery} />
            ))}
          </div>
        ) : (
          <p className="text-charcoal/70">No galleries published yet.</p>
        )}
      </Container>
    </section>
  );
}

export async function generateMetadata() {
  const siteSettings = await fetchSanity<SiteSettings>(siteSettingsQuery);

  return buildMetadata({
    title: "Work",
    description: "Explore editorial photography galleries and visual stories.",
    pathname: "/work",
    siteSettings,
  });
}
