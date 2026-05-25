import { Roadmap, Level, IntakeAnswer, ExpandedPhase, RoadmapPhase } from "../types";
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

function chunkPhases(phases: RoadmapPhase[]): RoadmapPhase[][] {
  const chunks: RoadmapPhase[][] = [];
  const total = phases.length;
  const baseSize = Math.ceil(total / 3);
  const sizes = [baseSize, baseSize, total - 2 * baseSize].filter(s => s > 0);

  let offset = 0;
  for (const size of sizes) {
    chunks.push(phases.slice(offset, offset + size));
    offset += size;
  }

  return chunks;
}

export async function expandAllPhases(
  topic: string,
  phases: RoadmapPhase[]
): Promise<ExpandedPhase[]> {
  const provider = process.env.AI_PROVIDER || "gemini";
  const service = provider.toLowerCase() === "groq" ? groqService : geminiService;

  const chunks = chunkPhases(phases);
  console.log(`Expanding ${phases.length} phases in ${chunks.length} parallel batches`);

  const results = await Promise.all(
    chunks.map(chunk =>
      service.expandPhaseBatch(
        topic,
        chunk.map(p => ({
          id: p.id,
          title: p.title,
          style: p.style,
          motivation_hook: p.motivation_hook || "",
          tasks: p.tasks || []
        }))
      )
    )
  );

  return results.flat();
}
