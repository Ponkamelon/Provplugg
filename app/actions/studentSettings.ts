"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

/**
 * Eleven ändrar sin egen inställning (sektion 61: ofarliga
 * UI-preferenser en elev får styra själv). RLS begränsar detta till
 * elevens egen rad oavsett — student_id måste matcha den inloggade.
 */
export async function updateOwnFeedbackTimingAction(formData: FormData) {
  const profile = await requireProfile("student");
  const supabase = createClient();

  const feedbackTiming = String(formData.get("feedback_timing") ?? "immediate");

  await supabase
    .from("student_preferences")
    .update({ feedback_timing: feedbackTiming })
    .eq("student_id", profile.id);

  revalidatePath("/elev/installningar");
  redirect("/elev/installningar?saved=1");
}
