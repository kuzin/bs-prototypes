import { useState } from 'react'
import { Img } from '../Img/Img'
import './FormField.css'

/**
 * `components/listItems/MaterialFormFieldItem.tsx` — the field every registration and settings
 * form is built from, and the third distinct input in this system. [[TextField]] is the app's
 * floating-label box (the book editor); the reading-session editor stacks its own titled rows;
 * this one is the Material-style field the API drives.
 *
 * It exists because these forms are NOT hand-authored. The server sends
 * `registration_fields.sections`, each field carrying a label, a type, a placeholder, a required
 * flag and its options, and the screen renders whatever arrives. So the component is a switch over
 * `field_type` rather than a layout — and the types are the app's own list: text, numeric, phone,
 * email, password, bool, select, date-picker.
 *
 * The 3pt underline is the part worth knowing about. It is `inputBottomLineColor`, which starts at
 * literal `'white'` and only changes on focus — and both settings forms pass
 * `renderActiveState={false}`, which makes that state setter a no-op. So in Edit Account and Edit
 * Reader the line is permanently white: it reserves 3pt and draws nothing, and what actually
 * separates the fields is the full-width hairline between rows. Reading the stylesheet alone would
 * have produced a visible 3pt rule under every input.
 *
 * `renderActiveState` is kept as the opt-in it is in the source — the signup flow does use it, and
 * there the line takes the tenant accent on focus and `redError` when the field is wrong.
 */
const PLACEHOLDER_DATE = 'YYYY-MM-DD'

export function FormField({
  label,
  type = 'text',
  name,
  value,
  placeholder = '',
  required = false,
  options = [],
  error,
  renderActiveState = false,
  onChange,
}) {
  const [focused, setFocused] = useState(false)
  const set = (v) => onChange?.(name, v === '' ? null : v)

  // `bool` is the one type that is not a column: the label takes the row and the switch sits at
  // its end.
  if (type === 'bool') {
    return (
      <div className="m-ff m-ff-bool">
        <span className="m-t-small-title m-t-black-font m-ff-label">{label}</span>
        <input
          type="checkbox"
          className="m-ff-switch"
          checked={Boolean(value)}
          aria-label={label}
          onChange={(e) => set(e.target.checked)}
        />
      </div>
    )
  }

  const lineState = !renderActiveState || !focused ? '' : error ? ' is-error' : ' is-active'

  return (
    <div className="m-ff">
      {/* Required or not, the label is the same type at the same 20/14 rhythm — the source's two
          branches differ only in the wrapper, not in what is drawn. */}
      <span className="m-t-small-title m-t-black-font m-ff-label">{label}</span>

      <div className={`m-ff-line${lineState}`}>
        {type === 'select' ? (
          <div className="m-ff-select">
            <select
              className={`m-ff-input${value == null || value === '' ? ' is-placeholder' : ''}`}
              value={value ?? ''}
              aria-label={`${name} field`}
              onChange={(e) => set(e.target.value)}
            >
              <option value="">{placeholder}</option>
              {options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.name}
                </option>
              ))}
            </select>
            <Img name="dropdown_arrow" className="m-ff-arrow" />
          </div>
        ) : type === 'date-picker' ? (
          /* A Pressable, not an input — it opens `DatePickerModal`. Unset it reads the literal
             placeholder `YYYY-MM-DD` in ashesGray; set, it is `MMMM DD, YYYY` in secondary. */
          <button
            type="button"
            className={`m-ff-input m-ff-date${value ? '' : ' is-placeholder'}`}
            onClick={() => set(value ? '' : '2016-04-12')}
          >
            {value
              ? new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
                  month: 'long',
                  day: '2-digit',
                  year: 'numeric',
                })
              : PLACEHOLDER_DATE}
          </button>
        ) : (
          <input
            className={`m-ff-input${error ? ' is-error' : ''}`}
            type={type === 'password' ? 'password' : 'text'}
            inputMode={type === 'numeric' ? 'numeric' : type === 'phone' ? 'tel' : undefined}
            value={value ?? ''}
            placeholder={placeholder}
            required={required}
            aria-label={`${name} field`}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            /* The app strips spaces from exactly these four as you type, because each is a
               credential the server matches literally. */
            onChange={(e) =>
              set(
                ['username', 'library_card_number', 'phone_number', 'email'].includes(name)
                  ? e.target.value.replace(/ /g, '')
                  : e.target.value,
              )
            }
          />
        )}
      </div>

      {/* An 18pt red disc with a bold white bang, then the message. With no error the source still
          renders a 4pt spacer, so a field does not move when one appears. */}
      {error ? (
        <div className="m-ff-error">
          <span className="m-ff-bang" aria-hidden="true">
            !
          </span>
          <span className="m-t-paragraph-small m-ff-error-text">{error}</span>
        </div>
      ) : (
        <div className="m-ff-spacer" />
      )}
    </div>
  )
}
