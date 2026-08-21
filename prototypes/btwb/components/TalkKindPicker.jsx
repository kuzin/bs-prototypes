import { Icon } from '@components/Icon/Icon'
import { Pill } from '@components/Pill/Pill'
import { TALK_KIND_OPTIONS } from '../data'

// Which of the three conversations a trigger should start.
//
// Every trigger now carries this choice — book completions, a challenge, and the
// warning threshold — so the cards live in one place rather than being repeated
// per surface. Each card is the type's name plus what that conversation actually
// is; the blurbs come from TALK_KINDS so the picker, the upsell panel and the
// talk itself all describe a type the same way.
export function TalkKindPicker({ value, onChange, label, ariaLabel = 'Conversation type' }) {
  return (
    <>
      {label && <h3 className="bw-subsetting-title">{label}</h3>}
      <div className="bw-kind-cards" role="radiogroup" aria-label={ariaLabel}>
        {TALK_KIND_OPTIONS.map((k) => {
          const active = value === k.id
          return (
            <button
              key={k.id}
              type="button"
              role="radio"
              aria-checked={active}
              className={`bw-kind-card${active ? ' is-active' : ''}`}
              style={{ '--kind': k.color }}
              onClick={() => onChange(k.id)}
            >
              <span className="bw-kind-head">
                <Icon name={k.icon} size={16} />
                <span className="bw-kind-label">{k.label}</span>
                {k.isNew && (
                  <Pill color={k.color} variant="filled" size="sm">
                    New
                  </Pill>
                )}
                {active && <Icon name="check" size={14} stroke={2.6} className="bw-kind-check" />}
              </span>
              <span className="bw-kind-blurb">{k.blurb}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}
