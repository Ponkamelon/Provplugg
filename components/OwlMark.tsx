type OwlMarkProps = {
  className?: string;
  size?: number;
};

/**
 * ProvKluras uggla — enkel, geometrisk platshållare i samma handritade
 * ikonstil som WaveDivider/HouseIcon, tills riktig illustrerad
 * maskotkonst finns att byta in (se moodboard).
 */
export function OwlMark({ className = "", size = 40 }: OwlMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      aria-hidden="true"
    >
      {/* Bakgrundscirkel */}
      <circle cx="20" cy="20" r="18" fill="#1D5D7A" />
      <circle cx="20" cy="20" r="18" stroke="#2CC4C4" strokeWidth="1.5" fill="none" />

      {/* Örontofsar */}
      <path d="M11 12L15 17L10 18Z" fill="#0E1114" />
      <path d="M29 12L25 17L30 18Z" fill="#0E1114" />

      {/* Huvud/kropp */}
      <ellipse cx="20" cy="21" rx="11" ry="10" fill="#0E1114" />

      {/* Bröst */}
      <ellipse cx="20" cy="24" rx="6.5" ry="7" fill="#E7D7B2" />

      {/* Ögon */}
      <circle cx="15.5" cy="19" r="4.2" fill="#E7D7B2" />
      <circle cx="24.5" cy="19" r="4.2" fill="#E7D7B2" />
      <circle cx="15.5" cy="19" r="2.2" fill="#0E1114" />
      <circle cx="24.5" cy="19" r="2.2" fill="#0E1114" />
      <circle cx="16.2" cy="18.3" r="0.7" fill="#fff" />
      <circle cx="25.2" cy="18.3" r="0.7" fill="#fff" />

      {/* Näbb */}
      <path d="M20 21.5L22 25L18 25Z" fill="#FF6B4A" />
    </svg>
  );
}
