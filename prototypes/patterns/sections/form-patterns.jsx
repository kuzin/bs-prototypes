import { useState } from 'react'
import { Button } from '@components/Button/Button'
import { Toggle, ToggleGroup, ToggleGroupItem } from '@components/Toggle/Toggle'
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
import { FilterMenu, FilterMenuBar } from '@components/FilterMenu/FilterMenu'
import { EarnedFilter } from '@components/EarnedFilter/EarnedFilter'
import { byEarnedState } from '@components/EarnedFilter/earned'
import { Knobs, Variant } from './_shared'

function ColorInputKnobs() {
  const [value, setValue] = useState('#196DD5')
  const [size, setSize] = useState('md')
  const [label] = useState('Accent color')
  const [showLabel, setShowLabel] = useState(true)
  const [disabled, setDisabled] = useState(false)
  const [chip, setChip] = useState(false)
  const [dot, setDot] = useState('#0CA7BC')
  return (
    <>
      <Knobs>
        <Field label="chip">
          <Toggle checked={chip} onChange={setChip} />
        </Field>
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
          chip={chip}
          disabled={disabled}
          label={chip ? undefined : showLabel ? label : undefined}
        />
      </div>
      <Variant label="chip — the swatch on its own, at all three rungs">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <ColorInput chip size="sm" value={dot} onChange={setDot} />
          <ColorInput chip size="md" value={dot} onChange={setDot} />
          <ColorInput chip size="lg" value={dot} onChange={setDot} />
        </div>
      </Variant>
      <Variant label="chip in a row of controls — what the knob rails on this site use">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, flexWrap: 'wrap' }}>
          <Field label="Accent">
            <ColorInput chip size="sm" value={dot} onChange={setDot} />
          </Field>
          <Field label="Label">
            <Input size="sm" value="Top readers" readOnly />
          </Field>
          <Field label="Scale">
            <Select size="sm" defaultValue="linear">
              <option value="linear">Linear</option>
              <option value="log">Log</option>
            </Select>
          </Field>
        </div>
      </Variant>
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

// Both picker pages used to render a thin knobs block that only exercised size
// and label, while the fuller showcase below it — the one matching what the
// page documents — was defined and never mounted. These are that showcase, plus
// the native `DateInput` / `TimeInput` the descriptions promise.
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
        <Field label="disabled">
          <Toggle checked={disabled} onChange={setDis} />
        </Field>
        <Field label="error">
          <Toggle checked={hasError} onChange={setErr} />
        </Field>
        <Field label="label">
          <Toggle checked={showLabel} onChange={setLbl} />
        </Field>
      </Knobs>
      <Variant label="default">
        <Field error={hasError ? 'Please select a date' : undefined}>
          <DatePicker
            value={date}
            onChange={setDate}
            size={size}
            disabled={disabled}
            clearable={clearable}
            label={showLabel ? 'Due date' : undefined}
          />
        </Field>
      </Variant>
      <Variant label="in a field row">
        <div className="pt-form-row">
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
      </Variant>
      <Variant label="DateInput — the native field, when a popover would be overkill">
        <DateInput label="Start date" size={size} disabled={disabled} />
      </Variant>
    </>
  )
}

function TimePickerKnobs() {
  const [time, setTime] = useState(null)
  const [size, setSize] = useState('md')
  const [step, setStep] = useState(15)
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
        <Field label="step">
          <Select value={step} onChange={(e) => setStep(Number(e.target.value))}>
            <option value={15}>15 min</option>
            <option value={30}>30 min</option>
            <option value={60}>60 min</option>
          </Select>
        </Field>
        <Field label="clearable">
          <Toggle checked={clearable} onChange={setClear} />
        </Field>
        <Field label="disabled">
          <Toggle checked={disabled} onChange={setDis} />
        </Field>
        <Field label="error">
          <Toggle checked={hasError} onChange={setErr} />
        </Field>
        <Field label="label">
          <Toggle checked={showLabel} onChange={setLbl} />
        </Field>
      </Knobs>
      <Variant label="default">
        <Field error={hasError ? 'Please select a time' : undefined}>
          <TimePicker
            value={time}
            onChange={setTime}
            size={size}
            step={step}
            disabled={disabled}
            clearable={clearable}
            label={showLabel ? 'Start time' : undefined}
          />
        </Field>
      </Variant>
      <Variant label="date + time together">
        <div className="pt-form-row">
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
      </Variant>
      <Variant label="TimeInput — the native field">
        <TimeInput label="Ends at" size={size} disabled={disabled} />
      </Variant>
    </>
  )
}

