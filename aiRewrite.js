import { GoogleGenAI } from "@google/genai";
import config from "./config.js";

const ai = new GoogleGenAI({
  apiKey: config.AI_API_KEY,
});

export async function rewriteNews(title, article) {
  try {
    const prompt = `
Rewrite the following news article in unique English.

Requirements:
- Keep all facts correct.
- Create an SEO-friendly title.
- Write around 800 words if enough information is available.
- Return JSON only.

Title:
${title}

Article:
${article}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (err) {
    console.error(err);
    return null;
  }
}
