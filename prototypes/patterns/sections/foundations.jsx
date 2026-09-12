import { useEffect, useState } from 'react'
import '@components/ui/tokens.css'
import { Variant } from './_shared'

// The color page mirrors components/ui/tokens.css, which in turn mirrors
// bs-product's `lib/_colors.scss`. No hex is duplicated here — every value is
// read back out of the live :root vars, so this gallery can't drift from the
// tokens, and the tokens can't drift from the app without it showing up here.

const GRAYS = [
  '--c-gray-0',
  '--c-gray-100',
  '--c-gray-150',
  '--c-gray-200',
  '--c-gray-250',
  '--c-gray-300',
  '--c-gray-350',
  '--c-gray-400',
  '--c-gray-500',
  '--c-gray-600',
  '--c-gray-700',
  '--c-gray-750',
  '--c-gray-800',
  '--c-gray-900',
]

// Three tokens per hue, and the app's own name for the middle one.
const HUES = [
  ['red', '$brick — $danger-color'],
  ['orange', '$flamingo'],
  ['yellow', '$saffron — $important-color'],
  ['green', '$jade — $success-color'],
  ['teal', '$teal600 — the Beanstack mark'],
  ['blue', '$denim'],
  ['purple', '$orchid'],
  ['pink', '$coral'],
]

const ACTION = [
  ['--c-accent', '$primary-color — tenant-themable'],
  ['--c-accent-hover', 'lighten 10%'],
  ['--c-accent-active', 'darken 10%'],
  ['--c-accent-wash', 'lighten 45% — rail hover + active fill'],
  ['--c-focus-blue', '$focusBlue — focus rings'],
]

const INK = [
  ['--c-text', '$textColor — body copy'],
  ['--c-text-dark', '$textColorDark — headings'],
  ['--c-text-light', '$textColorLight — secondary'],
]

const ROLES = [
  ['--c-surface', 'card / panel'],
  ['--c-bg', 'page ground'],
  ['--c-bg-muted', 'a sunken band'],
  ['--c-border', 'every hairline'],
  ['--c-border-strong', 'a border that has to be seen'],
  ['--c-brand', 'Beanstack teal'],
  ['--c-danger', 'destructive / error'],
  ['--c-warning', 'needs attention'],
  ['--c-success', 'done / healthy'],
  ['--c-info', 'neutral notice'],
]

const COLOR_TOKENS = [
  ...GRAYS,
  ...HUES.flatMap(([h]) => [`--c-${h}-wash`, `--c-${h}`, `--c-${h}-ink`]),
  ...ACTION.map(([t]) => t),
  ...INK.map(([t]) => t),
  ...ROLES.map(([t]) => t),
]

// Pick readable ink for a label sitting on the swatch itself. Relative
// luminance, not lightness: #ffe091 and #65a6f6 are the same L* and want
// opposite ink.
function isDark(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex ?? '')
  if (!m) return false
  const n = parseInt(m[1], 16)
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => lin(c / 255))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.42
}

const MONO = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-micro)' }

