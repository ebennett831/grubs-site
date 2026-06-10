"use client";

import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export default function StudioPage() {
  if (!projectId || !dataset) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
        <div className="space-y-4 rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-black/60">Sanity Studio</p>
          <h1 className="text-3xl font-semibold text-black">Studio is not configured yet</h1>
          <p className="text-black/70">
            Add your Sanity project ID and dataset to .env.local, then restart npm run dev.
          </p>
          <pre className="overflow-x-auto rounded-lg bg-black/5 p-4 text-sm text-black/80">
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
          </pre>
        </div>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
