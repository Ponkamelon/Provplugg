"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

async function assertOwnsStudent(studentId: string) {
  const profile = await requireProfile("admin");
  const supabase = createClient();

  const { data: student } = await supabase
    .from("profiles")
    .select("id, admin_id, role")
    .eq("id", studentId)
    .maybeSingle();

  if (!student || student.admin_id !== profile.id || student.role !== "student") {
    redirect("/admin/elever");
  }

  return { profile, supabase };
}

// Färdiga profiler (sektion 60). Neutrala namn med flit — inga
// diagnosnamn i UI:t, bara vad inställningarna faktiskt gör.
const PRESETS: Record<string, Record<string, unknown>> = {
  fokus: {
    adhd_support: true,
    add_support: false,
    autism_support: false,
    dyslexia_support: false,
    concentration_support: true,
    text_amount: "minimal",
    questions_per_session: 5,
    feedback_mode: "result_only",
    feedback_timing: "immediate",
    animation_level: "minimal",
    sound_mode: "feedback",
    visual_effect_level: "minimal",
    predictable_ui: false,
  },
  lugn: {
    adhd_support: false,
    add_support: true,
    autism_support: false,
    dyslexia_support: false,
    concentration_support: true,
    text_amount: "short",
    questions_per_session: 5,
    feedback_mode: "result_and_explanation",
    feedback_timing: "immediate",
    animation_level: "off",
    sound_mode: "off",
    visual_effect_level: "minimal",
    predictable_ui: true,
  },
  lasstod: {
    adhd_support: false,
    add_support: false,
    autism_support: false,
    dyslexia_support: true,
    concentration_support: false,
    text_amount: "short",
    text_size: "large",
    questions_per_session: 5,
    feedback_mode: "result_and_explanation",
    feedback_timing: "immediate",
    reading_aloud: true,
    predictable_ui: false,
  },
  struktur: {
    adhd_support: false,
    add_support: false,
    autism_support: true,
    dyslexia_support: false,
    concentration_support: false,
    text_amount: "normal",
    questions_per_session: 10,
    feedback_mode: "result_and_explanation",
    feedback_timing: "immediate",
    animation_level: "off",
    sound_mode: "off",
    visual_effect_level: "minimal",
    predictable_ui: true,
  },
};

export async function applyPresetAction(studentId: string, presetKey: string) {
  const { supabase } = await assertOwnsStudent(studentId);
  const preset = PRESETS[presetKey];
  if (!preset) return;

  await supabase.from("student_preferences").update(preset).eq("student_id", studentId);
  revalidatePath(`/admin/elever/${studentId}/anpassningar`);
}

export async function updatePreferencesAction(studentId: string, formData: FormData) {
  const { supabase } = await assertOwnsStudent(studentId);

  const checkbox = (name: string) => formData.get(name) === "on";

  await supabase
    .from("student_preferences")
    .update({
      adhd_support: checkbox("adhd_support"),
      add_support: checkbox("add_support"),
      autism_support: checkbox("autism_support"),
      dyslexia_support: checkbox("dyslexia_support"),
      concentration_support: checkbox("concentration_support"),
      text_amount: String(formData.get("text_amount") ?? "normal"),
      text_size: String(formData.get("text_size") ?? "normal"),
      questions_per_session: Number(formData.get("questions_per_session")) || 5,
      feedback_mode: String(formData.get("feedback_mode") ?? "result_and_explanation"),
      feedback_timing: String(formData.get("feedback_timing") ?? "immediate"),
      animation_level: String(formData.get("animation_level") ?? "normal"),
      sound_mode: String(formData.get("sound_mode") ?? "off"),
      reading_aloud: checkbox("reading_aloud"),
      visual_effect_level: String(formData.get("visual_effect_level") ?? "normal"),
      predictable_ui: checkbox("predictable_ui"),
    })
    .eq("student_id", studentId);

  revalidatePath(`/admin/elever/${studentId}/anpassningar`);
  redirect(`/admin/elever/${studentId}/anpassningar?saved=1`);
}
