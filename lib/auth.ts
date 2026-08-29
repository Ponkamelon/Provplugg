import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/database.types";

/**
 * Hämtar den inloggade profilen och skickar vidare till rätt ställe om
 * personen saknar konto eller har fel roll. middleware.ts gör samma sak på
 * request-nivå — det här är andra skyddslagret inne i sidan/layouten.
 */
export async function requireProfile(
  role: "admin" | "student",
): Promise<Tables<"profiles">> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/logga-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/logga-in");
  }

  if (profile.role !== role) {
    redirect(profile.role === "admin" ? "/admin" : "/elev");
  }

  return profile;
}
