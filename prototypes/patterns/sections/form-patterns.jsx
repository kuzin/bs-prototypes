import { useState } from 'react'
import { Button } from '@components/Button/Button'
import { Toggle } from '@components/Toggle/Toggle'
import {
  Checkbox,
  CheckboxGroup,
  CheckboxGroupItem,
  ColorInput,
  DateInput,
  Field,
  FileInput,
  Input,
  MultiSelect,
  NumberInput,
  Radio,
  RadioGroup,
  RangeSlider,
  Select,
  Textarea,
  TimeInput,
} from '@components/Form/Form'
import { CustomSelect } from '@components/CustomSelect/CustomSelect'
import { FilterBar, FilterItem } from '@components/FilterBar/FilterBar'
import { DatePicker } from '@components/DatePicker/DatePicker'
import { TimePicker } from '@components/TimePicker/TimePicker'
import { ActiveFilters } from '@components/ActiveFilters/ActiveFilters'
import { Knobs, Variant } from './_shared'

function ColorInputKnobs() {
  const [value, setValue] = useState('#1D4ED8')
  const [size, setSize] = useState('md')
  const [label, setLabel] = useState('Accent color')
  const [showLabel, setShowLabel] = useState(true)
  const [disabled, setDisabled] = useState(false)
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
        <Field label="show label">
          <Toggle checked={showLabel} onChange={setShowLabel} />
        </Field>
        <Field label="disabled">
          <Toggle checked={disabled} onChange={setDisabled} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <ColorInput
          value={value}
          onChange={setValue}
          size={size}
          disabled={disabled}
          label={showLabel ? label : undefined}
        />
      </div>
    </>
  )
}

function FileInputKnobs() {
  const [size, setSize] = useState('md')
  const [multiple, setMultiple] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [showLabel, setShowLabel] = useState(true)
  const [placeholder, setPlaceholder] = useState('No file chosen')
  const [accept, setAccept] = useState('.csv,.xlsx,.pdf')
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
        <Field label="placeholder">
          <Input value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} />
        </Field>
        <Field label="accept">
          <Input value={accept} onChange={(e) => setAccept(e.target.value)} placeholder="(any)" />
        </Field>
        <Field label="multiple">
          <Toggle checked={multiple} onChange={setMultiple} />
        </Field>
        <Field label="disabled">
          <Toggle checked={disabled} onChange={setDisabled} />
        </Field>
        <Field label="show label">
          <Toggle checked={showLabel} onChange={setShowLabel} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <FileInput
          size={size}
          multiple={multiple}
          disabled={disabled}
          label={showLabel ? 'Upload CSV' : undefined}
          placeholder={placeholder}
          accept={accept || undefined}
        />
      </div>
    </>
  )
}

function DateInputKnobs() {
  const [value, setValue] = useState(null)
  const [size, setSize] = useState('md')
  const [showLabel, setShowLabel] = useState(true)
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
        <Field label="label">
          <Toggle checked={showLabel} onChange={setShowLabel} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <DatePicker
          value={value}
          onChange={setValue}
          size={size}
          label={showLabel ? 'Deadline' : undefined}
          placeholder="Pick a date"
        />
      </div>
    </>
  )
}

