import { getTrimmedString } from "@/lib/utils/content";

const DEFAULT_ACCENT = "#9f5d3f";
const CREAM = "#f7f2ea";
const CHARCOAL = "#181513";
const HEX_COLOR_PATTERN = /^#[\da-f]{6}$/i;

type Rgb = {
  red: number;
  green: number;
  blue: number;
};

function parseHexColor(value: string): Rgb {
  return {
    red: Number.parseInt(value.slice(1, 3), 16),
    green: Number.parseInt(value.slice(3, 5), 16),
    blue: Number.parseInt(value.slice(5, 7), 16),
  };
}

function getRelativeLuminance({ red, green, blue }: Rgb) {
  const [normalizedRed, normalizedGreen, normalizedBlue] = [
    red,
    green,
    blue,
  ].map((channel) => {
    const normalizedChannel = channel / 255;
    return normalizedChannel <= 0.04045
      ? normalizedChannel / 12.92
      : ((normalizedChannel + 0.055) / 1.055) ** 2.4;
  });

  return (
    0.2126 * normalizedRed + 0.7152 * normalizedGreen + 0.0722 * normalizedBlue
  );
}

function getContrastRatio(firstColor: string, secondColor: string) {
  const firstLuminance = getRelativeLuminance(parseHexColor(firstColor));
  const secondLuminance = getRelativeLuminance(parseHexColor(secondColor));
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

function toHexChannel(value: number) {
  return Math.round(value).toString(16).padStart(2, "0");
}

function mixColors(firstColor: string, secondColor: string, amount: number) {
  const first = parseHexColor(firstColor);
  const second = parseHexColor(secondColor);

  return `#${toHexChannel(first.red + (second.red - first.red) * amount)}${toHexChannel(
    first.green + (second.green - first.green) * amount,
  )}${toHexChannel(first.blue + (second.blue - first.blue) * amount)}`;
}

function getReadableAccent(accent: string) {
  if (getContrastRatio(accent, CREAM) >= 4.5) {
    return accent;
  }

  for (let step = 1; step <= 20; step += 1) {
    const candidate = mixColors(accent, CHARCOAL, step / 20);
    if (getContrastRatio(candidate, CREAM) >= 4.5) {
      return candidate;
    }
  }

  return CHARCOAL;
}

export function getThemeColors(value: unknown) {
  const configuredAccent = getTrimmedString(value);
  const accentSurface =
    configuredAccent && HEX_COLOR_PATTERN.test(configuredAccent)
      ? configuredAccent.toLowerCase()
      : DEFAULT_ACCENT;
  const creamContrast = getContrastRatio(accentSurface, CREAM);
  const charcoalContrast = getContrastRatio(accentSurface, CHARCOAL);

  return {
    accent: getReadableAccent(accentSurface),
    accentSurface,
    accentContrast: creamContrast >= charcoalContrast ? CREAM : CHARCOAL,
  };
}
