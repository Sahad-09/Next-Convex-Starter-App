// Client-side color palette extraction from an uploaded File
// Zero token cost: uses Canvas to sample colors and derive a base/icon palette

import { loadImageFromFile } from "@/utils/logo-3d";

type Rgb = { r: number; g: number; b: number };
type Hsl = { h: number; s: number; l: number };

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function rgbToHex({ r, g, b }: Rgb): string {
  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb({ h, s, l }: Hsl): Rgb {
  const H = clamp(h, 0, 360) / 360;
  const S = clamp(s, 0, 100) / 100;
  const L = clamp(l, 0, 100) / 100;

  if (S === 0) {
    const v = Math.round(L * 255);
    return { r: v, g: v, b: v };
  }

  const q = L < 0.5 ? L * (1 + S) : L + S - L * S;
  const p = 2 * L - q;

  const hue2rgb = (t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const r = Math.round(hue2rgb(H + 1 / 3) * 255);
  const g = Math.round(hue2rgb(H) * 255);
  const b = Math.round(hue2rgb(H - 1 / 3) * 255);
  return { r, g, b };
}

function getComplementaryColor(rgb: Rgb, lightnessAdjust = 0): Rgb {
  const hsl = rgbToHsl(rgb);
  const h = (hsl.h + 180) % 360;
  const l = clamp(hsl.l + lightnessAdjust, 0, 100);
  return hslToRgb({ h, s: hsl.s, l });
}

function computeAverageColor(image: HTMLImageElement): Rgb {
  const targetWidth = 64;
  const aspect = image.naturalHeight === 0 ? 1 : image.naturalWidth / image.naturalHeight;
  const width = targetWidth;
  const height = Math.max(1, Math.round(width / (aspect || 1)));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { r: 127, g: 127, b: 127 };
  ctx.drawImage(image, 0, 0, width, height);
  const { data } = ctx.getImageData(0, 0, width, height);

  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  let count = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a < 10) continue; // skip transparent
    // skip near white/black to avoid background and empty areas
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max < 15 || min > 240) continue;
    rSum += r; gSum += g; bSum += b; count++;
  }
  if (count === 0) return { r: 127, g: 127, b: 127 };
  return { r: Math.round(rSum / count), g: Math.round(gSum / count), b: Math.round(bSum / count) };
}

export async function extractPaletteFromFile(file: File): Promise<{ baseColor: string; iconColor: string }> {
  const image = await loadImageFromFile(file);
  const avg = computeAverageColor(image);

  // Treat the average as the icon color, then derive a contrasting base color
  const iconHex = rgbToHex(avg);
  const baseRgb = getComplementaryColor(avg, 10); // slightly lighter complement for the base
  const baseHex = rgbToHex(baseRgb);

  return {
    baseColor: baseHex,
    iconColor: iconHex,
  };
}


