import Link from "next/link";
import { WaveDivider } from "@/components/WaveDivider";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function TestbibliotekPage() {
  await requireProfile("admin");
  const supabase = createClient();

  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, name")
    .eq("is_official", true)
    .order("name");

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-navy">
        Testbibliotek
      </h1>
      <WaveDivider className="mt-2 h-3 w-24" color="#FF6B4A" />
      <p className="mt-4 max-w-lg text-navy/70">
        Färdiga, kvalitetssäkrade tester per ämne — bra inför nationella prov
        i årskurs 9. Dela direkt med dina elever, inget material att klistra
        in.
      </p>

      <div className="mt-8 space-y-3">
        {!subjects?.length ? (
          <div className="notebook-card p-8 text-center">
            <p className="text-navy/70">
              Inga färdiga ämnen ännu — fler är på väg.
            </p>
          </div>
        ) : (
          subjects.map((s) => (
            <Link
              key={s.id}
              href={`/admin/testbibliotek/${s.id}`}
              className="notebook-card block p-4 transition-transform hover:-translate-y-0.5"
            >
              <p className="font-medium text-navy">{s.name}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
