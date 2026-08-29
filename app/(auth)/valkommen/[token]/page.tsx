import { acceptInvitationAction } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";

export default async function InvitePage({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams: { error?: string };
}) {
  const supabase = createClient();
  const { data: inviteRows } = await supabase.rpc("get_invitation_by_token", {
    p_token: params.token,
  });
  const invitation = inviteRows?.[0];

  if (!invitation) {
    return (
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy">
          Länken fungerar inte
        </h1>
        <p className="mt-2 text-sm text-navy/60">
          Be din admin skicka en ny inbjudan.
        </p>
      </div>
    );
  }

  if (invitation.status !== "pending") {
    return (
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy">
          {invitation.status === "expired"
            ? "Inbjudan har gått ut"
            : "Kontot är redan aktiverat"}
        </h1>
        <p className="mt-2 text-sm text-navy/60">
          {invitation.status === "expired"
            ? "Be din admin skicka en ny inbjudan."
            : "Logga in med ditt lösenord istället."}
        </p>
      </div>
    );
  }

  const acceptWithToken = acceptInvitationAction.bind(null, params.token);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy">
        Hej {invitation.student_name}! 👋
      </h1>
      <p className="mt-1 text-sm text-navy/60">
        Sätt ett lösenord så är du igång.
      </p>

      {searchParams.error && (
        <p className="mt-4 rounded-xl bg-coral/10 px-3 py-2 text-sm text-coral-dark">
          {searchParams.error}
        </p>
      )}

      <form action={acceptWithToken} className="mt-6 space-y-4">
        <div>
          <label htmlFor="password" className="field-label">
            Välj ett lösenord
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            className="field-input"
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          Kom igång
        </button>
      </form>
    </div>
  );
}
