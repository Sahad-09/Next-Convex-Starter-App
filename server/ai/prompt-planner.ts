import { ChatOpenAI } from "@langchain/openai";

/**
 * Produces a concise, higher-quality image prompt for Jelly 3D icon generation.
 * Keeps cost low by using a small model and a short system instruction.
 *
 * Input: user's base prompt (could be long). Output: a short, clean prompt.
 */
export async function planImagePrompt(basePrompt: string): Promise<string> {
  const modelName = process.env.AI_PLANNER_MODEL ?? "gpt-4o-mini";
  const temperature = Number(process.env.AI_PLANNER_TEMPERATURE ?? 0.2);

  const llm = new ChatOpenAI({
    model: modelName,
    temperature,
  });

  const system = [
    "You are an expert visual designer who writes world-class prompts for generating Jelly 3D app icons.",
    "Output only the improved prompt text, nothing else.",
    "Constraints:",
    "- Keep it concise (< 220 tokens).",
    "- Always specify: rounded square base, translucent jelly/glass material, inner glow, soft studio lighting, soft ambient shadow.",
    "- Prefer neutral/warm background and 1024x1024 square output.",
    "- Stay faithful to the given description; do not invent brand elements.",
  ].join("\n");

  const user = [
    "Base description for the icon:",
    basePrompt,
    "\nNow return only the refined image generation prompt for a Jelly 3D icon.",
  ].join("\n\n");

  const res = await llm.invoke([
    { role: "system", content: system },
    { role: "user", content: user },
  ]);

  const content = typeof res.content === "string"
    ? res.content
    : Array.isArray(res.content)
      ? res.content.map((c: any) => (typeof c === "string" ? c : (c?.text ?? ""))).join("")
      : String(res.content ?? "");

  return content.trim();
}


