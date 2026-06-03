import { useState } from 'react'
import { Toggle } from '@components/Toggle/Toggle'
import {
  Checkbox,
  Field,
  Input,
  NumberInput,
  Radio,
  RadioGroup,
  RangeSlider,
  Select,
  Textarea,
} from '@components/Form/Form'
import { Spinner } from '@components/Primitives/Primitives'
import { RichText } from '@components/RichText/RichText'
import { SearchInput } from '@components/SearchInput/SearchInput'
import { ImageDropzone } from '@components/ImageDropzone/ImageDropzone'
import { Icon } from '@components/Icon/Icon'
import { Knobs } from './_shared'

function RichTextKnobs() {
  const [html, setHtml] = useState('<p>Tell readers <strong>all about</strong> your challenge!</p>')
  return (
    <div className="pt-variant-frame">
      <div style={{ width: 360, maxWidth: '100%' }}>
        <RichText value={html} onChange={setHtml} placeholder="Write a description…" />
        <pre
          style={{
            marginTop: 10,
            fontSize: 11,
            background: '#f8fafc',
            padding: 8,
            borderRadius: 8,
            whiteSpace: 'pre-wrap',
            color: '#475569',
          }}
        >
          {html}
        </pre>
      </div>
    </div>
  )
}

function ImageDropzoneKnobs() {
  const [name, setName] = useState('')
  return (
    <div className="pt-variant-frame">
      <div style={{ width: 360, maxWidth: '100%' }}>
        <ImageDropzone
          fileName={name}
          onFile={setName}
          onClear={() => setName('')}
          hint={'920 × 351px · jpeg, jpg, gif, png · under 10MB'}
        />
      </div>
    </div>
  )
}

function ToggleKnobs() {
  const [checked, setChecked] = useState(true)
  const [size, setSize] = useState('md')
  const [disabled, setDisabled] = useState(false)
  const [label, setLabel] = useState('Notifications')
  return (
    <>
      <Knobs>
        <Field label="checked">
          <Toggle checked={checked} onChange={setChecked} />
        </Field>
        <Field label="size">
          <Select value={size} onChange={(e) => setSize(e.target.value)}>
            <option>sm</option>
            <option>md</option>
            <option>lg</option>
          </Select>
        </Field>
        <Field label="disabled">
          <Toggle checked={disabled} onChange={setDisabled} />
        </Field>
        <Field label="label">
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="(no label)"
          />
        </Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--row">
        <Toggle checked={checked} onChange={setChecked} size={size} disabled={disabled}>
          {label || undefined}
        </Toggle>
      </div>
    </>
  )
}

function InputKnobs() {
  const [value, setValue] = useState('Lincoln Elementary')
  const [placeholder, setPh] = useState('Type here…')
  const [type, setType] = useState('text')
  const [size, setSize] = useState('md')
  const [disabled, setDisabled] = useState(false)
  const [withIcon, setIcon] = useState(false)
  const [withIconRight, setIconRight] = useState(false)
  const [withLabel, setLabel] = useState(true)
  const [required, setRequired] = useState(false)
  const [error, setError] = useState('')
  const [help, setHelp] = useState('')
  const searchIcon = <Icon name="search" />
  const checkIcon = <Icon name="check" />
  return (
    <>
      <Knobs>
        <Field label="value">
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </Field>
        <Field label="placeholder">
          <Input value={placeholder} onChange={(e) => setPh(e.target.value)} />
        </Field>
        <Field label="type">
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option>text</option>
            <option>email</option>
            <option>number</option>
            <option>password</option>
          </Select>
        </Field>
        <Field label="size">
          <Select value={size} onChange={(e) => setSize(e.target.value)}>
            <option>sm</option>
            <option>md</option>
            <option>lg</option>
          </Select>
        </Field>
        <Field label="show label">
          <Toggle checked={withLabel} onChange={setLabel} />
        </Field>
        <Field label="required">
          <Toggle checked={required} onChange={setRequired} />
        </Field>
        <Field label="left icon">
          <Toggle checked={withIcon} onChange={setIcon} />
        </Field>
        <Field label="right icon">
          <Toggle checked={withIconRight} onChange={setIconRight} />
        </Field>
        <Field label="disabled">
          <Toggle checked={disabled} onChange={setDisabled} />
        </Field>
        <Field label="help">
          <Input value={help} onChange={(e) => setHelp(e.target.value)} placeholder="(none)" />
        </Field>
        <Field label="error">
          <Input value={error} onChange={(e) => setError(e.target.value)} placeholder="(none)" />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        {error || help || required ? (
          <Field
            label={withLabel ? 'School name' : undefined}
            required={required}
            help={help || undefined}
            error={error || undefined}
          >
            <Input
              type={type}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              size={size}
              disabled={disabled}
              icon={withIcon ? searchIcon : undefined}
              iconRight={withIconRight ? checkIcon : undefined}
            />
          </Field>
        ) : (
          <Input
            label={withLabel ? 'School name' : undefined}
            type={type}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            size={size}
            disabled={disabled}
            icon={withIcon ? searchIcon : undefined}
            iconRight={withIconRight ? checkIcon : undefined}
          />
        )}
      </div>
    </>
  )
}

