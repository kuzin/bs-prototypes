import { useState } from 'react'
import { Icon, ICON_NAMES } from '@components/Icon/Icon'
import { PlumpyIcon, PLUMPY_NAMES, PLUMPY_SOURCES } from '@components/PlumpyIcon/PlumpyIcon'
import { BsIcon, FLAG_ICON_FILE, RMI_FACTOR_FILES } from '@components/BsIcons/BsIcons'
import { BeanstackLogo } from '@components/BeanstackLogo/BeanstackLogo'
import { TrendChip } from '@components/TrendChip/TrendChip'
import { CompleteToggle } from '@components/CompleteToggle/CompleteToggle'
import { RowAction, RowActions } from '@components/RowAction/RowAction'
import { Button } from '@components/Button/Button'
import { Avatar } from '@components/Avatar/Avatar'
import { Pill } from '@components/Pill/Pill'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import { Toggle } from '@components/Toggle/Toggle'
import { ColorInput, Field, Input, Radio, RadioGroup, Select } from '@components/Form/Form'
import { Divider, IconButton, Skeleton, Spinner, Tooltip } from '@components/Primitives/Primitives'
import {
  Knobs,
  Variant,
  Specimen,
  Specimens,
  PlusIcon,
  CaretIcon,
  EditIcon,
  DuplicateIcon,
  ArchiveIcon,
  TrashIcon,
  MoreIcon,
  CheckIcon,
  StarIcon,
} from './_shared'

/**
 * Plumpy duotone gallery. The `active` knob mirrors the real app's behavior:
 * inactive icons sit at #2a2a2a, active ones repaint both layers in the accent.
 */
// One grid for every glyph gallery: Icon and PlumpyIcon differ only in what
// they draw per cell and what caption sits under it, so the layout, the chip
// styling and the caption type all live in .pt-glyph-* rather than being
// hand-rolled (with their own hex values) in each showcase.
function GlyphGrid({ label, names, color, cellBackground, renderGlyph, renderCaption }) {
  return (
    <Variant label={label}>
      <div className="pt-glyph-grid" style={{ color }}>
        {names.map((name) => (
          <div key={name} className="pt-glyph" title={name} style={{ background: cellBackground }}>
            {renderGlyph(name)}
            <span className="pt-glyph-name">{renderCaption ? renderCaption(name) : name}</span>
          </div>
        ))}
      </div>
    </Variant>
  )
}

function PlumpyShowcase() {
  const [size, setSize] = useState(24)
  const [active, setActive] = useState(false)
  return (
    <>
      <Knobs>
        <Field label="size">
          <Input
            type="range"
            min="16"
            max="48"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
        </Field>
        <Field label="active (accent)">
          <Toggle checked={active} onChange={setActive} />
        </Field>
      </Knobs>
      <GlyphGrid
        label="Every Plumpy glyph in the registry"
        names={PLUMPY_NAMES}
        color={active ? 'var(--c-accent)' : 'var(--c-gray-900)'}
        cellBackground={active ? 'var(--c-accent-wash)' : undefined}
        renderGlyph={(name) => <PlumpyIcon name={name} size={size} />}
        renderCaption={(name) => (
          <>
            {name}
            <br />
            <span className="pt-glyph-source">{PLUMPY_SOURCES[name]}</span>
          </>
        )}
      />
    </>
  )
}

function IconShowcase() {
  const [size, setSize] = useState(24)
  const [stroke, setStroke] = useState(1.8)
  const [color, setColor] = useState('#196DD5')
  return (
    <>
      <Knobs>
        <Field label="size">
          <Input
            type="range"
            min="14"
            max="40"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
        </Field>
        <Field label="stroke">
          <Input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={stroke}
            onChange={(e) => setStroke(Number(e.target.value))}
          />
        </Field>
        <Field label="color">
          <ColorInput chip size="sm" value={color} onChange={setColor} />
        </Field>
      </Knobs>
      <GlyphGrid
        label="Every name in the registry"
        names={ICON_NAMES}
        color={color}
        renderGlyph={(name) => <Icon name={name} size={size} stroke={stroke} />}
      />
    </>
  )
}

function ButtonShowcase() {
  return (
    <>
      <Variant label="variants">
        <Specimens>
          <Specimen label="primary">
            <Button variant="primary">Log for Class</Button>
          </Specimen>
          <Specimen label="secondary">
            <Button variant="secondary">Set Classroom Goal</Button>
          </Specimen>
          <Specimen label="ghost">
            <Button variant="ghost">Cancel</Button>
          </Specimen>
          <Specimen label="danger">
            <Button variant="danger">Delete</Button>
          </Specimen>
          <Specimen label='accent + accent="#B43DD0"'>
            <Button variant="accent" accent="#B43DD0">
              Open Skills
            </Button>
          </Specimen>
        </Specimens>
      </Variant>

      <Variant label="sizes — four rungs, ported from the app's own ladder">
        <Specimens>
          <Specimen label='size="sm" — 36px, inside a row'>
            <Button variant="primary" size="sm">
              Small
            </Button>
          </Specimen>
          <Specimen label='size="msm" — 40px, beside a 44px control'>
            <Button variant="primary" size="msm">
              Medium-small
            </Button>
          </Specimen>
          <Specimen label='size="md" (default) — 44px'>
            <Button variant="primary" size="md">
              Medium
            </Button>
          </Specimen>
          <Specimen label='size="lg" — 56px'>
            <Button variant="primary" size="lg">
              Large
            </Button>
          </Specimen>
        </Specimens>
      </Variant>

      <Variant label="icons, and rendering as a link">
        <Specimens>
          <Specimen label="icon">
            <Button variant="primary" icon={<PlusIcon />}>
              Add Student
            </Button>
          </Specimen>
          <Specimen label="iconRight">
            <Button variant="secondary" iconRight={<CaretIcon />}>
              Filter
            </Button>
          </Specimen>
          <Specimen label='as="a"'>
            <Button as="a" href="#" variant="ghost">
              Link button
            </Button>
          </Specimen>
        </Specimens>
      </Variant>

      <Variant label="states">
        <Specimens>
          <Specimen label="disabled">
            <Button disabled>Disabled</Button>
          </Specimen>
          <Specimen label="loading">
            <Button loading>Loading</Button>
          </Specimen>
        </Specimens>
      </Variant>
    </>
  )
}

function IconButtonShowcase() {
  return (
    <>
      <Variant label="variants">
        <Specimens>
          <Specimen label="primary">
            <IconButton variant="primary" aria-label="Add">
              <PlusIcon />
            </IconButton>
          </Specimen>
          <Specimen label="secondary (default)">
            <IconButton variant="secondary" aria-label="Edit">
              <EditIcon />
            </IconButton>
          </Specimen>
          <Specimen label="ghost">
            <IconButton variant="ghost" aria-label="More actions">
              <MoreIcon />
            </IconButton>
          </Specimen>
          <Specimen label="danger">
            <IconButton variant="danger" aria-label="Delete">
              <TrashIcon />
            </IconButton>
          </Specimen>
        </Specimens>
      </Variant>

      <Variant label="sizes — the same ladder Button and the form fields stand on">
        <Specimens>
          <Specimen label='size="xs" — 28px'>
            <IconButton size="xs" aria-label="Edit">
              <EditIcon />
            </IconButton>
          </Specimen>
          <Specimen label='size="sm" (default) — 36px'>
            <IconButton size="sm" aria-label="Edit">
              <EditIcon />
            </IconButton>
          </Specimen>
          <Specimen label='size="md" — 44px'>
            <IconButton size="md" aria-label="Edit">
              <EditIcon />
            </IconButton>
          </Specimen>
          <Specimen label='size="lg" — 52px'>
            <IconButton size="lg" aria-label="Edit">
              <EditIcon />
            </IconButton>
          </Specimen>
        </Specimens>
      </Variant>

      <Variant label="states">
        <Specimens>
          <Specimen label="disabled">
            <IconButton disabled aria-label="Archive">
              <ArchiveIcon />
            </IconButton>
          </Specimen>
        </Specimens>
      </Variant>
    </>
  )
}

