import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function ElevDashboard() {
  const profile = await requireProfile("student");
  const supabase = createClient();

  const { data: assignments } = await supabase
    .from("assignments")
    .select("study_set_id")
    .eq("student_id", profile.id);

  const studySetIds = assignments?.map((a) => a.study_set_id) ?? [];

  const { data: studySets } = studySetIds.length
    ? await supabase
        .from("study_sets")
        .select("id, title, status, exam_date, chapter_id")
        .in("id", studySetIds)
        .eq("status", "published")
    : { data: [] as { id: string; title: string; status: string; exam_date: string | null; chapter_id: string }[] };

  const chapterIds = [...new Set((studySets ?? []).map((s) => s.chapter_id))];

  const { data: chapters } = chapterIds.length
    ? await supabase.from("chapters").select("id, subject_id").in("id", chapterIds)
    : { data: [] as { id: string; subject_id: string }[] };

  const subjectIds = [...new Set((chapters ?? []).map((c) => c.subject_id))];

  const { data: subjects } = subjectIds.length
    ? await supabase.from("subjects").select("id, name").in("id", subjectIds)
    : { data: [] as { id: string; name: string }[] };

  const chapterToSubject = new Map((chapters ?? []).map((c) => [c.id, c.subject_id]));
  const subjectNameById = new Map((subjects ?? []).map((s) => [s.id, s.name]));

  const firstName = profile.display_name.split(" ")[0];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy">
        Hej {firstName}! 👋
      </h1>

      {!studySets?.length ? (
        <p className="mt-4 text-navy/70">
          Inga pluggprojekt tilldelade än. När din admin lägger till ett prov
          dyker det upp här.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {studySets.map((s) => {
            const subjectId = chapterToSubject.get(s.chapter_id);
            const subjectName = subjectId ? subjectNameById.get(subjectId) : undefined;
            return (
              <Link
                key={s.id}
                href={`/elev/plugga/${s.id}`}
                className="notebook-card block p-4 transition-transform hover:-translate-y-0.5"
              >
                {subjectName && <p className="text-xs text-navy/50">{subjectName}</p>}
                <p className="font-medium text-navy">{s.title}</p>
                {s.exam_date && (
                  <p className="mt-1 text-sm text-coral">Prov {s.exam_date}</p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