// The gray ramp reads as one strip, not fourteen cards: the whole point is the
// step from one rung to the next, and cards put a border between every step.
// 10px on the hex because fourteen cells leaves ~48px each.
function GrayRamp({ hexes }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRAYS.length}, 1fr)`,
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid var(--c-border)',
      }}
    >
      {GRAYS.map((token) => {
        const hex = hexes[token]
        return (
          <div
            key={token}
            title={`${token} — ${hex ?? ''}`}
            style={{
              background: `var(${token})`,
              color: isDark(hex) ? 'rgba(255,255,255,0.92)' : 'var(--c-text)',
              padding: '18px 0 7px',
              textAlign: 'center',
              fontSize: 'var(--text-micro)',
              fontWeight: 'var(--fw-bold)',
              lineHeight: 1.2,
            }}
          >
            {token.slice('--c-gray-'.length)}
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 'var(--fw-normal)',
                opacity: 0.75,
              }}
            >
              {(hex ?? '').replace('#', '')}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// A hue is one row: the wash carrying its own ink, then the solid, then the ink
// alone — shown doing the job each token exists for rather than as three
// unrelated chips.
function HueRow({ hue, note, hexes }) {
  const wash = `--c-${hue}-wash`
  const solid = `--c-${hue}`
  const ink = `--c-${hue}-ink`
  const cell = {
    borderRadius: 8,
    border: '1px solid var(--c-border)',
    padding: '10px 12px',
    minWidth: 0,
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
        <div
          style={{
            fontSize: 'var(--text-label)',
            fontWeight: 'var(--fw-bold)',
            color: 'var(--c-text)',
            textTransform: 'capitalize',
          }}
        >
          {hue}
        </div>
        <div style={{ ...MONO, color: 'var(--c-gray-600)' }}>{note}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        <div style={{ ...cell, background: `var(${wash})`, color: `var(${ink})` }}>
          <div style={{ ...MONO, fontWeight: 'var(--fw-bold)' }}>-wash</div>
          <div style={{ ...MONO, opacity: 0.8 }}>{hexes[wash]}</div>
        </div>
        <div
          style={{
            ...cell,
            background: `var(${solid})`,
            borderColor: `var(${solid})`,
            color: isDark(hexes[solid]) ? '#fff' : 'var(--c-text-dark)',
          }}
        >
          <div style={{ ...MONO, fontWeight: 'var(--fw-bold)' }}>(bare)</div>
          <div style={{ ...MONO, opacity: 0.85 }}>{hexes[solid]}</div>
        </div>
        <div style={{ ...cell, background: `var(${ink})`, color: '#fff' }}>
          <div style={{ ...MONO, fontWeight: 'var(--fw-bold)' }}>-ink</div>
          <div style={{ ...MONO, opacity: 0.85 }}>{hexes[ink]}</div>
        </div>
      </div>
    </div>
  )
}

function Swatch({ token, label, hex }) {
  return (
    <div
      style={{
        border: '1px solid var(--c-border)',
        borderRadius: 10,
        overflow: 'hidden',
        background: '#fff',
      }}
    >
      <div style={{ height: 40, background: `var(${token})` }} />
      <div style={{ padding: '7px 9px' }}>
        <div style={{ ...MONO, fontWeight: 'var(--fw-bold)', color: 'var(--c-text)' }}>{token}</div>
        <div style={{ ...MONO, color: 'var(--c-gray-600)', textTransform: 'uppercase' }}>
          {hex || ' '}
        </div>
        {label && (
          <div
            style={{
              fontSize: 'var(--text-micro)',
              color: 'var(--c-gray-600)',
              marginTop: 2,
              lineHeight: 1.3,
            }}
          >
            {label}
          </div>
        )}
      </div>
    </div>
  )
}

function SwatchGrid({ items, hexes, min = 170 }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`,
        gap: 10,
      }}
    >
      {items.map(([token, label]) => (
        <Swatch key={token} token={token} label={label} hex={hexes[token]} />
      ))}
    </div>
  )
}

function ColorSwatches() {
  const hexes = useTokenValues(COLOR_TOKENS)

  return (
    <>
      <Variant label="Grays — the only neutral ramp">
        <GrayRamp hexes={hexes} />
      </Variant>

      <Variant label="Action blue — the app's primary">
        <SwatchGrid items={ACTION} hexes={hexes} min={190} />
      </Variant>

      <Variant label="Hues — a wash, a solid, an ink">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {HUES.map(([hue, note]) => (
            <HueRow key={hue} hue={hue} note={note} hexes={hexes} />
          ))}
        </div>
      </Variant>

      <Variant label="Ink — the three text roles">
        <SwatchGrid items={INK} hexes={hexes} min={190} />
      </Variant>

      <Variant label="Roles — prefer these in new code">
        <SwatchGrid items={ROLES} hexes={hexes} min={190} />
      </Variant>
    </>
  )
}

const META = {
  fontSize: 'var(--text-micro)',
  color: 'var(--c-gray-500)',
  fontFamily: 'var(--font-mono)',
}

/* The real ladder, named for the role the app renders each size in. */
const TYPE_SCALE = [
  ['--text-title', 'page title — h1'],
  ['--text-head', 'section head — h2 / subhead'],
  ['--text-subhead', 'card head — h3'],
  ['--text-modal', 'modal title'],
  ['--text-nav', 'sidebar nav row'],
  ['--text-body', 'body — p / h4, and a default select'],
  ['--text-cell', 'table cell — td, and an sm control'],
  ['--text-label', 'label, th, button, caption'],
  ['--text-tag', 'tag / pill'],
  ['--text-micro', 'micro — the floor for text'],
]

