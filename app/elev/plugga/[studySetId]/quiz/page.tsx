import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { QuizRunner } from "@/components/QuizRunner";
import {
  selectQuestions,
  shuffle,
  shuffleOptions,
  type ProgressInfo,
} from "@/lib/quiz/selection";

type QuestionRow = {
  id: string;
  question: string;
  question_type: "multiple_choice" | "true_false" | "short_answer" | "concept";
  answer_options: unknown;
  image_url?: string | null;
};

type ProgressRow = { question_id: string } & ProgressInfo;

export default async function QuizPage({
  params,
  searchParams,
}: {
  params: { studySetId: string };
  searchParams: { length?: string; mode?: string };
}) {
  const profile = await requireProfile("student");
  const supabase = createClient();

  // Frågor och elevens inställningar hämtas parallellt för snabbare start.
  const [{ data: questionRows }, { data: prefs }] = await Promise.all([
    supabase
      .from("questions")
      .select("id, question, question_type, answer_options, image_url")
      .eq("study_set_id", params.studySetId)
      .eq("status", "published"),
    supabase
      .from("student_preferences")
      .select("feedback_timing")
      .eq("student_id", profile.id)
      .maybeSingle(),
  ]);

  const allQuestions = (questionRows ?? []) as unknown as QuestionRow[];

  if (!allQuestions.length) {
    redirect(`/elev/plugga/${params.studySetId}`);
  }

  // Bara framstegen för just det här provets frågor behövs.
  const { data: progressData } = await supabase
    .from("question_progress")
    .select("question_id, mastery_level, last_answered")
    .eq("student_id", profile.id)
    .in(
      "question_id",
      allQuestions.map((q) => q.id),
    );
  const progressRows = (progressData ?? []) as unknown as ProgressRow[];

  const feedbackTiming =
    prefs?.feedback_timing === "end_of_test" ? "end_of_test" : "immediate";

  const progressMap = new Map<string, ProgressInfo>(
    progressRows.map((p): [string, ProgressInfo] => [
      p.question_id,
      { mastery_level: p.mastery_level, last_answered: p.last_answered },
    ]),
  );

  let pool = allQuestions;

  if (searchParams.mode === "mistakes") {
    pool = shuffle(
      pool.filter((q) => progressMap.get(q.id)?.mastery_level === "needs_practice"),
    );
    if (!pool.length) redirect(`/elev/plugga/${params.studySetId}`);
  } else {
    // Adaptivt urval ur hela poolen (sektion 46): tidigare fel får förtur,
    // otestat dras oftare än det eleven redan kan, och ordningen blandas.
    const length = Number(searchParams.length) || 10;
    pool = selectQuestions(pool, progressMap, length);
  }

  const preparedQuestions = pool.map((q) => ({
    id: q.id,
    question: q.question,
    question_type: q.question_type,
    answer_options: Array.isArray(q.answer_options)
      ? shuffleOptions(q.answer_options as string[])
      : null,
    image_url: q.image_url ?? null,
  }));

  return (
    <QuizRunner
      studySetId={params.studySetId}
      questions={preparedQuestions}
      feedbackTiming={feedbackTiming}
    />
  );
}
