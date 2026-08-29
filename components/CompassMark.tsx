type CompassMarkProps = {
  className?: string;
  size?: number;
};

/**
 * ProvPluggets kompassmärke — "vi vet vägen, kort pass i taget".
 */
export function CompassMark({ className = "", size = 40 }: CompassMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="18" fill="#1E7291" />
      <circle cx="20" cy="20" r="18" stroke="#F4B942" strokeWidth="1.5" fill="none" />
      <path d="M20 8L23.5 20L20 32L16.5 20Z" fill="#FF7A59" />
      <path d="M8 20L20 16.5L32 20L20 23.5Z" fill="#F4EBD6" opacity="0.85" />
      <circle cx="20" cy="20" r="2.5" fill="#163449" />
    </svg>
  );
}
