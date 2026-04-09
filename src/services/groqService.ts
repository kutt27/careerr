import Groq from "groq-sdk";
import { GROQ_INTAKE_QUESTIONS_TEMPLATE } from "./templates";
import { IntakeQuestions } from "../types";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
  dangerouslyAllowBrowser: true 
});

export async function getIntakeQuestions(topic: string, level: string): Promise<IntakeQuestions> {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are an expert career consultant. Always respond with valid JSON."
      },
      {
        role: "user",
        content: GROQ_INTAKE_QUESTIONS_TEMPLATE(topic, level)
      }
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" }
  });

  const content = completion.choices[0]?.message?.content || "";
  try {
    return JSON.parse(content) as IntakeQuestions;
  } catch (e) {
    console.error("Failed to parse Groq intake questions:", content);
    return {
      summary: "I'd like to ask a few questions to better customize your roadmap.",
      questions: ["What is your primary goal?", "How much time can you dedicate per week?"]
    };
  }
}
