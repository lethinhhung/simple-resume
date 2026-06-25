// Server-only Gemini client. Imported exclusively by the /api/autofill route so
// the API key never reaches the browser bundle. Speaks the Gemini REST API
// directly (no SDK) and requests structured JSON via responseSchema.

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-2.5-flash";
const REQUEST_TIMEOUT_MS = 25_000;

export class GeminiError extends Error {
  status: number;
  detail?: string;
  constructor(message: string, status = 502, detail?: string) {
    super(message);
    this.name = "GeminiError";
    this.status = status;
    this.detail = detail;
  }
}

export const SYSTEM_PROMPT = `You convert a person's free-form text into structured JSON for a clean, professional resume, matching the provided schema. The text may describe ANY profession or industry — never assume a technical or software role. Infer the field from the content alone and use headings and wording that fit it.

LANGUAGE
- Write all output in English by default, even when the source is in another language: translate the wording, but keep proper nouns (people's names, employers, schools) and contact details (emails, phone numbers, links) exactly as written in the source.
- A writing-style instruction may override this to request a different language.

FAITHFULNESS (the source is the only source of truth)
- Use ONLY facts present in the source. Never invent or inflate employers, titles, dates, numbers/metrics, skills, schools, degrees, awards, or contact details. If a value is unknown, leave it as an empty string — do not guess.
- Do not attribute a fact to a specific job, employer, or school unless the source clearly links them. Standalone projects or achievements that aren't tied to a role belong in their own "entry" section (e.g. labelled "Projects" or "Key Achievements"), not folded into an employer's bullets.

RESUME VOICE
- Write the summary and all descriptions in concise resume style: drop the person's name and third-person pronouns (he/she/they). Rewrite "John is a Senior Engineer with 8 years of experience who leads a team" as "Senior Engineer with 8+ years of experience leading a team."
- Begin experience bullets with strong past-tense action verbs; keep them tight and outcome-focused; preserve any metrics exactly as given.
- Include only content that belongs on a professional resume. Do NOT add a personal hobbies/interests section by default. Fold professionally relevant activities (mentoring, open-source work, speaking, volunteering, publications) into a fitting professional section; omit purely personal hobbies. (A writing-style instruction may override this.)

SECTION TYPES (pick the best fit per block; "label" is a heading suited to the content, e.g. "Summary", "Experience", "Education", "Skills", "Certifications", "Languages")
- text: a summary/objective paragraph (use "content").
- entry: jobs, roles, experience, or projects (use "entries"; title = role/position, subtitle = company/organization, plus location, dates, achievement "bullets"). For ongoing roles write dates as "Present" (e.g. "2022 – Present"); never put a phrase like "currently working" in a date field. Use an en dash for ranges.
- education: schools and degrees (use "entries"; fill institution, degree, location, dates, gpa). Put ONLY a numeric grade in "gpa"; honours or classifications such as "First Class Honours" go in "degree" or "description", never in "gpa".
- skills: grouped skill lists (use "categories"; category = group name, values = comma-separated). Group into a few logical categories when natural; otherwise use one category.
- list: short standalone items such as certifications, awards, publications, or languages (use "items"; name, optional detail, dates).
- For each section set "type" and fill ONLY that type's fields; leave the others empty.

HEADER
- header.name = the person's full name; header.subtitle = their headline/role; header.contacts = a flat list of contact strings (email, phone, location, links).

WRITING-STYLE INSTRUCTION
- Apply any requested style to WORDING and presentation only (tone, phrasing, verb choice, language, emphasis, which optional sections to include). It must never introduce facts absent from the source.`;

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    header: {
      type: "object",
      properties: {
        name: { type: "string" },
        subtitle: { type: "string" },
        contacts: { type: "array", items: { type: "string" } },
      },
      propertyOrdering: ["name", "subtitle", "contacts"],
    },
    sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          type: {
            type: "string",
            enum: ["text", "entry", "education", "skills", "list"],
          },
          content: { type: "string" },
          entries: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                subtitle: { type: "string" },
                institution: { type: "string" },
                degree: { type: "string" },
                location: { type: "string" },
                dates: { type: "string" },
                gpa: { type: "string" },
                description: { type: "string" },
                bullets: { type: "array", items: { type: "string" } },
              },
              propertyOrdering: [
                "title",
                "subtitle",
                "institution",
                "degree",
                "location",
                "dates",
                "gpa",
                "description",
                "bullets",
              ],
            },
          },
          categories: {
            type: "array",
            items: {
              type: "object",
              properties: {
                category: { type: "string" },
                values: { type: "string" },
              },
              propertyOrdering: ["category", "values"],
            },
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                detail: { type: "string" },
                dates: { type: "string" },
              },
              propertyOrdering: ["name", "detail", "dates"],
            },
          },
        },
        propertyOrdering: ["label", "type", "content", "entries", "categories", "items"],
      },
    },
  },
  propertyOrdering: ["header", "sections"],
  required: ["header", "sections"],
};

export interface GeminiCallOptions {
  text: string;
  style?: string;
  apiKey: string;
  model?: string;
}

/**
 * Calls Gemini and returns the parsed resume JSON (untrusted — must still pass
 * through the client-side normalizer before touching the store). Throws
 * GeminiError on transport, status, or parse failures.
 */
export async function callGemini({
  text,
  style,
  apiKey,
  model = DEFAULT_MODEL,
}: GeminiCallOptions): Promise<unknown> {
  const styleLine = style && style.trim()
    ? `\n\nWriting style to apply (wording only): ${style.trim()}`
    : "";

  const body = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [
      { role: "user", parts: [{ text: `Resume source text:\n\n${text}${styleLine}` }] },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.3,
    },
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`${ENDPOINT}/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    throw new GeminiError(
      err instanceof Error && err.name === "AbortError"
        ? "Gemini request timed out"
        : "Gemini request failed to send",
      502
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new GeminiError(`Gemini responded ${res.status}`, res.status, detail);
  }

  const json = (await res.json().catch(() => null)) as
    | { candidates?: { content?: { parts?: { text?: unknown }[] } }[] }
    | null;
  const partText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof partText !== "string") {
    throw new GeminiError("Gemini returned no content", 502);
  }

  try {
    return JSON.parse(partText);
  } catch {
    throw new GeminiError("Gemini returned invalid JSON", 502);
  }
}
