import Link from "next/link";
import { OwlMark } from "@/components/OwlMark";
import { FAQ } from "@/components/FAQ";

export const metadata = {
  title: "Vanliga frågor – ProvKlura",
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-sand px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="flex items-center gap-3">
          <OwlMark size={64} />
          <span className="font-display text-xl font-semibold text-navy">
            ProvKlura
          </span>
        </Link>

        <Link href="/" className="mt-8 inline-block text-sm text-navy/50 underline">
          ← Tillbaka
        </Link>

        <FAQ className="mt-6" />
      </div>
    </div>
  );
}
