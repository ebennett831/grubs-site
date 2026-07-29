import Image from "next/image";
import Link from "next/link";

import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { Container } from "@/components/ui/container";
import { fetchSanity } from "@/lib/sanity/fetch";
import { getSanityFileUrl } from "@/lib/sanity/file";
import { getSanityImageUrl } from "@/lib/sanity/image";
import {
  aboutPageSettingsQuery,
  siteSettingsQuery,
} from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { getSafeEmailHref, getTrimmedString } from "@/lib/utils/content";
import { type AboutPageSettings, type SiteSettings } from "@/types/sanity";

export default async function AboutPage() {
  const [aboutPageSettings, siteSettings] = await Promise.all([
    fetchSanity<AboutPageSettings>(aboutPageSettingsQuery),
    fetchSanity<SiteSettings>(siteSettingsQuery),
  ]);

  const heroPortrait = aboutPageSettings?.portraitImage;
  const portraitUrl = getSanityImageUrl(heroPortrait, (builder) =>
    builder.width(1400).height(1750).fit("crop").quality(82).auto("format"),
  );

  const biographySource = getTrimmedString(aboutPageSettings?.body) || "";
  const biographyParagraphs = biographySource
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const resumeUrl = getSanityFileUrl(aboutPageSettings?.resumeFile);
  const resumeLabel =
    getTrimmedString(aboutPageSettings?.resumeLabel) || "View resume";
  const resumeDescription = getTrimmedString(
    aboutPageSettings?.resumeDescription,
  );

  const pageTitle = getTrimmedString(aboutPageSettings?.pageTitle);
  const intro = getTrimmedString(aboutPageSettings?.intro);
  const locationLine = getTrimmedString(aboutPageSettings?.locationLine);
  const eyebrow = getTrimmedString(aboutPageSettings?.eyebrow);
  const availabilityStatement = getTrimmedString(
    aboutPageSettings?.availabilityStatement,
  );
  const socialEmail = siteSettings?.socialLinks?.find(
    (link) => getTrimmedString(link?.platform)?.toLowerCase() === "email",
  );
  const contactEmail =
    getTrimmedString(siteSettings?.contactEmail) ||
    getTrimmedString(socialEmail?.url)
      ?.replace(/^mailto:/i, "")
      .trim();
  const contactEmailHref = getSafeEmailHref(contactEmail);
  const portraitAlt =
    getTrimmedString(aboutPageSettings?.portraitImageAlt) ||
    (pageTitle ? `Portrait of ${pageTitle}` : "");
  const hasHeroText = Boolean(eyebrow || pageTitle || locationLine || intro);
  const hasSupportingContent = Boolean(
    biographyParagraphs.length ||
    resumeUrl ||
    availabilityStatement ||
    contactEmailHref,
  );
  const showHero = Boolean(portraitUrl || hasHeroText || !hasSupportingContent);
  const showVisibleFallbackHeading = Boolean(
    !portraitUrl && !hasHeroText && !hasSupportingContent,
  );

  return (
    <article className="pt-10 pb-8 sm:pt-14 sm:pb-10 lg:pt-18 lg:pb-12">
      {!pageTitle && !showVisibleFallbackHeading ? (
        <h1 className="sr-only">About</h1>
      ) : null}

      <Container className="space-y-20 sm:space-y-24 lg:space-y-28">
        {showHero ? (
          <section
            aria-labelledby={pageTitle ? "about-heading" : undefined}
            className={
              portraitUrl && hasHeroText
                ? "grid gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:items-center lg:gap-16 xl:gap-20"
                : portraitUrl
                  ? "mx-auto w-full max-w-3xl"
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
                    sizes={
                      hasHeroText
                        ? "(max-width: 639px) calc(100vw - 2.5rem), (max-width: 1023px) calc(100vw - 4rem), (max-width: 1279px) 50vw, 630px"
                        : "(max-width: 639px) calc(100vw - 2.5rem), (max-width: 1023px) calc(100vw - 4rem), 768px"
                    }
                    placeholder={heroPortrait?.lqip ? "blur" : "empty"}
                    blurDataURL={heroPortrait?.lqip ?? undefined}
                    className="h-full w-full object-cover"
                  />
                </div>
              </RevealOnScroll>
            ) : null}

            {hasHeroText || showVisibleFallbackHeading ? (
              <RevealOnScroll delay={portraitUrl ? 0.05 : 0}>
                <div className="space-y-5 lg:py-10">
                  {eyebrow ? (
                    <p className="text-charcoal/58 text-xs tracking-[0.28em] uppercase">
                      {eyebrow}
                    </p>
                  ) : null}
                  {pageTitle || showVisibleFallbackHeading ? (
                    <h1
                      id={pageTitle ? "about-heading" : undefined}
                      className="font-serif-display text-charcoal text-5xl leading-[0.94] sm:text-6xl xl:text-7xl"
                    >
                      {pageTitle || "About"}
                    </h1>
                  ) : null}
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
            ) : null}
          </section>
        ) : null}

        {hasSupportingContent ? (
          <div>
            {biographyParagraphs.length > 0 ? (
              <RevealOnScroll>
                <section className="grid gap-6 border-t border-black/14 py-14 sm:py-16 lg:grid-cols-[minmax(0,28%)_minmax(0,64%)] lg:justify-between lg:gap-0 lg:py-20">
                  <h2 className="font-serif-display text-charcoal text-3xl leading-none sm:text-4xl">
                    Biography
                  </h2>
                  <div className="font-serif-display text-charcoal/82 max-w-[42rem] space-y-5 text-lg leading-[1.65] sm:space-y-6 sm:text-xl sm:leading-[1.65]">
                    {biographyParagraphs.map((paragraph, index) => (
                      <p key={`${index}-${paragraph.slice(0, 24)}`}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              </RevealOnScroll>
            ) : null}

            {resumeUrl ? (
              <RevealOnScroll>
                <section className="grid gap-6 border-t border-black/14 py-12 sm:py-14 lg:grid-cols-[minmax(0,28%)_minmax(0,64%)] lg:justify-between lg:gap-0 lg:py-16">
                  <h2 className="font-serif-display text-charcoal text-3xl leading-none sm:text-4xl">
                    Resume
                  </h2>
                  <div>
                    {resumeDescription ? (
                      <p className="text-charcoal/72 max-w-[42rem] text-base leading-7 sm:text-lg sm:leading-8">
                        {resumeDescription}
                      </p>
                    ) : null}
                    <Link
                      href={resumeUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${resumeLabel} (PDF, opens in a new tab)`}
                      className={`group bg-charcoal text-cream hover:bg-accent focus-visible:outline-accent inline-flex min-h-12 items-center gap-3 px-5 py-3 text-sm font-medium tracking-[0.12em] uppercase transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 ${
                        resumeDescription ? "mt-6" : ""
                      }`}
                    >
                      <span>{resumeLabel}</span>
                      <span
                        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      >
                        &#8599;
                      </span>
                    </Link>
                  </div>
                </section>
              </RevealOnScroll>
            ) : null}

            {availabilityStatement || contactEmailHref ? (
              <RevealOnScroll>
                <section className="grid gap-6 border-t border-black/14 py-12 sm:py-14 lg:grid-cols-[minmax(0,28%)_minmax(0,64%)] lg:justify-between lg:gap-0 lg:py-16">
                  <h2 className="font-serif-display text-charcoal text-3xl leading-none sm:text-4xl">
                    Work Together
                  </h2>
                  <div>
                    {availabilityStatement ? (
                      <p className="text-charcoal/78 max-w-[42rem] text-lg leading-8 sm:text-xl sm:leading-9">
                        {availabilityStatement}
                      </p>
                    ) : null}
                    {contactEmailHref && contactEmail ? (
                      <a
                        href={contactEmailHref}
                        className={`border-charcoal/35 text-charcoal hover:border-accent hover:text-accent focus-visible:outline-accent inline-flex min-h-11 max-w-full items-center border-b pb-1 text-base font-medium break-all transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 sm:text-lg sm:break-normal ${
                          availabilityStatement ? "mt-5" : ""
                        }`}
                      >
                        {contactEmail}
                      </a>
                    ) : null}
                  </div>
                </section>
              </RevealOnScroll>
            ) : null}
          </div>
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
    title: getTrimmedString(aboutPageSettings?.pageTitle) || "About",
    description:
      getTrimmedString(aboutPageSettings?.intro) ||
      getTrimmedString(siteSettings?.siteDescription) ||
      "Photographer profile and background.",
    pathname: "/about",
    siteSettings,
  });
}
