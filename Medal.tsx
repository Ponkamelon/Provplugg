type MedalTier = "brons" | "silver" | "guld";

const TIER_COLORS: Record<MedalTier, { base: string; dark: string; ribbon: string }> = {
  brons: { base: "#C17A4F", dark: "#9C5F3B", ribbon: "#8B4A2F" },
  silver: { base: "#C7CDD1", dark: "#9CA3A8", ribbon: "#6B7280" },
  guld: { base: "#F4B942", dark: "#D89B1F", ribbon: "#B87A15" },
};

/**
 * Poäng till buckla: 90%+ guld, 70%+ silver, 50%+ brons, annars ingen.
 */
export function medalForPercent(percent: number): MedalTier | null {
  if (percent >= 90) return "guld";
  if (percent >= 70) return "silver";
  if (percent >= 50) return "brons";
  return null;
}

export function Medal({ tier, size = 96 }: { tier: MedalTier; size?: number }) {
  const c = TIER_COLORS[tier];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 120"
      aria-hidden="true"
      className="mx-auto"
    >
      {/* Band */}
      <path d="M38 0 L50 45 L38 45 Z" fill={c.ribbon} />
      <path d="M62 0 L50 45 L62 45 Z" fill={c.ribbon} opacity="0.8" />
      {/* Medalj */}
      <circle cx="50" cy="72" r="30" fill={c.base} />
      <circle cx="50" cy="72" r="30" stroke={c.dark} strokeWidth="2" fill="none" />
      <circle cx="50" cy="72" r="22" stroke={c.dark} strokeWidth="1.5" fill="none" opacity="0.5" />
      {/* Stjärna */}
      <path
        d="M50 60L53.5 68.5L62.5 69.5L55.5 75.5L57.5 84.5L50 79.5L42.5 84.5L44.5 75.5L37.5 69.5L46.5 68.5Z"
        fill={c.dark}
        opacity="0.85"
      />
    </svg>
  );
}
