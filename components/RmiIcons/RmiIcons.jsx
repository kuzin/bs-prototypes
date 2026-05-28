// Icons for the 10 RMI motivation factors (5 intrinsic + 5 extrinsic).
// Inline SVGs, all 18×18 viewBox, single-color stroke or fill — colored via parent.

const stroke = {
  width: 18,
  height: 18,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const RMI_ICONS = {
  // ── Intrinsic ──
  enjoyment: (
    <svg viewBox="0 0 18 18" {...stroke}>
      <circle cx="9" cy="9" r="7" />
      <path d="M6 11c.7 1 1.8 1.6 3 1.6S11.3 12 12 11" />
      <circle cx="6.5" cy="7.5" r="0.5" fill="currentColor" />
      <circle cx="11.5" cy="7.5" r="0.5" fill="currentColor" />
    </svg>
  ),
  curiosity: (
    <svg viewBox="0 0 18 18" {...stroke}>
      <circle cx="7.5" cy="7.5" r="4.5" />
      <path d="M10.8 10.8 14.5 14.5" />
    </svg>
  ),
  importance: (
    <svg viewBox="0 0 18 18" {...stroke}>
      <path d="M9 1.8l2.2 4.5 4.9.7-3.6 3.5.9 4.9L9 13.1l-4.4 2.3.8-4.9L1.9 7l4.9-.7z" />
    </svg>
  ),
  confidence: (
    <svg viewBox="0 0 18 18" {...stroke}>
      <path d="M9 1.8 2.8 4.3v4.4c0 3.4 2.5 6.5 6.2 7.5 3.7-1 6.2-4.1 6.2-7.5V4.3z" />
      <path d="M6.4 9 8.4 11 12 7.2" />
    </svg>
  ),
  challenge: (
    <svg viewBox="0 0 18 18" {...stroke}>
      <path d="M2 15 6 9l3 3 3-5 4 8z" />
      <path d="M2 15h14" />
    </svg>
  ),
  // ── Extrinsic ──
  social: (
    <svg viewBox="0 0 18 18" {...stroke}>
      <circle cx="6.5" cy="7" r="2.5" />
      <circle cx="12" cy="7.5" r="2" />
      <path d="M2 15c0-2.5 2-4.2 4.5-4.2S11 12.5 11 15" />
      <path d="M11 15c0-1.8 1.5-3.2 3-3.2S17 13.2 17 15" />
    </svg>
  ),
  recognition: (
    <svg viewBox="0 0 18 18" {...stroke}>
      <path d="M5 2.5h8v4a4 4 0 0 1-8 0z" />
      <path d="M5 3.5H3v1c0 1.5 1 2.5 2.2 2.7" />
      <path d="M13 3.5h2v1c0 1.5-1 2.5-2.2 2.7" />
      <path d="M7.5 10.3 7 13h4l-.5-2.7" />
      <path d="M5.5 15.2h7" />
    </svg>
  ),
  grades: (
    <svg viewBox="0 0 18 18" {...stroke}>
      <rect x="3.2" y="2.5" width="11.6" height="13" rx="1.2" />
      <path d="M6 7.5h6" />
      <path d="M6 10.5h6" />
      <path d="M6 13h4" />
    </svg>
  ),
  competition: (
    <svg viewBox="0 0 18 18" {...stroke}>
      <rect x="6" y="7" width="3.8" height="8.5" />
      <rect x="2" y="10" width="3.8" height="5.5" />
      <rect x="10" y="5" width="3.8" height="10.5" />
    </svg>
  ),
  compliance: (
    <svg viewBox="0 0 18 18" {...stroke}>
      <rect x="3.5" y="3" width="11" height="12.5" rx="1.2" />
      <path d="M6.5 2.2h5v2h-5z" fill="currentColor" stroke="none" />
      <path d="M6.5 9 8.3 10.8 11.8 7.4" />
    </svg>
  ),
}
