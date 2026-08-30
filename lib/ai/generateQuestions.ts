import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type GeneratedQuestion = {
  question: string;
  type: "multiple_choice" | "true_false" | "short_answer" | "concept";
  options?: string[];
  correct_answer: string;
  accepted_answers?: string[];
  explanation: string;
  knowledge_unit: string;
  importance: "high" | "medium" | "low";
  confidence_score: number;
};

const SYSTEM_PROMPT = `Du genererar övningsfrågor för ProvPlugget, en studieapp för elever i årskurs 7–9.

Grundregler:
- Använd ENDAST fakta som finns i det bifogade materialet. Hitta aldrig på information som inte står där.
- Varje fråga ska testa en sak i taget, vara kort och tydlig, undvika trickfrågor, tvetydighet och onödiga negationer.
- Anpassa svårighetsgrad efter årskurs: åk 7 = grundläggande fakta och begrepp; åk 8 = lägg även till orsaker, konsekvenser, jämförelser; åk 9 = mer komplexa samband, tillämpning, resonemang.
- Fråga: max ca 20–25 ord. Förklaring: max ca 25–30 ord.
- Frågetypsfördelning ungefär: 60% multiple_choice, 15% true_false, 15% short_answer, 10% concept.
- Flervalsfrågor (multiple_choice): exakt 4 alternativ i "options", ett rätt och tre trovärdiga fel, ungefär lika långa. "correct_answer" måste vara IDENTISK, tecken för tecken, med ett av alternativen i "options".
- Sant/falskt-frågor (true_false): "correct_answer" ska vara exakt "Sant" eller "Falskt".
- Kortsvarsfrågor (short_answer): ge gärna alternativa godkända svar i "accepted_answers".
- Ge varje fråga en "knowledge_unit" (vad eleven behöver kunna, kort fras) och "importance" ("high"/"medium"/"low" — sikta på ungefär 60% high, 30% medium, 10% low över hela frågebanken).
- "confidence_score": ett tal 0–1 som visar hur säker du är på att svaret verkligen stöds av materialet. Var ärlig — sätt lågt värde om materialet är otydligt.
- Hellre färre bra frågor än många repetitiva. Riktvärde: normalt material 15–25 frågor, litet material 8–12, stort material 25–40. Skapa inte dubbletter som testar exakt samma sak med olika ord.

Svara ENDAST med en giltig JSON-array, inget annat — ingen inledande text, ingen markdown-kodruta. Varje objekt ska ha exakt fälten: question, type, options (endast för multiple_choice), correct_answer, accepted_answers (valfritt), explanation, knowledge_unit, importance, confidence_score.`;

export async function generateQuestionsFromText(params: {
  text: string;
  subjectName: string;
  chapterTitle: string;
  gradeLevel: number;
}): Promise<GeneratedQuestion[]> {
  const { text, subjectName, chapterTitle, gradeLevel } = params;

  const response = await anthropic.messages.create({
    // Snabbare modell för att hinna klart inom Vercel Hobby-planens
    // 60-sekundersgräns för serverfunktioner. Byt till "claude-sonnet-5"
    // för högre kvalitet om ni uppgraderar till Vercel Pro (300s gräns).
    model: "claude-haiku-4-5-20251001",
    max_tokens: 6000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Ämne: ${subjectName}
Kapitel/provområde: ${chapterTitle}
Årskurs: ${gradeLevel}

Material:
"""
${text}
"""

Generera frågorna enligt instruktionerna.`,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("AI:n gav inget textsvar");
  }

  const cleaned = textBlock.text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Kunde inte tolka AI-svaret som JSON");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("AI-svaret var inte en lista med frågor");
  }

  return parsed as GeneratedQuestion[];
}
