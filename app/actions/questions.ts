"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

async function assertOwnsStudySet(studySetId: string) {
  const profile = await requireProfile("admin");
  const supabase = createClient();

  const { data: studySet } = await supabase
    .from("study_sets")
    .select("id, admin_id")
    .eq("id", studySetId)
    .maybeSingle();

  if (!studySet || studySet.admin_id !== profile.id) {
    redirect("/admin/prov");
  }

  return { profile, supabase };
}

export async function publishQuestionAction(studySetId: string, questionId: string) {
  const { supabase } = await assertOwnsStudySet(studySetId);
  await supabase.from("questions").update({ status: "published" }).eq("id", questionId);
  revalidatePath(`/admin/prov/${studySetId}`);
}

export async function unpublishQuestionAction(studySetId: string, questionId: string) {
  const { supabase } = await assertOwnsStudySet(studySetId);
  await supabase.from("questions").update({ status: "draft" }).eq("id", questionId);
  revalidatePath(`/admin/prov/${studySetId}`);
}

export async function deleteQuestionAction(studySetId: string, questionId: string) {
  const { supabase } = await assertOwnsStudySet(studySetId);
  await supabase.from("questions").delete().eq("id", questionId);
  revalidatePath(`/admin/prov/${studySetId}`);
}

/** Sektion 38: "Godkänna alla" — publicerar de frågor AI:n redan bedömt med hög säkerhet. */
export async function publishAllReviewedAction(studySetId: string) {
  const { supabase } = await assertOwnsStudySet(studySetId);

  await supabase
    .from("questions")
    .update({ status: "published" })
    .eq("study_set_id", studySetId)
    .eq("verification_status", "verified");

  await supabase.from("study_sets").update({ status: "published" }).eq("id", studySetId);

  revalidatePath(`/admin/prov/${studySetId}`);
}

export async function updateQuestionAction(
  studySetId: string,
  questionId: string,
  formData: FormData,
) {
  const { supabase } = await assertOwnsStudySet(studySetId);

  const question = String(formData.get("question") ?? "").trim();
  const correctAnswer = String(formData.get("correctAnswer") ?? "").trim();
  const explanation = String(formData.get("explanation") ?? "").trim();
  const questionType = String(formData.get("questionType") ?? "");

  const options = [
    formData.get("option0"),
    formData.get("option1"),
    formData.get("option2"),
    formData.get("option3"),
  ]
    .map((v) => String(v ?? "").trim())
    .filter(Boolean);

  await supabase
    .from("questions")
    .update({
      question,
      correct_answer: correctAnswer,
      explanation,
      answer_options: questionType === "multiple_choice" ? options : null,
      // En admin som manuellt redigerar en fråga har i praktiken granskat den.
      verification_status: "verified",
    })
    .eq("id", questionId);

  revalidatePath(`/admin/prov/${studySetId}`);
  redirect(`/admin/prov/${studySetId}`);
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Sektion 39: tilldela ett pluggprojekt till valda elever. */
export async function assignStudySetAction(studySetId: string, formData: FormData) {
  const { profile, supabase } = await assertOwnsStudySet(studySetId);
  const studentIds = formData.getAll("studentIds").map(String).filter((id) => UUID_RE.test(id));

  // Enklast robusta sättet att hantera av/påmarkerade kryssrutor:
  // nollställ tilldelningen och skriv om den utifrån vald lista.
  await supabase.from("assignments").delete().eq("study_set_id", studySetId);

  if (studentIds.length) {
    const rows = studentIds.map((studentId) => ({
      study_set_id: studySetId,
      student_id: studentId,
      assigned_by: profile.id,
    }));
    await supabase.from("assignments").insert(rows);
  }

  revalidatePath(`/admin/prov/${studySetId}`);
  revalidatePath("/elev");
}