function ButtonKnobs() {
  const [label, setLabel] = useState('Log for Class')
  const [variant, setVariant] = useState('primary')
  const [size, setSize] = useState('md')
  const [accent, setAccent] = useState('#B43DD0')
  const [withIcon, setIcon] = useState(false)
  const [withCaret, setCaret] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  return (
    <>
      <Knobs>
        <Field label="label">
          <Input value={label} onChange={(e) => setLabel(e.target.value)} />
        </Field>
        <Field label="variant">
          <Select value={variant} onChange={(e) => setVariant(e.target.value)}>
            <option>primary</option>
            <option>secondary</option>
            <option>ghost</option>
            <option>danger</option>
            <option>accent</option>
          </Select>
        </Field>
        <Field label="size">
          <Select value={size} onChange={(e) => setSize(e.target.value)}>
            <option>sm</option>
            <option>msm</option>
            <option>md</option>
            <option>lg</option>
          </Select>
        </Field>
        {variant === 'accent' && (
          <Field label="accent">
            <ColorInput chip size="sm" value={accent} onChange={setAccent} />
          </Field>
        )}
        <Field label="left icon">
          <Toggle checked={withIcon} onChange={setIcon} />
        </Field>
        <Field label="right caret">
          <Toggle checked={withCaret} onChange={setCaret} />
        </Field>
        <Field label="disabled">
          <Toggle checked={disabled} onChange={setDisabled} />
        </Field>
        <Field label="loading">
          <Toggle checked={loading} onChange={setLoading} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Button
          variant={variant}
          size={size}
          accent={accent}
          disabled={disabled}
          loading={loading}
          icon={withIcon ? <PlusIcon /> : undefined}
          iconRight={withCaret ? <CaretIcon /> : undefined}
        >
          {label}
        </Button>
      </div>
    </>
  )
}

