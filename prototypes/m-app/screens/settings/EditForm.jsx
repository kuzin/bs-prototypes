import { useMemo, useState } from 'react'
import { FormField, PressableButton } from '@mobile/components'
import './EditForm.css'

/**
 * The body Edit Account and Edit Reader share — `EditAccount.jsx` and `EditReader.tsx` render the
 * same `MaterialFormFieldItem` list through the same `generateSectionsListStructure`, differing
 * only in what surrounds it.
 *
 * Section headers are the app's: the title UPPERCASED at 12 in `grayish`, 16 either side, and
 * **48 of air above** — a gap big enough that it reads as a break rather than a heading. The one
 * exception is baked into the screen: `sign_in_info` arrives titled "Create An Account" and both
 * editors swap it for "Your Account", since you are not creating anything here.
 *
 * Save is enabled only when a value differs from what arrived. The source computes that with
 * `areFieldsValuesEqual` over the defaults map, and it is the reason the button is the screen's
 * only state: an untouched form cannot be submitted.
 *
 * DIVERGENCE — the two screens rule their fields differently and both are kept. Edit Account puts
 * a hairline above every section header AND between fields; Edit Reader puts one only between
 * fields within a section. Neither is obviously right, but they are what the two files do.
 */
const titleFor = (section) =>
  section.title === 'Create An Account' ? 'Your Account' : section.title.toUpperCase()

export function EditForm({ sections, ruleAboveSections = false, footer, onSave }) {
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
          <div key={section.name}>
            {ruleAboveSections && <span className="m-edf-rule" />}
            <h3 className="m-edf-section">{titleFor(section)}</h3>
            {section.fields.map((field, i) => (
              <div key={field.name}>
                {i > 0 && <span className="m-edf-rule" />}
                <div className="m-edf-field">
                  <FormField
                    {...field}
                    value={values[field.name]}
                    onChange={change}
                    renderActiveState={false}
                  />
                </div>
              </div>
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
