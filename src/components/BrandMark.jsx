// Logo 0°Latitude: bingkai tergambar masuk, angka nol "bernapas", wordmark fade-in.
export default function BrandMark() {
  return (
    <svg className="zl-mark" viewBox="120 56 660 430" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="11" strokeLinecap="square">
        <path className="zl-mark-frame" pathLength={1} d="M338 190V74H572V304H432" />
        <rect className="zl-mark-zero" x="428" y="164" width="44" height="98" rx="22" />
      </g>
      <g className="zl-mark-words" fill="currentColor" textAnchor="middle">
        <text x="450" y="408" fontSize="92" fontWeight="400" textLength="640" lengthAdjust="spacingAndGlyphs">0° LATITUDE</text>
        <text x="450" y="472" fontSize="30" fontWeight="400" textLength="560" lengthAdjust="spacingAndGlyphs" opacity="0.75">ZERO DEGREES, INFINITE IMPACT</text>
      </g>
    </svg>
  );
}