function SelectKnobs() {
  const [value, setValue] = useState('5')
  const [size, setSize] = useState('md')
  const [disabled, setDisabled] = useState(false)
  const [labelText, setLabel] = useState('Grade level')
  const [withLabel, setWith] = useState(true)
  const [error, setError] = useState('')
  const options = ['K', '1', '2', '3', '4', '5', '6', '7', '8'].map((g) => (
    <option key={g} value={g}>
      Grade {g}
    </option>
  ))
  return (
    <>
      <Knobs>
        <Field label="value">
          <Select value={value} onChange={(e) => setValue(e.target.value)}>
            {['K', '1', '2', '3', '4', '5', '6', '7', '8'].map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="size">
          <Select value={size} onChange={(e) => setSize(e.target.value)}>
            <option>sm</option>
            <option>md</option>
            <option>lg</option>
          </Select>
        </Field>
        <Field label="show label">
          <Toggle checked={withLabel} onChange={setWith} />
        </Field>
        <Field label="label text">
          <Input value={labelText} onChange={(e) => setLabel(e.target.value)} />
        </Field>
        <Field label="disabled">
          <Toggle checked={disabled} onChange={setDisabled} />
        </Field>
        <Field label="error">
          <Input value={error} onChange={(e) => setError(e.target.value)} placeholder="(none)" />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        {error ? (
          <Field label={withLabel ? labelText : undefined} error={error}>
            <Select
              value={value}
              onChange={(e) => setValue(e.target.value)}
              size={size}
              disabled={disabled}
            >
              {options}
            </Select>
          </Field>
        ) : (
          <Select
            label={withLabel ? labelText : undefined}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            size={size}
            disabled={disabled}
          >
            {options}
          </Select>
        )}
      </div>
    </>
  )
}

function TextareaKnobs() {
  const [value, setValue] = useState(
    'Lincoln Elementary saw a 6-week Lexile plateau despite strong engagement scores.',
  )
  const [rows, setRows] = useState('4')
  const [size, setSize] = useState('md')
  const [disabled, setDisabled] = useState(false)
  const [help, setHelp] = useState('Visible to district leadership.')
  return (
    <>
      <Knobs>
        <Field label="rows">
          <Input type="number" value={rows} onChange={(e) => setRows(e.target.value)} />
        </Field>
        <Field label="size">
          <Select value={size} onChange={(e) => setSize(e.target.value)}>
            <option>sm</option>
            <option>md</option>
            <option>lg</option>
          </Select>
        </Field>
        <Field label="disabled">
          <Toggle checked={disabled} onChange={setDisabled} />
        </Field>
        <Field label="help">
          <Input value={help} onChange={(e) => setHelp(e.target.value)} placeholder="(none)" />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Field label="Notes" help={help || undefined}>
          <Textarea
            rows={Number(rows) || 3}
            size={size}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={disabled}
          />
        </Field>
      </div>
    </>
  )
}

function CheckboxKnobs() {
  const [checked, setChecked] = useState(true)
  const [disabled, setDisabled] = useState(false)
  const [label, setLabel] = useState('Include FRL data')
  return (
    <>
      <Knobs>
        <Field label="checked">
          <Toggle checked={checked} onChange={setChecked} />
        </Field>
        <Field label="disabled">
          <Toggle checked={disabled} onChange={setDisabled} />
        </Field>
        <Field label="label">
          <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="(none)" />
        </Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--row">
        <Checkbox checked={checked} onChange={setChecked} disabled={disabled}>
          {label || undefined}
        </Checkbox>
      </div>
    </>
  )
}

function RadioKnobs() {
  const [value, setValue] = useState('md')
  const [layout, setLayout] = useState('row')
  return (
    <>
      <Knobs>
        <Field label="layout">
          <Select value={layout} onChange={(e) => setLayout(e.target.value)}>
            <option>row</option>
            <option>column</option>
          </Select>
        </Field>
        <Field label="value">
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <RadioGroup name="rs-knob" layout={layout} value={value} onChange={setValue}>
          <Radio value="sm">Small</Radio>
          <Radio value="md">Medium</Radio>
          <Radio value="lg">Large</Radio>
        </RadioGroup>
      </div>
    </>
  )
}

function NumberInputKnobs() {
  const [value, setValue] = useState(5)
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(10)
  const [step, setStep] = useState(1)
  const [size, setSize] = useState('md')
  return (
    <>
      <Knobs>
        <Field label="size">
          <Select value={size} onChange={(e) => setSize(e.target.value)}>
            <option>sm</option>
            <option>md</option>
            <option>lg</option>
          </Select>
        </Field>
        <Field label="min">
          <Input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} />
        </Field>
        <Field label="max">
          <Input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} />
        </Field>
        <Field label="step">
          <Input
            type="number"
            min="0.1"
            step="0.1"
            value={step}
            onChange={(e) => setStep(Number(e.target.value) || 1)}
          />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <NumberInput
          value={value}
          onChange={setValue}
          min={min}
          max={max}
          step={step}
          size={size}
        />
      </div>
    </>
  )
}

