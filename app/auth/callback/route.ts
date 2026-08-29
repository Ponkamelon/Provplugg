import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Dit Supabase skickar användaren tillbaka efter att ha klickat på
 * bekräftelselänken i mejlet (bara relevant om mejlbekräftelse är
 * påslaget i Supabase-projektets auth-inställningar).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const flow = searchParams.get("flow");
  const inviteToken = searchParams.get("invite_token");

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        if (flow === "accept_invite" && inviteToken) {
          await supabase.rpc("accept_invitation", { p_token: inviteToken });
          return NextResponse.redirect(`${origin}/elev`);
        }

        if (flow === "admin_signup") {
          const { data: existingProfile } = await supabase
            .from("profiles")
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle();

          if (!existingProfile) {
            await supabase.from("profiles").insert({
              user_id: user.id,
              display_name: (user.user_metadata?.display_name as string) || "Admin",
              email: user.email ?? "",
              role: "admin",
            });
          }
          return NextResponse.redirect(`${origin}/admin`);
        }
      }
    }
  }

  return NextResponse.redirect(`${origin}/logga-in`);
}
