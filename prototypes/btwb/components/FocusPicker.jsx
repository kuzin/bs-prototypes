import { Icon } from '@components/Icon/Icon'
import { CONVERSATION_FOCUSES, focusById } from '../data'

// Conversation Focus picker — the setting a comprehension talk needs.
//
// The chips pick the focus; underneath are a couple of examples of how Benny
// works that focus into conversation. They're deliberately samples rather than
// the script — he varies his wording per reader and grade — and they read as
// conversation rather than as comprehension quiz items.
export function FocusPicker({ value, onChange }) {
  const focus = focusById(value)

  return (
    <div className="bw-focus">
      <div className="bw-focus-chips" role="radiogroup" aria-label="Conversation focus">
        {CONVERSATION_FOCUSES.map((f) => {
          const active = f.id === value
          return (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={active}
              className={`bw-focus-chip${active ? ' is-active' : ''}`}
              onClick={() => onChange(f.id)}
            >
              {active && <Icon name="check" size={14} />}
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Framed as samples, not a script: Benny writes his own wording each time
        and scales it to the reader, so two examples show the shape rather than
        implying a fixed question. */}
      <div className="bw-weave">
        <div className="bw-weave-row bw-weave-row--benny">
          <span className="bw-weave-tag">
            <img src="/bs-prototypes/benny.png" alt="" className="bw-weave-benny" />
            Benny might ask something like…
          </span>
          <ul className="bw-weave-examples">
            <li>{focus.benny}</li>
            <li>{focus.alsoAsks}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
