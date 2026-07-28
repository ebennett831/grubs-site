import { PhotoGrid } from "@/components/gallery/photo-grid";
import { Container } from "@/components/ui/container";
import { fetchSanity } from "@/lib/sanity/fetch";
import { allPhotosQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { type Photo, type SiteSettings } from "@/types/sanity";

export default async function PhotographyPage() {
  const photos = await fetchSanity<Array<Photo | null>>(allPhotosQuery);

  return (
    <section className="py-14 sm:py-18 lg:py-24">
      <Container className="max-w-none">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <h1 className="font-serif-display text-charcoal text-5xl sm:text-6xl">
            Photography
          </h1>
          <div
            className="h-px w-full max-w-3xl bg-black/10"
            aria-hidden="true"
          />
        </div>

        <PhotoGrid photos={photos} density={3} />
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
