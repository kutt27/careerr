import Groq from "groq-sdk";
import { Level, IntakeAnswer, ReflectionProfile, Roadmap } from "../types";
import { GEMINI_PROMPT_TEMPLATE, GEMINI_REFLECTION_TEMPLATE } from "./templates";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
  dangerouslyAllowBrowser: true 
});

export async function generateReflection(topic: string, level: Level, answers: IntakeAnswer[]): Promise<ReflectionProfile> {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are an expert learning assistant. Analyze the user's answers and output a JSON reflection profile."
      },
      {
        role: "user",
        content: GEMINI_REFLECTION_TEMPLATE(topic, level, answers)
      }
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" }
  });

  const content = completion.choices[0]?.message?.content || "";
  try {
    return JSON.parse(content) as ReflectionProfile;
  } catch (e) {
    console.error("Failed to parse Groq reflection:", content);
    throw new Error("Failed to generate reflection profile");
  }
}

export async function generateRoadmap(topic: string, level: Level, answers: IntakeAnswer[]): Promise<Roadmap> {
  // Stage 1: Generate self-reflection profile
  let reflection: ReflectionProfile;
  try {
    reflection = await generateReflection(topic, level, answers);
  } catch (e) {
    console.error("Failed to generate reflection with Groq, using default profile:", e);
    reflection = {
      sentiment: "neutral",
      learning_style_preference: "conceptual + examples",
      motivation_trigger: "completing milestones",
      risk_factors: ["time constraints"],
      current_trend_frame: topic
    };
  }

  // Stage 2: Generate personalized roadmap
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are an expert career consultant. Always respond with valid JSON."
      },
      {
        role: "user",
        content: GEMINI_PROMPT_TEMPLATE(topic, level, answers, reflection)
      }
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" }
  });

  const content = completion.choices[0]?.message?.content || "";
  try {
    return JSON.parse(content) as Roadmap;
  } catch (e) {
    console.error("Failed to parse Groq roadmap:", content);
    throw new Error("Invalid roadmap format received from AI");
  }
}
