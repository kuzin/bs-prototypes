import { useMemo, useState } from 'react'
import { FormField, PressableButton } from '@mobile/components'
import './EditForm.css'

/**
 * The body Edit Account and Edit Reader share — `EditAccount.jsx` and `EditReader.tsx` render the
 * same `MaterialFormFieldItem` list through the same `generateSectionsListStructure`, differing
 * only in what surrounds it.
 *
 * Section headers are `secondaryTitle`, 16/700 — one rung under the 20pt heading Accounts and
 * Readers carry. They are on the ladder those pages use rather than in the app's 12pt grayish
 * CAPS, which belong to the Material fields they used to head and read as a caption for the first
 * box rather than a title for the group. But they are not that 20 either: a page has one heading
 * and this screen has three of them, and at 20 three titles compete with the fields they are
 * meant to be organising.
 *
 * The one rename is kept — `sign_in_info` arrives titled "Create An Account" and both editors swap
 * it for "Your Account", since you are not creating anything here.
 *
 * Save is enabled only when a value differs from what arrived. The source computes that with
 * `areFieldsValuesEqual` over the defaults map, and it is the reason the button is the screen's
 * only state: an untouched form cannot be submitted.
 *
 * DIVERGENCE — the fields are boxed rather than ruled. `MaterialFormFieldItem` separates one field
 * from the next with a full-width hairline, because a bare line of text over an invisible underline
 * has nothing else to tell you where it ends. A box already says that, so the rules come out and
 * the group takes the book editor's rhythm instead: 12 between boxes, 20 either side. The 48pt gap
 * above a section header goes with them — it was buying separation the boxes now provide.
 */
const titleFor = (section) =>
  section.title === 'Create An Account' ? 'Your Account' : section.title

export function EditForm({ sections, footer, onSave }) {
  const defaults = useMemo(() => {
    const out = {}
    sections.forEach((s) => s.fields.forEach((f) => (out[f.name] = f.value ?? null)))
    return out
  }, [sections])

  const [values, setValues] = useState(defaults)
  const change = (name, value) => setValues((v) => ({ ...v, [name]: value }))

  const dirty = Object.keys(defaults).some((k) => values[k] !== defaults[k])

  return (
    <>
      <div className="m-edf-scroll">
        {sections.map((section) => (
          <div key={section.name} className="m-edf-group">
            <h3 className="m-t-secondary-title m-edf-section">{titleFor(section)}</h3>
            {section.fields.map((field) => (
              <FormField key={field.name} {...field} value={values[field.name]} onChange={change} />
            ))}
          </div>
        ))}
        {footer}
      </div>

      {/* Pinned OUTSIDE the scroll with 20 either side and 16 above and below, plus 20 more at the
          foot — the only control on the screen that never scrolls away. */}
      <div className="m-edf-save">
        <PressableButton
          fullWidth
          buttonText="Save"
          disabled={!dirty}
          onButtonPress={() => onSave?.(values)}
        />
      </div>
    </>
  )
}
