import Image from "next/image";
import Link from "next/link";

import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { SocialLinks } from "@/components/social/social-links";
import { Container } from "@/components/ui/container";
import { fetchSanity } from "@/lib/sanity/fetch";
import { urlFor } from "@/lib/sanity/image";
import {
  aboutPageSettingsQuery,
  photographerQuery,
  siteSettingsQuery,
} from "@/lib/sanity/queries";
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
        .width(1400)
        .height(1750)
        .fit("crop")
        .quality(82)
        .auto("format")
        .url()
    : null;

  const biographySource =
    aboutPageSettings?.body?.trim() || photographer?.bio?.trim() || "";
  const biographyParagraphs = biographySource
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const socialLinks = siteSettings?.socialLinks ?? [];
  const hasAboutSocialLinks =
    normalizeSocialLinks(socialLinks, "about").length > 0;

  const resumeUrl = aboutPageSettings?.resumeFile?.asset?.url;
  const resumeLabel = aboutPageSettings?.resumeLabel?.trim() || "View resume";
  const resumeDescription = aboutPageSettings?.resumeDescription?.trim();

  const pageTitle =
    aboutPageSettings?.pageTitle?.trim() ||
    photographer?.name?.trim() ||
    siteSettings?.siteTitle?.trim() ||
    "About";
  const intro = aboutPageSettings?.intro?.trim();
  const locationLine = aboutPageSettings?.locationLine?.trim();
  const availabilityStatement =
    aboutPageSettings?.availabilityStatement?.trim();
  const secondaryHeading =
    aboutPageSettings?.secondaryHeading?.trim() || "Biography";
  const socialHeading =
    aboutPageSettings?.socialSectionHeading?.trim() || "Elsewhere";
  const contactEmail = siteSettings?.contactEmail?.trim();
  const portraitAlt =
    aboutPageSettings?.portraitImageAlt?.trim() ||
    (photographer?.name?.trim()
      ? `Portrait of ${photographer.name.trim()}`
      : `Portrait for ${pageTitle}`);

  return (
    <article className="pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-18 lg:pb-28">
      <Container className="space-y-20 sm:space-y-24 lg:space-y-28">
        <section
          aria-labelledby="about-heading"
          className={
            portraitUrl
              ? "grid gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:items-center lg:gap-16 xl:gap-20"
              : "max-w-4xl py-10 sm:py-16"
          }
        >
          {portraitUrl ? (
            <RevealOnScroll>
              <div className="bg-charcoal/8 relative aspect-[4/5] overflow-hidden">
                <Image
                  src={portraitUrl}
                  alt={portraitAlt}
                  width={1400}
                  height={1750}
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 639px) calc(100vw - 2.5rem), (max-width: 1023px) calc(100vw - 4rem), (max-width: 1279px) 50vw, 630px"
                  placeholder={heroPortrait?.lqip ? "blur" : "empty"}
                  blurDataURL={heroPortrait?.lqip}
                  className="h-full w-full object-cover"
                />
              </div>
            </RevealOnScroll>
          ) : null}

          <RevealOnScroll delay={0.05}>
            <div className="space-y-5 lg:py-10">
              <p className="text-charcoal/58 text-xs tracking-[0.28em] uppercase">
                {aboutPageSettings?.eyebrow?.trim() || "About"}
              </p>
              <h1
                id="about-heading"
                className="font-serif-display text-charcoal text-5xl leading-[0.94] sm:text-6xl xl:text-7xl"
              >
                {pageTitle}
              </h1>
              {locationLine ? (
                <p className="text-charcoal/62 text-sm tracking-[0.12em] uppercase">
                  {locationLine}
                </p>
              ) : null}
              {intro ? (
                <p className="text-charcoal/80 max-w-xl text-lg leading-8 sm:text-xl sm:leading-9">
                  {intro}
                </p>
              ) : null}
            </div>
          </RevealOnScroll>
        </section>

        {biographyParagraphs.length > 0 ? (
          <RevealOnScroll>
            <section className="grid gap-8 border-t border-black/12 pt-10 sm:pt-12 lg:grid-cols-[minmax(0,0.3fr)_minmax(0,0.7fr)] lg:gap-16">
              <h2 className="text-charcoal/58 text-xs tracking-[0.28em] uppercase">
                {secondaryHeading}
              </h2>
              <div className="text-charcoal/82 max-w-[66ch] space-y-6 text-base leading-8 sm:text-lg sm:leading-9">
                {biographyParagraphs.map((paragraph, index) => (
                  <p
                    key={`${index}-${paragraph.slice(0, 24)}`}
                    className={
                      index === 0
                        ? "font-serif-display text-2xl leading-9 sm:text-3xl sm:leading-10"
                        : undefined
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          </RevealOnScroll>
        ) : null}

        {resumeUrl ? (
          <RevealOnScroll>
            <section className="grid gap-8 border-t border-black/12 pt-10 sm:pt-12 lg:grid-cols-[minmax(0,0.3fr)_minmax(0,0.7fr)] lg:gap-16">
              <h2 className="text-charcoal/58 text-xs tracking-[0.28em] uppercase">
                Resume
              </h2>
              <div>
                {resumeDescription ? (
                  <p className="text-charcoal/76 max-w-2xl leading-8">
                    {resumeDescription}
                  </p>
                ) : null}
                <Link
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${resumeLabel} (PDF, opens in a new tab)`}
                  className={`group border-charcoal/30 text-charcoal/88 hover:border-charcoal hover:text-charcoal focus-visible:outline-accent inline-flex min-h-11 items-center gap-3 border-b pb-1 text-sm tracking-[0.16em] uppercase transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 ${
                    resumeDescription ? "mt-6" : ""
                  }`}
                >
                  <span>{resumeLabel}</span>
                  <span
                    className="text-charcoal/50 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    PDF &#8599;
                  </span>
                </Link>
              </div>
            </section>
          </RevealOnScroll>
        ) : null}

        {availabilityStatement ? (
          <RevealOnScroll>
            <section className="grid gap-8 border-t border-black/12 pt-10 sm:pt-12 lg:grid-cols-[minmax(0,0.3fr)_minmax(0,0.7fr)] lg:gap-16">
              <h2 className="text-charcoal/58 text-xs tracking-[0.28em] uppercase">
                Work together
              </h2>
              <div>
                <p className="text-charcoal/82 max-w-3xl text-lg leading-8">
                  {availabilityStatement}
                </p>
                <Link
                  href={contactEmail ? `mailto:${contactEmail}` : "/contact"}
                  className="border-charcoal/30 text-charcoal/88 hover:border-charcoal hover:text-charcoal focus-visible:outline-accent mt-5 inline-flex min-h-11 items-center border-b pb-1 text-sm tracking-[0.16em] uppercase transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  {contactEmail ? "Email the photographer" : "Get in touch"}
                </Link>
              </div>
            </section>
          </RevealOnScroll>
        ) : null}

        {hasAboutSocialLinks ? (
          <RevealOnScroll>
            <section className="grid gap-8 border-t border-black/12 pt-10 sm:pt-12 lg:grid-cols-[minmax(0,0.3fr)_minmax(0,0.7fr)] lg:gap-16">
              <h2 className="text-charcoal/58 text-xs tracking-[0.28em] uppercase">
                {socialHeading}
              </h2>
              <SocialLinks links={socialLinks} variant="about" />
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
