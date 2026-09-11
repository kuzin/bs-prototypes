import { useState } from 'react'
import { Icon, ICON_NAMES } from '@components/Icon/Icon'
import { PlumpyIcon, PLUMPY_NAMES, PLUMPY_SOURCES } from '@components/PlumpyIcon/PlumpyIcon'
import { BsIcon, FLAG_ICON_FILE, RMI_FACTOR_FILES, ACTION_ICONS } from '@components/BsIcons/BsIcons'
import { TrendChip } from '@components/TrendChip/TrendChip'
import { CompleteToggle } from '@components/CompleteToggle/CompleteToggle'
import { RowAction, RowActions } from '@components/RowAction/RowAction'
import { Button } from '@components/Button/Button'
import { Avatar } from '@components/Avatar/Avatar'
import { Pill } from '@components/Pill/Pill'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import { Toggle } from '@components/Toggle/Toggle'
import { Field, Input, Radio, RadioGroup, Select } from '@components/Form/Form'
import { Divider, IconButton, Skeleton, Spinner, Tooltip } from '@components/Primitives/Primitives'
import {
  Knobs,
  Variant,
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(104px, 1fr))',
          gap: 8,
          color: active ? 'var(--c-accent)' : 'var(--c-gray-900)',
        }}
      >
        {PLUMPY_NAMES.map((name) => (
          <div
            key={name}
            title={name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: '14px 6px',
              background: active ? 'var(--c-accent-wash)' : '#fff',
              border: '1px solid var(--c-border)',
              borderRadius: 8,
            }}
          >
            <PlumpyIcon name={name} size={size} />
            <span
              style={{
                fontSize: 10,
                color: 'var(--c-text-muted)',
                textAlign: 'center',
                wordBreak: 'break-word',
                lineHeight: 1.25,
              }}
            >
              {name}
              <br />
              <span style={{ opacity: 0.7 }}>{PLUMPY_SOURCES[name]}</span>
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

function IconShowcase() {
  const [size, setSize] = useState(24)
  const [stroke, setStroke] = useState(1.8)
  const [color, setColor] = useState('#1D4ED8')
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
          <input
            className="pt-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </Field>
      </Knobs>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(104px, 1fr))',
          gap: 8,
          color,
        }}
      >
        {ICON_NAMES.map((name) => (
          <div
            key={name}
            title={name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: '14px 6px',
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: 8,
            }}
          >
            <Icon name={name} size={size} stroke={stroke} />
            <span
              style={{
                fontSize: 10,
                color: '#64748B',
                textAlign: 'center',
                wordBreak: 'break-word',
                lineHeight: 1.25,
              }}
            >
              {name}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

function ButtonShowcase() {
  return (
    <>
      <div className="pt-variants pt-variants--4">
        <Variant label="primary" bare>
          <Button variant="primary">Log for Class</Button>
        </Variant>
        <Variant label="secondary" bare>
          <Button variant="secondary">Set Classroom Goal</Button>
        </Variant>
        <Variant label="ghost" bare>
          <Button variant="ghost">Cancel</Button>
        </Variant>
        <Variant label="danger" bare>
          <Button variant="danger">Delete</Button>
        </Variant>
      </div>
      <div className="pt-variants pt-variants--4" style={{ marginTop: 16 }}>
        <Variant label="accent (custom color)" bare>
          <Button variant="accent" accent="#7C3AED">
            Open Skills
          </Button>
        </Variant>
        <Variant label="with icon" bare>
          <Button variant="primary" icon={<PlusIcon />}>
            Add Student
          </Button>
        </Variant>
        <Variant label="with right caret" bare>
          <Button variant="secondary" iconRight={<CaretIcon />}>
            Filter
          </Button>
        </Variant>
        <Variant label="as link (a)" bare>
          <Button as="a" href="#" variant="ghost">
            Link button
          </Button>
        </Variant>
      </div>
      <div className="pt-variants pt-variants--4" style={{ marginTop: 16 }}>
        <Variant label="size='sm'" bare>
          <Button variant="primary" size="sm">
            Small
          </Button>
        </Variant>
        <Variant label="size='md'" bare>
          <Button variant="primary" size="md">
            Medium
          </Button>
        </Variant>
        <Variant label="size='lg'" bare>
          <Button variant="primary" size="lg">
            Large
          </Button>
        </Variant>
        <Variant label="disabled / loading" bare>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
          </div>
        </Variant>
      </div>
    </>
  )
}

function ButtonKnobs() {
  const [label, setLabel] = useState('Log for Class')
  const [variant, setVariant] = useState('primary')
  const [size, setSize] = useState('md')
  const [accent, setAccent] = useState('#7C3AED')
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
            <option>md</option>
            <option>lg</option>
          </Select>
        </Field>
        {variant === 'accent' && (
          <Field label="accent">
            <input
              className="pt-color"
              type="color"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
            />
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
  const [size, setSize] = useState('md')
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

function PillKnobs() {
  const [text, setText] = useState('Skills')
  const [variant, setVariant] = useState('soft')
  const [size, setSize] = useState('md')
  const [color, setColor] = useState('#7C3AED')
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
          <input
            className="pt-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
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

function AvatarKnobs() {
  const [initials, setInitials] = useState('MC')
  const [color, setColor] = useState('#E8866A')
  const [size, setSize] = useState('md')
  const [shape, setShape] = useState('circle')
  return (
    <>
      <Knobs>
        <Field label="initials">
          <Input value={initials} onChange={(e) => setInitials(e.target.value.slice(0, 2))} />
        </Field>
        <Field label="color">
          <input
            className="pt-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
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
      </Knobs>
      <div className="pt-variant-frame">
        <Avatar initials={initials} color={color} size={size} shape={shape} />
      </div>
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
              color: '#475569',
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
  const [color, setColor] = useState('#1D4ED8')
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
          <input
            className="pt-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
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
  const [color, setColor] = useState('#E8866A')
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
          <input
            className="pt-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
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
          count={repeatable ? 7 : undefined}
          disabled={disabled}
          onChange={readOnly ? undefined : setDone}
          label="Museums"
        />
      </Variant>
      <Variant label="a claim column, as it reads in a table">
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <CompleteToggle done onChange={() => {}} label="Complete" />
          <CompleteToggle done={false} onChange={() => {}} label="Not complete" />
          <CompleteToggle done disabled label="Already redeemed" />
          <CompleteToggle repeatable count={7} label="Repeatable" />
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
    group: 'atoms',
    id: 'icon',
    name: 'Icon',
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
    group: 'atoms',
    id: 'plumpy-icon',
    name: 'PlumpyIcon',
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
    group: 'atoms',
    id: 'button',
    name: 'Button',
    desc: (
      <>
        Variants: <code>primary</code>, <code>secondary</code>, <code>ghost</code>,{' '}
        <code>danger</code>, <code>accent</code>. Sizes: <code>sm</code>, <code>md</code>,{' '}
        <code>lg</code>. Optional <code>icon</code> / <code>iconRight</code>. Can render as a link
        via <code>as="a"</code>.
      </>
    ),
    render: () => (
      <>
        <ButtonKnobs />
      </>
    ),
  },
  {
    group: 'atoms',
    id: 'icon-button',
    name: 'IconButton',
    desc: (
      <>
        Square button with just an icon. Variants: <code>primary</code>, <code>secondary</code>,{' '}
        <code>ghost</code>, <code>danger</code>. Sizes: <code>sm</code>, <code>md</code>,{' '}
        <code>lg</code>. Always pair with an <code>aria-label</code>.
      </>
    ),
    render: () => (
      <>
        <IconButtonKnobs />
      </>
    ),
  },
  {
    group: 'atoms',
    id: 'pill',
    name: 'Pill',
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
      </>
    ),
  },
  {
    group: 'atoms',
    id: 'avatar',
    name: 'Avatar',
    desc: (
      <>
        Initials in a colored shape. Props: <code>initials</code>, <code>color</code>,{' '}
        <code>size</code> (xs / sm / md / lg / xl), <code>shape</code> (<code>circle</code> /{' '}
        <code>square</code> / <code>rounded</code>).
      </>
    ),
    render: () => (
      <>
        <AvatarKnobs />
      </>
    ),
  },
  {
    group: 'atoms',
    id: 'divider',
    name: 'Divider',
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
      </>
    ),
  },
  {
    group: 'atoms',
    id: 'spinner',
    name: 'Spinner',
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
    group: 'atoms',
    id: 'skeleton',
    name: 'Skeleton',
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
                    borderBottom: i < 3 ? '1px solid #F1F5F9' : 'none',
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
    group: 'atoms',
    id: 'progress-bar',
    name: 'ProgressBar',
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
    group: 'atoms',
    id: 'tooltip',
    name: 'Tooltip',
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
    group: 'atoms',
    id: 'bs-icons',
    name: 'BsIcons',
    desc: (
      <>
        The product&apos;s own illustrated icons, copied verbatim out of the shipped app (bs-product{' '}
        <code>app/assets/images/icons/</code>) and served from <code>public/bs-icons/</code>. Three
        sets: <code>flags</code> (the Book Talks integrity flags), <code>rmi-factors</code> (the ten
        motivation factors) and <code>actions</code> (the admin&apos;s row-action glyphs).
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
        <Variant label="actions — the row actions on a claim table">
          <div className="pt-bsicon-grid">
            {ACTION_ICONS.map((name) => (
              <div key={name} className="pt-bsicon">
                <BsIcon set="actions" name={name} size={32} />
                <code>{name}</code>
              </div>
            ))}
          </div>
        </Variant>
      </>
    ),
  },
  {
    group: 'atoms',
    id: 'row-action',
    name: 'RowAction',
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
      </>
    ),
    render: () => (
      <>
        <Variant label="one action per row">
          <RowAction icon="dots" label="Actions for The Hobbit" onClick={() => {}} />
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
    group: 'atoms',
    id: 'complete-toggle',
    name: 'CompleteToggle',
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
        count is the record. Omit <code>onChange</code> for a read-only cell.
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
    group: 'atoms',
    id: 'trend-chip',
    name: 'TrendChip',
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
        (flags, concerns). A null or zero delta renders nothing — a flat week isn&apos;t a trend.
      </>
    ),
    render: () => (
      <>
        <Variant label="up / down, and inverse (fewer is better)" full>
          <div className="pt-variant-frame--row" style={{ display: 'flex', gap: 16, padding: 14 }}>
            <TrendChip delta={26} format={(n) => `${n}%`} />
            <TrendChip delta={-15} format={(n) => `${n}L`} suffix="vs Apr" />
            <TrendChip delta={2} inverse format={(n) => `${n} flags`} />
            <TrendChip delta={-3} inverse format={(n) => `${n} flags`} />
          </div>
        </Variant>
      </>
    ),
  },
]
