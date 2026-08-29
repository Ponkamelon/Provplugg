import { CompassMark } from "@/components/CompassMark";
import { requireProfile } from "@/lib/auth";
import { signOutAction } from "@/app/actions/auth";

export default async function ElevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // requireProfile skyddar sidan; profilen används inte här ännu men
  // kommer driva anpassningar (student_preferences) i nästa steg.
  await requireProfile("student");

  return (
    <div className="min-h-screen bg-sand">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <CompassMark size={28} />
          <span className="font-display text-base font-semibold text-navy">
            ProvPlugget
          </span>
        </div>
        <form action={signOutAction}>
          <button type="submit" className="text-sm text-navy/50 underline">
            Logga ut
          </button>
        </form>
      </header>
      <main className="mx-auto max-w-md px-6 py-6">{children}</main>
    </div>
  );
}
