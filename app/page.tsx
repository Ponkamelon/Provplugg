import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CompassMark } from "@/components/CompassMark";
import { WaveDivider } from "@/components/WaveDivider";

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profile?.role === "admin") redirect("/admin");
    if (profile?.role === "student") redirect("/elev");
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-sand px-6 py-16 text-center">
      <CompassMark size={56} />
      <h1 className="mt-6 font-display text-4xl font-semibold text-navy sm:text-5xl">
        ProvPlugget
      </h1>
      <p className="mt-3 max-w-md text-lg text-navy/70">
        Foto, PDF eller anteckningar in. Korta frågor ut. Vi fixar det.
      </p>
      <WaveDivider className="mt-6 h-4 w-40" color="#FF7A59" />
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/skapa-konto" className="btn-primary">
          Kom igång som förälder/lärare
        </Link>
        <Link href="/logga-in" className="btn-secondary">
          Logga in
        </Link>
      </div>
    </main>
  );
}