function CheckboxGroupKnobs() {
  const [value, setValue] = useState(['motivation', 'habits'])
  const [size, setSize] = useState('md')
  const [layout, setLayout] = useState('column')
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
        <CheckboxGroup value={value} onChange={setValue} size={size} layout={layout}>
          <CheckboxGroupItem value="motivation">Motivation</CheckboxGroupItem>
          <CheckboxGroupItem value="habits">Habits</CheckboxGroupItem>
          <CheckboxGroupItem value="skills">Skills</CheckboxGroupItem>
          <CheckboxGroupItem value="integrity">Integrity</CheckboxGroupItem>
        </CheckboxGroup>
      </div>
    </>
  )
}

function ToggleGroupKnobs() {
  const [value, setValue] = useState(['log'])
  const [size, setSize] = useState('md')
  const [layout, setLayout] = useState('column')
  const [inset, setInset] = useState(false)
  return (
    <>
      <Knobs>
        <Field label="layout">
          <Select value={layout} onChange={(e) => setLayout(e.target.value)}>
            <option>column</option>
            <option>row</option>
            <option>grid</option>
          </Select>
        </Field>
        <Field label="size">
          <Select value={size} onChange={(e) => setSize(e.target.value)}>
            <option>sm</option>
            <option>md</option>
            <option>lg</option>
          </Select>
        </Field>
        <Field label="inset">
          <Toggle checked={inset} onChange={setInset} />
        </Field>
        <Field label="selection">
          <Input value={value.join(', ') || '(none)'} readOnly />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <ToggleGroup value={value} onChange={setValue} size={size} layout={layout} inset={inset}>
          <ToggleGroupItem value="log">Separate logging badges</ToggleGroupItem>
          <ToggleGroupItem value="reviews">Separate review badges</ToggleGroupItem>
          <ToggleGroupItem value="activities">Activity badges</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Variant label="uncontrolled — plain <Toggle> children, group owns only layout + size">
        <ToggleGroup layout="row">
          <Toggle checked onChange={() => {}}>
            Minutes
          </Toggle>
          <Toggle checked={false} onChange={() => {}}>
            Books
          </Toggle>
          <Toggle checked={false} onChange={() => {}}>
            Pages
          </Toggle>
        </ToggleGroup>
      </Variant>
    </>
  )
}

