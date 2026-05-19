import { IntakeAnswer, ReflectionProfile } from "../types";

export const GEMINI_REFLECTION_TEMPLATE = (topic: string, level: string, answers: IntakeAnswer[]) => {
  const formattedAnswers = answers.map(a => `Q: ${a.question}\nA: ${a.answer}`).join("\n\n");
  
  return `
You are a reflective learning coach. Below is a user’s input about a topic they want to learn.
Topic: "${topic}"
Level: "${level}"

Here are their profile details and preferences:
${formattedAnswers}

Analyze:
1. Sentiment / emotional state: Are they excited, anxious, curious, overwhelmed, or cautious?
2. Effective learning pattern: Based on their answers, what learning style and constraints suggest they will respond best to? (e.g., bite-sized conceptual, project-first, lots of practice, etc.)
3. Current-trends framing: Even though you cannot access live data, re-frame the topic as something timely and relevant to their goal (e.g., 'modern React patterns', 'applied positive psychology in fast-paced work environments').
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
  const formattedAnswers = answers.map(a => `Q: ${a.question}\nA: ${a.answer}`).join("\n\n");
  
  return `
You are a world-class career consultant, educational architect, and curriculum designer.
Create a highly customized, detailed learning roadmap for learning "${topic}" at the "${level}" level.

Here is the learner's profile and answers:
${formattedAnswers}

Here is the expert self-reflection analysis of this learner:
- Sentiment: ${reflection.sentiment}
- Learning Style Preference: ${reflection.learning_style_preference}
- Motivation Trigger: ${reflection.motivation_trigger}
- Risk Factors: ${reflection.risk_factors.join(", ")}
- Current Trend Frame: ${reflection.current_trend_frame}

Guidelines for Roadmap Generation:
1. Dynamic Phase Count: Decide whether the roadmap should have 6, 9, or 12 phases.
   - For beginners with a high risk of drop-off (e.g. risk factors like inconsistent time or fear of being behind), aim for 6 shorter phases.
   - For intermediate/advanced learners with more time, good motivation, and lower risk of drop-off, aim for 9 to 12 phases.
2. Phase Semantics: Structuring phases as milestones, not weeks. Examples of phase progressions include:
   - Foundation (core concepts)
   - Pattern recognition (common patterns / idioms)
   - Practice / drills
   - Project zero (small project)
   - Integration (advanced pieces + tools)
   - Independent practice (self-driven, stretch projects)
   - Specialist extensions (if 9-12 phases chosen)
3. Steering by Reflection:
   - Risk Factors: Insert micro-checkpoints and re-motivation messages in the description or tasks of early phases.
   - Learning Style Preference: Swap emphasis (e.g., deep definitions + conceptual examples vs more "try this next" actions).
   - Current Trend Frame: Wrap each phase in a framing sentence (e.g., "In this phase you'll learn the modern pattern used in...").
4. Text-Based Focus: Do NOT suggest external links, books, videos, or external URLs. Focus on conceptual outlines, tasks to try, and specific keywords to search.
`;
};

export const GROQ_INTAKE_QUESTIONS_TEMPLATE = (topic: string, level: string) => `
Topic: ${topic}
Level: ${level}
`;

