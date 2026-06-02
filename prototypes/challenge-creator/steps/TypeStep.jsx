import { Hero } from '@components/Hero/Hero'

// Per-type inline glyphs (24×24, stroke, currentColor) — tinted by each type accent.
const GLYPHS = {
  logging: (
    <>
      <path d="M12 6.5C10.2 5.2 7.8 4.5 5 4.5c-.83 0-1.5.3-1.5.95v11.6c0 .6.6.95 1.4.9C7.6 17.7 10 18.4 12 19.7" />
      <path d="M12 6.5C13.8 5.2 16.2 4.5 19 4.5c.83 0 1.5.3 1.5.95v11.6c0 .6-.6.95-1.4.9C16.4 17.7 14 18.4 12 19.7" />
    </>
  ),
  activity: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <path d="M8.5 12.2l2.6 2.6 4.4-5" />
    </>
  ),
  bingo: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M9.33 4.5v15M14.67 4.5v15M4.5 9.33h15M4.5 14.67h15" />
    </>
  ),
  points: <path d="M12 4l2.35 4.76 5.25.76-3.8 3.7.9 5.23L12 16.74l-4.7 2.47.9-5.23-3.8-3.7 5.25-.76z" />,
  'reading-list': (
    <>
      <circle cx="4.5" cy="6" r="1.3" />
      <circle cx="4.5" cy="12" r="1.3" />
      <circle cx="4.5" cy="18" r="1.3" />
      <path d="M8.5 6h11M8.5 12h11M8.5 18h11" />
    </>
  ),
  reviews: (
    <>
      <path d="M5 4.5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4.5 3.5V16.5H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" />
      <path
        d="M12 8l1.1 2.25 2.48.36-1.8 1.75.43 2.47L12 13.7l-2.2 1.16.42-2.47-1.8-1.75 2.49-.36z"
        fill="currentColor"
        stroke="none"
      />
    </>
  ),
  gameboard: (
    <>
      <path d="M4 18.5l4-5 4 3 4-5 4-4" />
      <circle cx="4" cy="18.5" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="8" cy="13.5" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="12" cy="16.5" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="16" cy="11.5" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="20" cy="7.5" r="1.7" fill="currentColor" stroke="none" />
    </>
  ),
}

export function TypeGlyph({ id, size = 26 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {GLYPHS[id] ?? <circle cx="12" cy="12" r="8" />}
    </svg>
  )
}

export function TypeStep({ types, value, onSelect }) {
  return (
    <section className="cc-step">
      <div className="cc-step-head">
        <Hero
          icon={
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          }
          title="Choose a challenge type"
          subtitle="Pick the main way readers earn badges — you can layer on more in the Badges step."
          accent="#0DA7BC"
        />
      </div>
      <div className="cc-type-grid">
        {types.map((t) => {
          const selected = t.id === value
          return (
            <button
              key={t.id}
              type="button"
              className={`cc-type-card${selected ? ' is-selected' : ''}`}
              style={{ '--type-accent': t.accent }}
              onClick={() => onSelect(t.id)}
              aria-pressed={selected}
            >
              <span className="cc-type-glyph">
                <TypeGlyph id={t.id} />
              </span>
              <span className="cc-type-name">{t.name}</span>
              <span className="cc-type-tagline">{t.tagline}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
