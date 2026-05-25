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
2. Phase Semantics: Structuring phases as milestones, not weeks. Examples of phase progressions include:
   - Foundation (core concepts)
   - Pattern recognition (common patterns / idioms)
   - Practice / drills
   - Project zero (small project)
   - Integration (advanced pieces + tools)
   - Independent practice (self-driven, stretch projects)
3. Steering by Reflection:
   - Risk Factors: Insert micro-checkpoints and re-motivation messages in the description or tasks of early phases.
   - Learning Style Preference: Swap emphasis (e.g., deep definitions + conceptual examples vs more "try this next" actions).
   - Current Trend Frame: Wrap each phase in a framing sentence (e.g., "In this phase you'll learn the modern pattern used in...").
4. Text-Based Focus: Do NOT suggest external links, books, videos, or external URLs. Focus on conceptual outlines, tasks to try, and specific keywords to search.
`;
};

export const PHASE_EXPANSION_TEMPLATE = (
  topic: string,
  phaseId: string,
  phaseTitle: string,
  phaseStyle: string,
  motivationHook: string,
  tasks: string[]
) => {
  const taskList = tasks.map((t, i) => `${i + 1}. ${t}`).join("\n");

  return `
You are an expert curriculum designer and technical mentor. The user is learning "${topic}".

They are working on a phase called "${phaseTitle}" (${phaseStyle}).
The motivation behind this phase: "${motivationHook}"

Here are the key milestones/tasks for this phase:
${taskList}

For EACH task above, expand it into a detailed, practical, and specific breakdown. Be concrete — name actual tools, frameworks, concepts, commands, or techniques where applicable. Do NOT suggest external links, books, or videos. Focus on actionable knowledge.

For each task provide:
- "why": A sentence explaining WHY this task matters in the learner's journey. Connect it to the bigger picture.
- "how": A specific, detailed description of HOW to accomplish this task. Be prescriptive and concrete. Include step-by-step mental models, techniques, or approaches.
- "keywords": An array of 3-5 specific search keywords, tool names, or concept names the learner should look up.
- "pitfall": One specific mistake or trap learners commonly fall into with this task, and how to avoid it.
- "outcome": What the learner should be able to DO or UNDERSTAND after completing this task. A tangible, testable result.

Output a JSON object with this structure:
{
  "id": "${phaseId}",
  "title": "${phaseTitle}",
  "style": "${phaseStyle}",
  "expanded_tasks": [
    {
      "original": "the original task text",
      "why": "...",
      "how": "...",
      "keywords": ["keyword1", "keyword2", "keyword3"],
      "pitfall": "...",
      "outcome": "..."
    }
    // one entry per original task
  ]
}
`;
};

export const GROQ_INTAKE_QUESTIONS_TEMPLATE = (topic: string, level: string) => `
Topic: ${topic}
Level: ${level}
`;

