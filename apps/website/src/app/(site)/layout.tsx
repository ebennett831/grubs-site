import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { fetchSanity } from "@/lib/sanity/fetch";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { type SiteSettings } from "@/types/sanity";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await fetchSanity<SiteSettings>(siteSettingsQuery);

  return (
    <>
      <SiteHeader siteSettings={siteSettings} />
      <main className="flex-1">{children}</main>
      <SiteFooter siteSettings={siteSettings} />
    </>
  );
}
