"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

/**
 * Dela ett officiellt (is_official=true) test med en av admins egna elever.
 * RLS-policyn assignments_admin_share_official kräver assigned_by =
 * current_profile_id() och att eleven tillhör admin — samma sak vi sätter
 * här, så ett fel här betyder att något i UI:t skickade fel data.
 */
export async function shareOfficialTestAction(
  studySetId: string,
  subjectId: string,
  formData: FormData,
) {
  const profile = await requireProfile("admin");
  const supabase = createClient();

  const studentId = String(formData.get("studentId") ?? "").trim();
  if (!studentId) {
    redirect(`/admin/testbibliotek/${subjectId}`);
  }

  const { error } = await supabase.from("assignments").insert({
    study_set_id: studySetId,
    student_id: studentId,
    assigned_by: profile.id,
  });

  if (error) {
    console.error("Kunde inte dela officiellt test:", error);
  }

  revalidatePath(`/admin/testbibliotek/${subjectId}`);
  revalidatePath("/elev");
}

export async function unshareOfficialTestAction(assignmentId: string, subjectId: string) {
  const profile = await requireProfile("admin");
  const supabase = createClient();

  await supabase
    .from("assignments")
    .delete()
    .eq("id", assignmentId)
    .eq("assigned_by", profile.id);

  revalidatePath(`/admin/testbibliotek/${subjectId}`);
  revalidatePath("/elev");
}
