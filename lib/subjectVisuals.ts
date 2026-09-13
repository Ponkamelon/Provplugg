export type SubjectVisual = {
  slug: string;
  color: string;
  icon: string;
};

/**
 * Matchar mot subjects.name i databasen (t.ex. "Nationell biologi").
 * Vi letar efter nyckelordet (case-insensitive) någonstans i namnet,
 * så det spelar ingen roll om "Nationell "-prefixet ändras senare.
 */
const SUBJECT_VISUALS: { keyword: string; visual: SubjectVisual }[] = [
  { keyword: "matematik", visual: { slug: "matematik", color: "#F4B942", icon: "/subjects/matematik.png" } },
  { keyword: "svenska", visual: { slug: "svenska", color: "#0E1114", icon: "/subjects/svenska.png" } },
  { keyword: "engelska", visual: { slug: "engelska", color: "#2CC4C4", icon: "/subjects/engelska.png" } },
  { keyword: "biologi", visual: { slug: "biologi", color: "#4A7C59", icon: "/subjects/biologi.png" } },
  { keyword: "kemi", visual: { slug: "kemi", color: "#D99A3D", icon: "/subjects/kemi.png" } },
  { keyword: "fysik", visual: { slug: "fysik", color: "#FF6B4A", icon: "/subjects/fysik.png" } },
  { keyword: "geografi", visual: { slug: "geografi", color: "#1D5D7A", icon: "/subjects/geografi.png" } },
  { keyword: "historia", visual: { slug: "historia", color: "#B5754A", icon: "/subjects/historia.png" } },
  { keyword: "samhällskunskap", visual: { slug: "samhallskunskap", color: "#3D4A6B", icon: "/subjects/samhallskunskap.png" } },
  { keyword: "religionskunskap", visual: { slug: "religionskunskap", color: "#6FA8C0", icon: "/subjects/religionskunskap.png" } },
];

const FALLBACK: SubjectVisual = { slug: "ovrigt", color: "#FF6B4A", icon: "/subjects/teknik.png" };

export function getSubjectVisual(subjectName: string): SubjectVisual {
  const lower = subjectName.toLowerCase();
  const match = SUBJECT_VISUALS.find((s) => lower.includes(s.keyword));
  return match?.visual ?? FALLBACK;
}