function IconButtonKnobs() {
  const [variant, setVariant] = useState('secondary')
  const [size, setSize] = useState('sm')
  const [iconKey, setIconKey] = useState('plus')
  const [disabled, setDisabled] = useState(false)
  const ICONS = {
    plus: { node: <PlusIcon />, label: 'Add' },
    caret: { node: <CaretIcon />, label: 'Open menu' },
    edit: { node: <EditIcon />, label: 'Edit' },
    trash: { node: <TrashIcon />, label: 'Delete' },
    archive: { node: <ArchiveIcon />, label: 'Archive' },
    duplicate: { node: <DuplicateIcon />, label: 'Duplicate' },
    more: { node: <MoreIcon />, label: 'More actions' },
    check: { node: <CheckIcon />, label: 'Confirm' },
  }
  return (
    <>
      <Knobs>
        <Field label="variant">
          <Select value={variant} onChange={(e) => setVariant(e.target.value)}>
            <option>primary</option>
            <option>secondary</option>
            <option>ghost</option>
            <option>danger</option>
          </Select>
        </Field>
        <Field label="size">
          <Select value={size} onChange={(e) => setSize(e.target.value)}>
            <option>xs</option>
            <option>sm</option>
            <option>md</option>
            <option>lg</option>
          </Select>
        </Field>
        <Field label="icon">
          <Select value={iconKey} onChange={(e) => setIconKey(e.target.value)}>
            {Object.keys(ICONS).map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="disabled">
          <Toggle checked={disabled} onChange={setDisabled} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--row">
        <IconButton
          variant={variant}
          size={size}
          disabled={disabled}
          aria-label={ICONS[iconKey].label}
        >
          {ICONS[iconKey].node}
        </IconButton>
      </div>
    </>
  )
}

// TrendChip draws an arrow and nothing else — the reading lives in the tooltip.
// So the rail exposes what actually shapes that reading (format + suffix) and
// echoes it beside the chip, rather than pretending there's a text variant.
function TrendChipKnobs() {
  const [delta, setDelta] = useState(26)
  const [unit, setUnit] = useState('%')
  const [suffix, setSuffix] = useState('vs Apr')
  const [inverse, setInverse] = useState(false)
  const [showValue, setShowValue] = useState(false)

  const format = unit === 'none' ? undefined : (n) => `${n}${unit}`
  const magnitude = Math.abs(delta)
  const reading = `${delta > 0 ? 'Up' : 'Down'} ${format ? format(magnitude) : magnitude}${
    suffix ? ` ${suffix}` : ''
  }`

  return (
    <>
      <Knobs>
        <Field label="delta">
          <Input
            type="range"
            min="-40"
            max="40"
            value={delta}
            onChange={(e) => setDelta(Number(e.target.value))}
          />
        </Field>
        <Field label="format (unit)">
          <Select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="%">%</option>
            <option value="L">L</option>
            <option value=" pts">pts</option>
            <option value=" flags">flags</option>
            <option value="none">none</option>
          </Select>
        </Field>
        <Field label="suffix">
          <Input value={suffix} onChange={(e) => setSuffix(e.target.value)} />
        </Field>
        <Field label="inverse (fewer is better)">
          <Toggle checked={inverse} onChange={setInverse} />
        </Field>
        <Field label="showValue">
          <Toggle checked={showValue} onChange={setShowValue} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--row">
        <TrendChip
          delta={delta}
          format={format}
          suffix={suffix}
          inverse={inverse}
          showValue={showValue}
        />
        <code className="pt-specimen-label">
          {delta === 0
            ? 'delta 0 — flat: a grey dash, not a hole in the row'
            : `hover reads: “${reading}”`}
        </code>
      </div>
    </>
  )
}

function TrendChipShowcase() {
  return (
    <>
      <Variant label="direction">
        <Specimens>
          <Specimen label="delta={26}">
            <TrendChip delta={26} format={(n) => `${n}%`} />
          </Specimen>
          <Specimen label="delta={-15}">
            <TrendChip delta={-15} format={(n) => `${n}L`} suffix="vs Apr" />
          </Specimen>
          <Specimen label="delta={0} — flat">
            <TrendChip delta={0} format={(n) => `${n}%`} />
          </Specimen>
          <Specimen label="delta={null} — nothing">
            <TrendChip delta={null} />
          </Specimen>
        </Specimens>
      </Variant>

      <Variant label="showValue — the magnitude printed in the chip">
        <Specimens>
          <Specimen label="showValue">
            <TrendChip delta={3} format={(n) => `${n}%`} showValue />
          </Specimen>
          <Specimen label="showValue, down">
            <TrendChip delta={-12} format={(n) => `${n}%`} showValue />
          </Specimen>
          <Specimen label="showValue + inverse">
            <TrendChip delta={-3} inverse format={(n) => `${n} flags`} showValue />
          </Specimen>
          <Specimen label="no format → bare number">
            <TrendChip delta={8} showValue />
          </Specimen>
        </Specimens>
      </Variant>

      <Variant label="inverse — for metrics where fewer is better">
        <Specimens>
          <Specimen label="delta={2} inverse">
            <TrendChip delta={2} inverse format={(n) => `${n} flags`} />
          </Specimen>
          <Specimen label="delta={-3} inverse">
            <TrendChip delta={-3} inverse format={(n) => `${n} flags`} />
          </Specimen>
        </Specimens>
      </Variant>
    </>
  )
}

function PillShowcase() {
  return (
    <>
      <Variant label="variants">
        <Specimens>
          <Specimen label="soft (default)">
            <Pill color="#B43DD0" variant="soft">
              Skills
            </Pill>
          </Specimen>
          <Specimen label="filled">
            <Pill color="#B43DD0" variant="filled">
              Skills
            </Pill>
          </Specimen>
          <Specimen label="outline">
            <Pill color="#B43DD0" variant="outline">
              Skills
            </Pill>
          </Specimen>
        </Specimens>
      </Variant>

      <Variant label="sizes">
        <Specimens>
          <Specimen label='size="sm"'>
            <Pill color="var(--c-teal)" size="sm">
              Active
            </Pill>
          </Specimen>
          <Specimen label='size="md" (default)'>
            <Pill color="var(--c-teal)" size="md">
              Active
            </Pill>
          </Specimen>
          <Specimen label='size="lg"'>
            <Pill color="var(--c-teal)" size="lg">
              Active
            </Pill>
          </Specimen>
        </Specimens>
      </Variant>

      <Variant label="with an icon">
        <Specimens>
          <Specimen label="icon">
            <Pill color="var(--c-green)" icon={<CheckIcon />}>
              Verified
            </Pill>
          </Specimen>
          <Specimen label="icon + filled">
            <Pill color="var(--c-yellow-ink)" variant="filled" icon={<StarIcon />}>
              Featured
            </Pill>
          </Specimen>
        </Specimens>
      </Variant>

      <Variant label="the colours a status pill actually takes">
        <Specimens>
          <Specimen label="--c-green">
            <Pill color="var(--c-green)">Verified</Pill>
          </Specimen>
          <Specimen label="--c-yellow-ink">
            <Pill color="var(--c-yellow-ink)">Needs review</Pill>
          </Specimen>
          <Specimen label="--c-red">
            <Pill color="var(--c-red)">Flagged</Pill>
          </Specimen>
          <Specimen label="--c-gray-700">
            <Pill color="var(--c-gray-700)">Draft</Pill>
          </Specimen>
        </Specimens>
      </Variant>
    </>
  )
}

function AvatarShowcase() {
  return (
    <>
      <Variant label="sizes">
        <Specimens>
          {['xs', 'sm', 'md', 'lg', 'xl'].map((size) => (
            <Specimen key={size} label={`size="${size}"`}>
              <Avatar initials="MC" color="#F26430" size={size} />
            </Specimen>
          ))}
        </Specimens>
      </Variant>

      <Variant label="shapes">
        <Specimens>
          <Specimen label='shape="circle" (default)'>
            <Avatar initials="AB" color="var(--c-teal)" shape="circle" />
          </Specimen>
          <Specimen label='shape="square"'>
            <Avatar initials="AB" color="var(--c-teal)" shape="square" />
          </Specimen>
        </Specimens>
      </Variant>

      <Variant label="src — a real picture, initials as the fallback">
        <Specimens>
          <Specimen label="src">
            <Avatar src={facePath('emma')} initials="EM" size="lg" />
          </Specimen>
          <Specimen label="src + square">
            <Avatar src={facePath('jayden')} initials="JA" size="lg" shape="square" />
          </Specimen>
          <Specimen label="no src — initials">
            <Avatar initials="NO" color="var(--c-teal)" size="lg" />
          </Specimen>
          <Specimen label="broken src — falls back">
            <Avatar src="/nope.jpg" initials="BR" color="var(--c-orange)" size="lg" />
          </Specimen>
        </Specimens>
      </Variant>

      <Variant label="a roster mixes the two — some readers have uploaded one">
        <Specimens>
          <Specimen label="the same silhouette either way">
            <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
              <Avatar src={facePath('emma')} initials="EM" />
              <Avatar initials="MC" color="var(--c-orange)" />
              <Avatar src={facePath('noah')} initials="NO" />
              <Avatar src={facePath('priya')} initials="PS" />
              <Avatar initials="TV" color="var(--c-purple)" />
            </div>
          </Specimen>
        </Specimens>
      </Variant>

      <Variant label="every size, with a picture">
        <Specimens>
          {['xs', 'sm', 'md', 'lg', 'xl'].map((size) => (
            <Specimen key={size} label={`size="${size}"`}>
              <Avatar src={facePath('sofia')} initials="SO" size={size} />
            </Specimen>
          ))}
        </Specimens>
      </Variant>

      <Variant label="a roster reads as a row of them">
        <Specimens>
          <Specimen label="one per reader, coloured by name">
            <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
              <Avatar initials="MC" color="var(--c-orange)" />
              <Avatar initials="AB" color="var(--c-teal)" />
              <Avatar initials="TV" color="var(--c-purple)" />
              <Avatar initials="PS" color="var(--c-green)" />
            </div>
          </Specimen>
        </Specimens>
      </Variant>
    </>
  )
}

function PillKnobs() {
  const [text, setText] = useState('Skills')
  const [variant, setVariant] = useState('soft')
  const [size, setSize] = useState('md')
  const [color, setColor] = useState('#B43DD0')
  const [iconKey, setIconKey] = useState('none')
  const ICONS = { none: null, plus: <PlusIcon />, check: <CheckIcon />, star: <StarIcon /> }
  return (
    <>
      <Knobs>
        <Field label="text">
          <Input value={text} onChange={(e) => setText(e.target.value)} />
        </Field>
        <Field label="variant">
          <Select value={variant} onChange={(e) => setVariant(e.target.value)}>
            <option>soft</option>
            <option>filled</option>
            <option>outline</option>
          </Select>
        </Field>
        <Field label="size">
          <Select value={size} onChange={(e) => setSize(e.target.value)}>
            <option>sm</option>
            <option>md</option>
            <option>lg</option>
          </Select>
        </Field>
        <Field label="icon">
          <Select value={iconKey} onChange={(e) => setIconKey(e.target.value)}>
            <option value="none">none</option>
            <option value="plus">plus</option>
            <option value="check">check</option>
            <option value="star">star</option>
          </Select>
        </Field>
        <Field label="color">
          <ColorInput chip size="sm" value={color} onChange={setColor} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--row">
        <Pill color={color} variant={variant} size={size} icon={ICONS[iconKey]}>
          {text}
        </Pill>
      </div>
    </>
  )
}

// The sample faces that ship in public/avatars — the same set the Book
// Discovery prototype uses for its readers.
const SAMPLE_FACES = ['emma', 'jayden', 'noah', 'priya', 'sofia', 'diego']
const facePath = (name) => `/bs-prototypes/avatars/${name}.jpg`

function AvatarKnobs() {
  const [initials, setInitials] = useState('MC')
  const [face, setFace] = useState('none')
  const [color, setColor] = useState('#F26430')
  const [size, setSize] = useState('md')
  const [shape, setShape] = useState('circle')
  return (
    <>
      <Knobs>
        <Field label="initials">
          <Input value={initials} onChange={(e) => setInitials(e.target.value.slice(0, 2))} />
        </Field>
        <Field label="color">
          <ColorInput chip size="sm" value={color} onChange={setColor} />
        </Field>
        <Field label="size">
          <Select value={size} onChange={(e) => setSize(e.target.value)}>
            <option>xs</option>
            <option>sm</option>
            <option>md</option>
            <option>lg</option>
            <option>xl</option>
          </Select>
        </Field>
        <Field label="shape">
          <RadioGroup name="av-shape" value={shape} onChange={setShape}>
            <Radio value="circle">circle</Radio>
            <Radio value="square">square</Radio>
          </RadioGroup>
        </Field>
        <Field label="picture">
          <Select value={face} onChange={(e) => setFace(e.target.value)}>
            <option value="none">none — initials</option>
            {SAMPLE_FACES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
            <option value="broken">broken URL — falls back</option>
          </Select>
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Avatar
          initials={initials}
          color={color}
          size={size}
          shape={shape}
          src={face === 'none' ? undefined : face === 'broken' ? '/nope.jpg' : facePath(face)}
        />
      </div>
    </>
  )
}

function DividerShowcase() {
  return (
    <>
      <Variant label="plain rule">
        <Divider />
      </Variant>

      <Variant label="label — an “OR” style separator">
        <Divider label="OR" />
      </Variant>

      <Variant label='orientation="vertical" — stretches to its flex parent'>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-16)', height: 44 }}>
          <span>Minutes</span>
          <Divider orientation="vertical" />
          <span>Books</span>
          <Divider orientation="vertical" />
          <span>Badges</span>
        </div>
      </Variant>
    </>
  )
}

function DividerKnobs() {
  const [orientation, setOrientation] = useState('horizontal')
  const [label, setLabel] = useState('')
  return (
    <>
      <Knobs>
        <Field label="orientation">
          <Select value={orientation} onChange={(e) => setOrientation(e.target.value)}>
            <option value="horizontal">horizontal</option>
            <option value="vertical">vertical</option>
          </Select>
        </Field>
        {orientation === 'horizontal' && (
          <Field label="label">
            <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="(none)" />
          </Field>
        )}
      </Knobs>
      <div className="pt-variant-frame">
        {orientation === 'vertical' ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: 13,
              color: '#656565',
            }}
          >
            <span>Left</span>
            <Divider orientation="vertical" />
            <span>Right</span>
          </div>
        ) : (
          <Divider label={label || undefined} />
        )}
      </div>
    </>
  )
}

