import { useState } from "react";
import { I8_IDS, I8_TOKEN, COVER_PALETTES } from "./tokens.js";

export { C, LABEL, GENRE_COLORS, I8_TOKEN, I8_IDS, COVER_PALETTES } from "./tokens.js";

// ─── Icon ─────────────────────────────────────────────────────────────────────
export function Ic({ name, size = 16, style = {} }) {
  const id = I8_IDS[name];
  if (!id) return null;
  return (
    <img
      src={`https://img.icons8.com/?id=${id}&format=png&size=${size * 2}&token=${I8_TOKEN}`}
      width={size}
      height={size}
      alt=""
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
    />
  );
}

// ─── Status badge ──────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  "Watch":       { icon: "ti-alert-triangle", cls: "bp-status--watch" },
  "Improving":   { icon: "ti-trending-up",    cls: "bp-status--improving" },
  "Strong":      { icon: "ti-check",          cls: "bp-status--strong" },
  "Trending up": { icon: "ti-trending-up",    cls: "bp-status--trending" },
};

export function StatusBadge({ label, size = 11, accent }) {
  const cfg = STATUS_CONFIG[label] ?? { icon: "ti-circle-check", cls: "bp-status--strong" };
  const style = accent ? { background: accent } : undefined;
  return (
    <span className={`bp-status ${cfg.cls}`} style={style}>
      <Ic name={cfg.icon} size={size} />
      {label}
    </span>
  );
}

// ─── Pill ─────────────────────────────────────────────────────────────────────
export function Pill({ label, bg, color, small }) {
  return (
    <span
      className={`bp-pill${small ? " bp-pill--sm" : ""}`}
      style={{ "--pill-bg": bg, "--pill-color": color }}
    >
      {label}
    </span>
  );
}

// ─── Bar ──────────────────────────────────────────────────────────────────────
export function Bar({ value, color, height = 6 }) {
  return (
    <div className="bp-bar" style={{ height }}>
      <div
        className="bp-bar-fill"
        style={{ "--bar-width": `${Math.min(value, 100)}%`, "--bar-color": color }}
      />
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, flush }) {
  return <div className={`bp-card${flush ? " bp-card--flush" : ""}`}>{children}</div>;
}

// ─── Section heading ──────────────────────────────────────────────────────────
export function SectionHeading({ children }) {
  return <div className="bp-section-heading">{children}</div>;
}

// ─── Goal ring ────────────────────────────────────────────────────────────────
export function GoalRing({ minutes, goal, color }) {
  const R     = 34;
  const sw    = 7;
  const circ  = 2 * Math.PI * R;
  const pct   = minutes == null ? 0 : Math.min(minutes / goal, 1);
  const dash  = pct * circ;
  const met   = minutes !== null && minutes >= goal;
  const ringColor = met ? "#10B981" : color;

  return (
    <svg width={88} height={88} viewBox="0 0 88 88" style={{ flexShrink: 0 }}>
      <circle cx={44} cy={44} r={R} fill="none" stroke="#EAECF0" strokeWidth={sw} />
      {minutes > 0 && (
        <circle
          cx={44} cy={44} r={R}
          fill="none"
          stroke={ringColor}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          transform="rotate(-90 44 44)"
          style={{ transition: "stroke-dasharray 0.4s ease" }}
        />
      )}
      {met ? (
        <text x={44} y={52} textAnchor="middle" fontSize={24} fill={ringColor} fontFamily="inherit">✓</text>
      ) : (
        <>
          <text x={44} y={43} textAnchor="middle" fontSize={19} fontWeight={800} fill="#111827" fontFamily="inherit">
            {minutes ?? "–"}
          </text>
          <text x={44} y={58} textAnchor="middle" fontSize={10} fill="#9CA3AF" fontFamily="inherit">
            / {goal} min
          </text>
        </>
      )}
    </svg>
  );
}

// ─── Cover image ──────────────────────────────────────────────────────────────
export function CoverImage({ isbn, title }) {
  const [failed, setFailed] = useState(false);
  const seed  = title.charCodeAt(0) + (title.charCodeAt(1) || 0);
  const [bg, fg] = COVER_PALETTES[seed % COVER_PALETTES.length];

  if (failed) {
    return (
      <div className="bp-title-cover bp-title-cover--placeholder" style={{ background: bg, color: fg }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      </div>
    );
  }
  return (
    <img
      className="bp-title-cover"
      src={`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`}
      alt={title}
      onLoad={(e) => { if (e.target.naturalWidth <= 1) setFailed(true); }}
      onError={() => setFailed(true)}
    />
  );
}
