import { FeaturedGalleriesSection } from "@/components/sections/featured-galleries-section";
import { HeroSection } from "@/components/sections/hero-section";
import { fetchSanity } from "@/lib/sanity/fetch";
import {
  featuredGalleriesQuery,
  photographerQuery,
  siteSettingsQuery,
} from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  buildOrganizationSchema,
  buildWebsiteSchema,
} from "@/lib/seo/structured-data";
import {
  type Gallery,
  type Photographer,
  type SiteSettings,
} from "@/types/sanity";

export default async function HomePage() {
  const [siteSettings, photographer, featuredGalleries] = await Promise.all([
    fetchSanity<SiteSettings>(siteSettingsQuery),
    fetchSanity<Photographer>(photographerQuery),
    fetchSanity<Gallery[]>(featuredGalleriesQuery),
  ]);

  const organizationSchema = buildOrganizationSchema(
    siteSettings,
    photographer,
  );
  const websiteSchema = buildWebsiteSchema(siteSettings);

  return (
    <>
      <HeroSection photographer={photographer} />
      <FeaturedGalleriesSection galleries={featuredGalleries ?? []} />

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
