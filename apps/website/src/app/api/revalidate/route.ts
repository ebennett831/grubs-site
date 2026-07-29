import { revalidateTag } from "next/cache";
import { type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { SANITY_CACHE_TAG } from "@/lib/sanity/fetch";

type SanityWebhookPayload = {
  _id?: string;
  _type?: string;
};

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return Response.json(
      { message: "The Sanity revalidation secret is not configured." },
      { status: 500 },
    );
  }

  try {
    const { body, isValidSignature } = await parseBody<SanityWebhookPayload>(
      request,
      secret,
      true,
    );

    if (!isValidSignature) {
      return Response.json(
        { message: "Invalid Sanity webhook signature." },
        { status: 401 },
      );
    }

    revalidateTag(SANITY_CACHE_TAG);

    return Response.json({
      revalidated: true,
      documentId: body?._id ?? null,
      documentType: body?._type ?? null,
    });
  } catch {
    return Response.json(
      { message: "Unable to process the Sanity webhook." },
      { status: 400 },
    );
  }
}
