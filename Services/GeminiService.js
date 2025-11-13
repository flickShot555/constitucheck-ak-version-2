// src/Services/GeminiService.js
import { GEMINI_API_KEY, GEMINI_MODEL_ID } from "../config/gemini";

export async function sendToGemini(promptText) {
  if (!GEMINI_API_KEY || !GEMINI_MODEL_ID) {
    throw new Error("Gemini config missing.");
  }

  const endpoint =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL_ID}:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          { text: promptText }
        ]
      }
    ]
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini request failed: ${res.status} — ${err}`);
  }

  const json = await res.json();

  const text =
    json?.candidates?.[0]?.content?.[0]?.text ??
    json?.candidates?.[0]?.content?.map(p => p.text).join("") ??
    JSON.stringify(json);

  return { text };
}
