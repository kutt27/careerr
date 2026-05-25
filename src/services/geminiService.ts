import { GoogleGenAI, Type } from "@google/genai";
import { Roadmap, Level, IntakeAnswer, ReflectionProfile, ExpandedPhase } from "../types";
import { GEMINI_PROMPT_TEMPLATE, GEMINI_REFLECTION_TEMPLATE, PHASE_BATCH_EXPANSION_TEMPLATE } from "./templates";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateReflection(topic: string, level: Level, answers: IntakeAnswer[]): Promise<ReflectionProfile> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: GEMINI_REFLECTION_TEMPLATE(topic, level, answers),
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sentiment: { type: Type.STRING },
          learning_style_preference: { type: Type.STRING },
          motivation_trigger: { type: Type.STRING },
          risk_factors: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          current_trend_frame: { type: Type.STRING }
        },
        required: ["sentiment", "learning_style_preference", "motivation_trigger", "risk_factors", "current_trend_frame"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("Failed to generate reflection profile");
  }
  return JSON.parse(text) as ReflectionProfile;
}

export async function generateRoadmap(topic: string, level: Level, answers: IntakeAnswer[]): Promise<Roadmap> {
  // Stage 1: Generate self-reflection profile
  let reflection: ReflectionProfile;
  try {
    reflection = await generateReflection(topic, level, answers);
  } catch (e) {
    console.error("Failed to generate reflection, using default profile:", e);
    reflection = {
      sentiment: "neutral",
      learning_style_preference: "conceptual + examples",
      motivation_trigger: "completing milestones",
      risk_factors: ["time constraints"],
      current_trend_frame: topic
    };
  }

  // Stage 2: Generate personalized roadmap
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: GEMINI_PROMPT_TEMPLATE(topic, level, answers, reflection),
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          level: { type: Type.STRING },
          overview: { type: Type.STRING, description: "A brief overview of what this level covers for this topic." },
          phase_count: { type: Type.INTEGER },
          phases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                style: { type: Type.STRING },
                motivation_hook: { type: Type.STRING },
                tasks: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["id", "title", "style", "motivation_hook", "tasks"]
            }
          }
        },
        required: ["topic", "level", "overview", "phase_count", "phases"]
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

export async function expandPhaseBatch(
  topic: string,
  phases: { id: string; title: string; style: string; motivation_hook: string; tasks: string[] }[]
): Promise<ExpandedPhase[]> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: PHASE_BATCH_EXPANSION_TEMPLATE(topic, phases),
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          expanded_phases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                style: { type: Type.STRING },
                expanded_tasks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      original: { type: Type.STRING },
                      why: { type: Type.STRING },
                      how: { type: Type.STRING },
                      keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                      pitfall: { type: Type.STRING },
                      outcome: { type: Type.STRING }
                    },
                    required: ["original", "why", "how", "keywords", "pitfall", "outcome"]
                  }
                }
              },
              required: ["id", "title", "style", "expanded_tasks"]
            }
          }
        },
        required: ["expanded_phases"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from AI for batch expansion");
  }

  try {
    const parsed = JSON.parse(text);
    if (!parsed.expanded_phases || !Array.isArray(parsed.expanded_phases)) {
      throw new Error("Missing expanded_phases array in response");
    }
    return parsed.expanded_phases as ExpandedPhase[];
  } catch (e) {
    console.error("Failed to parse batch expansion JSON:", text);
    throw new Error("Invalid batch expansion format received from AI");
  }
}

