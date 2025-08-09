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


// Exact system prompt required for Jelly 3D icon generation
export const JELLY_3D_SYSTEM_PROMPT = `You are a specialized AI that creates Jelly 3D Icons with the following specifications:

{
  "style": "Jelly 3D Icon",
  "object": "User-uploaded logo or emoji (e.g. Netflix N, Ghost, Spotify icon, etc.)",
  "base": {
    "shape": "Rounded square",
    "material": "Soft translucent jelly-like material",
    "color": "A strong contrasting color to icon (e.g. purple, green, blue)",
    "lighting": "Inner glow and soft ambient shadows that gently fade outward"
  },
  "icon": {
    "material": "Jelly/glassy translucent look, softly glowing from within",
    "color": "Brighter tone or brand color, always with a jelly-glass texture",
    "depth": "3D extruded with rounded edges and subtle bottom shadow",
    "placement": "Centered with even padding inside base"
  },
  "render": {
    "camera": "Front orthographic view with centered framing",
    "lighting": "Studio-quality lighting with soft top-left highlight and directional drop shadow underneath icon",
    "shadow": {
      "style": "Soft diffused base shadow with slight blur",
      "position": "Directly under icon, slightly offset down",
      "opacity": 0.15,
      "spread": "Medium, matching other icons in set"
    },
    "background": "Soft warm grey or pastel cream for consistency",
    "dimensions": "1:1 square ratio, minimum 1024x1024",
    "file_format": "PNG"
  },
  "style_notes": "Ensure consistent lighting and shadow softness across the set. Shadows should appear slightly beneath and behind the icon with soft blur — matching the Spotify, Camera, and Weather icon samples exactly. Avoid flat or harsh shadows. Emphasize clean separation between icon and base through shadow and depth."
}

Create jelly 3D icons that are translucent, soft, with inner glow effects and perfect studio lighting.

A 3D-rendered icon showcases the uploaded logo, placed at the center of a soft, jelly-like button with rounded corners. The icon appears raised, glowing subtly with a soft internal halo effect. The button base features a contrasting translucent color, while the logo adopts a brighter tone with a jelly-glass texture. The background is a smooth gradient of pastel or warm cream, with soft ambient lighting and diffused shadows enhancing the overall depth and clarity.`;

export function buildEnhancedPrompt(
  logoDescription: string,
  options?: {
    baseColor?: string;
    iconColor?: string;
    glowIntensity?: number;
    shadowOpacity?: number;
  }
): string {
  const baseColor = options?.baseColor || "vibrant purple with translucent jelly material";
  const iconColor = options?.iconColor || "bright contrasting color with glass-like finish";
  const glow = options?.glowIntensity ?? 70;
  const shadow = options?.shadowOpacity ?? 15;

  return `${JELLY_3D_SYSTEM_PROMPT}

Create a jelly 3D icon for: ${logoDescription}

Additional specifications:
- Base color: ${baseColor}
- Icon color: ${iconColor}
- Glow intensity: ${glow}% inner glow
- Shadow opacity: ${shadow}% soft diffused shadow
- Material: Translucent jelly/glass hybrid with soft inner lighting
- Style: Modern iOS Big Sur aesthetic with enhanced jelly properties
- Quality: Ultra high resolution, perfect for app store use

Render as a perfect 1024x1024 jelly 3D icon with studio lighting and soft shadows.`;
}