function RangeSliderKnobs() {
  const [value, setValue] = useState(45)
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(100)
  const [step, setStep] = useState(1)
  const [showValue, setShow] = useState(true)
  const [showLabel, setShowLabel] = useState(false)
  const [labelText, setLabelText] = useState('Target score')
  return (
    <>
      <Knobs>
        <Field label="show value">
          <Toggle checked={showValue} onChange={setShow} />
        </Field>
        <Field label="show label">
          <Toggle checked={showLabel} onChange={setShowLabel} />
        </Field>
        {showLabel && (
          <Field label="label">
            <Input value={labelText} onChange={(e) => setLabelText(e.target.value)} />
          </Field>
        )}
        <Field label="min">
          <Input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} />
        </Field>
        <Field label="max">
          <Input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} />
        </Field>
        <Field label="step">
          <Input
            type="number"
            min="0.1"
            step="0.1"
            value={step}
            onChange={(e) => setStep(Number(e.target.value) || 1)}
          />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <RangeSlider
          value={value}
          onChange={setValue}
          min={min}
          max={max}
          step={step}
          showValue={showValue}
          label={showLabel ? labelText : undefined}
        />
      </div>
    </>
  )
}

function SearchInputKnobs() {
  const [value, setValue] = useState('')
  return (
    <div style={{ maxWidth: 360 }}>
      <SearchInput value={value} onChange={setValue} placeholder="Search all badges" />
    </div>
  )
}

