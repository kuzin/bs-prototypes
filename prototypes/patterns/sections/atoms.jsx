import { useState } from 'react'
import { Button } from '@components/Button/Button'
import { Avatar } from '@components/Avatar/Avatar'
import { Pill } from '@components/Pill/Pill'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import { Toggle } from '@components/Toggle/Toggle'
import {
  Field,
  Input,
  Radio,
  RadioGroup,
  Select,
} from '@components/Form/Form'
import {
  Divider,
  IconButton,
  Skeleton,
  Spinner,
  Tooltip,
} from '@components/Primitives/Primitives'
import { Knobs, Variant, PlusIcon, CaretIcon, EditIcon, DuplicateIcon, ArchiveIcon, TrashIcon, MoreIcon, CheckIcon, StarIcon } from './_shared'

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
        <Tooltip
          content={content}
          placement={placement}
          delay={delay}
          followCursor={followCursor}
        >
          <Button variant="secondary">Hover me</Button>
        </Tooltip>
      </div>
    </>
  )
}

export const atomsSections = [
  {
    group: 'atoms',
    id: 'button',
    name: "Button",
    desc: (
      <>
                  Variants: <code>primary</code>, <code>secondary</code>, <code>ghost</code>,{' '}
                  <code>danger</code>, <code>accent</code>. Sizes: <code>sm</code>, <code>md</code>,{' '}
                  <code>lg</code>. Optional <code>icon</code> / <code>iconRight</code>. Can render
                  as a link via <code>as="a"</code>.
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
    name: "IconButton",
    desc: (
      <>
                  Square button with just an icon. Variants: <code>primary</code>,{' '}
                  <code>secondary</code>, <code>ghost</code>, <code>danger</code>. Sizes:{' '}
                  <code>sm</code>, <code>md</code>, <code>lg</code>. Always pair with an{' '}
                  <code>aria-label</code>.
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
    name: "Pill",
    desc: (
      <>
                  Colored badge / chip. Variants: <code>soft</code> (default, tinted bg + dark
                  text), <code>filled</code> (solid + white text), <code>outline</code>. Sizes:{' '}
                  <code>sm</code>, <code>md</code>. Optional left <code>icon</code>.
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
    name: "Avatar",
    desc: (
      <>
                  Initials in a colored shape. Props: <code>initials</code>, <code>color</code>,{' '}
                  <code>size</code> (xs / sm / md / lg / xl), <code>shape</code> (
                  <code>circle</code> / <code>square</code> / <code>rounded</code>).
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
    name: "Divider",
    desc: (
      <>
                  Horizontal rule. Optional <code>label</code> to render an "OR" style separator.{' '}
                  <code>orientation="vertical"</code> for a thin column divider that stretches to
                  its flex parent.
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
    name: "Spinner",
    desc: (
      <>
                  Animated loading indicator. Sizes <code>xs / sm / md / lg / xl</code>. Inherits
                  current color or set explicitly via <code>color</code>.
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
    name: "Skeleton",
    desc: (
      <>
                  Animated loading placeholder. <code>width</code>, <code>height</code>,{' '}
                  <code>shape</code> (rect/circle), or <code>lines</code> for a multi-row text
                  placeholder.
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
    name: "ProgressBar",
    desc: (
      <>
                  Track + fill with optional <code>label</code>, <code>subLabel</code>, and{' '}
                  <code>valueLabel</code>. Used for cohorts, RMI factors, grade bands, engagement
                  tiers. Sizes: <code>sm</code>, <code>md</code>, <code>lg</code>.
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
    name: "Tooltip",
    desc: (
      <>
                  Lightweight hover tooltip for explaining icon buttons and labels — not for chart
                  data. <code>placement</code>: <code>top</code> / <code>bottom</code> /{' '}
                  <code>left</code> / <code>right</code>.
                </>
    ),
    render: () => (
      <>
              <TooltipKnobs />
            </>
    ),
  },
]
