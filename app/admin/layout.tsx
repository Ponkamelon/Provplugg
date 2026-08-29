import Link from "next/link";
import { CompassMark } from "@/components/CompassMark";
import { requireProfile } from "@/lib/auth";
import { signOutAction } from "@/app/actions/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile("admin");

  return (
    <div className="min-h-screen bg-sand">
      <header className="border-b border-sand-deep bg-white/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-2">
              <CompassMark size={32} />
              <span className="font-display text-lg font-semibold text-navy">
                ProvPlugget
              </span>
            </Link>
            <nav className="hidden gap-4 text-sm font-medium text-navy/70 sm:flex">
              <Link href="/admin/elever" className="hover:text-ocean">
                Elever
              </Link>
              <Link href="/admin/prov" className="hover:text-ocean">
                Pluggprojekt
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-navy/60">{profile.display_name}</span>
            <form action={signOutAction}>
              <button type="submit" className="text-ocean underline">
                Logga ut
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
