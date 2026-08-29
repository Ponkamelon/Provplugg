type WaveDividerProps = {
  className?: string;
  color?: string;
};

/**
 * Signaturelementet för ProvPlugget: en handritad, lätt ojämn våglinje.
 * Används under rubriker och som avdelare — kopplar till "vågor" och
 * "handritade detaljer" i varumärkeskänslan utan att bli stökigt.
 */
export function WaveDivider({ className = "", color = "#1E7291" }: WaveDividerProps) {
  return (
    <svg
      viewBox="0 0 240 20"
      className={className}
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d="M2 12.5C18 4, 30 20, 46 11S 74 3, 90 12 106 19 122 10 150 3, 166 12 182 19 198 9 214 11 230 17 238 10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