function DatePickerKnobs() {
  const [date, setDate] = useState(null)
  const [size, setSize] = useState('md')
  const [disabled, setDis] = useState(false)
  const [showLabel, setLbl] = useState(true)
  const [hasError, setErr] = useState(false)
  const [clearable, setClear] = useState(true)
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
        <Field label="clearable">
          <Toggle checked={clearable} onChange={setClear} />
        </Field>
        <Field label="error">
          <Toggle checked={hasError} onChange={setErr} />
        </Field>
        <Field label="disabled">
          <Toggle checked={disabled} onChange={setDis} />
        </Field>
        <Field label="label">
          <Toggle checked={showLabel} onChange={setLbl} />
        </Field>
      </Knobs>
      <div
        className="pt-variant-frame"
        style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
      >
        <div>
          <span
            style={{
              fontSize: 12,
              color: '#94A3B8',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Default
          </span>
          <div style={{ marginTop: 8 }}>
            <Field error={hasError ? 'Please select a date' : undefined}>
              <DatePicker
                value={date}
                onChange={setDate}
                size={size}
                disabled={disabled}
                clearable={clearable}
              />
            </Field>
          </div>
        </div>
        <div>
          <span
            style={{
              fontSize: 12,
              color: '#94A3B8',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            With label
          </span>
          <div style={{ marginTop: 8 }}>
            <DatePicker
              value={date}
              onChange={setDate}
              size={size}
              disabled={disabled}
              clearable={clearable}
              label={showLabel ? 'Due date' : undefined}
            />
          </div>
        </div>
        <div>
          <span
            style={{
              fontSize: 12,
              color: '#94A3B8',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            In a field row
          </span>
          <div className="pt-form-row" style={{ marginTop: 8 }}>
            <Field label="Start date" error={hasError ? 'Required' : undefined}>
              <DatePicker
                value={date}
                onChange={setDate}
                size={size}
                disabled={disabled}
                clearable={clearable}
              />
            </Field>
            <Field label="End date">
              <DatePicker
                value={null}
                onChange={() => {}}
                size={size}
                disabled={disabled}
                clearable={clearable}
                placeholder="Pick an end date"
              />
            </Field>
          </div>
        </div>
      </div>
    </>
  )
}

function TimeInputKnobs() {
  const [value, setValue] = useState(null)
  const [size, setSize] = useState('md')
  const [step, setStep] = useState(30)
  const [showLabel, setShowLabel] = useState(true)
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
        <Field label="step">
          <Select value={step} onChange={(e) => setStep(Number(e.target.value))}>
            <option value={15}>15 min</option>
            <option value={30}>30 min</option>
            <option value={60}>60 min</option>
          </Select>
        </Field>
        <Field label="label">
          <Toggle checked={showLabel} onChange={setShowLabel} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <TimePicker
          value={value}
          onChange={setValue}
          size={size}
          step={step}
          label={showLabel ? 'Start time' : undefined}
          placeholder="Pick a time"
        />
      </div>
    </>
  )
}

function TimePickerKnobs() {
  const [time, setTime] = useState(null)
  const [size, setSize] = useState('md')
  const [step, setStep] = useState(30)
  const [disabled, setDis] = useState(false)
  const [showLabel, setLbl] = useState(true)
  const [hasError, setErr] = useState(false)
  const [clearable, setClearable] = useState(true)
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
        <Field label="step (min)">
          <Select value={step} onChange={(e) => setStep(Number(e.target.value))}>
            <option value={15}>15</option>
            <option value={30}>30</option>
            <option value={60}>60</option>
          </Select>
        </Field>
        <Field label="clearable">
          <Toggle checked={clearable} onChange={setClearable} />
        </Field>
        <Field label="error">
          <Toggle checked={hasError} onChange={setErr} />
        </Field>
        <Field label="disabled">
          <Toggle checked={disabled} onChange={setDis} />
        </Field>
        <Field label="label">
          <Toggle checked={showLabel} onChange={setLbl} />
        </Field>
      </Knobs>
      <div
        className="pt-variant-frame"
        style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
      >
        <div>
          <span
            style={{
              fontSize: 12,
              color: '#94A3B8',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Default
          </span>
          <div style={{ marginTop: 8 }}>
            <Field error={hasError ? 'Please select a time' : undefined}>
              <TimePicker
                value={time}
                onChange={setTime}
                size={size}
                step={step}
                disabled={disabled}
                clearable={clearable}
              />
            </Field>
          </div>
        </div>
        <div>
          <span
            style={{
              fontSize: 12,
              color: '#94A3B8',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            With label
          </span>
          <div style={{ marginTop: 8 }}>
            <TimePicker
              value={time}
              onChange={setTime}
              size={size}
              step={step}
              disabled={disabled}
              clearable={clearable}
              label={showLabel ? 'Start time' : undefined}
            />
          </div>
        </div>
        <div>
          <span
            style={{
              fontSize: 12,
              color: '#94A3B8',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Date + time together
          </span>
          <div className="pt-form-row" style={{ marginTop: 8 }}>
            <Field label="Date">
              <DatePicker
                value={null}
                onChange={() => {}}
                size={size}
                disabled={disabled}
                placeholder="Pick a date"
              />
            </Field>
            <Field label="Time" error={hasError ? 'Required' : undefined}>
              <TimePicker
                value={time}
                onChange={setTime}
                size={size}
                step={step}
                disabled={disabled}
                clearable={clearable}
              />
            </Field>
          </div>
        </div>
      </div>
    </>
  )
}

function CheckboxGroupKnobs() {
  const [value, setValue] = useState(['motivation', 'habits'])
  const [layout, setLayout] = useState('column')
  return (
    <>
      <Knobs>
        <Field label="layout">
          <Select value={layout} onChange={(e) => setLayout(e.target.value)}>
            <option>column</option>
            <option>row</option>
          </Select>
        </Field>
        <Field label="selection">
          <Input value={value.join(', ')} readOnly />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <CheckboxGroup value={value} onChange={setValue} layout={layout}>
          <CheckboxGroupItem value="motivation">Motivation</CheckboxGroupItem>
          <CheckboxGroupItem value="habits">Habits</CheckboxGroupItem>
          <CheckboxGroupItem value="skills">Skills</CheckboxGroupItem>
          <CheckboxGroupItem value="integrity">Integrity</CheckboxGroupItem>
        </CheckboxGroup>
      </div>
    </>
  )
}

const GRADE_OPTIONS = [
  { value: 'k', label: 'Kindergarten' },
  { value: '1', label: 'Grade 1' },
  { value: '2', label: 'Grade 2' },
  { value: '3', label: 'Grade 3' },
  { value: '4', label: 'Grade 4' },
  { value: '5', label: 'Grade 5' },
  { value: '6', label: 'Grade 6' },
  { value: '7', label: 'Grade 7' },
  { value: '8', label: 'Grade 8' },
]

function MultiSelectKnobs() {
  const [value, setValue] = useState(['4', '5'])
  const [size, setSize] = useState('md')
  const [disabled, setDisabled] = useState(false)
  const [placeholder, setPlaceholder] = useState('Select grades…')
  const [labelText, setLabelText] = useState('Grade levels')
  const [showLabel, setShowLabel] = useState(true)
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
        <Field label="show label">
          <Toggle checked={showLabel} onChange={setShowLabel} />
        </Field>
        {showLabel && (
          <Field label="label">
            <Input value={labelText} onChange={(e) => setLabelText(e.target.value)} />
          </Field>
        )}
        <Field label="placeholder">
          <Input value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} />
        </Field>
        <Field label="disabled">
          <Toggle checked={disabled} onChange={setDisabled} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <MultiSelect
          options={GRADE_OPTIONS}
          value={value}
          onChange={setValue}
          size={size}
          disabled={disabled}
          label={showLabel ? labelText : undefined}
          placeholder={placeholder}
        />
      </div>
    </>
  )
}

const CSEL_OPTS_SIMPLE = [
  { value: 'k', label: 'Kindergarten' },
  { value: '1', label: 'Grade 1' },
  { value: '2', label: 'Grade 2' },
  { value: '3', label: 'Grade 3' },
  { value: '4', label: 'Grade 4' },
  { value: '5', label: 'Grade 5' },
]

const CSEL_OPTS_GROUPED = [
  { value: 'motivation', label: 'Motivation' },
  { value: 'habits', label: 'Habits' },
  { value: 'skills', label: 'Skills' },
  {
    group: 'Integrity',
    options: [
      { value: 'btwb', label: 'BTWB flag' },
      { value: 'rapid', label: 'Rapid entry' },
      { value: 'dupe', label: 'Duplicate session' },
    ],
  },
]

const CSEL_OPTS_LONG = [
  { value: 'al', label: 'Alabama' },
  { value: 'ak', label: 'Alaska' },
  { value: 'az', label: 'Arizona' },
  { value: 'ar', label: 'Arkansas' },
  { value: 'ca', label: 'California' },
  { value: 'co', label: 'Colorado' },
  { value: 'ct', label: 'Connecticut' },
  { value: 'de', label: 'Delaware' },
  { value: 'fl', label: 'Florida' },
  { value: 'ga', label: 'Georgia' },
  { value: 'hi', label: 'Hawaii' },
  { value: 'id', label: 'Idaho' },
  { value: 'il', label: 'Illinois' },
  { value: 'in', label: 'Indiana' },
  { value: 'ia', label: 'Iowa' },
]

const CSEL_OPTS_WITH_DISABLED = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive', disabled: true },
  { value: 'pending', label: 'Pending' },
  { value: 'archived', label: 'Archived', disabled: true },
  { value: 'draft', label: 'Draft' },
]

const CSEL_OPTS_MAP = {
  simple: CSEL_OPTS_SIMPLE,
  grouped: CSEL_OPTS_GROUPED,
  long: CSEL_OPTS_LONG,
  'w/ disabled': CSEL_OPTS_WITH_DISABLED,
}

function CustomSelectKnobs() {
  const [value, setValue] = useState('motivation')
  const [size, setSize] = useState('md')
  const [disabled, setDis] = useState(false)
  const [showLabel, setLbl] = useState(true)
  const [hasError, setErr] = useState(false)
  const [optSet, setOptSet] = useState('grouped')

  const opts = CSEL_OPTS_MAP[optSet]
  const handleOptSet = (v) => {
    setOptSet(v)
    setValue('')
  }

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
        <Field label="options">
          <Select value={optSet} onChange={(e) => handleOptSet(e.target.value)}>
            {Object.keys(CSEL_OPTS_MAP).map((k) => (
              <option key={k}>{k}</option>
            ))}
          </Select>
        </Field>
        <Field label="label">
          <Toggle checked={showLabel} onChange={setLbl} />
        </Field>
        <Field label="error">
          <Toggle checked={hasError} onChange={setErr} />
        </Field>
        <Field label="disabled">
          <Toggle checked={disabled} onChange={setDis} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Field error={hasError ? 'This field is required' : undefined}>
          <CustomSelect
            options={opts}
            value={value}
            onChange={setValue}
            size={size}
            disabled={disabled}
            label={showLabel ? 'Category' : undefined}
            placeholder="Select an option…"
          />
        </Field>
      </div>
    </>
  )
}

function FilterBarKnobs() {
  const [showAction, setShowAction] = useState(true)
  const [view, setView] = useState('goal')
  const [logType, setLogType] = useState('minutes')
  const [showAs, setShowAs] = useState('pct')

  return (
    <>
      <Knobs>
        <Field label="action button">
          <Toggle checked={showAction} onChange={setShowAction} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <FilterBar
          action={
            showAction ? (
              <Button variant="primary" size="sm">
                Save &amp; Update
              </Button>
            ) : undefined
          }
        >
          <FilterItem label="View as">
            <Select value={view} onChange={(e) => setView(e.target.value)} size="sm">
              <option value="goal">Goal %</option>
              <option value="actual">Actual mins</option>
              <option value="rank">Rank</option>
            </Select>
          </FilterItem>
          <FilterItem label="Log type">
            <Select value={logType} onChange={(e) => setLogType(e.target.value)} size="sm">
              <option value="minutes">Minutes</option>
              <option value="books">Books</option>
              <option value="pages">Pages</option>
            </Select>
          </FilterItem>
          <FilterItem label="Show as">
            <Select value={showAs} onChange={(e) => setShowAs(e.target.value)} size="sm">
              <option value="pct">Percentage</option>
              <option value="abs">Absolute</option>
            </Select>
          </FilterItem>
        </FilterBar>
      </div>
    </>
  )
}

function FullFormExample() {
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('5')
  const [bucket, setBucket] = useState('motivation')
  const [notes, setNotes] = useState('')
  const [optIn, setOptIn] = useState(true)
  return (
    <form className="pt-form" onSubmit={(e) => e.preventDefault()}>
      <Field label="Student name" help="As it appears in your SIS.">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Marcus Chen" />
      </Field>
      <Field label="Grade level">
        <Select value={grade} onChange={(e) => setGrade(e.target.value)}>
          {['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((g) => (
            <option key={g} value={g}>
              Grade {g}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Watch reason">
        <RadioGroup name="watch-reason" value={bucket} onChange={setBucket}>
          <Radio value="motivation">Motivation</Radio>
          <Radio value="habits">Habits</Radio>
          <Radio value="skills">Skills</Radio>
          <Radio value="integrity">Integrity</Radio>
        </RadioGroup>
      </Field>
      <Field label="Notes" help="Visible to district leadership.">
        <Textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Why are we watching this student?"
        />
      </Field>
      <Toggle checked={optIn} onChange={setOptIn}>
        Notify teacher when this student is logged for the next reading session
      </Toggle>
      <div className="pt-form-actions">
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary">Add to watchlist</Button>
      </div>
    </form>
  )
}

function CompactFormExample() {
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const error = touched && !email.includes('@') ? 'Please enter a valid email.' : ''
  return (
    <form
      className="pt-form"
      onSubmit={(e) => {
        e.preventDefault()
        setTouched(true)
      }}
    >
      <Field label="Email" help="We'll send weekly summaries here." error={error || undefined}>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="you@school.org"
        />
      </Field>
      <div className="pt-form-actions">
        <Button variant="primary">Subscribe</Button>
      </div>
    </form>
  )
}

function FilterFormExample() {
  const [grades, setGrades] = useState(['4', '5'])
  const [bucket, setBucket] = useState('all')
  const [minScore, setMinScore] = useState(40)
  const [flagged, setFlagged] = useState(false)
  return (
    <form className="pt-form" onSubmit={(e) => e.preventDefault()}>
      <Field label="Grade levels">
        <CheckboxGroup value={grades} onChange={setGrades} layout="row">
          {['3', '4', '5', '6', '7', '8'].map((g) => (
            <CheckboxGroupItem key={g} value={g}>
              Grade {g}
            </CheckboxGroupItem>
          ))}
        </CheckboxGroup>
      </Field>
      <Field label="Reading health area">
        <RadioGroup name="filter-bucket" value={bucket} onChange={setBucket} layout="column">
          <Radio value="all">All areas</Radio>
          <Radio value="motivation">Motivation</Radio>
          <Radio value="habits">Habits</Radio>
          <Radio value="skills">Skills</Radio>
          <Radio value="integrity">Integrity</Radio>
        </RadioGroup>
      </Field>
      <RangeSlider
        label="Minimum RMI score"
        min={0}
        max={100}
        value={minScore}
        onChange={setMinScore}
      />
      <Checkbox checked={flagged} onChange={setFlagged}>
        Flagged students only
      </Checkbox>
      <div className="pt-form-actions">
        <Button variant="ghost">Reset</Button>
        <Button variant="primary">Apply filters</Button>
      </div>
    </form>
  )
}

function SettingsFormExample() {
  const [orgName, setOrgName] = useState('Lincoln Elementary')
  const [tz, setTz] = useState('America/Chicago')
  const [sessGoal, setSessGoal] = useState(3)
  const [dataTypes, setTypes] = useState(['logins', 'sessions'])
  const [exportFmt, setExport] = useState('csv')
  return (
    <form className="pt-form" onSubmit={(e) => e.preventDefault()}>
      <Input
        label="Organization name"
        value={orgName}
        onChange={(e) => setOrgName(e.target.value)}
      />
      <Select label="Timezone" value={tz} onChange={(e) => setTz(e.target.value)}>
        <option value="America/New_York">Eastern (ET)</option>
        <option value="America/Chicago">Central (CT)</option>
        <option value="America/Denver">Mountain (MT)</option>
        <option value="America/Los_Angeles">Pacific (PT)</option>
      </Select>
      <NumberInput
        label="Sessions per week goal"
        min={1}
        max={7}
        value={sessGoal}
        onChange={setSessGoal}
      />
      <Field label="Include in reports">
        <CheckboxGroup value={dataTypes} onChange={setTypes} layout="column">
          <CheckboxGroupItem value="logins">Login activity</CheckboxGroupItem>
          <CheckboxGroupItem value="sessions">Reading sessions</CheckboxGroupItem>
          <CheckboxGroupItem value="lexile">Lexile changes</CheckboxGroupItem>
          <CheckboxGroupItem value="flags">Flagged events</CheckboxGroupItem>
        </CheckboxGroup>
      </Field>
      <Field label="Default export format">
        <RadioGroup name="export-format" value={exportFmt} onChange={setExport} layout="row">
          <Radio value="csv">CSV</Radio>
          <Radio value="xlsx">Excel</Radio>
          <Radio value="pdf">PDF</Radio>
        </RadioGroup>
      </Field>
      <div className="pt-form-actions">
        <Button variant="ghost">Discard</Button>
        <Button variant="primary">Save settings</Button>
      </div>
    </form>
  )
}

function FieldFormKnobs() {
  const [example, setExample] = useState('full')
  return (
    <>
      <Knobs>
        <Field label="example">
          <Select value={example} onChange={(e) => setExample(e.target.value)}>
            <option value="full">full (add to watchlist)</option>
            <option value="compact">compact (email subscribe)</option>
            <option value="filter">filter panel</option>
            <option value="settings">settings form</option>
          </Select>
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        {example === 'full' && <FullFormExample />}
        {example === 'compact' && <CompactFormExample />}
        {example === 'filter' && <FilterFormExample />}
        {example === 'settings' && <SettingsFormExample />}
      </div>
    </>
  )
}

// ── Chart knobs ──────────────────────────────────────────────────────────

export const formPatternsSections = [
  {
    group: 'form-patterns',
    id: 'color-input',
    name: 'ColorInput',
    desc: (
      <>
        A styled color swatch + hex readout. Clicking anywhere opens the native color picker. The
        swatch uses <code>{'<input type="color">'}</code> with vendor-prefixed chrome removed.
      </>
    ),
    render: () => (
      <>
        <ColorInputKnobs />
      </>
    ),
  },
  {
    group: 'form-patterns',
    id: 'file-input',
    name: 'FileInput',
    desc: (
      <>
        Custom file upload control. A styled button triggers the hidden native input; selected
        filename is shown alongside. Supports <code>multiple</code>, <code>accept</code>, and{' '}
        <code>disabled</code>.
      </>
    ),
    render: () => (
      <>
        <FileInputKnobs />
      </>
    ),
  },
  {
    group: 'form-patterns',
    id: 'date-input',
    name: 'DatePicker / DateInput',
    desc: (
      <>
        <code>DatePicker</code> — calendar popup via Radix Popover with month navigation, today
        indicator, and clear. <code>DateInput</code> — lightweight native{' '}
        <code>{'<input type="date">'}</code> wrapper for simpler contexts.
      </>
    ),
    render: () => (
      <>
        <DateInputKnobs />
      </>
    ),
  },
  {
    group: 'form-patterns',
    id: 'time-input',
    name: 'TimePicker / TimeInput',
    desc: (
      <>
        <code>TimePicker</code> — scrollable time-slot list (configurable step) in a Radix Popover.{' '}
        <code>TimeInput</code> — lightweight native <code>{'<input type="time">'}</code> wrapper for
        simpler contexts.
      </>
    ),
    render: () => (
      <>
        <TimeInputKnobs />
      </>
    ),
  },
  {
    group: 'form-patterns',
    id: 'checkbox-group',
    name: 'CheckboxGroup',
    desc: (
      <>
        Multi-select group of checkboxes. <code>CheckboxGroup</code> holds <code>value</code>{' '}
        (string[]) + <code>onChange</code>. Children are <code>CheckboxGroupItem</code> with a{' '}
        <code>value</code> key. Supports row/column layout.
      </>
    ),
    render: () => (
      <>
        <CheckboxGroupKnobs />
      </>
    ),
  },
  {
    group: 'form-patterns',
    id: 'multi-select',
    name: 'MultiSelect',
    desc: (
      <>
        Dropdown that lets users pick multiple items from an <code>options</code> array. Displays a
        summary of the selection. Click outside or press Esc to close.
      </>
    ),
    render: () => (
      <>
        <MultiSelectKnobs />
      </>
    ),
  },
  {
    group: 'form-patterns',
    id: 'custom-select',
    name: 'CustomSelect',
    desc: (
      <>
        Radix UI–powered select with consistent cross-browser styling, keyboard navigation, animated
        dropdown, and grouped options. Replaces the native <code>{'<select>'}</code> chrome
        entirely.
      </>
    ),
    render: () => (
      <>
        <CustomSelectKnobs />
      </>
    ),
  },
  {
    group: 'form-patterns',
    id: 'filter-bar',
    name: 'FilterBar',
    desc: (
      <>
        <code>FilterBar</code> is a horizontal row of labeled controls (<code>FilterItem</code>{' '}
        children) with an optional trailing action. Collapses to a 2-column grid on mobile.
      </>
    ),
    render: () => (
      <>
        <FilterBarKnobs />
      </>
    ),
  },
  {
    group: 'form-patterns',
    id: 'field-form',
    name: 'Field / Form',
    desc: (
      <>
        <code>Field</code> wraps any input with a label, optional <code>help</code> text, and an{' '}
        <code>error</code> state. Switch the knob to preview four common form layouts.
      </>
    ),
    render: () => (
      <>
        <FieldFormKnobs />
      </>
    ),
  },
  {
    group: 'form-patterns',
    id: 'active-filters',
    name: 'ActiveFilters',
    desc: (
      <>
        Active filter chips rendered below the filter bar. Each chip shows the filter label and a ×
        to clear it. Props: <code>filters</code> array of <code>{'{ key, label, onClear }'}</code>,{' '}
        <code>onClearAll</code> callback. Renders nothing when <code>filters</code> is empty.
      </>
    ),
    render: () => (
      <>
        <Variant label="one filter">
          <ActiveFilters
            filters={[{ key: 'rating', label: 'Engagement: Positive', onClear: () => {} }]}
            onClearAll={() => {}}
          />
        </Variant>
        <Variant label="multiple filters">
          <ActiveFilters
            filters={[
              { key: 'type', label: 'Type: Flagged', onClear: () => {} },
              { key: 'rating', label: 'Engagement: Mixed', onClear: () => {} },
              { key: 'status', label: 'Status: Unfinished', onClear: () => {} },
            ]}
            onClearAll={() => {}}
          />
        </Variant>
      </>
    ),
  },
]
