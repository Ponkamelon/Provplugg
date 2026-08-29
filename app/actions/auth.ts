"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/logga-in?error=${encodeURIComponent(error.message)}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user?.id ?? "")
    .maybeSingle();

  redirect(profile?.role === "admin" ? "/admin" : "/elev");
}

/**
 * Admin-signup (förälder/lärare). Om Supabase-projektet kräver
 * mejlbekräftelse skapas admin-profilen först i /auth/callback när
 * länken klickas — annars skapas den direkt här.
 */
export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "");

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${SITE_URL}/auth/callback?flow=admin_signup`,
      data: { display_name: displayName },
    },
  });

  if (error) {
    redirect(`/skapa-konto?error=${encodeURIComponent(error.message)}`);
  }

  if (data.session && data.user) {
    await supabase.from("profiles").insert({
      user_id: data.user.id,
      display_name: displayName,
      email,
      role: "admin",
    });
    redirect("/admin");
  }

  redirect("/logga-in?message=confirm_email");
}

/**
 * Elev aktiverar sitt konto via inbjudningslänken. Skapar en riktig
 * Supabase Auth-användare och kopplar den till rätt admin via
 * accept_invitation()-funktionen i databasen (se sektion 11 i kravspecen).
 */
export async function acceptInvitationAction(token: string, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const supabase = createClient();

  // as any: se kommentar vid samma anrop i valkommen/[token]/page.tsx
  const { data: inviteRows } = await (supabase.rpc as any)("get_invitation_by_token", {
    p_token: token,
  });
  const invitation = inviteRows?.[0];

  if (!invitation) {
    redirect(`/valkommen/${token}?error=${encodeURIComponent("Ogiltig inbjudningslänk")}`);
  }

  const { data, error: signUpError } = await supabase.auth.signUp({
    email: invitation!.email,
    password,
    options: {
      emailRedirectTo: `${SITE_URL}/auth/callback?flow=accept_invite&invite_token=${token}`,
    },
  });

  if (signUpError) {
    redirect(`/valkommen/${token}?error=${encodeURIComponent(signUpError.message)}`);
  }

  if (data.session) {
    const { error: acceptError } = await (supabase.rpc as any)("accept_invitation", {
      p_token: token,
    });

    if (acceptError) {
      redirect(`/valkommen/${token}?error=${encodeURIComponent(acceptError.message)}`);
    }

    redirect("/elev");
  }

  redirect("/logga-in?message=confirm_email");
}

export async function signOutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/");
}
