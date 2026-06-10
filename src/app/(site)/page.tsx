import { PhotoGrid } from "@/components/gallery/photo-grid";
import { Container } from "@/components/ui/container";
import { fetchSanity } from "@/lib/sanity/fetch";
import {
  featuredPhotosQuery,
  homePageSettingsQuery,
  siteSettingsQuery,
} from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildOrganizationSchema, buildWebsiteSchema } from "@/lib/seo/structured-data";
import { type HomePageSettings, type Photo, type SiteSettings } from "@/types/sanity";

export default async function HomePage() {
  const [siteSettings, homePageSettings, featuredPhotos] = await Promise.all([
    fetchSanity<SiteSettings>(siteSettingsQuery),
    fetchSanity<HomePageSettings>(homePageSettingsQuery),
    fetchSanity<Photo[]>(featuredPhotosQuery),
  ]);

  const organizationSchema = buildOrganizationSchema(siteSettings, null);
  const websiteSchema = buildWebsiteSchema(siteSettings);

  return (
    <>
      <section className="border-b border-black/10 py-12 sm:py-16 lg:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="space-y-6">
            <p className="text-charcoal/70 text-xs tracking-[0.3em] uppercase">
              {homePageSettings?.heroEyebrow ?? "Photography"}
            </p>
            <h1 className="font-serif-display text-charcoal text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
              {homePageSettings?.heroTitle ?? "A photography site built around the images."}
            </h1>
            <p className="text-charcoal/80 max-w-2xl text-base sm:text-lg">
              {homePageSettings?.heroDescription ?? "Use the Home Page Settings document in Sanity to write the home page exactly how you want it."}
            </p>
          </div>

          <div className="bg-charcoal/5 border border-black/10 p-6 sm:p-8">
            <p className="text-charcoal/70 text-xs tracking-[0.2em] uppercase">
              {homePageSettings?.sectionTitle ?? "Photography"}
            </p>
            <p className="text-charcoal/80 mt-3 max-w-xl text-sm sm:text-base">
              {homePageSettings?.sectionDescription ?? "A clean lineup of published photos that you can order, crop, and style from Sanity."}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-18 lg:py-24">
        <Container className="space-y-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="font-serif-display text-charcoal text-4xl sm:text-5xl">
                {homePageSettings?.sectionTitle ?? "Photography"}
              </h2>
              <p className="text-charcoal/75 mt-3 max-w-2xl text-sm sm:text-base whitespace-pre-wrap break-words leading-relaxed">
                {homePageSettings?.sectionDescription ?? "Featured images arranged like an editorial wall."}
              </p>
            </div>
            <span className="text-charcoal/50 hidden text-xs tracking-[0.2em] uppercase sm:block">
              {homePageSettings?.ctaLabel ?? "Latest work"}
            </span>
          </div>

          <PhotoGrid photos={featuredPhotos ?? []} />
        </Container>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}

export async function generateMetadata() {
  const siteSettings = await fetchSanity<SiteSettings>(siteSettingsQuery);

  return buildMetadata({
    siteSettings,
    pathname: "/",
  });
}