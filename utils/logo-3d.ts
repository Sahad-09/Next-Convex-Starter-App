// Single, canonical prompt for all image generations
export const JELLY_3D_SYSTEM_PROMPT =
  "A 3D digital icon featuring the provided logo with no background base — only the logo itself, perfectly straight with no tilt or rotation, viewed from the front orthographic perspective. Preserve the logo’s original colors as much as possible. The logo should be slightly extruded with a glossy finish, smooth edges, and soft reflections. Use a soft jelly-like translucent material effect on the logo, with a gentle top-left studio light highlight and a diffused drop shadow directly underneath. Transparent background PNG output.";

// Backwards-compatible export used by callers; returns the single prompt
export function buildEnhancedPrompt(): string {
  return JELLY_3D_SYSTEM_PROMPT;
}