export const formFieldsSections = [
  {
    group: 'form-fields',
    id: 'toggle',
    name: 'Toggle',
    desc: (
      <>
        iOS-style switch. Props: <code>checked</code>, <code>onChange</code>, <code>disabled</code>,{' '}
        <code>size</code> (sm/md), optional label as children.
      </>
    ),
    render: () => (
      <>
        <ToggleKnobs />
      </>
    ),
  },
  {
    group: 'form-fields',
    id: 'input',
    name: 'Input',
    desc: (
      <>
        Text input. Sizes <code>sm</code> / <code>md</code> / <code>lg</code>. Optional{' '}
        <code>icon</code> + <code>iconRight</code>. Picks up id, error state, and ARIA from the
        parent <code>Field</code>.
      </>
    ),
    render: () => (
      <>
        <InputKnobs />
      </>
    ),
  },
  {
    group: 'form-fields',
    id: 'select',
    name: 'Select',
    desc: (
      <>
        Wrapped native <code>{'<select>'}</code> with a consistent caret + focus ring. Same size
        scale as Input.
      </>
    ),
    render: () => (
      <>
        <SelectKnobs />
      </>
    ),
  },
  {
    group: 'form-fields',
    id: 'textarea',
    name: 'Textarea',
    desc: <>Multi-line text input. Resizes vertically by default.</>,
    render: () => (
      <>
        <TextareaKnobs />
      </>
    ),
  },
  {
    group: 'form-fields',
    id: 'checkbox',
    name: 'Checkbox',
    desc: <>Boolean control with a colored check icon when on. Use for non-exclusive options.</>,
    render: () => (
      <>
        <CheckboxKnobs />
      </>
    ),
  },
  {
    group: 'form-fields',
    id: 'radio',
    name: 'RadioGroup',
    desc: (
      <>
        Mutually exclusive options. <code>RadioGroup</code> takes <code>name</code>,{' '}
        <code>value</code>, <code>onChange</code>, optional <code>layout</code> (row/column).
        Children are <code>Radio</code> with a <code>value</code>.
      </>
    ),
    render: () => (
      <>
        <RadioKnobs />
      </>
    ),
  },
  {
    group: 'form-fields',
    id: 'number-input',
    name: 'NumberInput',
    desc: (
      <>
        A number field with decrement/increment buttons. Respects <code>min</code>, <code>max</code>
        , and <code>step</code>. Buttons disable at the bounds. Spinner arrows are hidden via CSS.
      </>
    ),
    render: () => (
      <>
        <NumberInputKnobs />
      </>
    ),
  },
  {
    group: 'form-fields',
    id: 'range-slider',
    name: 'RangeSlider',
    desc: (
      <>
        Styled <code>{'<input type="range">'}</code> with a filled track that updates via a CSS
        variable and a value readout. Pass <code>showValue={'{false}'}</code> to hide the label.
      </>
    ),
    render: () => (
      <>
        <RangeSliderKnobs />
      </>
    ),
  },
  {
    group: 'form-fields',
    id: 'rich-text',
    name: 'RichText',
    desc: (
      <>
        Lightweight WYSIWYG editor that emits an HTML string. Toolbar: bold / italic / underline /
        bullet list / link. Props: <code>value</code>, <code>onChange(html)</code>,{' '}
        <code>placeholder</code>, <code>minHeight</code>.
      </>
    ),
    render: () => (
      <>
        <RichTextKnobs />
      </>
    ),
  },
  {
    group: 'form-fields',
    id: 'image-dropzone',
    name: 'ImageDropzone',
    desc: (
      <>
        Drag-and-drop (or click-to-browse) image upload. Props: <code>fileName</code>,{' '}
        <code>onFile(name)</code>, <code>onClear</code>, <code>accept</code>, <code>hint</code>.
        Prototype-grade — reports the chosen file's name (no real upload).
      </>
    ),
    render: () => (
      <>
        <ImageDropzoneKnobs />
      </>
    ),
  },
  {
    group: 'form-fields',
    id: 'search-input',
    name: 'SearchInput',
    desc: (
      <>
        A search field — leading magnifier, text input, and a clear button that appears once there’s
        a value. Controlled via <code>value</code> + <code>onChange(next)</code> (gets the new
        string, and <code>&apos;&apos;</code> on clear). Defaults to <code>flex: 1</code>; pass{' '}
        <code>className</code> for layout overrides.
      </>
    ),
    render: () => (
      <>
        <SearchInputKnobs />
      </>
    ),
  },
]
