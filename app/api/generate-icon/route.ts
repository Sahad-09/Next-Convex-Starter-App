import { NextRequest, NextResponse } from "next/server";

const OPENAI_URL = "https://api.openai.com/v1/images/generations";
const OPENAI_URL_EDITS = "https://api.openai.com/v1/images/edits";

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

    // Support both JSON (no file) and multipart (file + prompt)
    const contentType = req.headers.get("content-type") || "";
    let prompt: string | undefined;
    let model = "gpt-image-1";
    let size: string = "1024x1024";
    let quality: string = "high";
    let fileBlob: Blob | undefined;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      prompt = String(form.get("prompt") || "");
      model = String(form.get("model") || model);
      size = String(form.get("size") || size);
      quality = String(form.get("quality") || quality);
      const file = form.get("file");
      if (file && file instanceof Blob) {
        fileBlob = file;
      }
    } else {
      const body = await req.json();
      prompt = body?.prompt;
      model = body?.model ?? model;
      size = body?.size ?? size;
      quality = body?.quality ?? quality;
    }

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
    }

    const start = Date.now();
    console.log("[generate-icon] Requesting OpenAI", {
      model,
      size,
      quality,
      promptLen: typeof prompt === "string" ? prompt.length : 0,
    });

    // Time out the upstream call to avoid hanging
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 150000);
    let response: Response;
    if (fileBlob) {
      // Multipart for edits/variations-like flow (gpt-image-1 accepts input_image)
      const form = new FormData();
      form.append("model", model);
      form.append("prompt", prompt);
      form.append("size", size);
      form.append("quality", quality);
      form.append("background", "transparent");
      form.append("output_format", "png");
      form.append("image", fileBlob, "input.png");

      response = await fetch(OPENAI_URL_EDITS, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: form,
        signal: controller.signal,
      });
    } else {
      // JSON generation flow
      response = await fetch(OPENAI_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          prompt,
          size,
          quality,
          n: 1,
          background: "transparent",
          output_format: "png",
        }),
        signal: controller.signal,
      });
    }
    clearTimeout(timeout);

    const durationMs = Date.now() - start;
    if (!response.ok) {
      const raw = await response.text();
      console.error("[generate-icon] OpenAI image error", {
        status: response.status,
        durationMs,
        raw: raw?.slice(0, 1200) ?? "",
      });
      let err: unknown = {};
      try {
        err = JSON.parse(raw);
      } catch {
        // keep err as {}
      }
      return NextResponse.json(
        { error: (err as { error?: { message?: string } })?.error?.message || `OpenAI request failed (${response.status})` },
        { status: 500 }
      );
    }

    const data = (await response.json()) as {
      data?: Array<{ url?: string; b64_json?: string; [k: string]: unknown }>;
      [k: string]: unknown;
    };
    const item = data?.data?.[0] ?? {};
    const url = (item as any)?.url as string | undefined;
    const b64 = (item as any)?.b64_json as string | undefined;
    if (!url) {
      if (b64) {
        console.log("[generate-icon] Received base64 image, returning data URL", { durationMs });
        return NextResponse.json({ url: `data:image/png;base64,${b64}` });
      }
      console.error("[generate-icon] No image generated", {
        durationMs,
        dataKeys: Object.keys(data || {}),
        hasDataArray: Array.isArray((data as any).data),
        dataLen: Array.isArray((data as any).data) ? (data as any).data.length : 0,
        itemKeys: Object.keys(item || {}),
      });
      return NextResponse.json({ error: "No image generated" }, { status: 500 });
    }
    console.log("[generate-icon] Success, received image URL", { durationMs });
    return NextResponse.json({ url });
  } catch (err) {
    const isAbort = (err as any)?.name === "AbortError";
    console.error(
      "[generate-icon] Exception",
      isAbort ? "AbortError (timeout)" : (err as Error)?.message || err
    );
    return NextResponse.json(
      { error: isAbort ? "Upstream timeout" : (err as Error)?.message || "Server error" },
      { status: 500 }
    );
  }
}