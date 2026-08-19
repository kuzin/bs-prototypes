import { Banner } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import { getTemplatesForType } from '../data'
import { StepHead, thumbStyle } from './shared'

// ─── Step 2 · Template ────────────────────────────────────────────────────────
// Its own step between choosing the type and filling in the details: start from
// scratch, or take a template that pre-fills the title, description, banner, and
// badge set. It sits here rather than at the top of Details because it's a fork
// in the road — everything on the steps that follow is either what a template
// handed you or what you built yourself.
export function TemplateStep({ challenge, onTemplate }) {
  const templates = [
    { id: 'scratch', name: 'Start from scratch', blurb: 'A blank challenge you build yourself.' },
    ...getTemplatesForType(challenge.typeId),
  ]
  return (
    <section className="gb-step">
      <StepHead
        title="Start from a template"
        sub="Take a ready-made challenge and change what you like, or build one from scratch."
        icon={<Icon name="layers" size={22} />}
      />

      <div className="gb-panel">
        <h3 className="gb-panel-title">Templates for a Gameboard Challenge</h3>
        <div className="gb-gallery">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`gb-gallery-card${challenge.templateId === t.id ? ' is-on' : ''}`}
              onClick={() => onTemplate(t.id)}
            >
              <span
                className="gb-gallery-thumb"
                style={t.id === 'scratch' ? { background: '#f1f5f9' } : thumbStyle(t.id)}
              >
                {t.id === 'scratch' && <span className="gb-gallery-plus">+</span>}
              </span>
              <span className="gb-gallery-name">{t.name}</span>
              <span className="gb-gallery-blurb">{t.blurb}</span>
            </button>
          ))}
        </div>
        <Banner level="info" className="gb-template-banner">
          Looking for a challenge template that isn’t listed here?{' '}
          <a href="#" className="gb-link" onClick={(e) => e.preventDefault()}>
            Visit the template browser
          </a>
          .
        </Banner>
      </div>
    </section>
  )
}
