import { Roadmap, Level, IntakeAnswer, ExpandedPhase } from "../types";
import * as geminiService from "./geminiService";
import * as groqService from "./groqService";

export async function generateRoadmap(topic: string, level: Level, answers: IntakeAnswer[]): Promise<Roadmap> {
  const provider = process.env.AI_PROVIDER || "gemini";
  console.log(`Using AI Provider: ${provider}`);
  if (provider.toLowerCase() === "groq") {
    return groqService.generateRoadmap(topic, level, answers);
  } else {
    return geminiService.generateRoadmap(topic, level, answers);
  }
}

export async function expandPhase(
  topic: string,
  phaseId: string,
  phaseTitle: string,
  phaseStyle: string,
  motivationHook: string,
  tasks: string[]
): Promise<ExpandedPhase> {
  const provider = process.env.AI_PROVIDER || "gemini";
  if (provider.toLowerCase() === "groq") {
    return groqService.expandPhase(topic, phaseId, phaseTitle, phaseStyle, motivationHook, tasks);
  } else {
    return geminiService.expandPhase(topic, phaseId, phaseTitle, phaseStyle, motivationHook, tasks);
  }
}
