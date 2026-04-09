export const GROQ_INTAKE_QUESTIONS_TEMPLATE = (topic: string, level: string) => `
You are a world-class career consultant and curriculum designer.

A user has said they want to learn: "${topic}".
Their current level is: "${level}".

Your job is to design a short intake questionnaire that discovers what they *really* want and need, so that a highly customized learning roadmap can be generated for them.

Guidelines:
- Ask only as many questions as are genuinely necessary to understand their goals and constraints for this topic.
- Use clear, conversational, open-ended questions.
- Focus on:
  - Their primary outcome (e.g. interview prep, role, project, research, personal growth, spiritual exploration, etc.).
  - Their target role, exam, or use-case if relevant for this topic.
  - Their time horizon and available weekly time.
  - Their prior experience with this topic or adjacent fields.
  - Any preferences or constraints (tools, subfields, traditions, ethics, languages, frameworks, etc.).
- Adapt your questions to the specific combination of topic and level. 
- Avoid yes/no questions unless absolutely necessary.
- Do not ask more than one thing in a single question.

Format your response exactly as a JSON object:
{
  "summary": "1–3 sentences explaining what this questionnaire is trying to clarify for this user.",
  "questions": [
    "Question 1",
    "Question 2",
    "..."
  ]
}

Only output the JSON object. Do not include any other text.
`;

export const GEMINI_PROMT_TEMPLATE = (topic: string, level: string, groqAnalysis: string) => `
Based on the following expert analysis:
${groqAnalysis}

Create a detailed learning roadmap for "${topic}" at the ${level} level. 
The roadmap should be structured as a series of chronological steps. 
Each step should have a title, a brief description, and a list of specific sub-topics to cover.
`;
