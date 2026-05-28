import { IntakeAnswer, ReflectionProfile } from "../types";

export const GEMINI_REFLECTION_TEMPLATE = (topic: string, level: string, answers: IntakeAnswer[]) => {
  const formattedAnswers = answers.length > 0
    ? answers.map(a => `Q: ${a.question}\nA: ${a.answer}`).join("\n\n")
    : "None (Quick Mode)";
  
  return `
You are a reflective learning coach. Below is a user’s input about a topic they want to learn.
Topic: "${topic}"
Mode: "${level}"

Here are their profile details and preferences:
${formattedAnswers}

Analyze:
1. Sentiment / emotional state: Are they excited, anxious, curious, overwhelmed, or cautious?
2. Effective learning pattern: Based on their answers (or general best practices for fast-tracked 80/20 learning if Quick Mode), what learning style and constraints suggest they will respond best to? (e.g., bite-sized conceptual, project-first, lots of practice, etc.)
3. Current-trends framing: Even though you cannot access live data, re-frame the topic as something timely and relevant to their goal.
4. Risk / blockers: What are the most likely reasons this person might stall or give up?

Output a JSON object with these fields:
- sentiment
- learning_style_preference
- motivation_trigger
- risk_factors (array of strings)
- current_trend_frame
`;
};

export const GEMINI_PROMPT_TEMPLATE = (
  topic: string, 
  level: string, 
  answers: IntakeAnswer[], 
  reflection: ReflectionProfile
) => {
  const formattedAnswers = answers.length > 0
    ? answers.map(a => `Q: ${a.question}\nA: ${a.answer}`).join("\n\n")
    : "No detailed profile answers provided (Quick Mode).";
  
  const modeInstruction = level === 'Quick'
    ? `Create a focused, fast-tracked roadmap emphasizing the 80/20 rule (focus on the 20% of effort/concepts that yield 80% of the results). Optimize for speed, core conceptual understanding, and high-yield practical skills.`
    : `Create a highly customized, detailed learning roadmap tailored to the detailed learner profile and phase 2 answers provided below.`;

  const phaseInstruction = level === 'Quick'
    ? `For Quick mode, design exactly 5 or 6 concise, high-impact phases focusing on the core 20% to get 80% competency.`
    : `For Planning mode, decide whether the roadmap should have 6, 9, or 12 phases based on risk factors and depth.`;

  return `
You are a world-class career consultant, educational architect, and curriculum designer.
Create a customized learning roadmap for learning "${topic}" using the "${level}" mode.

${modeInstruction}

Here is the learner's profile and answers:
${formattedAnswers}

Here is the expert self-reflection analysis of this learner:
- Sentiment: ${reflection.sentiment}
- Learning Style Preference: ${reflection.learning_style_preference}
- Motivation Trigger: ${reflection.motivation_trigger}
- Risk Factors: ${reflection.risk_factors.join(", ")}
- Current Trend Frame: ${reflection.current_trend_frame}

Guidelines for Roadmap Generation:
1. Dynamic Phase Count:
   ${phaseInstruction}
2. Tasks Per Phase: Each and every phase MUST contain exactly 5 to 9 specific, actionable tasks. Never produce a phase with fewer than 5 or more than 9 tasks. Each task should be a single, clear action or concept the learner can tackle — not vague placeholders. Think of tasks as the granular steps someone actually executes.
4. Phase Semantics: Structuring phases as milestones, not weeks. Examples of phase progressions include:
   - Foundation (core concepts)
   - Pattern recognition (common patterns / idioms)
   - Practice / drills
   - Project zero (small project)
   - Integration (advanced pieces + tools)
   - Independent practice (self-driven, stretch projects)
5. Steering by Reflection:
   - Risk Factors: Insert micro-checkpoints and re-motivation messages in the description or tasks of early phases.
   - Learning Style Preference: Swap emphasis (e.g., deep definitions + conceptual examples vs more "try this next" actions).
   - Current Trend Frame: Wrap each phase in a framing sentence (e.g., "In this phase you'll learn the modern pattern used in...").
6. Text-Based Focus: Do NOT suggest external links, books, videos, or external URLs. Focus on conceptual outlines, tasks to try, and specific keywords to search.
`;
};

export const GROQ_INTAKE_QUESTIONS_TEMPLATE = (topic: string, level: string) => `
Topic: ${topic}
Level: ${level}
`;

export const PHASE_BATCH_EXPANSION_TEMPLATE = (
  topic: string,
  phases: { id: string; title: string; style: string; motivation_hook: string; tasks: string[] }[]
) => {
  const phasesText = phases.map((p) => {
    const taskList = p.tasks.map((t, ti) => `${ti + 1}. ${t}`).join("\n");
    return `Phase "${p.title}" (id: ${p.id}, style: ${p.style})
Motivation: "${p.motivation_hook}"
Current tasks:
${taskList}`;
  }).join("\n\n");

  return `
You are an expert curriculum designer. The user is learning "${topic}".

Below are ${phases.length} phases of their learning roadmap. For each phase, produce 5 to 9 enriched tasks. If the phase already has 5-9 tasks, enrich each one. If it has fewer than 5, add new meaningful tasks to reach at least 5. If it somehow has more than 9, keep only the 9 most valuable ones. Each enriched task should be a richer, more specific version that fills in the missing 20% — the concrete details, specific tools, techniques, or sub-steps that make it truly actionable. Keep each enriched task to 1-2 sentences. Be specific and concrete. Do NOT suggest links or videos.

${phasesText}

Output a JSON object with "expanded_phases" — an array with one entry per phase (same order):
{
  "expanded_phases": [
    {
      "id": "the phase id exactly as given",
      "enriched_tasks": [
        "enriched version of task 1",
        "enriched version of task 2"
      ]
    }
  ]
}
`;
};

