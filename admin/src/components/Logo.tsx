/** NyotaCredit premium SVG logo mark.
 *  Mark: dark emerald square → white "N" letterform → gold 5-point star above right tip.
 *  Nyota = "star" in Swahili, so the star doubles as brand symbol + financial growth peak.
 */

export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
      <defs>
        <linearGradient id="ncBg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0b2416" />
          <stop offset="100%" stopColor="#1a5c38" />
        </linearGradient>
        <filter id="ncGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Background tile */}
      <rect width="40" height="40" rx="10" fill="url(#ncBg)" />
      {/* Subtle inner shine */}
      <rect x="0" y="0" width="40" height="20" rx="10" fill="white" opacity="0.04" />

      {/* N letterform — clean geometric strokes */}
      <path
        d="M9 32 L9 14 L31 32 L31 14"
        stroke="white"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#ncGlow)"
      />

      {/* Gold 5-point star above top-right of N (center 31, 10) */}
      <path
        d="M31 6.5 L31.94 8.7 L34.33 8.92 L32.52 10.49 L33.06 12.83 L31 11.6 L28.94 12.83 L29.48 10.49 L27.67 8.92 L30.06 8.7 Z"
        fill="#e8a520"
        filter="url(#ncGlow)"
      />
    </svg>
  );
}

export function Logo({
  dark = false,
  size = 36,
}: {
  dark?: boolean;
  size?: number;
}) {
  const textColor  = dark ? "white" : "#111827";
  const mutedColor = dark ? "rgba(255,255,255,0.45)" : "#6B7280";

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem" }}>
      <LogoMark size={size} />
      <span style={{ lineHeight: 1, display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontFamily: "'Sora', 'Inter', sans-serif",
            fontWeight: 800,
            fontSize: `${size * 0.47}px`,
            letterSpacing: "-0.02em",
            color: textColor,
          }}
        >
          Nyota
          <span style={{ color: "#2a9a5c" }}>Credit</span>
        </span>
        <span
          style={{
            fontSize: `${size * 0.22}px`,
            letterSpacing: "0.04em",
            color: mutedColor,
            marginTop: "1px",
            textTransform: "uppercase",
          }}
        >
          Lighting Your Future
        </span>
      </span>
    </span>
  );
}
