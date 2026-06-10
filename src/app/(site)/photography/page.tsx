import { PhotoGrid } from "@/components/gallery/photo-grid";
import { Container } from "@/components/ui/container";
import { fetchSanity } from "@/lib/sanity/fetch";
import { allPhotosQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { type Photo, type SiteSettings } from "@/types/sanity";

export default async function PhotographyPage() {
  const photos = (await fetchSanity<Photo[]>(allPhotosQuery)) ?? [];

  return (
    <section className="py-14 sm:py-18 lg:py-24">
      <Container>
        <div className="mb-10 flex flex-col gap-3">
          <h1 className="font-serif-display text-5xl text-charcoal sm:text-6xl">Photography</h1>
          <p className="max-w-2xl text-charcoal/75">
            An editorial wall of every published photo, arranged directly from Sanity.
          </p>
        </div>

        {photos.length ? <PhotoGrid photos={photos} /> : <p className="text-charcoal/70">No photos published yet.</p>}
      </Container>
    </section>
  );
}

export async function generateMetadata() {
  const siteSettings = await fetchSanity<SiteSettings>(siteSettingsQuery);

  return buildMetadata({
    title: "Photography",
    description: "An editorial wall of all published photos.",
    pathname: "/photography",
    siteSettings,
  });
}