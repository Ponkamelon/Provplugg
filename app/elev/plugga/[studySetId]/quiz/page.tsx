import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { QuizRunner } from "@/components/QuizRunner";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default async function QuizPage({
  params,
  searchParams,
}: {
  params: { studySetId: string };
  searchParams: { length?: string; mode?: string };
}) {
  const profile = await requireProfile("student");
  const supabase = createClient();

  const { data: allQuestions } = await supabase
    .from("questions")
    .select("id, question, question_type, answer_options")
    .eq("study_set_id", params.studySetId)
    .eq("status", "published");

  if (!allQuestions?.length) {
    redirect(`/elev/plugga/${params.studySetId}`);
  }

  const { data: progressRows } = await supabase
    .from("question_progress")
    .select("question_id, mastery_level")
    .eq("student_id", profile.id);

  const { data: prefs } = await supabase
    .from("student_preferences")
    .select("feedback_timing")
    .eq("student_id", profile.id)
    .maybeSingle();

  const feedbackTiming =
    prefs?.feedback_timing === "end_of_test" ? "end_of_test" : "immediate";

  const progressMap = new Map(progressRows?.map((p) => [p.question_id, p.mastery_level]));

  let pool = allQuestions!;

  if (searchParams.mode === "mistakes") {
    pool = pool.filter((q) => progressMap.get(q.id) === "needs_practice");
    if (!pool.length) redirect(`/elev/plugga/${params.studySetId}`);
  } else {
    // Enkel adaptiv prioritering (sektion 46): tidigare fel först, sen
    // otestat, sen redan säkra frågor sist.
    const length = Number(searchParams.length) || 10;
    const needsPractice = shuffle(pool.filter((q) => progressMap.get(q.id) === "needs_practice"));
    const untried = shuffle(pool.filter((q) => !progressMap.has(q.id)));
    const rest = shuffle(
      pool.filter((q) => {
        const level = progressMap.get(q.id);
        return level === "mastered" || level === "learning";
      }),
    );
    pool = [...needsPractice, ...untried, ...rest].slice(0, length);
  }

  const preparedQuestions = pool.map((q) => ({
    id: q.id,
    question: q.question,
    question_type: q.question_type,
    answer_options: Array.isArray(q.answer_options)
      ? shuffle(q.answer_options as string[])
      : null,
  }));

  return (
    <QuizRunner
      studySetId={params.studySetId}
      questions={preparedQuestions}
      feedbackTiming={feedbackTiming}
    />
  );
}
