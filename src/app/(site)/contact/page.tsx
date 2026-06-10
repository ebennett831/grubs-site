import Link from "next/link";

import { Container } from "@/components/ui/container";
import { fetchSanity } from "@/lib/sanity/fetch";
import { photographerQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { type Photographer, type SiteSettings } from "@/types/sanity";

import { submitContactForm } from "./actions";

interface ContactPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const [{ status }, photographer, siteSettings] = await Promise.all([
    searchParams,
    fetchSanity<Photographer>(photographerQuery, {}, 0),
    fetchSanity<SiteSettings>(siteSettingsQuery),
  ]);

  const successMessage = status === "success" ? "Message received. We will be in touch soon." : null;
  const errorMessage = status === "invalid" ? "Please complete all fields with valid details." : null;

  return (
    <section className="py-14 sm:py-18 lg:py-24">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          <h1 className="font-serif-display text-5xl text-charcoal sm:text-6xl">Contact</h1>
          <p className="text-charcoal/80">
            Share your project details or inquiry. Form validation is server-side and structured for a
            secure provider integration in production.
          </p>
          {photographer?.email ? (
            <p>
              <Link
                href={`mailto:${photographer.email}`}
                className="text-charcoal underline decoration-charcoal/40 underline-offset-4 hover:decoration-charcoal"
              >
                {photographer.email}
              </Link>
            </p>
          ) : null}

          <ul className="flex flex-wrap gap-3 text-sm">
            {(siteSettings?.socialLinks ?? []).map((item) => (
              <li key={`${item.platform}-${item.url}`}>
                <Link
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-charcoal/30 px-3 py-1 uppercase tracking-[0.16em] hover:border-charcoal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  {item.platform}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <form action={submitContactForm} className="space-y-5 border border-black/10 bg-white/60 p-6 sm:p-8">
          <input
            type="text"
            name="company"
            autoComplete="off"
            tabIndex={-1}
            aria-hidden="true"
            className="hidden"
          />

          <label className="block space-y-2">
            <span className="text-sm text-charcoal/80">Name</span>
            <input
              type="text"
              name="name"
              required
              className="w-full border border-charcoal/25 bg-transparent px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-charcoal/80">Email</span>
            <input
              type="email"
              name="email"
              required
              className="w-full border border-charcoal/25 bg-transparent px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-charcoal/80">Message</span>
            <textarea
              name="message"
              required
              rows={6}
              className="w-full border border-charcoal/25 bg-transparent px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
          </label>

          {successMessage ? <p className="text-sm text-green-700">{successMessage}</p> : null}
          {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}

          <button
            type="submit"
            className="inline-flex border border-charcoal px-6 py-3 text-sm uppercase tracking-[0.2em] transition-colors hover:bg-charcoal hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Send Message
          </button>
        </form>
      </Container>
    </section>
  );
}

export async function generateMetadata() {
  const siteSettings = await fetchSanity<SiteSettings>(siteSettingsQuery);

  return buildMetadata({
    title: "Contact",
    description: "Contact the photographer for projects, commissions, and collaborations.",
    pathname: "/contact",
    siteSettings,
  });
}
