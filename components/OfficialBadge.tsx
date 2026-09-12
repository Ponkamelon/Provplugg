/**
 * Visuell markör för officiellt innehåll (is_official=true i databasen),
 * t.ex. nationella provet-biblioteket. Håller texten på ett ställe så den
 * inte kan hamna i otakt mellan admin- och elevvyn.
 */
export function OfficialBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full bg-coral/10 px-2 py-0.5 text-xs font-medium text-coral-dark ${className}`}
    >
      Nationellt prov · åk 9
    </span>
  );
}
