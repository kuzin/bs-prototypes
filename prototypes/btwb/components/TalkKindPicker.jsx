import { Icon } from '@components/Icon/Icon'
import { TALK_KIND_OPTIONS } from '../data'

/* `.choice-card` — what the admin reads when picking a conversation is what
   that conversation does *to the reader*, which is a different sentence from
   the one a session card needs. `TALK_KINDS[].blurb` describes a talk you are
   looking at; these describe one you are choosing. */
const CHOICE_COPY = {
  engagement: 'A chat that prompts students to reflect on the book and what they enjoyed most when reading.', // prettier-ignore
  comprehension: 'A chat that prompts students to demonstrate what they understood, focusing on the plot, characters, and themes.', // prettier-ignore
}

/**
 * Which conversation a trigger should start — the app's `.choice-card`
 * container: one card to a row, the type's glyph, its name, and what it does.
 *
 * A card is white with a hairline until it's the one chosen, when it takes the
 * app's green border and a green corner flag with a tick in it. The types carry
 * their own colours everywhere else in this prototype; here they don't, because
 * on this page the only colour that means anything is "this is the one".
 */
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
              onClick={() => onChange(k.id)}
            >
              <span className="bw-kind-icon">
                <Icon name={k.icon} size={24} />
              </span>
              <span className="bw-kind-text">
                <span className="bw-kind-label">{k.short}</span>
                <span className="bw-kind-blurb">{CHOICE_COPY[k.id] ?? k.blurb}</span>
              </span>
            </button>
          )
        })}
      </div>
    </>
  )
}
