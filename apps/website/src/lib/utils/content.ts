const SAFE_WEB_PROTOCOLS = new Set(["http:", "https:"]);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function getTrimmedString(value: unknown): string | null {
  return isNonEmptyString(value) ? value.trim() : null;
}

export function getSafeExternalHref(value: unknown): string | null {
  const candidate = getTrimmedString(value);

  if (!candidate) {
    return null;
  }

  try {
    const parsedUrl = new URL(candidate);
    return SAFE_WEB_PROTOCOLS.has(parsedUrl.protocol)
      ? parsedUrl.toString()
      : null;
  } catch {
    return null;
  }
}

export function getSafeEmailHref(value: unknown): string | null {
  const candidate = getTrimmedString(value);

  if (!candidate) {
    return null;
  }

  const email = candidate.toLowerCase().startsWith("mailto:")
    ? candidate.slice(7).trim()
    : candidate;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? `mailto:${email}` : null;
}

export function getSafeLinkHref(value: unknown): string | null {
  const candidate = getTrimmedString(value);

  if (!candidate) {
    return null;
  }

  if (
    (candidate.startsWith("/") && !candidate.startsWith("//")) ||
    candidate.startsWith("#")
  ) {
    return candidate;
  }

  if (candidate.toLowerCase().startsWith("mailto:")) {
    return getSafeEmailHref(candidate);
  }

  if (candidate.toLowerCase().startsWith("tel:")) {
    const telephone = candidate.slice(4).trim();
    return telephone && /^[+()\d.\s-]+$/.test(telephone)
      ? `tel:${telephone}`
      : null;
  }

  return getSafeExternalHref(candidate);
}

export function isExternalHref(href: string): boolean {
  try {
    return SAFE_WEB_PROTOCOLS.has(new URL(href).protocol);
  } catch {
    return false;
  }
}
