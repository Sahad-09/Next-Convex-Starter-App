// Browser-safe helper that calls our server route instead of using a client-side key

export interface OpenAIImageRequest {
  prompt: string;
  model?: string;
  size?: "1024x1024" | "1792x1024" | "1024x1792";
  quality?: "standard" | "hd";
  usePlanner?: boolean;
}

export const generateJelly3DIcon = async (
  prompt: string,
  opts?: { model?: string; size?: OpenAIImageRequest["size"]; quality?: OpenAIImageRequest["quality"]; usePlanner?: boolean }
): Promise<string> => {
  const res = await fetch("/api/generate-icon", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, model: opts?.model, size: opts?.size, quality: opts?.quality, usePlanner: opts?.usePlanner ?? false }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || "Failed to generate image");
  }
  const data = (await res.json()) as { url: string };
  return data.url;
};

export const downloadImageFromUrl = async (imageUrl: string): Promise<string> => {
  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error("Failed to fetch image");
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};


