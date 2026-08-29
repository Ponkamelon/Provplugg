/**
 * Enkel dublettkontroll (sektion 36). Ingen embeddings-pipeline —
 * jämför ordöverlapp mellan frågetexter. Bra nog för att fånga
 * "Vad gör mitokondrien?" vs "Vilken funktion har mitokondrien?",
 * men ingen semantisk förståelse. En kandidat för uppgradering senare.
 */
function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\såäö]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

export function jaccardSimilarity(a: string, b: string): number {
  const setA = new Set(normalize(a));
  const setB = new Set(normalize(b));
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  for (const word of setA) {
    if (setB.has(word)) intersection++;
  }
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

export const DUPLICATE_THRESHOLD = 0.6;