/* Kept only so the gallery shows what they still resolve to. */
const LEGACY_SCALE = [
  '--text-2xs',
  '--text-xs',
  '--text-sm',
  '--text-base',
  '--text-md',
  '--text-lg',
  '--text-xl',
  '--text-2xl',
  '--text-3xl',
]
const FAMILIES = [
  [
    '--font-sans',
    'Museo Sans Rounded — Beanstack\u2019s real typeface',
    { fontFamily: 'var(--font-sans)', fontSize: 'var(--text-head)', fontWeight: 'var(--fw-bold)' },
  ],
  [
    '--font-mono',
    'const minutesRead = 1_204 // monospace for code + data',
    { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)' },
  ],
]

const WEIGHTS = [
  ['--fw-normal', 'Normal'],
  ['--fw-medium', 'Medium'],
  ['--fw-semibold', 'Semibold'],
  ['--fw-bold', 'Bold'],
  ['--fw-extrabold', 'Extrabold'],
  ['--fw-black', 'Black'],
]
const RADII = [
  '--radius-xs',
  '--radius-sm',
  '--radius-md',
  '--radius-lg',
  '--radius-xl',
  '--radius-2xl',
  '--radius-pill',
  '--radius-full',
]

function useTokenValues(names) {
  const [vals, setVals] = useState({})
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement)
    setVals(Object.fromEntries(names.map((n) => [n, cs.getPropertyValue(n).trim()])))
    // names is a stable module-level array per caller
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return vals
}

function Typography() {
  const vals = useTokenValues([
    ...TYPE_SCALE.map((t) => t[0]),
    ...LEGACY_SCALE,
    ...WEIGHTS.map((w) => w[0]),
  ])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Same shape as Type scale below: token above, specimen on its own line,
          a hairline between entries — so the two cards read as one system. */}
      <Variant label="Font families">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {FAMILIES.map(([token, sample, style], i) => (
            <div
              key={token}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                paddingTop: i === 0 ? 0 : 14,
                marginTop: i === 0 ? 0 : 14,
                borderTop: i === 0 ? 'none' : '1px solid var(--c-gray-200)',
              }}
            >
              <code style={META}>{token}</code>
              <span style={{ color: 'var(--c-gray-900)', lineHeight: 1.15, ...style }}>
                {sample}
              </span>
            </div>
          ))}
        </div>
      </Variant>

      {/* Stacked, not a four-column row: the top rungs are 24-30px, and on one
          line beside their metadata the specimen wrapped mid-phrase, which is
          exactly what you can't judge a size by. Meta above, specimen below on
          a line of its own. */}
      <Variant label="Type scale">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {TYPE_SCALE.map(([t, role], i) => (
            <div
              key={t}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                paddingTop: i === 0 ? 0 : 14,
                marginTop: i === 0 ? 0 : 14,
                borderTop: i === 0 ? 'none' : '1px solid var(--c-gray-200)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <code style={META}>{t}</code>
                <span style={{ ...META, fontWeight: 'var(--fw-bold)', color: 'var(--c-gray-750)' }}>
                  {vals[t]}
                </span>
                <span style={META}>· {role}</span>
              </div>
              <span
                style={{
                  fontSize: `var(${t})`,
                  fontWeight: 'var(--fw-bold)',
                  color: 'var(--c-gray-900)',
                  lineHeight: 1.15,
                }}
              >
                The quick brown fox
              </span>
            </div>
          ))}
        </div>
      </Variant>

      <Variant label="Font weights">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {WEIGHTS.map(([w, label]) => (
            <div key={w} style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <code style={{ ...META, width: 108, flexShrink: 0 }}>{w}</code>
              <span style={{ ...META, width: 36, flexShrink: 0 }}>{vals[w]}</span>
              <span
                style={{
                  fontSize: 'var(--text-body)',
                  fontWeight: `var(${w})`,
                  color: 'var(--c-gray-900)',
                }}
              >
                {label} — Reading Motivation Index
              </span>
            </div>
          ))}
        </div>
      </Variant>
    </div>
  )
}

