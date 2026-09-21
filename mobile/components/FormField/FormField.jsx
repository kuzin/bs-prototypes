import { Img } from '../Img/Img'
import { TextField } from '../TextField/TextField'
import './FormField.css'

/**
 * A field in a server-driven form — `components/listItems/MaterialFormFieldItem.tsx`.
 *
 * The BEHAVIOUR is the app's, and it is the whole reason this component exists: registration and
 * settings forms are not authored. The server sends `registration_fields.sections`, each field
 * carrying a label, a type, a placeholder, a required flag and its options, and the screen renders
 * whatever arrives. So this is a switch over `field_type` rather than a layout, and the types are
 * the app's own list: text, numeric, phone, email, password, bool, select, date-picker.
 *
 * The CHROME is deliberately NOT the app's. `MaterialFormFieldItem` is the oldest input in the
 * codebase — a label above a bare line of text, over a 3pt underline that is set to the literal
 * string `'white'` and, because both settings editors pass `renderActiveState={false}`, never
 * changes from it. So it reserves 3pt, draws nothing, and the only thing separating one field from
 * the next is a full-width hairline. It is a Material pattern from before the app had
 * [[TextField]], and beside the book editor's floating-label boxes it reads as a different
 * product.
 *
 * So the box here is TextField's, on a design call: same 56pt at radius 10, same 2pt stroke, same
 * label notching the border. A select and a date sit in that same box rather than redrawing one —
 * a picker that has to invent its own chrome to stand beside a text field is how a form drifts.
 *
 * `bool` keeps its own shape, because it is not a value in the form so much as a question: a ruled
 * row with the label on the left and the platform switch on the right, which is what the book
 * editor's Track Progress does one screen over.
 */
export function FormField({
  label,
  type = 'text',
  name,
  value,
  placeholder = '',
  required = false,
  options = [],
  error,
  onChange,
}) {
  const set = (v) => onChange?.(name, v === '' ? null : v)

  if (type === 'bool') {
    return (
      <div className="m-ff-bool">
        <span className="m-ff-bool-label">{label}</span>
        {/* RN's platform `<Switch>` — a UISwitch, not the app's own CustomToggleSwitch. */}
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

  const control =
    type === 'select' ? (
      <TextField label={label} value={value} alwaysRaised className="m-ff-box">
        <select
          className={`m-tf-input m-ff-select${value == null || value === '' ? ' is-placeholder' : ''}`}
          value={value ?? ''}
          aria-label={label}
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
      </TextField>
    ) : type === 'date-picker' ? (
      /* A Pressable in the app, opening `DatePickerModal` — so a button here, not an input.
         Unset it reads the literal `YYYY-MM-DD`; set, it is `MMMM DD, YYYY`. */
      <TextField label={label} value={value} alwaysRaised className="m-ff-box">
        <button
          type="button"
          className={`m-tf-input m-ff-date${value ? '' : ' is-placeholder'}`}
          onClick={() => set(value ? '' : '2016-04-12')}
        >
          {value
            ? new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
                month: 'long',
                day: '2-digit',
                year: 'numeric',
              })
            : 'YYYY-MM-DD'}
        </button>
      </TextField>
    ) : (
      <TextField
        label={label}
        value={value ?? ''}
        placeholder={placeholder}
        type={type === 'password' ? 'password' : 'text'}
        inputMode={type === 'numeric' ? 'numeric' : type === 'phone' ? 'tel' : undefined}
        required={required}
        className={`m-ff-box${error ? ' is-error' : ''}`}
        /* The app strips spaces from exactly these four as you type, because each is a credential
           the server matches literally. */
        onChange={(v) =>
          set(
            ['username', 'library_card_number', 'phone_number', 'email'].includes(name)
              ? v.replace(/ /g, '')
              : v,
          )
        }
      />
    )

  return (
    <div className="m-ff">
      {control}
      {/* `renderError` — an 18pt red disc with a bold white bang, then the message. */}
      {error && (
        <div className="m-ff-error">
          <span className="m-ff-bang" aria-hidden="true">
            !
          </span>
          <span className="m-t-paragraph-small m-ff-error-text">{error}</span>
        </div>
      )}
    </div>
  )
}
