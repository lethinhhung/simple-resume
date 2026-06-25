// Server-side proxy for AI Autofill. Holds the app-owned Gemini key (env var),
// guards against abuse (same-origin, size cap, in-memory per-IP rate limit),
// and forwards the user's text to Gemini. It stores nothing and never touches
// persisted resume data. The response is normalized on the client.

import { callGemini, GeminiError } from "@/lib/autofill/gemini";
import { checkRateLimit, recordRequest } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_CONTENT_LENGTH = 100_000; // raw body bytes, rejected before parsing
const MAX_INPUT_CHARS = 20_000; // text + style characters

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function clientKey(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "local";
}

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser callers are still bound by rate limit + size cap
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Autofill is not configured on this server." },
      { status: 500 }
    );
  }

  if (!sameOrigin(req)) {
    return Response.json(
      { error: "Cross-origin requests are not allowed." },
      { status: 403 }
    );
  }

  if (Number(req.headers.get("content-length") ?? 0) > MAX_CONTENT_LENGTH) {
    return Response.json({ error: "Input is too long." }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const text = isObject(payload) && typeof payload.text === "string" ? payload.text : "";
  const style =
    isObject(payload) && typeof payload.style === "string" ? payload.style : "";

  if (!text.trim()) {
    return Response.json(
      { error: "Paste some text to autofill from." },
      { status: 400 }
    );
  }
  if (text.length + style.length > MAX_INPUT_CHARS) {
    return Response.json(
      { error: "Input is too long. Please shorten it." },
      { status: 413 }
    );
  }

  const key = clientKey(req);
  const now = Date.now();
  const limit = checkRateLimit(key, now);
  if (!limit.allowed) {
    return Response.json(
      {
        error: "Too many autofill requests. Please wait a moment.",
        retryAfterMs: limit.retryAfterMs,
      },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) },
      }
    );
  }
  // Count the attempt now (before the call) so retry loops can't burn quota.
  recordRequest(key, now);

  try {
    const data = await callGemini({ text, style, apiKey, model: process.env.GEMINI_MODEL });
    return Response.json({ data });
  } catch (err) {
    if (err instanceof GeminiError) {
      console.error("[autofill] Gemini error:", err.status, err.message, err.detail);
    } else {
      console.error("[autofill] Unexpected error:", err);
    }
    return Response.json(
      { error: "The AI service could not process this text. Please try again." },
      { status: 502 }
    );
  }
}
