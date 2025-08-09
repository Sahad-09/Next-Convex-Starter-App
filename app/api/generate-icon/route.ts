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
    const { prompt, model = "dall-e-3", size = "1024x1024", quality = "standard" } = body ?? {};

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
    }

    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, prompt, size, quality, n: 1 }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: err?.error?.message || `OpenAI request failed (${response.status})` },
        { status: 500 }
      );
    }

    const data = (await response.json()) as { data?: Array<{ url: string }> };
    const url = data?.data?.[0]?.url;
    if (!url) return NextResponse.json({ error: "No image generated" }, { status: 500 });
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


