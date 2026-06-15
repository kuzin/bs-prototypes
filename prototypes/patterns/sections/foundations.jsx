import { useEffect, useState } from 'react'
import '@components/ui/tokens.css'

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {TOKEN_GROUPS.map((g) => (
        <div key={g.label}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--c-slate-500)',
              marginBottom: 10,
            }}
          >
            {g.label}
          </div>
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
                      fontSize: 12,
                      fontWeight: 700,
                      color: 'var(--c-slate-800)',
                      fontFamily: 'monospace',
                    }}
                  >
                    {t}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
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
        </div>
      ))}
    </div>
  )
}

const SECTION_LABEL = {
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--c-slate-500)',
  marginBottom: 10,
}
const META = { fontSize: 11, color: 'var(--c-slate-400)', fontFamily: 'var(--font-mono)' }

const TYPE_SCALE = [
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
  const vals = useTokenValues([...TYPE_SCALE, ...WEIGHTS.map((w) => w[0])])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <div style={SECTION_LABEL}>Font families</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 22,
                fontWeight: 'var(--fw-bold)',
                color: 'var(--c-slate-900)',
              }}
            >
              Nunito — the joyful sans for every prototype
            </div>
            <code style={META}>--font-sans</code>
          </div>
          <div>
            <div
              style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--c-slate-800)' }}
            >
              const minutesRead = 1_204 // monospace for code + data
            </div>
            <code style={META}>--font-mono</code>
          </div>
        </div>
      </div>

      <div>
        <div style={SECTION_LABEL}>Type scale</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TYPE_SCALE.map((t) => (
            <div key={t} style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
              <code style={{ ...META, width: 86, flexShrink: 0 }}>{t}</code>
              <span style={{ ...META, width: 44, flexShrink: 0 }}>{vals[t]}</span>
              <span
                style={{
                  fontSize: `var(${t})`,
                  fontWeight: 'var(--fw-bold)',
                  color: 'var(--c-slate-900)',
                }}
              >
                The quick brown fox
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={SECTION_LABEL}>Font weights</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {WEIGHTS.map(([w, label]) => (
            <div key={w} style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
              <code style={{ ...META, width: 108, flexShrink: 0 }}>{w}</code>
              <span style={{ ...META, width: 36, flexShrink: 0 }}>{vals[w]}</span>
              <span style={{ fontSize: 16, fontWeight: `var(${w})`, color: 'var(--c-slate-900)' }}>
                {label} — Reading Motivation Index
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Radii() {
  const vals = useTokenValues(RADII)
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(116px, 1fr))',
        gap: 14,
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
                fontSize: 11,
                fontWeight: 700,
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
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--c-slate-800)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {t}
            </div>
            <div style={{ ...META, fontSize: 10 }}>{vals[t]}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Spacing() {
  const vals = useTokenValues(SPACING)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {SPACING.map((t) => (
        <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {SEMANTIC.map((g) => (
        <div key={g.label}>
          <div style={SECTION_LABEL}>{g.label}</div>
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
        </div>
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
        The type system: <strong>Nunito</strong> (<code>--font-sans</code>) for everything, a
        monospace stack (<code>--font-mono</code>) for code and data, plus the size scale (
        <code>--text-*</code>, 13px body default) and the weight set (<code>--fw-*</code>). Font
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
