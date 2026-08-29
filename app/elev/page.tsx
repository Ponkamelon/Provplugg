import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type AssignmentWithStudySet = {
  id: string;
  study_sets: {
    id: string;
    title: string;
    status: string;
    exam_date: string | null;
    chapters: { subjects: { name: string } | null } | null;
  } | null;
};

export default async function ElevDashboard() {
  const profile = await requireProfile("student");
  const supabase = createClient();

  const { data } = await supabase
    .from("assignments")
    .select("id, study_sets(id, title, status, exam_date, chapters(subjects(name)))")
    .eq("student_id", profile.id);

  const assignments = (data ?? []) as unknown as AssignmentWithStudySet[];
  const active = assignments.filter((a) => a.study_sets?.status === "published");
  const firstName = profile.display_name.split(" ")[0];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy">
        Hej {firstName}! 👋
      </h1>

      {!active.length ? (
        <p className="mt-4 text-navy/70">
          Inga pluggprojekt tilldelade än. När din admin lägger till ett prov
          dyker det upp här.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {active.map((a) => (
            <Link
              key={a.id}
              href={`/elev/plugga/${a.study_sets!.id}`}
              className="notebook-card block p-4 transition-transform hover:-translate-y-0.5"
            >
              <p className="text-xs text-navy/50">
                {a.study_sets!.chapters?.subjects?.name}
              </p>
              <p className="font-medium text-navy">{a.study_sets!.title}</p>
              {a.study_sets!.exam_date && (
                <p className="mt-1 text-sm text-coral">
                  Prov {a.study_sets!.exam_date}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
