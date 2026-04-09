import Groq from "groq-sdk";
import { GROQ_ROADMAP_TEMPLATE } from "./templates";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
  dangerouslyAllowBrowser: true 
});

export async function analyzeTopic(topic: string, level: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are an expert career consultant."
      },
      {
        role: "user",
        content: GROQ_ROADMAP_TEMPLATE(topic, level)
      }
    ],
    model: "llama-3.3-70b-versatile",
  });

  return completion.choices[0]?.message?.content || "No analysis provided.";
}
