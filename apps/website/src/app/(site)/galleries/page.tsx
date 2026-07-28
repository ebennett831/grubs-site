import { Container } from "@/components/ui/container";
import { GalleriesGrid } from "@/components/gallery/galleries-grid";
import { fetchSanity } from "@/lib/sanity/fetch";
import { galleriesQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { type Gallery, type SiteSettings } from "@/types/sanity";

export default async function GalleriesPage() {
  const rawGalleries = await fetchSanity<Gallery[]>(galleriesQuery);
  const galleries = rawGalleries ?? [];

  return (
    <section className="py-14 sm:py-18 lg:py-24">
      <Container className="max-w-none">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <h1 className="font-serif-display text-charcoal text-5xl sm:text-6xl">
            Galleries
          </h1>
          <div
            className="h-px w-full max-w-3xl bg-black/10"
            aria-hidden="true"
          />
        </div>

        <GalleriesGrid galleries={galleries} />
      </Container>
    </section>
  );
}

export async function generateMetadata() {
  const siteSettings = await fetchSanity<SiteSettings>(siteSettingsQuery);

  return buildMetadata({
    title: "Galleries",
    description: "A browsable collection of photo galleries.",
    pathname: "/galleries",
    siteSettings,
  });
}
