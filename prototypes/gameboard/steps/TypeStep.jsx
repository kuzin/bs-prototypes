import { Hero } from '@components/Hero/Hero'
import { Icon } from '@components/Icon/Icon'

// Per-type icon, drawn from the shared Tabler set. Tinted by each type accent
// (the .gb-type-glyph wrapper sets the color, which the icon inherits).
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

// The full type grid renders so the step reads as it does in the creator, but
// only the Gameboard type has a flow behind it in this prototype — the rest are
// shown inert rather than hidden, so the step keeps its real shape.
export function TypeStep({ types, value, onSelect, selectableIds }) {
  return (
    <section className="gb-step">
      <div className="gb-step-head">
        <Hero
          icon={<Icon name="layout-grid" size={22} />}
          title="Choose a challenge type"
          subtitle="Pick the main way readers earn badges — you can layer on more in the Badges step."
          accent="#0DA7BC"
        />
      </div>
      <div className="gb-type-grid">
        {types.map((t) => {
          const selected = t.id === value
          const off = selectableIds && !selectableIds.includes(t.id)
          return (
            <button
              key={t.id}
              type="button"
              className={`gb-type-card${selected ? ' is-selected' : ''}${off ? ' is-off' : ''}`}
              style={{ '--type-accent': t.accent }}
              onClick={() => onSelect(t.id)}
              aria-pressed={selected}
              disabled={off}
              title={off ? `${t.name} — not part of this prototype` : t.name}
            >
              <span className="gb-type-glyph">
                <TypeGlyph id={t.id} />
              </span>
              <span className="gb-type-name">{t.name}</span>
              <span className="gb-type-tagline">{t.tagline}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
