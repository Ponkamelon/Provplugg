import Link from "next/link";
import { CompassMark } from "@/components/CompassMark";
import { WaveDivider } from "@/components/WaveDivider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-sand px-4 py-12">
      <WaveDivider
        className="pointer-events-none absolute left-0 top-8 h-6 w-full opacity-40"
        color="#6FC2B4"
      />
      <Link href="/" className="relative z-10 mb-8 flex items-center gap-3">
        <CompassMark size={36} />
        <span className="font-display text-xl font-semibold text-navy">
          ProvPlugget
        </span>
      </Link>
      <div className="notebook-card relative z-10 w-full max-w-sm p-8">
        {children}
      </div>
      <WaveDivider
        className="pointer-events-none absolute bottom-8 left-0 h-6 w-full opacity-40"
        color="#FF7A59"
      />
    </div>
  );
}
