import Image from "next/image";
import Link from "next/link";

import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { SocialLinks } from "@/components/social/social-links";
import { Container } from "@/components/ui/container";
import { fetchSanity } from "@/lib/sanity/fetch";
import {
  aboutPageSettingsQuery,
  photographerQuery,
  siteSettingsQuery,
} from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { buildMetadata } from "@/lib/seo/metadata";
import { normalizeSocialLinks } from "@/lib/utils/social-links";
import {
  type AboutPageSettings,
  type Photographer,
  type SiteSettings,
} from "@/types/sanity";

export default async function AboutPage() {
  const [aboutPageSettings, siteSettings, photographer] = await Promise.all([
    fetchSanity<AboutPageSettings>(aboutPageSettingsQuery),
    fetchSanity<SiteSettings>(siteSettingsQuery),
    fetchSanity<Photographer>(photographerQuery, {}, 0),
  ]);

  const heroPortrait =
    aboutPageSettings?.portraitImage ?? photographer?.profileImage;
  const hasPortrait = Boolean(heroPortrait?.asset?._ref);
  const portraitUrl = hasPortrait
    ? urlFor(heroPortrait!)
        .width(1200)
        .height(1500)
        .fit("max")
        .quality(82)
        .auto("format")
        .url()
    : null;
  const portraitWidth = heroPortrait?.dimensions?.width ?? 1200;
  const portraitHeight = heroPortrait?.dimensions?.height ?? 1500;
  const portraitAlt =
    aboutPageSettings?.portraitImageAlt?.trim() ||
    aboutPageSettings?.pageTitle?.trim() ||
    photographer?.name?.trim() ||
    "Portrait photograph";

  const biographySource =
    aboutPageSettings?.body?.trim() || photographer?.bio?.trim() || "";
  const biographyParagraphs = biographySource
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const socialLinks = siteSettings?.socialLinks?.length
    ? siteSettings.socialLinks
    : (photographer?.socialLinks ?? []);
  const hasAboutSocialLinks =
    normalizeSocialLinks(socialLinks, "about").length > 0;

  const resumeUrl = aboutPageSettings?.resumeFile?.asset?.url;
  const resumeLabel = aboutPageSettings?.resumeLabel?.trim() || "View resume";
  const resumeDescription =
    aboutPageSettings?.resumeDescription?.trim() ||
    "View selected experience, clients, exhibitions, and education.";

  const pageTitle = aboutPageSettings?.pageTitle?.trim() || "About";
  const intro =
    aboutPageSettings?.intro?.trim() || "Photographer profile and background.";
  const locationLine = aboutPageSettings?.locationLine?.trim();
  const availabilityStatement =
    aboutPageSettings?.availabilityStatement?.trim();
  const secondaryHeading =
    aboutPageSettings?.secondaryHeading?.trim() || "Biography";
  const socialHeading =
    aboutPageSettings?.socialSectionHeading?.trim() || "Elsewhere";

  return (
    <article className="py-14 sm:py-18 lg:py-24">
      <Container className="space-y-16 sm:space-y-20">
        <section className="grid gap-10 lg:grid-cols-[minmax(0,0.56fr)_minmax(0,0.44fr)] lg:items-center lg:gap-16">
          <RevealOnScroll>
            <div className="bg-charcoal/8 relative aspect-[4/5] overflow-hidden">
              {portraitUrl ? (
                <Image
                  src={portraitUrl}
                  alt={portraitAlt}
                  width={portraitWidth}
                  height={portraitHeight}
                  sizes="(max-width: 1024px) calc(100vw - 2.5rem), 56vw"
                  placeholder={heroPortrait?.lqip ? "blur" : "empty"}
                  blurDataURL={heroPortrait?.lqip}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-charcoal/60 flex h-full items-center justify-center text-sm">
                  Portrait image pending
                </div>
              )}
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.05}>
            <div className="space-y-5 lg:pl-4">
              <p className="text-charcoal/58 text-xs tracking-[0.28em] uppercase">
                {aboutPageSettings?.eyebrow?.trim() || "About"}
              </p>
              <h1 className="font-serif-display text-charcoal text-4xl leading-[0.98] sm:text-6xl">
                {pageTitle}
              </h1>
              {locationLine ? (
                <p className="text-charcoal/62 text-sm tracking-[0.12em] uppercase">
                  {locationLine}
                </p>
              ) : null}
              <p className="text-charcoal/80 max-w-xl text-lg leading-relaxed">
                {intro}
              </p>
            </div>
          </RevealOnScroll>
        </section>

        {biographyParagraphs.length > 0 ? (
          <RevealOnScroll>
            <section className="grid gap-8 border-t border-black/12 pt-10 lg:grid-cols-[minmax(0,0.28fr)_minmax(0,0.72fr)] lg:gap-10">
              <div>
                <h2 className="text-charcoal/58 text-xs tracking-[0.28em] uppercase">
                  {secondaryHeading}
                </h2>
              </div>
              <div className="text-charcoal/82 max-w-[72ch] space-y-5 text-base leading-8 sm:text-lg">
                {biographyParagraphs.map((paragraph, index) => (
                  <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                ))}
              </div>
            </section>
          </RevealOnScroll>
        ) : null}

        {resumeUrl ? (
          <RevealOnScroll>
            <section className="border-t border-black/12 pt-10">
              <h2 className="text-charcoal/58 text-xs tracking-[0.28em] uppercase">
                Resume
              </h2>
              <p className="text-charcoal/76 mt-4 max-w-2xl leading-relaxed">
                {resumeDescription}
              </p>
              <p className="mt-6">
                <Link
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group border-charcoal/30 text-charcoal/88 hover:border-charcoal hover:text-charcoal focus-visible:outline-accent inline-flex min-h-11 items-center gap-3 border-b pb-1 text-sm tracking-[0.16em] uppercase transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  <span>{resumeLabel}</span>
                  <span
                    className="text-charcoal/50 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    -&gt;
                  </span>
                </Link>
              </p>
            </section>
          </RevealOnScroll>
        ) : null}

        {hasAboutSocialLinks ? (
          <RevealOnScroll>
            <section className="grid gap-8 border-t border-black/12 pt-10 lg:grid-cols-[minmax(0,0.28fr)_minmax(0,0.72fr)] lg:gap-10">
              <h2 className="text-charcoal/58 text-xs tracking-[0.28em] uppercase">
                {socialHeading}
              </h2>
              <SocialLinks links={socialLinks} variant="about" />
            </section>
          </RevealOnScroll>
        ) : null}

        {availabilityStatement ? (
          <RevealOnScroll>
            <section className="border-t border-black/12 pt-10">
              <p className="text-charcoal/82 max-w-3xl text-lg leading-relaxed">
                {availabilityStatement}
              </p>
              <p className="mt-5">
                {siteSettings?.contactEmail ? (
                  <Link
                    href={`mailto:${siteSettings.contactEmail}`}
                    className="border-charcoal/30 text-charcoal/88 hover:border-charcoal hover:text-charcoal focus-visible:outline-accent inline-flex min-h-11 items-center border-b pb-1 text-sm tracking-[0.16em] uppercase transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    Email the photographer
                  </Link>
                ) : (
                  <Link
                    href="/contact"
                    className="border-charcoal/30 text-charcoal/88 hover:border-charcoal hover:text-charcoal focus-visible:outline-accent inline-flex min-h-11 items-center border-b pb-1 text-sm tracking-[0.16em] uppercase transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    Get in touch
                  </Link>
                )}
              </p>
            </section>
          </RevealOnScroll>
        ) : null}
      </Container>
    </article>
  );
}

export async function generateMetadata() {
  const [siteSettings, aboutPageSettings] = await Promise.all([
    fetchSanity<SiteSettings>(siteSettingsQuery),
    fetchSanity<AboutPageSettings>(aboutPageSettingsQuery),
  ]);

  return buildMetadata({
    title: aboutPageSettings?.pageTitle?.trim() || "About",
    description:
      aboutPageSettings?.intro?.trim() ||
      siteSettings?.siteDescription ||
      "Photographer profile and background.",
    pathname: "/about",
    siteSettings,
  });
}
