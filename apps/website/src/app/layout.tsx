import { Cormorant_Garamond, Manrope } from "next/font/google";
import { type CSSProperties } from "react";

import { fetchSanity } from "@/lib/sanity/fetch";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { getThemeColors } from "@/lib/utils/theme";
import { type SiteSettings } from "@/types/sanity";

import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const siteSettings = await fetchSanity<SiteSettings>(siteSettingsQuery);
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    ),
    ...buildMetadata({ siteSettings }),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await fetchSanity<SiteSettings>(siteSettingsQuery);
  const { accent, accentSurface, accentContrast } = getThemeColors(
    siteSettings?.accentColor?.hex,
  );
  const themeStyles = {
    "--color-accent": accent,
    "--color-accent-surface": accentSurface,
    "--color-accent-contrast": accentContrast,
  } as CSSProperties;

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}
      style={themeStyles}
    >
      <body className="bg-cream text-charcoal font-sans-ui min-h-full">
        <div className="relative flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}