function Radii() {
  const vals = useTokenValues(RADII)
  return (
    <Variant label="Radius scale">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(116px, 1fr))',
          gap: 16,
        }}
      >
        {RADII.map((t) => (
          <div
            key={t}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
          >
            <div
              style={{
                width: 76,
                height: 76,
                background: 'var(--c-gray-100)',
                border: '2px solid var(--c-teal)',
                borderRadius: `var(${t})`,
              }}
            />
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 'var(--text-micro)',
                  fontWeight: 'var(--fw-bold)',
                  color: 'var(--c-gray-900)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {t}
              </div>
              <div style={META}>{vals[t]}</div>
            </div>
          </div>
        ))}
      </div>
    </Variant>
  )
}

const SHADOWS = ['--shadow-sm', '--shadow-md', '--shadow-lg']
const SPACING = [
  '--space-2',
  '--space-4',
  '--space-6',
  '--space-8',
  '--space-10',
  '--space-12',
  '--space-16',
  '--space-20',
  '--space-24',
  '--space-32',
]

function Shadows() {
  const vals = useTokenValues(SHADOWS)
  return (
    <Variant label="Elevation scale">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 20,
          background: 'var(--c-gray-0)',
          padding: 24,
          borderRadius: 'var(--radius-xl)',
        }}
      >
        {SHADOWS.map((t) => (
          <div key={t} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div
              style={{
                height: 72,
                background: '#fff',
                borderRadius: 'var(--radius-lg)',
                boxShadow: `var(${t})`,
              }}
            />
            <div>
              <div
                style={{
                  fontSize: 'var(--text-micro)',
                  fontWeight: 'var(--fw-bold)',
                  color: 'var(--c-gray-900)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {t}
              </div>
              <div style={{ ...META, fontSize: 'var(--text-micro)' }}>{vals[t]}</div>
            </div>
          </div>
        ))}
      </div>
    </Variant>
  )
}

function Spacing() {
  const vals = useTokenValues(SPACING)
  return (
    <Variant label="Spacing scale">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SPACING.map((t) => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <code style={{ ...META, width: 80, flexShrink: 0 }}>{t}</code>
            <span style={{ ...META, width: 40, flexShrink: 0 }}>{vals[t]}</span>
            <div
              style={{
                height: 16,
                width: `var(${t})`,
                background: 'var(--c-teal)',
                borderRadius: 'var(--radius-xs)',
              }}
            />
          </div>
        ))}
      </div>
    </Variant>
  )
}

const SEMANTIC = [
  {
    label: 'Text',
    rows: [
      ['--c-text', '--c-gray-900'],
      ['--c-text-light', '--c-gray-700'],
      ['--c-gray-600', '--c-gray-500'],
    ],
  },
  {
    label: 'Surfaces',
    rows: [
      ['--c-surface', '#fff'],
      ['--c-bg', '--c-gray-0'],
      ['--c-bg-muted', '--c-gray-100'],
    ],
  },
  {
    label: 'Borders',
    rows: [
      ['--c-border', '--c-gray-200'],
      ['--c-border-strong', '--c-gray-350'],
    ],
  },
  {
    label: 'Intent',
    rows: [
      ['--c-brand', '--c-teal'],
      ['--c-danger', '--c-red'],
      ['--c-warning', '--c-yellow-ink'],
      ['--c-success', '--c-green'],
      ['--c-info', '--c-blue'],
    ],
  },
]
const SEMANTIC_TOKENS = SEMANTIC.flatMap((g) => g.rows.map((r) => r[0]))

function Semantic() {
  const vals = useTokenValues(SEMANTIC_TOKENS)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {SEMANTIC.map((g) => (
        <Variant key={g.label} label={g.label}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {g.rows.map(([alias, maps]) => (
              <div key={alias} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    flexShrink: 0,
                    borderRadius: 'var(--radius-sm)',
                    background: `var(${alias})`,
                    border: '1px solid var(--c-border)',
                  }}
                />
                <code style={{ ...META, width: 150, flexShrink: 0, color: 'var(--c-text)' }}>
                  {alias}
                </code>
                <span style={META}>→ {maps.startsWith('--') ? `var(${maps})` : maps}</span>
                <span style={{ ...META, marginLeft: 'auto' }}>{vals[alias]}</span>
              </div>
            ))}
          </div>
        </Variant>
      ))}
    </div>
  )
}

