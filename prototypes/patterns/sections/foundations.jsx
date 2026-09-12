import { useEffect, useState } from 'react'
import '@components/ui/tokens.css'
import { Variant } from './_shared'

// Token groups mirror components/ui/tokens.css. The hex values are NOT duplicated
// here — they're read from the live :root vars so this gallery can never drift
// from the source of truth.
const TOKEN_GROUPS = [
  {
    label: 'Neutrals — Tailwind slate',
    tokens: [
      '--c-slate-50',
      '--c-slate-100',
      '--c-slate-200',
      '--c-slate-300',
      '--c-slate-400',
      '--c-slate-500',
      '--c-slate-600',
      '--c-slate-700',
      '--c-slate-800',
      '--c-slate-900',
      '--c-gray-200',
    ],
  },
  {
    label: 'Accent / status',
    tokens: ['--c-red-600', '--c-amber-600', '--c-blue-700', '--c-violet-600'],
  },
  {
    label: 'Brand — Beanstack',
    tokens: ['--c-brand-teal', '--c-brand-green', '--c-brand-coral'],
  },
]

const ALL_TOKENS = TOKEN_GROUPS.flatMap((g) => g.tokens)

function ColorSwatches() {
  const [hexes, setHexes] = useState({})
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement)
    setHexes(Object.fromEntries(ALL_TOKENS.map((t) => [t, cs.getPropertyValue(t).trim()])))
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {TOKEN_GROUPS.map((g) => (
        <Variant key={g.label} label={g.label}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 10,
            }}
          >
            {g.tokens.map((t) => (
              <div
                key={t}
                style={{
                  border: '1px solid var(--c-slate-200)',
                  borderRadius: 10,
                  overflow: 'hidden',
                  background: '#fff',
                }}
              >
                <div style={{ height: 56, background: `var(${t})` }} />
                <div style={{ padding: '8px 10px' }}>
                  <div
                    style={{
                      fontSize: 'var(--text-micro)',
                      fontWeight: 'var(--fw-bold)',
                      color: 'var(--c-slate-800)',
                      fontFamily: 'monospace',
                    }}
                  >
                    {t}
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--text-micro)',
                      color: 'var(--c-slate-500)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {hexes[t] || ' '}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Variant>
      ))}
    </div>
  )
}

const META = {
  fontSize: 'var(--text-micro)',
  color: 'var(--c-slate-400)',
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
              <span style={{ color: 'var(--c-slate-900)', lineHeight: 1.15, ...style }}>
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
                <span
                  style={{ ...META, fontWeight: 'var(--fw-bold)', color: 'var(--c-slate-600)' }}
                >
                  {vals[t]}
                </span>
                <span style={META}>· {role}</span>
              </div>
              <span
                style={{
                  fontSize: `var(${t})`,
                  fontWeight: 'var(--fw-bold)',
                  color: 'var(--c-slate-900)',
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
                  color: 'var(--c-slate-900)',
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
                background: 'var(--c-slate-100)',
                border: '2px solid var(--c-brand-teal)',
                borderRadius: `var(${t})`,
              }}
            />
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 'var(--text-micro)',
                  fontWeight: 'var(--fw-bold)',
                  color: 'var(--c-slate-800)',
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
          background: 'var(--c-slate-50)',
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
                  color: 'var(--c-slate-800)',
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
                background: 'var(--c-brand-teal)',
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
      ['--c-text', '--c-slate-900'],
      ['--c-text-muted', '--c-slate-500'],
      ['--c-text-subtle', '--c-slate-400'],
    ],
  },
  {
    label: 'Surfaces',
    rows: [
      ['--c-surface', '#fff'],
      ['--c-bg', '--c-slate-50'],
      ['--c-bg-muted', '--c-slate-100'],
    ],
  },
  {
    label: 'Borders',
    rows: [
      ['--c-border', '--c-slate-200'],
      ['--c-border-strong', '--c-slate-300'],
    ],
  },
  {
    label: 'Intent',
    rows: [
      ['--c-brand', '--c-brand-teal'],
      ['--c-danger', '--c-red-600'],
      ['--c-warning', '--c-amber-600'],
      ['--c-success', '--c-brand-green'],
      ['--c-info', '--c-blue-700'],
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
        the tokens are available on every page. Neutrals are the Tailwind <strong>slate</strong>{' '}
        scale; accents and Beanstack brand colors round it out. In CSS, use <code>var(--c-…)</code>{' '}
        instead of hardcoding hex — change a token once and it updates everywhere.
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
