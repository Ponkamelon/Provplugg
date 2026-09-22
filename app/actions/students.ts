"use server";

import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";

const INVITE_EXPIRY_DAYS = 7;

/**
 * Skapar en inbjudan (sektion 11) — OM mejladressen inte redan tillhör en
 * aktiverad elev. Om den gör det (t.ex. en annan förälder till samma barn
 * har redan bjudit in och eleven aktiverat sitt konto) kopplas den här
 * admin-profilen direkt som ytterligare förälder till samma elev istället
 * — annars skulle eleven senare fastna i ett "redan registrerad"-fel från
 * Supabase Auth när hen försöker aktivera en andra gång.
 */
export async function createInvitationAction(formData: FormData) {
  const profile = await requireProfile("admin");

  const studentName = String(formData.get("studentName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const gradeLevel = Number(formData.get("gradeLevel"));

  if (!studentName || !email || ![7, 8, 9].includes(gradeLevel)) {
    redirect(`/admin/elever/ny?error=${encodeURIComponent("Fyll i namn, e-post och årskurs.")}`);
  }

  const supabase = createClient();

  const { data: existingStudent } = await supabase
    .from("profiles")
    .select("id, display_name")
    .eq("role", "student")
    .ilike("email", email)
    .maybeSingle();

  if (existingStudent) {
    const { error: linkError } = await supabase.from("student_guardians").insert({
      student_id: existingStudent.id,
      admin_id: profile.id,
    });

    // Redan kopplad (23505 = unique-krock) räknas inte som ett fel här —
    // resultatet admin ville ha (kopplad till eleven) stämmer redan.
    if (linkError && linkError.code !== "23505") {
      redirect(`/admin/elever/ny?error=${encodeURIComponent(linkError.message)}`);
    }

    revalidatePath("/admin/elever");
    redirect(
      `/admin/elever?linked=${encodeURIComponent(existingStudent.display_name)}`,
    );
  }

  const token = randomBytes(24).toString("hex");
  const expiresAt = new Date(
    Date.now() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { error } = await supabase.from("invitations").insert({
    admin_id: profile.id,
    email,
    student_name: studentName,
    grade_level: gradeLevel,
    invite_token: token,
    expires_at: expiresAt,
  });

  if (error) {
    redirect(`/admin/elever/ny?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/elever");
  redirect(`/admin/elever?invited=${token}`);
}

export async function cancelInvitationAction(invitationId: string) {
  await requireProfile("admin");
  const supabase = createClient();
  await supabase
    .from("invitations")
    .update({ status: "cancelled" })
    .eq("id", invitationId);

  revalidatePath("/admin/elever");
}

/**
 * Tar bort en elev — smart nog att skilja på "sluta hantera" och
 * "radera helt":
 * - Har eleven fler än en förälder kopplad tas bara MIN koppling bort.
 *   Eleven, dess resultat och den andra förälderns koppling finns kvar.
 * - Är jag den enda kvarvarande föräldern raderas elevens profil helt
 *   (kaskad tar bort tilldelningar, försök, inställningar osv).
 */
export async function deleteStudentAction(studentId: string) {
  const profile = await requireProfile("admin");
  const supabase = createClient();

  const { count } = await supabase
    .from("student_guardians")
    .select("id", { count: "exact", head: true })
    .eq("student_id", studentId);

  if ((count ?? 0) > 1) {
    await supabase
      .from("student_guardians")
      .delete()
      .eq("student_id", studentId)
      .eq("admin_id", profile.id);

    // Om jag var den ursprungliga (profiles.admin_id) flyttas den
    // referensen till en kvarvarande förälder, så den inte pekar på
    // någon som inte längre hanterar eleven.
    const { data: remaining } = await supabase
      .from("student_guardians")
      .select("admin_id")
      .eq("student_id", studentId)
      .limit(1)
      .maybeSingle();

    if (remaining) {
      await supabase
        .from("profiles")
        .update({ admin_id: remaining.admin_id })
        .eq("id", studentId)
        .eq("admin_id", profile.id);
    }
  } else {
    await supabase.from("profiles").delete().eq("id", studentId);
  }

  revalidatePath("/admin/elever");
}