export const foundationsSections = [
  {
    group: 'foundations',
    id: 'color',
    name: 'Color',
    desc: (
      <>
        The shared color palette, defined as <code>:root</code> custom properties in{' '}
        <code>components/ui/tokens.css</code> and imported once per entry <code>main.jsx</code> so
        the tokens are available on every page. In CSS use <code>var(--c-…)</code> rather than a hex
        — change a token once and it updates everywhere.
        <br />
        <br />
        Every value is the product's, lifted from bs-product's <code>lib/_colors.scss</code>, and
        every hex on this page is read back out of the live <code>:root</code> vars, so the gallery
        can&apos;t drift from the tokens. The set is deliberately small: one gray ramp, one action
        blue, and <strong>three tokens per hue</strong> — a <code>-wash</code> to fill with, the
        bare name to draw with, and an <code>-ink</code> to set type in. The app defines far more
        (full 0–1000 ramps for all eight hues); the rungs between these were either unused or too
        close to tell apart, and a token you can&apos;t distinguish from its neighbour is a token
        people guess at.
        <br />
        <br />
        The Tailwind slate / amber / violet scales the prototypes started on are gone — every call
        site now points at the real palette.
      </>
    ),
    render: () => <ColorSwatches />,
  },
  {
    group: 'foundations',
    id: 'typography',
    name: 'Typography',
    desc: (
      <>
        The type system: <strong>Museo Sans Rounded</strong> (<code>--font-sans</code>) for
        everything, a monospace stack (<code>--font-mono</code>) for code and data, plus the size
        scale (<code>--text-*</code>) and the weight set (<code>--fw-*</code>).
        <br />
        <br />
        The scale is the sizes the shipped app actually renders, named for the role it renders them
        in. Counted across bs-product&apos;s stylesheets its whole text scale is{' '}
        <strong>14 · 16 · 15 · 13 · 18 · 12 · 22 · 20 · 24 · 30</strong> — with 14px the most common
        by a wide margin, and effectively no fractional sizes at all. Anything between those rungs
        is drift: pick a rung rather than splitting the difference. Above 30 is the display tier —
        figures drawn to fit a graphic (a donut&apos;s centre, a stat numeral), sized to the art
        rather than to a rung. Museo is Beanstack's real typeface, served from the Adobe Fonts kit{' '}
        <code>kus1pku</code> — the same six weights the product's own kit carries, plus real
        italics; Nunito sits behind it as a fallback. The kit ships{' '}
        <strong>100 / 300 / 500 / 700 / 800 / 900</strong> — no 400 and no 600 — so a requested 400
        renders as 500 and a 600 renders as 700; prefer the weights the kit actually has. Font
        families are tokenized at every call site; the size / weight tokens are the standard to
        adopt going forward.
      </>
    ),
    render: () => <Typography />,
  },
  {
    group: 'foundations',
    id: 'radius',
    name: 'Radius',
    desc: (
      <>
        Corner-radius scale (<code>--radius-*</code>) — from <code>xs</code> (4px) through{' '}
        <code>2xl</code> (14px), plus <code>pill</code> (999px) and <code>full</code> (50%, for
        circles). The values that recur across cards, buttons, inputs and chips.
      </>
    ),
    render: () => <Radii />,
  },
  {
    group: 'foundations',
    id: 'elevation',
    name: 'Elevation',
    desc: (
      <>
        Box-shadow elevation scale (<code>--shadow-sm</code> / <code>--shadow-md</code> /{' '}
        <code>--shadow-lg</code>) — a hairline lift, raised cards and popovers, and modal overlays.
        Accent focus-rings are separate and derive from the color tokens.
      </>
    ),
    render: () => <Shadows />,
  },
  {
    group: 'foundations',
    id: 'spacing',
    name: 'Spacing',
    desc: (
      <>
        The spacing steps (<code>--space-*</code>, named by px) that recur in padding, gap and
        margin. The documented rhythm to adopt going forward — raw px values still appear at call
        sites.
      </>
    ),
    render: () => <Spacing />,
  },
  {
    group: 'foundations',
    id: 'semantic',
    name: 'Semantic',
    desc: (
      <>
        Role aliases mapped onto the color primitives — <code>--c-text</code>,{' '}
        <code>--c-surface</code>, <code>--c-border</code>, intent colors (<code>--c-danger</code> /{' '}
        <code>--c-warning</code> / <code>--c-success</code> / <code>--c-info</code>) and{' '}
        <code>--c-brand</code>. Prefer these in new code — the indirection lets a role restyle in
        one place. Text + border roles are adopted across CSS; surfaces / intent are the documented
        standard to adopt incrementally.
      </>
    ),
    render: () => <Semantic />,
  },
]
