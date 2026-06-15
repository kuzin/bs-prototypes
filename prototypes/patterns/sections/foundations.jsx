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
]
