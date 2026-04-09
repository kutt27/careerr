import { GoogleGenAI, Type } from "@google/genai";
import { Roadmap, Level } from "../types";
import { GEMINI_PROMT_TEMPLATE } from "./templates";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateRoadmap(topic: string, level: Level, analysis: string): Promise<Roadmap> {
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash", // Updated to a stable model name if preview was an issue, but keeping it modern
    contents: GEMINI_PROMT_TEMPLATE(topic, level, analysis),
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          level: { type: Type.STRING },
          overview: { type: Type.STRING, description: "A brief overview of what this level covers for this topic." },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                topics: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                estimatedTime: { type: Type.STRING, description: "e.g., '1-2 weeks'" }
              },
              required: ["title", "description", "topics"]
            }
          }
        },
        required: ["topic", "level", "overview", "steps"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from AI");
  }

  try {
    return JSON.parse(text) as Roadmap;
  } catch (e) {
    console.error("Failed to parse roadmap JSON:", text);
    throw new Error("Invalid roadmap format received from AI");
  }
}