function SpinnerKnobs() {
  const [size, setSize] = useState('md')
  const [color, setColor] = useState('#196DD5')
  return (
    <>
      <Knobs>
        <Field label="size">
          <Select value={size} onChange={(e) => setSize(e.target.value)}>
            <option>xs</option>
            <option>sm</option>
            <option>md</option>
            <option>lg</option>
            <option>xl</option>
          </Select>
        </Field>
        <Field label="color">
          <ColorInput chip size="sm" value={color} onChange={setColor} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Spinner size={size} color={color} />
      </div>
    </>
  )
}

function SkeletonKnobs() {
  const [shape, setShape] = useState('rect')
  const [width, setWidth] = useState('200')
  const [height, setHeight] = useState('14')
  const [lines, setLines] = useState('1')
  const isCircle = shape === 'circle'
  return (
    <>
      <Knobs>
        <Field label="shape">
          <RadioGroup
            name="skel-shape"
            value={shape}
            onChange={(v) => {
              setShape(v)
              if (v === 'circle') {
                setWidth('44')
                setHeight('44')
              }
            }}
          >
            <Radio value="rect">rect</Radio>
            <Radio value="circle">circle</Radio>
          </RadioGroup>
        </Field>
        <Field label="width">
          <Input value={width} onChange={(e) => setWidth(e.target.value)} />
        </Field>
        <Field label="height">
          <Input value={height} onChange={(e) => setHeight(e.target.value)} />
        </Field>
        {!isCircle && (
          <Field label="lines">
            <Input type="number" value={lines} onChange={(e) => setLines(e.target.value)} />
          </Field>
        )}
      </Knobs>
      <div className="pt-variant-frame">
        <Skeleton
          shape={shape}
          width={Number(width) || width}
          height={Number(height) || height}
          lines={!isCircle && Number(lines) > 1 ? Number(lines) : undefined}
        />
      </div>
    </>
  )
}

function ProgressBarKnobs() {
  const [value, setValue] = useState(62)
  const [max, setMax] = useState(100)
  const [inline, setInline] = useState(false)
  const [color, setColor] = useState('#F26430')
  const [size, setSize] = useState('md')
  const [label, setLabel] = useState('Engagement')
  const [valueLabel, setVl] = useState('62%')
  const [subLabel, setSub] = useState('')
  const [showLabel, setShowLabel] = useState(true)
  return (
    <>
      <Knobs>
        <Field label="value">
          <Input
            type="range"
            min="0"
            max={max}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
        </Field>
        <Field label="max">
          <Input
            type="number"
            min="1"
            value={max}
            onChange={(e) => setMax(Number(e.target.value) || 1)}
          />
        </Field>
        <Field label="inline">
          <Toggle checked={inline} onChange={setInline} />
        </Field>
        <Field label="color">
          <ColorInput chip size="sm" value={color} onChange={setColor} />
        </Field>
        <Field label="size">
          <Select value={size} onChange={(e) => setSize(e.target.value)}>
            <option>sm</option>
            <option>md</option>
            <option>lg</option>
          </Select>
        </Field>
        <Field label="label / value">
          <Toggle checked={showLabel} onChange={setShowLabel} />
        </Field>
        {showLabel && (
          <Field label="label">
            <Input value={label} onChange={(e) => setLabel(e.target.value)} />
          </Field>
        )}
        {showLabel && (
          <Field label="subLabel">
            <Input
              value={subLabel}
              onChange={(e) => setSub(e.target.value)}
              placeholder="(optional)"
            />
          </Field>
        )}
        {showLabel && (
          <Field label="valueLabel">
            <Input value={valueLabel} onChange={(e) => setVl(e.target.value)} />
          </Field>
        )}
      </Knobs>
      <div className="pt-variant-frame">
        <ProgressBar
          value={value}
          max={max}
          inline={inline}
          color={color}
          size={size}
          label={showLabel ? label : undefined}
          subLabel={showLabel && subLabel ? subLabel : undefined}
          valueLabel={showLabel ? valueLabel : undefined}
        />
      </div>
    </>
  )
}

// ── More knob panels ─────────────────────────────────────────────────────

/**
 * The claim-column toggle. `repeatable` and `disabled` are separate states in
 * the app, not variants of one another — a repeatable row has no done state,
 * and a disabled-but-checked row is the app's $green100 "already, and not
 * yours to change".
 */
