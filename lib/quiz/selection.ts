/**
 * Urval och blandning av frågor inför ett quiz.
 *
 * Allt här är ren kod utan AI- eller databasanrop, så variationen
 * kostar ingen väntetid för eleven.
 */

export type ProgressInfo = {
  mastery_level: string;
  last_answered: string | null;
};

type Rng = () => number;

export function shuffle<T>(arr: T[], rng: Rng = Math.random): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Alternativ som syftar på de andra alternativen ("Alla ovanstående",
// "Inget av dessa", "Båda stämmer") ska ligga kvar sist.
const ANCHOR_PATTERNS = [
  /ovanst[åa]ende/i,
  /^(alla|inga|inget|ingen|samtliga|b[åa]da|b[äa]gge)\b.*\b(ovan|dessa|alternativen|alternativ|svaren|p[åa]st[åa]endena)/i,
  /^(alla|samtliga|b[åa]da|b[äa]gge|inget|ingen|inga)( p[åa]st[åa]enden| alternativ)? (st[äa]mmer|[äa]r r[äa]tt|[äa]r korrekta|[äa]r fel)/i,
  /\b(all|none|both|neither) of (the above|these)\b/i,
];

// Alternativ som pekar ut andra alternativ via position ("Både A och B",
// "Alternativ 1 och 3") blir fel om ordningen ändras – då blandas inget.
const POSITION_PATTERNS = [
  /\b[A-D1-4]\s+(och|eller|and|or|&)\s+[A-D1-4]\b/,
  /\b(alternativ|svar|option)\s+[A-D1-4]\b/i,
];

function isAnchor(option: string): boolean {
  return ANCHOR_PATTERNS.some((p) => p.test(option.trim()));
}

function refersToPosition(option: string): boolean {
  return POSITION_PATTERNS.some((p) => p.test(option));
}

/**
 * Blandar svarsalternativ. Rättningen sker på svarets text (inte på
 * positionen), så ordningen kan ändras fritt mellan varje försök.
 */
export function shuffleOptions(options: string[], rng: Rng = Math.random): string[] {
  if (options.some(refersToPosition)) return [...options];

  const anchors = options.filter(isAnchor);
  if (!anchors.length) return shuffle(options, rng);

  const movable = options.filter((o) => !isAnchor(o));
  return [...shuffle(movable, rng), ...anchors];
}

// Hur stor del av ett test som högst viks åt frågor eleven svarat fel på,
// så att testet inte bara består av samma missar varje gång.
const MAX_MISTAKE_SHARE = 0.6;

const WEIGHT_UNTRIED = 6;
const WEIGHT_NEEDS_PRACTICE = 4;
const WEIGHT_LEARNING = 2;
const WEIGHT_MASTERED = 1;

const THIRTY_MINUTES = 30 * 60 * 1000;
const ONE_DAY = 24 * 60 * 60 * 1000;

function weightFor(info: ProgressInfo | undefined, now: number): number {
  if (!info) return WEIGHT_UNTRIED;
  if (info.mastery_level === "needs_practice") return WEIGHT_NEEDS_PRACTICE;

  const base = info.mastery_level === "mastered" ? WEIGHT_MASTERED : WEIGHT_LEARNING;

  // Frågor eleven nyss klarat väljs mer sällan, så att två test i rad
  // inte känns likadana.
  const answeredAt = info.last_answered ? Date.parse(info.last_answered) : NaN;
  if (Number.isNaN(answeredAt)) return base;
  const age = now - answeredAt;
  if (age < THIRTY_MINUTES) return base * 0.2;
  if (age < ONE_DAY) return base * 0.6;
  return base;
}

/** Viktat urval utan återläggning (Efraimidis–Spirakis). */
function weightedSample<T>(items: T[], count: number, weight: (item: T) => number, rng: Rng): T[] {
  if (count <= 0) return [];
  return items
    .map((item) => ({ item, key: Math.pow(rng(), 1 / Math.max(weight(item), 0.0001)) }))
    .sort((a, b) => b.key - a.key)
    .slice(0, count)
    .map((entry) => entry.item);
}

/**
 * Drar `length` frågor ur poolen.
 *
 * - Tidigare fel får förtur, men högst 60 % av platserna.
 * - Resten dras viktat: otestade frågor oftast, sedan "på gång",
 *   sist de som redan sitter. Nyss klarade frågor viktas ner.
 * - Slutordningen blandas, så felen kommer inte alltid först.
 */
export function selectQuestions<T extends { id: string }>(
  questions: T[],
  progress: Map<string, ProgressInfo>,
  length: number,
  options: { now?: number; rng?: Rng } = {},
): T[] {
  const rng = options.rng ?? Math.random;
  const now = options.now ?? Date.now();

  if (questions.length <= length) return shuffle(questions, rng);

  const isMistake = (q: T) => progress.get(q.id)?.mastery_level === "needs_practice";

  const mistakeSlots = Math.ceil(length * MAX_MISTAKE_SHARE);
  const mistakes = shuffle(questions.filter(isMistake), rng).slice(0, mistakeSlots);
  const pickedIds = new Set(mistakes.map((q) => q.id));

  const remaining = questions.filter((q) => !pickedIds.has(q.id));
  const fill = weightedSample(
    remaining,
    length - mistakes.length,
    (q) => weightFor(progress.get(q.id), now),
    rng,
  );

  return shuffle([...mistakes, ...fill], rng);
}
