"use server";

import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";

const INVITE_EXPIRY_DAYS = 7;

/**
 * Skapar en inbjudan (sektion 11). Skickar inget mejl än — admin får
 * länken direkt i UI:t och delar den manuellt tills en mejltjänst är
 * kopplad in.
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
