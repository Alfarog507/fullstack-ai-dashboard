const genAI = require('../clients/geminiClient');
const { aiResponseSchema } = require('../schemas/aiResponseSchema');

const SYSTEM_PROMPT = `Eres un analizador de comentarios.
Dado un listado de comentarios, devuelve ÚNICAMENTE un JSON con esta forma exacta (sin markdown, sin texto extra):
{"summary":"resumen breve en una oración","sentiment":"positive"}
Los valores válidos para sentiment son: positive, neutral, negative.`;

async function analyzeComments(comments) {
  const userMessage = comments.map((c, i) => `${i + 1}. ${c}`).join('\n');

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await model.generateContent(userMessage);
  const text = result.response.text();
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('LLM response did not contain a JSON object');

  const parsed = JSON.parse(match[0]);
  return aiResponseSchema.parse(parsed);
}

module.exports = { analyzeComments };
