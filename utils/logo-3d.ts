// Logo to 3D Icon Conversion Utilities

export interface Logo3DOptions {
  lighting: number;
  depth: number;
  gloss: number;
  borderRadius: number;
  backgroundStyle: "neutral" | "gradient" | "glass";
  colorEnhancement: number;
}

export const defaultOptions: Logo3DOptions = {
  lighting: 75,
  depth: 60,
  gloss: 80,
  borderRadius: 85,
  backgroundStyle: "neutral",
  colorEnhancement: 50,
};

export const generateLogoPrompt = (options: Logo3DOptions): string => {
  const styles = {
    neutral: "on a neutral cream beige background with soft shadows",
    gradient:
      "with a subtle gradient background transitioning from light to slightly darker neutral tones",
    glass:
      "with a translucent glassmorphism background with subtle frosted glass effects",
  } as const;

  const lightingTerms = {
    low: "subtle ambient lighting",
    medium: "soft directional lighting from top-left",
    high: "dramatic studio lighting with pronounced highlights",
  } as const;

  const depthTerms = {
    low: "slight embossed effect",
    medium: "moderate 3D depth with beveled edges",
    high: "pronounced 3D extrusion with deep shadows",
  } as const;

  const glossTerms = {
    low: "matte finish",
    medium: "semi-gloss surface",
    high: "high-gloss reflective surface",
  } as const;

  const roundnessTerms = {
    low: "slightly rounded corners",
    medium: "moderately rounded corners",
    high: "very rounded iOS-style corners",
  } as const;

  const getLightingLevel = (value: number) =>
    value < 40 ? "low" : value < 70 ? "medium" : "high";
  const getDepthLevel = (value: number) =>
    value < 35 ? "low" : value < 65 ? "medium" : "high";
  const getGlossLevel = (value: number) =>
    value < 35 ? "low" : value < 65 ? "medium" : "high";
  const getRoundnessLevel = (value: number) =>
    value < 35 ? "low" : value < 65 ? "medium" : "high";

  return `Transform this logo into a modern 3D app icon with ${
    roundnessTerms[getRoundnessLevel(options.borderRadius) as keyof typeof roundnessTerms]
  } in a rounded square container.
Apply ${
    depthTerms[getDepthLevel(options.depth) as keyof typeof depthTerms]
  } and ${
    glossTerms[getGlossLevel(options.gloss) as keyof typeof glossTerms]
  } finish.
Use ${
    lightingTerms[getLightingLevel(options.lighting) as keyof typeof lightingTerms]
  } ${styles[options.backgroundStyle]}.
${
    options.colorEnhancement > 60
      ? "Enhance colors with modern gradients while preserving logo identity. "
      : ""
  }
Style should be professional SaaS app icon, reminiscent of iOS Big Sur design language.
Ultra high resolution, 1024x1024 pixels, perfect for app store use.`;
};

export const loadImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export const downloadImage = (
  dataUrl: string,
  filename: string = "logo-3d-icon.png"
) => {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


// System default prompt for logo-only 3D icon generation
export const JELLY_3D_SYSTEM_PROMPT = `You are a specialized AI that creates 3D digital icons from provided logos.

Requirements:
- Only the logo itself; no background base, container, badge, or rounded-square button.
- Front orthographic view, perfectly straight: no tilt, rotation, skew, or perspective warp.
- Preserve the logo’s original colors as much as possible; avoid recoloring unless the source is monochrome.
- Slight extrusion of the logo geometry; smooth rounded edges.
- Material: soft jelly-like translucent/glassy look with a glossy finish and soft reflections.
- Lighting: gentle top-left studio highlight with soft ambient fill.
- Shadow: soft, diffused drop shadow directly underneath the logo.
- Background: fully transparent; output as PNG with alpha channel.
- Composition: centered, evenly framed, no cropping, 1:1 square (minimum 1024x1024).

Follow the above precisely.`;

export function buildEnhancedPrompt(
  logoDescription: string,
  options?: {
    baseColor?: string;
    iconColor?: string;
    glowIntensity?: number;
    shadowOpacity?: number;
  }
): string {
  const iconColor = options?.iconColor || "use the original logo colors";
  const glow = options?.glowIntensity ?? 70;
  const shadow = options?.shadowOpacity ?? 15;

  return `${JELLY_3D_SYSTEM_PROMPT}

Create the 3D icon for: ${logoDescription}

Additional specifications:
- Color: ${iconColor}; preserve brand colors as much as possible
- Geometry: slight extrusion; smooth rounded edges
- Material: soft translucent jelly/glass effect with subtle internal glow (${glow}%)
- Camera: front orthographic; perfectly straight; no tilt or rotation
- Lighting: gentle top-left studio light highlight; soft ambient fill
- Shadow: soft diffused drop shadow directly underneath (opacity ~${shadow}%)
- Background: transparent PNG with alpha; no background base, container, or gradient
- Quality: ultra high resolution, square 1024x1024`;
}


