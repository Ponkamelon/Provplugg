/**
 * Visuell markör för Skrivklura (set_type = 'skriv'), motsvarigheten
 * till OfficialBadge för nationella prov. Bläckfärgad istället för korall
 * så skrivövningar inte blandas ihop med quiz.
 */
export function SkrivBadge({ className = "" }: { className?: string }) {
  return <span className={`skriv-badge ${className}`}>Skrivklura · skriv steg för steg</span>;
}
