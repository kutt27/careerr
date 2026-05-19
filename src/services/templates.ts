import { IntakeAnswer } from "../types";

export const GEMINI_PROMPT_TEMPLATE = (topic: string, level: string, answers: IntakeAnswer[]) => {
  const formattedAnswers = answers.map(a => `Q: ${a.question}\nA: ${a.answer}`).join("\n\n");
  
  return `
You are a world-class career consultant, educational architect, and curriculum designer.
Create a highly customized, detailed learning roadmap for learning "${topic}" at the "${level}" level.

Here is the learner's profile, motivation, and learning preferences:
${formattedAnswers}

Guidelines for Roadmap Customization:
1. Pacing & Level: Adjust the complexity and tone to the user's "Previous exposure" and selected "Level".
2. Motivation & Success: Tailor the learning path and final milestones to align with their "Primary goal" and "Success definition".
3. Text-Based Focus: We are a text-based learning platform. Do NOT recommend external links, books, or video links. Instead, provide clear conceptual step-by-step guidance, actionable exercises or projects they can build, and specific key terms/keywords they should research further.
4. Chronological Layout: Structure the roadmap as a series of clear, chronological steps.
`;
};

export const GROQ_INTAKE_QUESTIONS_TEMPLATE = (topic: string, level: string) => `
Topic: ${topic}
Level: ${level}
`;
