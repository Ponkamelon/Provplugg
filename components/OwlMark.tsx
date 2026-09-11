import Image from "next/image";

type OwlMarkProps = {
  className?: string;
  size?: number;
};

/**
 * ProvKluras uggla — riktig illustration från varumärkesbiblioteket
 * (ersatte den enkla platshållar-SVG:n).
 */
export function OwlMark({ className = "", size = 80 }: OwlMarkProps) {
  return (
    <Image
      src="/owl-logo.png"
      alt="ProvKlura"
      width={size}
      height={size}
      className={`rounded-xl ${className}`}
      priority
    />
  );
}
