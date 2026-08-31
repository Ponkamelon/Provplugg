import Link from "next/link";
import { WaveDivider } from "@/components/WaveDivider";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { cancelInvitationAction } from "@/app/actions/students";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function EleverPage({
  searchParams,
}: {
  searchParams: { invited?: string };
}) {
  const profile = await requireProfile("admin");
  const supabase = createClient();

  const [{ data: students }, { data: invitations }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("admin_id", profile.id)
      .eq("role", "student")
      .order("display_name"),
    supabase
      .from("invitations")
      .select("*")
      .eq("admin_id", profile.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
  ]);

  const justInvited = invitations?.find(
    (i) => i.invite_token === searchParams.invited,
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-navy">
            Elever
          </h1>
          <WaveDivider className="mt-2 h-3 w-24" color="#FF7A59" />
        </div>
        <Link href="/admin/elever/ny" className="btn-primary">
          + Lägg till elev
        </Link>
      </div>

      {justInvited && (
        <div className="mt-6 rounded-xl border border-turquoise bg-seafoam p-4">
          <p className="text-sm font-medium text-navy">
            Inbjudan skapad för {justInvited.student_name}. Skicka länken:
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <code className="break-all rounded-lg bg-white px-3 py-2 text-xs text-navy/80">
              {SITE_URL}/valkommen/{justInvited.invite_token}
            </code>
            <CopyLinkButton
              link={`${SITE_URL}/valkommen/${justInvited.invite_token}`}
            />
          </div>
          <p className="mt-2 text-xs text-navy/50">
            Automatiska inbjudningsmejl är inte kopplat in än — dela länken
            manuellt tills vidare.
          </p>
        </div>
      )}

      <section className="mt-8">
        {!students?.length && !invitations?.length ? (
          <div className="notebook-card p-8 text-center">
            <p className="text-navy/70">Inga elever än. Lägg till din första!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {students?.map((student) => (
              <Link
                key={student.id}
                href={`/admin/elever/${student.id}`}
                className="notebook-card flex items-center justify-between p-4 transition-transform hover:-translate-y-0.5"
              >
                <div>
                  <p className="font-medium text-navy">
                    {student.display_name}
                  </p>
                  <p className="text-sm text-navy/60">
                    {student.email} · Åk {student.grade_level}
                  </p>
                </div>
                <span className="rounded-full bg-seafoam px-3 py-1 text-xs font-medium text-ocean-dark">
                  Aktiv
                </span>
              </Link>
            ))}

            {invitations?.map((invitation) => (
              <div
                key={invitation.id}
                className="notebook-card flex items-center justify-between p-4 opacity-80"
              >
                <div>
                  <p className="font-medium text-navy">
                    {invitation.student_name}
                  </p>
                  <p className="text-sm text-navy/60">
                    {invitation.email} · Åk {invitation.grade_level}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-sun/20 px-3 py-1 text-xs font-medium text-navy/70">
                    Väntar på aktivering
                  </span>
                  <form action={cancelInvitationAction.bind(null, invitation.id)}>
                    <button
                      type="submit"
                      className="text-xs text-navy/40 underline hover:text-coral"
                    >
                      Avbryt
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
