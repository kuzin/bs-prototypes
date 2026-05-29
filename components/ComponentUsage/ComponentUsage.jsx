import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Modal } from '@components/Modal/Modal'
import '@components/Modal/Modal.css'
import './ComponentUsage.css'

// Lazy raw-source loaders for every prototype + shared component file.
// eager:false → each raw module is its own chunk, loaded only when the
// inspector is opened, so this adds nothing to the normal page bundle.
const PROTO_RAW = import.meta.glob('/prototypes/**/*.{jsx,js}', {
  query: '?raw',
  import: 'default',
})

// Pretty names for the prototype folder ids.
const PROTO_NAMES = {
  'student-profile': 'Student Profile',
  ris: 'RIS: School',
  'ris-district': 'RIS: District',
  sfr: 'Sessions for Review',
  'admin-dashboard': 'Admin Dashboard',
  rostering: 'Rostering: School',
  'rostering-district': 'Rostering: District',
  insights: 'Insights',
  'web-app': 'Web App',
  footers: 'Footers',
  patterns: 'Pattern Library',
}

// Parse raw source → { proto: { shared: {name: count}, local: Set<name> } }
function analyze(sources) {
  const byProto = {}
  for (const [path, src] of Object.entries(sources)) {
    const m = path.match(/^\/prototypes\/([^/]+)\//)
    if (!m) continue
    const proto = m[1]
    if (proto === 'patterns') continue // the catalog imports everything; not a real consumer
    const p = (byProto[proto] ||= { shared: {}, local: new Set() })

    // Shared design-system imports: from '@components/<Name>/...'
    for (const im of src.matchAll(/from\s+['"]@components\/([^'"]+)['"]/g)) {
      const name = im[1].split('/')[0]
      if (name.endsWith('.css')) continue
      p.shared[name] = (p.shared[name] || 0) + 1
    }
    // Local component imports: relative paths whose basename is Capitalized
    // (i.e. a component file, not a util/data/css module).
    for (const im of src.matchAll(/from\s+['"](\.[^'"]+)['"]/g)) {
      const rel = im[1]
      if (/\.css$/.test(rel)) continue
      const base = rel
        .split('/')
        .pop()
        .replace(/\.(jsx|js)$/, '')
      // Capitalized basename = a component file; skip the prototype's own root App.
      if (/^[A-Z]/.test(base) && base !== 'App') p.local.add(base)
    }
  }
  return byProto
}

export function ComponentUsage({ onClose }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load + analyze on mount.
  useEffect(() => {
    let alive = true
    Promise.all(Object.entries(PROTO_RAW).map(async ([path, load]) => [path, await load()])).then(
      (entries) => {
        if (!alive) return
        setData(analyze(Object.fromEntries(entries)))
        setLoading(false)
      },
    )
    return () => {
      alive = false
    }
  }, [])

  const protos = data ? Object.keys(data).sort((a, b) => a.localeCompare(b)) : []

  // Tally how many prototypes use each shared component (popularity).
  const sharedTotals = {}
  if (data) {
    for (const p of Object.values(data)) {
      for (const name of Object.keys(p.shared)) sharedTotals[name] = (sharedTotals[name] || 0) + 1
    }
  }

  return createPortal(
    <Modal open onClose={onClose} variant="center" ariaLabel="Component usage">
      {({ close }) => (
        <div className="cu">
          <div className="cu-head">
            <div className="cu-title">Component usage</div>
            <button type="button" className="cu-close" onClick={close} aria-label="Close">
              <svg
                viewBox="0 0 20 20"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>
          </div>

          {loading && <div className="cu-loading">Scanning prototype sources…</div>}

          {!loading && (
            <div className="cu-body">
              {protos.map((id) => {
                const p = data[id]
                const shared = Object.entries(p.shared).sort((a, b) => b[1] - a[1])
                const local = [...p.local].sort((a, b) => a.localeCompare(b))
                return (
                  <div key={id} className="cu-proto">
                    <div className="cu-proto-name">{PROTO_NAMES[id] || id}</div>
                    <div className="cu-row">
                      <div className="cu-row-label">
                        Shared <span className="cu-count">{shared.length}</span>
                      </div>
                      <div className="cu-chips">
                        {shared.length === 0 && <span className="cu-empty">none</span>}
                        {shared.map(([name, n]) => (
                          <span key={name} className="cu-chip cu-chip--shared">
                            {name}
                            {n > 1 && <em>×{n}</em>}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="cu-row">
                      <div className="cu-row-label">
                        Local <span className="cu-count">{local.length}</span>
                      </div>
                      <div className="cu-chips">
                        {local.length === 0 && <span className="cu-empty">none</span>}
                        {local.map((name) => (
                          <span
                            key={name}
                            className="cu-chip cu-chip--local"
                            title="Prototype-local — candidate to promote to @components"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {!loading && Object.keys(sharedTotals).length > 0 && (
            <div className="cu-foot">
              <div className="cu-row-label">Most-shared</div>
              <div className="cu-chips">
                {Object.entries(sharedTotals)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 12)
                  .map(([name, n]) => (
                    <span key={name} className="cu-chip cu-chip--shared">
                      {name}
                      <em>{n} protos</em>
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>,
    document.body,
  )
}
