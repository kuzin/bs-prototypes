import { Hero } from '@components/Hero/Hero'
import { Icon } from '@components/Icon/Icon'

// Per-type icon, drawn from the shared Tabler set. Tinted by each type accent
// (the .cc-type-glyph wrapper sets the color, which the icon inherits).
const GLYPH_NAMES = {
  logging: 'reading-log',
  activity: 'circle-check',
  bingo: 'layout-grid',
  points: 'star',
  'reading-list': 'list',
  reviews: 'message-circle',
  gameboard: 'route',
}

export function TypeGlyph({ id, size = 26 }) {
  return <Icon name={GLYPH_NAMES[id] ?? 'puzzle'} size={size} />
}

export function TypeStep({ types, value, onSelect }) {
  return (
    <section className="cc-step">
      <div className="cc-step-head">
        <Hero
          icon={<Icon name="layout-grid" size={22} />}
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
