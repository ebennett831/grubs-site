import Link from "next/link";

import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <section className="py-24">
      <Container className="space-y-6 text-center">
        <h1 className="font-serif-display text-charcoal text-5xl sm:text-6xl">
          Not Found
        </h1>
        <p className="text-charcoal/75">
          This page does not exist or is not published yet.
        </p>
        <Link
          href="/work"
          className="border-charcoal hover:bg-charcoal hover:text-cream inline-flex border px-6 py-3 text-xs tracking-[0.2em] uppercase"
        >
          Browse Work
        </Link>
      </Container>
    </section>
  );
}