function RadioKnobs() {
  const [value, setValue] = useState('md')
  const [size, setSize] = useState('md')
  const [layout, setLayout] = useState('row')
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
        <RadioGroup name="rs-knob" size={size} layout={layout} value={value} onChange={setValue}>
          <Radio value="sm">Small</Radio>
          <Radio value="md">Medium</Radio>
          <Radio value="lg">Large</Radio>
        </RadioGroup>
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
  const [compact, setCompact] = useState(false)
  const [view, setView] = useState('goal')
  const [logType, setLogType] = useState('minutes')
  const [showAs, setShowAs] = useState('pct')

  return (
    <>
      <Knobs>
        <Field label="compact (the bar, not the form)">
          <Toggle checked={compact} onChange={setCompact} />
        </Field>
        <Field label="action button">
          <Toggle checked={showAction} onChange={setShowAction} />
        </Field>
      </Knobs>
      {/* FilterBar draws its own white card, so the frame here is bare — a
          second card around it doubled the padding you see against the edge. */}
      <div className="pt-variant-frame pt-variant-frame--bare">
        <FilterBar
          compact={compact}
          action={
            showAction ? (
              <Button variant="primary" size="sm">
                {compact ? 'Update' : 'Save & Update'}
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

const FM_GENRES = ['Adventure', 'Fantasy', 'Graphic Novels', 'Humor', 'Mystery', 'Nonfiction']
const FM_GRADES = ['K–2', '3–5', '6–8', '9–12']
const FM_GROUPS = {
  'Race & Ethnicity': ['Black', 'Latine', 'Asian', 'Indigenous'],
  Disability: ['Deaf & Hard of Hearing', 'Neurodivergent'],
}

const DEMO_PRIZES = [
  { id: 'p1', name: 'Book Fair Voucher', earned: true },
  { id: 'p2', name: 'Sponsor a Shelf plaque' },
  { id: 'p3', name: 'Pizza with the Principal' },
  { id: 'p4', name: 'Name a library cart' },
  { id: 'p5', name: 'Read-a-thon hoodie' },
]

function EarnedFilterDemo() {
  const [state, setState] = useState('all')
  const isEarned = (p) => Boolean(p.earned)
  const shown = byEarnedState(DEMO_PRIZES, state, isEarned)
  return (
    <Variant label="a fundraiser's Prizes tab — the strip over the set it cuts">
      <EarnedFilter
        items={DEMO_PRIZES}
        isEarned={isEarned}
        value={state}
        onChange={setState}
        ariaLabel="Which prizes"
      />
      <ul
        style={{
          margin: '14px 0 0',
          padding: 0,
          listStyle: 'none',
          display: 'grid',
          gap: 6,
        }}
      >
        {shown.map((p) => (
          <li key={p.id} style={{ fontSize: 14, fontWeight: 700 }}>
            {p.name}
            {p.earned ? ' — earned' : ''}
          </li>
        ))}
      </ul>
    </Variant>
  )
}

function FilterMenuDemo() {
  const [genres, setGenres] = useState([])
  const [tags, setTags] = useState([])
  const [grade, setGrade] = useState(null)
  return (
    <>
      <Variant label="several facets in a row — two that take a set, one that takes a value">
        <FilterMenuBar>
          <FilterMenu
            label="Genres"
            options={FM_GENRES}
            value={genres}
            onChange={setGenres}
            multi
          />
          <FilterMenu
            label="Main Characters"
            groups={FM_GROUPS}
            value={tags}
            onChange={setTags}
            multi
          />
          <FilterMenu label="Grade" options={FM_GRADES} value={grade} onChange={setGrade} />
        </FilterMenuBar>
      </Variant>
    </>
  )
}

export const formPatternsSections = [
  {
    group: 'form-patterns',
    id: 'color-input',
    name: 'ColorInput',
    usage: `import { ColorInput } from '@components/Form/Form'

<ColorInput label="Badge color" value={color} onChange={setColor} />

/* Just the swatch, for a dense row of controls: */
<ColorInput chip size="sm" value={color} onChange={setColor} />`,
    desc: (
      <>
        A styled color swatch + hex readout. Clicking anywhere opens the native color picker. The
        swatch uses <code>{'<input type="color">'}</code> with vendor-prefixed chrome removed, and
        is a circle like the app&apos;s own picker (<code>.color-picker span</code>).
        <br />
        <br />
        <code>chip</code> drops the frame and the hex and leaves the swatch on its own — 22 / 26 /
        30px across the rungs. It&apos;s what a row of small controls wants, and what this
        site&apos;s own knob rails use; they had a hand-rolled <code>.pt-color</code> before this
        prop existed. A chip carries its own ring and hover/focus states, since there&apos;s no
        frame to hold them.
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
    usage: `import { FileInput } from '@components/Form/Form'

<FileInput label="Roster CSV" accept=".csv" onChange={setFile} />`,
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
    usage: `import { DatePicker } from '@components/DatePicker/DatePicker'

<DatePicker label="Start date" value={start} onChange={setStart} clearable />

/* Or the native field, when a popover would be overkill: */
import { DateInput } from '@components/Form/Form'
<DateInput label="Start date" />`,
    desc: (
      <>
        <code>DatePicker</code> — calendar popup via Radix Popover with month navigation, today
        indicator, and clear. <code>DateInput</code> — lightweight native{' '}
        <code>{'<input type="date">'}</code> wrapper for simpler contexts.
      </>
    ),
    render: () => (
      <>
        <DatePickerKnobs />
      </>
    ),
  },
  {
    group: 'form-patterns',
    id: 'time-input',
    name: 'TimePicker / TimeInput',
    usage: `import { TimePicker } from '@components/TimePicker/TimePicker'

<TimePicker label="Ends at" value={time} onChange={setTime} step={15} clearable />`,
    desc: (
      <>
        <code>TimePicker</code> — scrollable time-slot list (configurable step) in a Radix Popover.{' '}
        <code>TimeInput</code> — lightweight native <code>{'<input type="time">'}</code> wrapper for
        simpler contexts.
      </>
    ),
    render: () => (
      <>
        <TimePickerKnobs />
      </>
    ),
  },
  {
    /* The three group components sit together here; the single controls they
       compose (Checkbox / Radio / Toggle) stay in Form Fields. */
    group: 'form-patterns',
    id: 'radio-group',
    name: 'RadioGroup',
    usage: `import { RadioGroup, Radio } from '@components/Form/Form'

<RadioGroup name="scope" value={scope} onChange={setScope} layout="row">
  <Radio value="school">This school</Radio>
  <Radio value="district">Whole district</Radio>
</RadioGroup>`,
    desc: (
      <>
        Mutually exclusive options — pick exactly one. <code>RadioGroup</code> takes{' '}
        <code>name</code>, <code>value</code>, <code>onChange</code>, <code>size</code>, and{' '}
        <code>layout</code> (row/column); children are <code>Radio</code> with a <code>value</code>.
        It owns the layout and hands <code>size</code> down through context, the same way{' '}
        <code>CheckboxGroup</code> and <code>ToggleGroup</code> do.
        <br />
        <br />A row lays out with <code>gap: 10px 24px</code> — wider across than down, because side
        by side a long label runs into the next box.
      </>
    ),
    render: () => (
      <>
        <RadioKnobs />
      </>
    ),
  },
  {
    group: 'form-patterns',
    id: 'checkbox-group',
    name: 'CheckboxGroup',
    usage: `import { CheckboxGroup, CheckboxGroupItem } from '@components/Form/Form'

<CheckboxGroup value={picked} onChange={setPicked} layout="row">
  <CheckboxGroupItem value="fiction">Fiction</CheckboxGroupItem>
  <CheckboxGroupItem value="nonfiction">Nonfiction</CheckboxGroupItem>
</CheckboxGroup>`,
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
    id: 'toggle-group',
    name: 'ToggleGroup',
    usage: `import { Toggle, ToggleGroup, ToggleGroupItem } from '@components/Toggle/Toggle'

/* Group owns only the layout + the shared size: */
<ToggleGroup layout="row">
  <Toggle checked={a} onChange={setA}>Minutes</Toggle>
  <Toggle checked={b} onChange={setB}>Books</Toggle>
</ToggleGroup>

/* Or let it own the set, like CheckboxGroup: */
<ToggleGroup value={on} onChange={setOn} layout="column" inset>
  <ToggleGroupItem value="log">Separate logging badges</ToggleGroupItem>
  <ToggleGroupItem value="reviews">Separate review badges</ToggleGroupItem>
</ToggleGroup>`,
    desc: (
      <>
        A set of related switches — the <code>Toggle</code> sibling of <code>RadioGroup</code> and{' '}
        <code>CheckboxGroup</code>. It owns the layout (<code>column</code> / <code>row</code> /{' '}
        <code>grid</code>) and hands <code>size</code> down through context, so a cluster of
        switches can&apos;t drift apart one call site at a time. <code>inset</code> frames it as the
        tinted nested card used for an &ldquo;advanced&rdquo; cluster revealed by the switch above
        it.
        <br />
        <br />
        Children are normally plain <code>&lt;Toggle&gt;</code>s, each bound to its own piece of
        state — that&apos;s how the challenge steps use it. Pass <code>value</code> (string[]) +{' '}
        <code>onChange</code> instead and the group owns the set, with <code>ToggleGroupItem</code>{' '}
        children keyed by <code>value</code>.
        <br />
        <br />
        Gaps run wider than a checkbox group&apos;s: a switch is a broader, heavier mark and crowds
        its neighbour sooner. For a <em>labelled</em> switch on its own row — label left, switch
        right, hairline between — use <code>SettingRow</code> instead; this is for switches that
        carry their own label.
      </>
    ),
    render: () => (
      <>
        <ToggleGroupKnobs />
      </>
    ),
  },
  {
    group: 'form-patterns',
    id: 'multi-select',
    name: 'MultiSelect',
    usage: `import { MultiSelect } from '@components/Form/Form'

<MultiSelect
  label="Schools"
  options={[{ value: 'ps1', label: 'PS 1' }, { value: 'ps2', label: 'PS 2' }]}
  value={ids}
  onChange={setIds}
/>`,
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
    usage: `import { CustomSelect } from '@components/CustomSelect/CustomSelect'

<CustomSelect
  label="Grade"
  options={[{ value: '3', label: '3rd' }, { value: '4', label: '4th' }]}
  value={grade}
  onChange={setGrade}
/>`,
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
    usage: `import { FilterBar, FilterItem } from '@components/FilterBar/FilterBar'
import '@components/FilterBar/FilterBar.css'

/* \`compact\` is the filter BAR; without it you get the filter FORM */
<FilterBar compact action={<Button size="sm">Apply</Button>}>
  <FilterItem label="Grade"><CustomSelect … /></FilterItem>
</FilterBar>`,
    desc: (
      <>
        <code>FilterBar</code> is a horizontal row of controls (<code>FilterItem</code> children)
        with an optional trailing action. Collapses to a 2-column grid on mobile.
        <br />
        <br />
        Two shapes, because the app has two. The <strong>default</strong> is the app&apos;s filter{' '}
        <em>form</em> (<code>.daily-reading__filters</code> holding a <code>.filter-row</code>):
        labelled controls on a white card, the kind you fill in and then submit — use it when the
        controls need naming (a date range, a goal, a log type).
        <br />
        <br />
        <code>compact</code> is the app&apos;s filter <em>bar</em>, ported straight across from{' '}
        <code>admin/_admin_filter_bar.scss</code>: <code>.filter-bar</code> is a white strip with no
        border (<code>padding: 14px</code>, radius 12, <code>space-between</code>) holding a 10px
        row of <code>.ms-parent.filter</code> controls — a <code>#f2f2f2</code> fill with no border,
        radius 12, <code>padding: 10px 14px</code>, 14px / 600 over a 20px line, 28px of caret room,
        and the <em>same</em> fill on hover, active and focus, which is what separates a filter
        control from a text field. The app&apos;s <code>165px</code> is the pill&apos;s floor.
        <br />
        <br />
        There are <strong>no labels above them</strong>, because each control already says what it
        filters (&ldquo;All Challenges&rdquo;, &ldquo;All years&rdquo;) — the <code>label</code>{' '}
        stays in the DOM as the control&apos;s accessible name. Use it above a list: it reads as a
        filter rather than a form, and it costs one row instead of two.
        <br />
        <br />
        There is deliberately <strong>no result count and no Clear</strong>: the controls already
        say what they&apos;re set to, and a bar that reports on itself as well is one more thing to
        read on the way to the list. The props are <code>children</code>, <code>action</code>,{' '}
        <code>compact</code> and <code>className</code> — that&apos;s the whole surface. If a
        surface does need a &ldquo;12 of 40 · Clear&rdquo; reading, that belongs above the list it
        describes, not inside the filter.
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
    usage: `import { Field } from '@components/Form/Form'
import '@components/Form/Form.css'

<Field label="Challenge name" help="Readers see this" error={errors.name} required>
  <Input value={name} onChange={(e) => setName(e.target.value)} />
</Field>`,
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
    id: 'filter-menu',
    name: 'FilterMenu',
    usage: `import { FilterMenu, FilterMenuBar } from '@components/FilterMenu/FilterMenu'

<FilterMenuBar>
  <FilterMenu label="Genres" options={GENRES} value={genres} onChange={setGenres} multi />
  <FilterMenu label="Main Characters" groups={BACKGROUND_GROUPS} value={tags} onChange={setTags} multi />
  <FilterMenu label="Grade" options={GRADES} value={grade} onChange={setGrade} />
</FilterMenuBar>`,
    desc: (
      <>
        One facet, behind one button — the shape a catalog filter takes when there are five of them
        and forty values between them. The app&apos;s own accordion (
        <code>books/_filters.html.haml</code>: five <code>fieldset</code>s of checkboxes behind
        headings) with the off-canvas drawer replaced by a row. The accordion&apos;s point is that
        one section is open at a time; a <code>Flyout</code> is that, and it costs one row instead
        of a column down the side of the page.
        <br />
        <br />
        <strong>The button reports what it is set to</strong> rather than carrying a count beside an
        unchanged label — &ldquo;Humor&rdquo; for one value, &ldquo;Genres: 3&rdquo; past that, in
        the accent. A filter you can&apos;t see from the page is a page that lies about what it is
        showing, and a 2 next to a label that never changed still makes you open the menu to find
        out what the 2 was. Pair it with <code>ActiveFilters</code> below the bar when you want the
        individual values clearable too.
        <br />
        <br />
        <code>groups</code> is the app&apos;s grouped facet (<code>background_groups</code>,{' '}
        <code>topic_groups</code>) — one filter made of several sets with subheads of their own.{' '}
        <code>multi</code> is the difference between <code>with_genres[]</code> and a filter that
        narrows to one thing, where picking the active value clears it.
      </>
    ),
    render: () => <FilterMenuDemo />,
  },
  {
    group: 'form-patterns',
    id: 'earned-filter',
    name: 'EarnedFilter',
    usage: `import { EarnedFilter } from '@components/EarnedFilter/EarnedFilter'
import { byEarnedState } from '@components/EarnedFilter/earned'

const [state, setState] = useState('all')
const isEarned = (p) => p.earned

<EarnedFilter items={prizes} isEarned={isEarned} value={state} onChange={setState} />
{byEarnedState(prizes, state, isEarned).map(…)}`,
    desc: (
      <>
        <strong>All / Earned / Unearned</strong> — the question a reader turns up to a set of
        earnables with: what have I got, and what is left. A segmented control, which in this system
        is a pill <code>Tabs</code>, with the counts on the tabs so the answer is readable without
        picking one.
        <br />
        <br />
        <strong>It renders nothing unless the set has both halves.</strong> A shelf you have earned
        all of — or none of — can only answer one way, and a reader&apos;s own badge collection is
        earned-only by definition, since an unearned badge belongs to the challenge that sets its
        requirement and exists nowhere else. <code>byEarnedState</code> is the matching filter, and
        it passes the whole set through in that case rather than hiding things behind a control the
        reader can&apos;t see.
        <br />
        <br />
        <code>isEarned</code> is how a set says which half a thing is in — badges carry{' '}
        <code>locked</code>, prizes and rewards carry <code>earned</code>. Used by{' '}
        <code>BadgeShelf</code>, a challenge&apos;s Rewards tab and a fundraiser&apos;s Prizes.
      </>
    ),
    render: () => <EarnedFilterDemo />,
  },
  {
    group: 'form-patterns',
    id: 'active-filters',
    name: 'ActiveFilters',
    usage: `import { ActiveFilters } from '@components/ActiveFilters/ActiveFilters'
import '@components/ActiveFilters/ActiveFilters.css'

<ActiveFilters
  filters={[{ label: 'Grade: 4th', onRemove: () => clear('grade') }]}
  onClearAll={clearAll}
/>`,
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