function CompleteToggleKnobs() {
  const [done, setDone] = useState(false)
  const [times, setTimes] = useState(7)
  const [repeatable, setRepeatable] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [readOnly, setReadOnly] = useState(false)
  return (
    <>
      <Knobs>
        <Field label="repeatable">
          <Toggle checked={repeatable} onChange={setRepeatable} />
        </Field>
        <Field label="disabled">
          <Toggle checked={disabled} onChange={setDisabled} />
        </Field>
        <Field label="read-only (no onChange)">
          <Toggle checked={readOnly} onChange={setReadOnly} />
        </Field>
      </Knobs>
      <Variant label="click it — the same control marks and unmarks">
        <CompleteToggle
          done={done}
          repeatable={repeatable}
          count={repeatable ? times : undefined}
          disabled={disabled}
          onChange={readOnly ? undefined : repeatable ? setTimes : setDone}
          label="Museums"
        />
      </Variant>
      <Variant label="a claim column, as it reads in a table">
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <CompleteToggle done onChange={() => {}} label="Complete" />
          <CompleteToggle done={false} onChange={() => {}} label="Not complete" />
          <CompleteToggle done disabled label="Already redeemed" />
          <CompleteToggle repeatable count={7} onChange={() => {}} label="Repeatable" />
        </div>
      </Variant>
      <Variant label="wording — the same control, renamed for its column (hover it)">
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <CompleteToggle
            done
            onChange={() => {}}
            label="Spring Reading Challenge"
            wording={{ set: 'Enroll', unset: 'Unenroll', on: 'Enrolled', off: 'Not enrolled' }}
          />
          <CompleteToggle
            done={false}
            onChange={() => {}}
            label="Library Tote Bag"
            wording={{ set: 'Redeem reward', unset: 'Mark unredeemed' }}
          />
        </div>
      </Variant>
    </>
  )
}

function TooltipKnobs() {
  const [placement, setPlacement] = useState('top')
  const [content, setContent] = useState('Mark as read')
  const [delay, setDelay] = useState(0)
  const [followCursor, setFollowCursor] = useState(false)
  return (
    <>
      <Knobs>
        <Field label="placement">
          <Select value={placement} onChange={(e) => setPlacement(e.target.value)}>
            <option>auto</option>
            <option>top</option>
            <option>bottom</option>
            <option>left</option>
            <option>right</option>
          </Select>
        </Field>
        <Field label="content">
          <Input value={content} onChange={(e) => setContent(e.target.value)} />
        </Field>
        <Field label="delay (ms)">
          <Input
            type="number"
            min="0"
            step="100"
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
          />
        </Field>
        <Field label="followCursor">
          <Toggle checked={followCursor} onChange={setFollowCursor} />
        </Field>
      </Knobs>
      <div
        className="pt-variant-frame"
        style={{ minHeight: 100, justifyContent: 'center', display: 'flex', alignItems: 'center' }}
      >
        <Tooltip content={content} placement={placement} delay={delay} followCursor={followCursor}>
          <Button variant="secondary">Hover me</Button>
        </Tooltip>
      </div>
    </>
  )
}

