/**
 * Skrivklura — typer och små hjälpfunktioner som delas mellan server och
 * klient. Själva innehållet ligger som JSON i study_sets.writing_content
 * (set_type = 'skriv'), så nya genrer kan läggas till direkt i databasen.
 */

export type WritingBlock = {
  /** Stabil nyckel, används även som bedömningspunkt i AI-feedbacken. */
  id: string;
  /** Kort namn i minnesregeln, t.ex. "Händelse". */
  label: string;
  /** Rubrik på byggkloss-skärmen, t.ex. "Något händer". */
  title: string;
  /** En enda instruktion — max en mening. */
  prompt: string;
  /** Meningsstarter som eleven kan trycka på. */
  starters: string[];
  /** "Jag fastnar"-frågor, visas en i taget. */
  stuckQuestions: string[];
  /** Exempelmening(ar) för just den här klossen. */
  example: string;
  /** Vad AI:n ska leta efter i texten. */
  criterion: string;
};

export type TrainingQuestion = {
  id: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
};

export type WritingContent = {
  version: 1;
  language: "sv" | "en";
  genre: string;
  /** A. Vad är det? Korta meningar, en per rad. */
  what: string[];
  /** B. Vad behöver jag kunna? 3–6 punkter. */
  needs: string[];
  /** D. Träna — snabb använder de 3 första, normal 4, fördjupning alla. */
  training: TrainingQuestion[];
  /** Ämnesförslag att trycka på. */
  topics: string[];
  topicPrompt: string;
  /** Byggklossarna i ordning = minnesregeln. C. Exempel byggs av block.example. */
  blocks: WritingBlock[];
  /** Ord som håller ihop texten. */
  linkingWords: string[];
  /** F. Testa utan hjälp. */
  test: {
    task: string;
    wordGoal: number;
    /** "Jag fastnar" i provläget: bara frågor, inga starter eller exempel. */
    stuckQuestions: string[];
  };
};

export type TimeLevel = "snabb" | "normal" | "fordjupning";
export type WritingMode = "trana" | "gor_sjalv" | "testa";
export type WritingResult = "kan" | "nastan" | "trana";
export type PartStatus = "finns" | "delvis" | "saknas";

export type WritingFeedback = {
  /** Alltid först: en konkret sak som eleven gjorde bra. */
  strength: string;
  /** Ett enda nästa steg. Tomt om allt finns på plats. */
  nextStep: string;
  parts: { id: string; label: string; status: PartStatus }[];
  /** true om AI-feedbacken inte gick att hämta — då visas egen checklista. */
  fallback: boolean;
  /** true om texten handlar om något tungt — visar en varsam rad om att prata med en vuxen. */
  careNote: boolean;
};

export const TIME_LEVELS: {
  id: TimeLevel;
  label: string;
  minutes: number;
  description: string;
  trainingCount: number;
}[] = [
  { id: "snabb", label: "Snabb", minutes: 5, description: "Det viktigaste + tre frågor", trainingCount: 3 },
  { id: "normal", label: "Normal", minutes: 10, description: "Grunderna + skriv med stöd", trainingCount: 4 },
  { id: "fordjupning", label: "Fördjupning", minutes: 20, description: "Skriv med stöd + skriv som på provet", trainingCount: 5 },
];

export const RESULT_LABEL: Record<WritingResult, string> = {
  kan: "Kan",
  nastan: "Nästan",
  trana: "Träna lite mer",
};

export function isTimeLevel(value: unknown): value is TimeLevel {
  return value === "snabb" || value === "normal" || value === "fordjupning";
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

/** Träningsfrågor → Kan / Nästan / Träna lite mer (inga betyg). */
export function resultFromTraining(correct: number, total: number): WritingResult {
  if (total > 0 && correct === total) return "kan";
  if (correct * 2 >= total) return "nastan";
  return "trana";
}

/** Bedömda delar → resultat. "delvis" räknas som en halv. */
export function resultFromParts(parts: { status: PartStatus }[]): WritingResult {
  if (!parts.length) return "nastan";
  const points = parts.reduce(
    (sum, p) => sum + (p.status === "finns" ? 1 : p.status === "delvis" ? 0.5 : 0),
    0,
  );
  const share = points / parts.length;
  if (share >= 0.8) return "kan";
  if (share >= 0.5) return "nastan";
  return "trana";
}

/** Enkel kontroll så en trasig JSON i databasen ger en vänlig sida istället för en krasch. */
export function parseWritingContent(value: unknown): WritingContent | null {
  if (!value || typeof value !== "object") return null;
  const c = value as Partial<WritingContent>;
  if (
    !Array.isArray(c.blocks) ||
    !c.blocks.length ||
    !Array.isArray(c.training) ||
    !Array.isArray(c.what) ||
    !Array.isArray(c.needs) ||
    !Array.isArray(c.topics) ||
    !c.test ||
    typeof c.test.task !== "string"
  ) {
    return null;
  }
  return c as WritingContent;
}
