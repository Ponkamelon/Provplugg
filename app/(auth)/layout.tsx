import Link from "next/link";
import { OwlMark } from "@/components/OwlMark";
import { WaveDivider } from "@/components/WaveDivider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-sand px-4 py-12">
      <WaveDivider
        className="pointer-events-none absolute left-0 top-8 h-6 w-full opacity-40"
        color="#2CC4C4"
      />
      <Link href="/" className="relative z-10 mb-8 flex items-center gap-3">
        <OwlMark size={72} />
        <span className="font-display text-xl font-semibold text-navy">
          ProvKlura
        </span>
      </Link>
      <div className="relative z-10 w-full max-w-2xl">{children}</div>
      <WaveDivider
        className="pointer-events-none absolute bottom-8 left-0 h-6 w-full opacity-40"
        color="#FF6B4A"
      />
    </div>
  );
}