export const atomsSections = [
  {
    group: 'iconography',
    id: 'icon',
    name: 'Icon',
    usage: `import { Icon } from '@components/Icon/Icon'

<Icon name="flame" />                        // size 18, stroke 1.8, currentColor
<Icon name="chevron-down" size={11} stroke={2} />
<Icon name="flag" size={16} color="#E85648" />`,
    desc: (
      <>
        The single icon system for every prototype — a house-styled wrapper over{' '}
        <code>@tabler/icons-react</code>. Use a semantic kebab-case <code>name</code> so call sites
        stay library-agnostic: <code>{'<Icon name="flame" />'}</code>. Props: <code>size</code> (px,
        default 18), <code>stroke</code> (width, default 1.8), <code>color</code> (defaults to{' '}
        <code>currentColor</code>), plus <code>className</code> / <code>style</code>. Add new glyphs
        to the registry in <code>components/Icon/Icon.jsx</code>.
      </>
    ),
    render: () => (
      <>
        <IconShowcase />
      </>
    ),
  },
  {
    group: 'iconography',
    id: 'plumpy-icon',
    name: 'PlumpyIcon',
    usage: `import { PlumpyIcon } from '@components/PlumpyIcon/PlumpyIcon'

<PlumpyIcon name="insights" size={22} />
<PlumpyIcon name="medal" size={18} title="Badges" />`,
    desc: (
      <>
        The <strong>duotone</strong> family the real Beanstack admin chrome uses for its main rail —
        a solid layer plus a 35%-opacity layer, which is how both the Figma designs and the shipped
        app build those icons (<code>.dark</code> / <code>.light</code> in{' '}
        <code>_menu.html.haml</code>). These are the <strong>exact Icons8 Plumpy</strong> icons the
        Figma nav specifies — its asset names (shown under each glyph) are literally{' '}
        <code>icons8-staff</code>, <code>icons8-mission</code>, <code>icons8-deviation</code>, and
        so on. Because Plumpy shares that two-layer construction, a single{' '}
        <code>fill: currentColor</code> reproduces the real active state: both layers tint to the
        accent together. Props: <code>name</code>, <code>size</code> (default 24),{' '}
        <code>className</code>, <code>title</code>. Keep additions on the Plumpy pack — the Icons8
        id is stored beside each entry in <code>components/PlumpyIcon/PlumpyIcon.jsx</code>. This is{' '}
        <em>not</em> a replacement for <code>Icon</code>: Tabler line icons remain the default for
        in-page glyphs; Plumpy is for nav chrome.
      </>
    ),
    render: () => <PlumpyShowcase />,
  },
  {
    group: 'actions',
    id: 'button',
    name: 'Button',
    usage: `import { Button } from '@components/Button/Button'

<Button variant="primary" onClick={save}>Log for Class</Button>
<Button variant="ghost" size="sm" icon="plus">Add reader</Button>
<Button variant="secondary" size="msm">Manage</Button>   // beside a 44px select
<Button as="a" href="/readers" variant="secondary">All readers</Button>
<Button variant="danger" loading={saving} disabled={saving}>Delete</Button>`,
    desc: (
      <>
        Variants: <code>primary</code>, <code>secondary</code>, <code>ghost</code>,{' '}
        <code>danger</code>, <code>accent</code>. Sizes: <code>sm</code>, <code>md</code>,{' '}
        <code>msm</code>, <code>lg</code>. Optional <code>icon</code> / <code>iconRight</code>, or{' '}
        <code>iconOnly</code> for a square glyph-only target (the app&apos;s{' '}
        <code>.button--icon</code> — give it an <code>aria-label</code>). Can render as a link via{' '}
        <code>as="a"</code>.
        <br />
        <br />
        The four sizes are the app&apos;s own ladder (<code>lib/_buttons.scss</code>):{' '}
        <strong>36</strong> / <strong>40</strong> / <strong>44</strong> / <strong>56</strong>px.{' '}
        <code>sm</code> is for a button inside a row; <code>msm</code> is the rung to reach for when
        a button sits beside a 44px control (a select, a filter bar) — at <code>sm</code> it reads
        as a shrunken version of the thing next to it.
      </>
    ),
    render: () => (
      <>
        <ButtonKnobs />
        <ButtonShowcase />
      </>
    ),
  },
  {
    group: 'actions',
    id: 'icon-button',
    name: 'IconButton',
    usage: `import { IconButton } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'

<IconButton aria-label="Edit" onClick={edit}>
  <Icon name="pencil" size={16} />
</IconButton>`,
    desc: (
      <>
        Square button with just an icon. Variants: <code>primary</code>, <code>secondary</code>,{' '}
        <code>ghost</code>, <code>danger</code>.
        <br />
        <br />
        Sizes are the app&apos;s control ladder, by the same names <code>Button</code> and the form
        fields use — <code>sm</code> 36, <code>md</code> 44, <code>lg</code> 52 — so an icon button
        beside a button at the same rung comes out the same height. They used to run a rung short
        (28 / 36 / 44), which put a 28px control next to a 36px one with nothing in the JSX to say
        so. <code>xs</code> is that 28px rung, kept for the dense places that want it: a table row,
        a card&apos;s corner, a banner&apos;s dismiss. Always pair with an <code>aria-label</code>.
      </>
    ),
    render: () => (
      <>
        <IconButtonKnobs />
        <IconButtonShowcase />
      </>
    ),
  },
  {
    group: 'badges',
    id: 'pill',
    name: 'Pill',
    usage: `import { Pill } from '@components/Pill/Pill'

<Pill color="teal">Active</Pill>
<Pill color="amber" variant="filled" size="sm" icon="flame">Streak</Pill>
<Pill color="slate" variant="outline">Draft</Pill>`,
    desc: (
      <>
        Colored badge / chip. Variants: <code>soft</code> (default, tinted bg + dark text),{' '}
        <code>filled</code> (solid + white text), <code>outline</code>. Sizes: <code>sm</code>,{' '}
        <code>md</code>. Optional left <code>icon</code>.
      </>
    ),
    render: () => (
      <>
        <PillKnobs />
        <PillShowcase />
      </>
    ),
  },
  {
    group: 'badges',
    id: 'avatar',
    name: 'Avatar',
    usage: `import { Avatar } from '@components/Avatar/Avatar'

<Avatar initials="MC" color="#0CA7BC" />
<Avatar initials="AB" size="lg" shape="square" />

/* a reader who has uploaded a picture — initials stay the fallback */
<Avatar src="/bs-prototypes/avatars/emma.jpg" initials="EM" />`,
    desc: (
      <>
        Initials in a colored shape. Props: <code>initials</code>, <code>color</code>,{' '}
        <code>size</code> (xs / sm / md / lg / xl), <code>shape</code> (<code>circle</code> /{' '}
        <code>square</code>).
        <br />
        <br />
        <code>src</code> renders a real picture instead — a reader who has uploaded one. The
        initials stay the fallback: they show while there&apos;s no <code>src</code>, and again if
        the image fails to load, so a dead URL leaves the tile looking like every other avatar
        rather than a broken image.
      </>
    ),
    render: () => (
      <>
        <AvatarKnobs />
        <AvatarShowcase />
      </>
    ),
  },
  {
    group: 'cards',
    id: 'divider',
    name: 'Divider',
    usage: `import { Divider } from '@components/Primitives/Primitives'

<Divider />
<Divider label="OR" />
<Divider orientation="vertical" />`,
    desc: (
      <>
        Horizontal rule. Optional <code>label</code> to render an "OR" style separator.{' '}
        <code>orientation="vertical"</code> for a thin column divider that stretches to its flex
        parent.
      </>
    ),
    render: () => (
      <>
        <DividerKnobs />
        <DividerShowcase />
      </>
    ),
  },
  {
    group: 'feedback',
    id: 'spinner',
    name: 'Spinner',
    usage: `import { Spinner } from '@components/Primitives/Primitives'

<Spinner />
<Spinner size="sm" color="var(--c-teal)" />`,
    desc: (
      <>
        Animated loading indicator. Sizes <code>xs / sm / md / lg / xl</code>. Inherits current
        color or set explicitly via <code>color</code>.
      </>
    ),
    render: () => (
      <>
        <SpinnerKnobs />
      </>
    ),
  },
  {
    group: 'feedback',
    id: 'skeleton',
    name: 'Skeleton',
    usage: `import { Skeleton } from '@components/Primitives/Primitives'

<Skeleton width="60%" />
<Skeleton lines={3} />
<Skeleton shape="circle" width={40} height={40} />`,
    desc: (
      <>
        Animated loading placeholder. <code>width</code>, <code>height</code>, <code>shape</code>{' '}
        (rect/circle), or <code>lines</code> for a multi-row text placeholder.
      </>
    ),
    render: () => (
      <>
        <SkeletonKnobs />
        <div className="pt-variants pt-variants--3">
          <Variant label="avatar row">
            <div
              style={{
                background: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: 10,
                padding: 14,
                display: 'flex',
                gap: 16,
                alignItems: 'center',
              }}
            >
              <Skeleton shape="circle" width={44} height={44} />
              <div style={{ flex: 1 }}>
                <Skeleton width="35%" height={14} />
                <div style={{ height: 6 }} />
                <Skeleton width="60%" height={12} />
              </div>
              <Skeleton width={64} height={26} />
            </div>
          </Variant>
          <Variant label="stat card">
            <div
              style={{
                background: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: 10,
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <Skeleton width="45%" height={12} />
              <Skeleton width="30%" height={28} />
              <Skeleton width="55%" height={11} />
            </div>
          </Variant>
          <Variant label="article / card">
            <div
              style={{
                background: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: 10,
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <Skeleton width="100%" height={120} />
              <Skeleton width="70%" height={15} />
              <Skeleton width="90%" height={12} lines={3} />
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                <Skeleton shape="circle" width={24} height={24} />
                <Skeleton width="30%" height={11} />
              </div>
            </div>
          </Variant>
          <Variant label="table rows">
            <div
              style={{
                background: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: 10,
                overflow: 'hidden',
              }}
            >
              {[100, 80, 70, 60].map((w, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    borderBottom: i < 3 ? '1px solid #F5F5F5' : 'none',
                  }}
                >
                  <Skeleton shape="circle" width={28} height={28} />
                  <Skeleton width={`${w}%`} height={13} style={{ flex: 1 }} />
                  <Skeleton width={40} height={13} />
                </div>
              ))}
            </div>
          </Variant>
          <Variant label="form">
            <div
              style={{
                background: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: 10,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              {[
                ['40%', 32],
                ['60%', 32],
                ['100%', 72],
              ].map(([w, h], i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Skeleton width="28%" height={11} />
                  <Skeleton width={w} height={h} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Skeleton width={72} height={32} />
                <Skeleton width={88} height={32} />
              </div>
            </div>
          </Variant>
        </div>
      </>
    ),
  },
  {
    group: 'feedback',
    id: 'progress-bar',
    name: 'ProgressBar',
    usage: `import { ProgressBar } from '@components/ProgressBar/ProgressBar'

<ProgressBar value={18} max={30} label="Minutes today" valueLabel="18 / 30" />
<ProgressBar value={62} size="sm" inline />`,
    desc: (
      <>
        Track + fill with optional <code>label</code>, <code>subLabel</code>, and{' '}
        <code>valueLabel</code>. Used for cohorts, RMI factors, grade bands, engagement tiers.
        Sizes: <code>sm</code>, <code>md</code>, <code>lg</code>.
      </>
    ),
    render: () => (
      <>
        <ProgressBarKnobs />
      </>
    ),
  },
  {
    group: 'overlays',
    id: 'tooltip',
    name: 'Tooltip',
    usage: `import { Tooltip } from '@components/Primitives/Primitives'

/* Portals to document.body, so a clipping ancestor can't cut it off */
<Tooltip content="Up 12% on last month" placement="top">
  <TrendChip delta={12} />
</Tooltip>`,
    desc: (
      <>
        Lightweight hover tooltip for explaining icon buttons and labels — not for chart data.{' '}
        <code>placement</code>: <code>top</code> / <code>bottom</code> / <code>left</code> /{' '}
        <code>right</code>.
      </>
    ),
    render: () => (
      <>
        <TooltipKnobs />
      </>
    ),
  },
  {
    group: 'iconography',
    id: 'bs-icons',
    name: 'BsIcons',
    usage: `import { BsIcon } from '@components/BsIcons/BsIcons'

<BsIcon set="flags" name="speed" size={28} />
<BsIcon set="rmiFactors" name="consistency" size={20} alt="Consistency" />`,
    desc: (
      <>
        The product&apos;s own illustrated icons, copied verbatim out of the shipped app (bs-product{' '}
        <code>app/assets/images/icons/</code>) and served from <code>public/bs-icons/</code>. Two
        sets are gallery-worthy: <code>flags</code> (the Book Talks integrity flags) and{' '}
        <code>rmi-factors</code> (the ten motivation factors). A third, <code>actions</code>, holds
        the admin&apos;s two row-action glyphs (<code>reward</code>, <code>ticket</code>) — plain
        single-colour marks in the Plumpy manner rather than drawings, so they aren&apos;t shown
        here; the profiles use them directly.
        <br />
        <br />
        These are deliberately <strong>not</strong> in the <code>&lt;Icon&gt;</code> registry.{' '}
        <code>&lt;Icon&gt;</code> is a stroked single-glyph system where <code>currentColor</code>{' '}
        does the work; these are multi-path full-colour drawings with gradient defs — the category
        CLAUDE.md keeps as asset SVG. Rendered as <code>&lt;img&gt;</code> so gradient ids
        can&apos;t collide between instances. The two single-colour sets are the exception: the app
        tints those from CSS, so they render as a mask painted with <code>currentColor</code> —
        which also keeps a drawing&apos;s own internal opacity (the reward box&apos;s lid is drawn
        at 0.35, and an alpha mask preserves that as 35% of the tint).
        <br />
        <br />
        <code>&lt;FlagIcon type&gt;</code> takes a prototype flag key and looks up the app&apos;s
        file for it via <code>FLAG_ICON_FILE</code> — the prototypes name a flag for what a reviewer
        sees (<code>time-warning</code>), the app names the asset for the signal that raised it (
        <code>delayed_response</code>), and the map keeps both honest.
      </>
    ),
    render: () => (
      <>
        <Variant label="flags — keyed by our flag types">
          <div className="pt-bsicon-grid">
            {Object.entries(FLAG_ICON_FILE).map(([type, file]) => (
              <div key={type} className="pt-bsicon">
                <BsIcon set="flags" name={file} size={32} />
                <code>{type}</code>
              </div>
            ))}
          </div>
        </Variant>
        <Variant label="rmi-factors — the ten motivation factors (+ mystery)">
          <div className="pt-bsicon-grid">
            {RMI_FACTOR_FILES.map((name) => (
              <div key={name} className="pt-bsicon">
                <BsIcon set="rmi-factors" name={name} size={32} />
                <code>{name}</code>
              </div>
            ))}
          </div>
        </Variant>
      </>
    ),
  },
  {
    group: 'actions',
    id: 'row-action',
    name: 'RowAction',
    usage: `import { RowAction, RowActions } from '@components/RowAction/RowAction'

/* The two shapes a table-row action is allowed to take — icon, or text link */
<RowActions>
  <RowAction icon="gift" label="Redeem" onClick={redeem} />
  <RowAction as="link" label="View" onClick={open} />
</RowActions>

/* Switched on for this row — a filled green disc you can press to switch off */
<RowAction icon="check" label="Take off the class Book List" done onClick={remove} />`,
    desc: (
      <>
        The one control that sits at the end of a table row. The app has exactly two shapes for this
        and no others: <strong>an icon</strong>, for something you do to this row and every row —
        redeem, open, re-run (<code>.redeem-reward-icon</code> in the earned-rewards table is the
        reference: a bare 32px box holding a 20px drawing, no border and no fill until you&apos;re
        over it, with the label in a tooltip because there&apos;s no room to write it forty times
        down a column); and <strong>a text button</strong>, for &ldquo;open the thing this row is
        about&rdquo; — the app&apos;s <code>View Activity</code>, which is a plain{' '}
        <code>Button</code> at <code>width: max-content</code>, so this component doesn&apos;t wrap
        it.
        <br />
        <br />
        Before it, the profiles had four: a ghost <code>IconButton</code>, a bespoke 28px{' '}
        <code>.rl-dots</code>, a bespoke 32px <code>.row-action</code>, and a bare text link — four
        different targets and three different hover treatments down the same page.
        <br />
        <br />
        The glyph is <strong>Plumpy</strong> wherever the pack has it, which is what the app does:{' '}
        <code>
          .refresh-icon {'{'} @include icon(&apos;refresh&apos;, &apos;#000000&apos;, 20,
          &apos;plumpy&apos;) {'}'}
        </code>{' '}
        on its own row action, and the raffle editor pulls <code>train-ticket</code> and{' '}
        <code>leaderboard</code> from the same pack. Anything Plumpy doesn&apos;t carry falls back
        to the stroked <code>&lt;Icon&gt;</code> at the same size, so a name never renders nothing.
        <br />
        <br />
        Pass <code>children</code> to draw something that isn&apos;t an <code>&lt;Icon&gt;</code> —
        a product drawing, a partner mark. Pass <code>as=&quot;span&quot;</code> for a mark that
        reports rather than acts (a flag, a partner logo): the same 32px cell, no button semantics.{' '}
        <code>RowActions</code> is the cell they sit in — <code>.row-actions</code> right-aligns in
        the app&apos;s table Sass, so several of them line up on one grid however many a given row
        has.
        <br />
        <br />
        <code>done</code> is the switched-on state of an action that toggles — the title is on the
        list, the row is starred. It fills: a green disc with a white mark in it, and pressing it
        switches back off the way a bookmark does. Don&apos;t reach for <code>disabled</code> to say
        this — grey reads as &ldquo;you can&apos;t&rdquo;, which on a book already added said the
        title had been refused when in fact it had worked.
      </>
    ),
    render: () => (
      <>
        <Variant label="one action per row">
          <RowAction icon="dots" label="Actions for The Hobbit" onClick={() => {}} />
        </Variant>
        <Variant label="done — the switched-on half of a toggle, beside off and unavailable">
          <RowActions>
            <RowAction icon="bookmark" label="Add to the class Book List" onClick={() => {}} />
            <RowAction icon="check" label="Take off the class Book List" done onClick={() => {}} />
            <RowAction icon="bookmark" label="The class list is full" disabled />
          </RowActions>
        </Variant>
        <Variant label="a cluster — RowActions right-aligns them on one grid">
          <RowActions>
            <RowAction as="span" label="Logged from Comics Plus" icon="flame" />
            <RowAction icon="flag" label="2 flags" onClick={() => {}} />
            <RowAction icon="message-chatbot" label="Book talk with Benny" onClick={() => {}} />
            <RowAction icon="dots" label="Entry actions" onClick={() => {}} />
          </RowActions>
        </Variant>
        <Variant label="disabled — present, but nothing to do">
          <RowAction icon="printer" label="Nothing to print" disabled />
        </Variant>
      </>
    ),
  },
  {
    group: 'actions',
    id: 'complete-toggle',
    name: 'CompleteToggle',
    usage: `import { CompleteToggle } from '@components/CompleteToggle/CompleteToggle'

<CompleteToggle done={row.done} onChange={(done) => setDone(row.id, done)} />
<CompleteToggle done={row.done} repeatable count={row.count} wording="redeemed" />`,
    desc: (
      <>
        The admin&apos;s row-completion toggle — the one control that runs down the{' '}
        <code>Completed?</code> / <code>Redeemed?</code> column of every reader-profile table.
        <br />
        <br />
        Ported from the shipped app, where a single rule covers all of them (
        <code>
          .complete-learning-track-toggle, .redeem-incentive-toggle, .redeem-raffle-toggle,
          .redeem-reward-toggle
        </code>{' '}
        in <code>admin/_admin.scss</code>): a 32px filled checkbox glyph, green <code>#0BA85F</code>{' '}
        when it&apos;s done and grey when it isn&apos;t, clickable either way — which is also how
        staff take a badge or a reward <em>back</em>.
        <br />
        <br />
        It is deliberately not a <code>Checkbox</code>: it reads as a state you set, not a form
        field you fill in, and the app draws it as a glyph rather than an input.{' '}
        <code>repeatable</code> swaps it for the app&apos;s <code>add</code> glyph and a running
        count, because a row that can be completed more than once has no single done state — the
        count is the record. Since that glyph is an <em>add</em>, it adds: the cell takes the
        secondary button&apos;s chrome and calls <code>onChange</code> with <code>count + 1</code>.
        Omit <code>onChange</code> for a read-only cell — same shape, no pointer, so a column of
        them still lines up.
        <br />
        <br />
        The same glyph runs several different columns, and &ldquo;Mark complete&rdquo; is the wrong
        sentence in some of them — a challenge&apos;s <code>Enrolled?</code> column enrolls.{' '}
        <code>
          wording={'{'}
          {'{'} set, unset, on, off {'}'}
          {'}'}
        </code>{' '}
        renames the four states without changing the control.
      </>
    ),
    render: () => <CompleteToggleKnobs />,
  },
  {
    group: 'badges',
    id: 'trend-chip',
    name: 'TrendChip',
    usage: `import { TrendChip } from '@components/TrendChip/TrendChip'

/* Direction only — the figure belongs in the tooltip, never beside the arrow */
<TrendChip delta={12} />
<TrendChip delta={-4} inverse />                        // down is good (e.g. flag rate)
<TrendChip delta={3} format={(n) => \`\${n}%\`} showValue />  // prints "3% ↑"`,
    desc: (
      <>
        The one way a trend is drawn: a pastel chip holding an arrow, and nothing else. The figure
        it stands for lives in the tooltip.
        <br />
        <br />A direction, <strong>not a second number</strong> — wherever a trend appears it sits
        beside a value that&apos;s already the number, and repeating a delta there makes the eye
        read two figures per line. So the chip says which way it moved, hovering says by how much,
        and every trend looks identical whether it&apos;s a profile stat row, a Lexile delta or a{' '}
        <code>BarList</code> row. Colours are the app&apos;s own tag pairs — a hue&apos;s{' '}
        <code>50</code> fill under its <code>500</code>/<code>800</code> text.
        <br />
        <br />
        <code>inverse</code> flips which direction counts as good, for metrics where fewer is better
        (flags, concerns).
        <br />
        <br />A <strong>zero</strong> delta is flat, not absent: a grey chip holding a dash, so a
        row that genuinely didn&apos;t move still lines up with the rows that did instead of leaving
        a hole. A <strong>null</strong> delta is the different case — no reading at all — and
        renders nothing.
        <br />
        <br />
        <code>showValue</code> prints the magnitude in the chip beside the arrow (
        <strong>3% ↑</strong>), for the places where the trend stands on its own with no value next
        to it to read it against — a lone cell, a caption, a summary line. Don&apos;t reach for it
        beside a figure: that&apos;s the two-numbers-per-line problem the default shape exists to
        avoid.
      </>
    ),
    render: () => (
      <>
        <TrendChipKnobs />
        <TrendChipShowcase />
      </>
    ),
  },
  {
    group: 'iconography',
    id: 'beanstack-logo',
    name: 'Beanstack Logo',
    usage: `import { BeanstackLogo } from '@components/BeanstackLogo/BeanstackLogo'

<BeanstackLogo />
<BeanstackLogo variant="mark" size={40} />
<BeanstackLogo invert />`,
    desc: (
      <>
        Our own mark, the way the partners have theirs. <code>variant="lockup"</code> (the default)
        is the bean beside the wordmark; <code>variant="mark"</code> is the bean alone, for a tab,
        an avatar or a favicon-sized slot. Sizes are <code>sm/md/lg</code>, or a number — the
        mark&apos;s pixel height, with the wordmark and the gap scaled off it, so a one-off size
        can&apos;t drift the two halves apart.
        <br />
        <br />
        The art is <code>public/bs.svg</code> inlined rather than an <code>&lt;img&gt;</code>: the
        bean draws from <code>--accent</code> where a surface sets one (the footers tint a whole
        chrome that way) and falls back to brand teal, and the wordmark&apos;s ink comes from{' '}
        <code>--bsl-word</code>. <code>invert</code> is for dark chrome and only moves the wordmark
        — the teal bean reads fine on navy and it&apos;s the brand colour.
        <br />
        <br />
        <code>word</code> + <code>upper</code> put a sub-brand on the same mark: RMI&apos;s footer
        lockup is this component, not a second drawing. <strong>Five</strong> surfaces had each
        drawn the lockup themselves — the web app&apos;s top bar, logging-flow, beeverso,
        book-talks, and the footers — and had drifted to two weights and three trackings. The admin
        rail is the one deliberate holdout: the shipped app puts the <code>bs-heart</code> symbol
        there, not the bean.
      </>
    ),
    render: () => (
      <>
        <Variant label="lockup — sm / md / lg">
          <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
            <BeanstackLogo size="sm" />
            <BeanstackLogo size="md" />
            <BeanstackLogo size="lg" />
          </div>
        </Variant>
        <Variant label="mark — the bean alone, 20 / 30 / 44">
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <BeanstackLogo variant="mark" size={20} />
            <BeanstackLogo variant="mark" size={30} />
            <BeanstackLogo variant="mark" size={44} />
          </div>
        </Variant>
        <Variant label="invert — on dark chrome">
          <div
            style={{
              display: 'flex',
              gap: 28,
              alignItems: 'center',
              flexWrap: 'wrap',
              background: 'var(--c-gray-900)',
              padding: '16px 18px',
              borderRadius: 10,
            }}
          >
            <BeanstackLogo invert />
            <BeanstackLogo variant="mark" size={30} />
            <BeanstackLogo word="RMI" upper invert />
          </div>
        </Variant>
        <Variant label="a sub-brand on the same mark">
          <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
            <BeanstackLogo />
            <BeanstackLogo word="RMI" upper />
          </div>
        </Variant>
      </>
    ),
  },
]
