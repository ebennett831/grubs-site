import { getCloudflareContext } from "@opennextjs/cloudflare";
import { revalidateTag } from "next/cache";
import { type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { SANITY_CACHE_TAG } from "@/lib/sanity/fetch";

type SanityWebhookPayload = {
  _id?: string;
  _type?: string;
};

async function tokensMatch(actual: string, expected: string) {
  const encoder = new TextEncoder();
  const [actualHash, expectedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(actual)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  const actualBytes = new Uint8Array(actualHash);
  const expectedBytes = new Uint8Array(expectedHash);
  let difference = 0;

  for (let index = 0; index < actualBytes.length; index += 1) {
    difference |= actualBytes[index] ^ expectedBytes[index];
  }

  return difference === 0;
}

async function hasValidBearerToken(request: NextRequest, secret: string) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return false;
  }

  return tokensMatch(authorization.slice("Bearer ".length), secret);
}

function getRevalidationSecret() {
  try {
    const { env } = getCloudflareContext();
    const cloudflareEnv = env as CloudflareEnv & {
      SANITY_REVALIDATE_SECRET?: string;
    };

    if (cloudflareEnv.SANITY_REVALIDATE_SECRET) {
      return cloudflareEnv.SANITY_REVALIDATE_SECRET;
    }
  } catch {
    // The Cloudflare request context is unavailable under the normal Next.js
    // development server, where process.env supplies the local fallback.
  }

  return process.env.SANITY_REVALIDATE_SECRET;
}

export async function POST(request: NextRequest) {
  const secret = getRevalidationSecret();

  if (!secret) {
    return Response.json(
      { message: "The Sanity revalidation secret is not configured." },
      { status: 500 },
    );
  }

  try {
    let body: SanityWebhookPayload | null;

    if (await hasValidBearerToken(request, secret)) {
      await new Promise((resolve) => setTimeout(resolve, 3_000));
      body = (await request.json()) as SanityWebhookPayload;
    } else {
      const parsedWebhook = await parseBody<SanityWebhookPayload>(
        request,
        secret,
        true,
      );

      if (!parsedWebhook.isValidSignature) {
        return Response.json(
          { message: "Invalid Sanity webhook authorization." },
          { status: 401 },
        );
      }

      body = parsedWebhook.body;
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
