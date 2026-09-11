import { Hero } from '@components/Hero/Hero'
import { PlumpyIcon } from '@components/PlumpyIcon/PlumpyIcon'

// Per-type icon, on the Plumpy duotone family the real admin chrome uses. Both
// Plumpy layers tint from `fill: currentColor`, so the .cc-type-glyph wrapper's
// accent still drives them.
const GLYPH_NAMES = {
  logging: 'log',
  activity: 'puzzle',
  bingo: 'classroom',
  points: 'points',
  'reading-list': 'book',
  reviews: 'chat',
  gameboard: 'challenges',
}

export function TypeGlyph({ id, size = 26 }) {
  return <PlumpyIcon name={GLYPH_NAMES[id] ?? 'puzzle'} size={size} />
}

export function TypeStep({ types, value, onSelect }) {
  return (
    <section className="cc-step">
      <div className="cc-step-head">
        <Hero
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
