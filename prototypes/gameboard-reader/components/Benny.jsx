/**
 * Benny mid-cheer — the pose the Figma celebration uses.
 *
 * Drawn here rather than pulled from the shared assets because every Benny in
 * the repo is either a circular avatar crop (`/benny-*.svg`) or badge art baked
 * onto a colored disc (`gameboard/assets/benny/*`). This frame needs the whole
 * character standing free on white, arms up. Palette matches those assets.
 */
export function BennyCheer({ size = 118 }) {
  return (
    <svg
      viewBox="0 0 120 132"
      width={size}
      height={(size * 132) / 120}
      role="img"
      aria-label="Benny cheering"
    >
      <defs>
        <linearGradient id="gr-benny-body" x1="26%" y1="8%" x2="86%" y2="96%">
          <stop offset="0%" stopColor="#FCE0A0" />
          <stop offset="52%" stopColor="#FBD68A" />
          <stop offset="100%" stopColor="#E9AE31" />
        </linearGradient>
      </defs>

      {/* Limbs sit behind the body so they read as tucked in at the joints. */}
      <g
        stroke="#4E453D"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* Arms, thrown up — a single curved stroke each, with the round cap
            doing the work of a hand. Splayed fingers just read as noise at the
            size this renders. */}
        <path d="M33 66 C22 58 12 46 6 28" />
        <path d="M87 66 C98 58 108 46 114 28" />
        {/* Legs */}
        <path d="M47 104 L44 122" />
        <path d="M73 104 L76 122" />
        <path d="M38 123 L50 123" />
        <path d="M70 123 L82 123" />
      </g>

      {/* Body */}
      <path
        d="M60 6 C82 6 97 28 97 58 C97 88 82 108 60 108 C38 108 23 88 23 60 C23 30 38 6 60 6 Z"
        fill="url(#gr-benny-body)"
      />
      {/* Sheen down the left flank */}
      <path
        d="M42 22 C32 34 30 52 34 70 C36 80 40 88 45 94 C36 88 29 76 27 62 C25 46 31 30 42 22 Z"
        fill="#FFF3D2"
        opacity="0.75"
      />

      {/* Brows, eyes, cheeks, mouth */}
      <g stroke="#C79A5B" strokeWidth="3.4" strokeLinecap="round" fill="none">
        <path d="M40 40 C44 36 49 36 52 39" />
        <path d="M69 39 C72 36 77 36 81 40" />
      </g>
      <ellipse cx="47" cy="55" rx="6" ry="7.4" fill="#4E453D" />
      <ellipse cx="74" cy="55" rx="6" ry="7.4" fill="#4E453D" />
      <circle cx="45" cy="52" r="2.1" fill="#fff" />
      <circle cx="72" cy="52" r="2.1" fill="#fff" />
      <circle cx="35" cy="70" r="5" fill="#F6B79C" opacity="0.85" />
      <circle cx="86" cy="70" r="5" fill="#F6B79C" opacity="0.85" />
      <path d="M52 72 C58 76 66 76 71 71 C71 82 63 88 57 84 C53 81 51 76 52 72 Z" fill="#FF8071" />

      {/* Ground shadow */}
      <ellipse cx="60" cy="128" rx="26" ry="4" fill="#0F172A" opacity="0.09" />
    </svg>
  )
}
