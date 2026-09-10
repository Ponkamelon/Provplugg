import Link from "next/link";
import { CompassMark } from "@/components/CompassMark";
import { FAQ } from "@/components/FAQ";

export const metadata = {
  title: "Vanliga frågor – ProvPlugget",
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-sand px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="flex items-center gap-3">
          <CompassMark size={32} />
          <span className="font-display text-xl font-semibold text-navy">
            ProvPlugget
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
