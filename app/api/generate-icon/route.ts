import { NextRequest, NextResponse } from "next/server";

const OPENAI_URL = "https://api.openai.com/v1/images/generations";

// POST /api/generate-icon
// Body: { prompt: string, model?: string, size?: string, quality?: string }
export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY on server" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { prompt, model = "gpt-image-1", size = "1024x1024", quality = "high" } = body ?? {};

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
    }

    console.log("[generate-icon] Requesting OpenAI", {
      model,
      size,
      quality,
      promptLen: typeof prompt === "string" ? prompt.length : 0,
    });

    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, prompt, size, quality, n: 1 }),
    });

    if (!response.ok) {
      const raw = await response.text();
      console.error("[generate-icon] OpenAI image error", response.status, raw);
      let err: any = {};
      try {
        err = JSON.parse(raw);
      } catch {
        // keep err as {}
      }
      return NextResponse.json(
        { error: err?.error?.message || `OpenAI request failed (${response.status})` },
        { status: 500 }
      );
    }

    const data = (await response.json()) as { data?: Array<{ url: string }> };
    const url = data?.data?.[0]?.url;
    if (!url) return NextResponse.json({ error: "No image generated" }, { status: 500 });
    console.log("[generate-icon] Success, received image URL");
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


