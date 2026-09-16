/**
 * The mobile app's image registry, as a browsable gallery.
 *
 * This is the whole icon system: the app has no icon font and only 13 SVGs, so 314 raster PNGs
 * addressed by string key ARE the iconography. The gallery exists so a key can be found by
 * looking rather than by grepping the RN source — and because "does an asset for this already
 * exist?" is the first question when building a new screen.
 */
import { useMemo, useState } from 'react'
import { Img } from '@mobile/components'
import { IMAGES, IMAGE_NAMES, BENNY_REACTIONS } from '@mobile/images.generated'
import './mobile-icons.css'

/** Assets whose filename sits in a subfolder are grouped by it; the rest are the loose root set. */
function groupOf(name) {
  const url = IMAGES[name] || ''
  const rel = url.split('/mobile/images/')[1] || ''
  return rel.includes('/') ? rel.split('/')[0] : 'root'
}

function Gallery() {
  const [q, setQ] = useState('')
  const [tint, setTint] = useState(false)

  const groups = useMemo(() => {
    const query = q.trim().toLowerCase()
    const hits = IMAGE_NAMES.filter((n) => !query || n.toLowerCase().includes(query))
    const by = new Map()
    for (const name of hits) {
      const g = groupOf(name)
      if (!by.has(g)) by.set(g, [])
      by.get(g).push(name)
    }
    // `root` first — it is the loose set most screens reach for — then the folders alphabetically.
    return [...by.entries()].sort(([a], [b]) =>
      a === 'root' ? -1 : b === 'root' ? 1 : a.localeCompare(b),
    )
  }, [q])

  const shown = groups.reduce((n, [, items]) => n + items.length, 0)

  return (
    <div className="mi">
      <div className="mi-bar">
        <input
          className="mi-search"
          type="search"
          value={q}
          placeholder={`Filter ${IMAGE_NAMES.length} assets by key…`}
          onChange={(e) => setQ(e.target.value)}
        />
        <label className="mi-toggle">
          <input type="checkbox" checked={tint} onChange={(e) => setTint(e.target.checked)} />
          Tint (mask mode)
        </label>
        <span className="mi-count">{shown} shown</span>
      </div>

      {tint && (
        <p className="mi-note">
          Tinting renders the asset as a <code>mask-image</code> over a solid fill — the only way
          CSS can reproduce <code>tintColor</code>. It is correct only for a monochrome
          asset-with-alpha, so a full-colour one turns into a flat silhouette. That is why{' '}
          <code>tint</code> is opt-in per call site, exactly as it is in the app.
        </p>
      )}

      {groups.map(([group, items]) => (
        <section key={group} className="mi-group">
          <h4 className="mi-group-title">
            {group} <span>{items.length}</span>
          </h4>
          <div className="mi-grid">
            {items.map((name) => (
              <figure key={name} className="mi-cell" title={name}>
                <span className="mi-thumb">
                  <Img
                    name={name}
                    size={40}
                    tint={tint ? 'var(--c-gray-900)' : undefined}
                    alt={name}
                  />
                </span>
                <figcaption>{name}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}

      {shown === 0 && <p className="mi-note">No asset key contains “{q}”.</p>}
    </div>
  )
}

export const mobileIconSections = [
  {
    group: 'm-iconography',
    id: 'm-img',
    name: 'Img',
    desc: (
      <>
        An asset from the app’s registry, addressed by the same string key the app uses —{' '}
        <code>&lt;Img name="settings_gear_icon" /&gt;</code> is the web spelling of{' '}
        <code>
          &lt;Image source={'{'}images.settings_gear_icon{'}'} /&gt;
        </code>
        . Pass <code>tint</code> to reproduce <code>tintColor</code> on a monochrome asset.
      </>
    ),
    usage: `import { Img } from '@mobile/components'

<Img name="settings_gear_icon" size={24} />
<Img name="plus_icon" size={20} tint="var(--m-accent)" />   // tintColor`,
    render: () => (
      <div className="mi mi-inline">
        <div className="mi-grid">
          {['settings_gear_icon', 'back_arrow_icon', 'plus_icon', 'squiggle', 'streak_fire']
            .filter((n) => IMAGES[n])
            .map((name) => (
              <figure key={name} className="mi-cell" title={name}>
                <span className="mi-thumb">
                  <Img name={name} size={40} alt={name} />
                </span>
                <figcaption>{name}</figcaption>
              </figure>
            ))}
        </div>
      </div>
    ),
  },
  {
    group: 'm-iconography',
    id: 'm-image-registry',
    name: 'Image registry',
    desc: (
      <>
        All <strong>{IMAGE_NAMES.length}</strong> assets, mirrored from{' '}
        <code>src/assets/themes/images.ts</code> by <code>pnpm mobile:images</code>. The app has no
        icon font and only 13 SVGs, so this registry <em>is</em> the icon system — check here before
        drawing anything new.
      </>
    ),
    usage: `pnpm mobile:images          # re-sync from a mobile checkout
pnpm mobile:images --check  # fail if the committed copy is stale`,
    render: () => <Gallery />,
  },
  {
    group: 'm-iconography',
    id: 'm-benny-reactions',
    name: 'Benny reactions',
    desc: (
      <>
        Benny’s five moods, from <code>assets/themes/bennyReactions.ts</code> — a <em>second</em>{' '}
        registry in the app, declared with ESM <code>import</code> rather than{' '}
        <code>require()</code>, which is why a parser written for the main one drops it.
      </>
    ),
    usage: `import { BENNY_REACTIONS } from '@mobile/components'

<img src={BENNY_REACTIONS.thinking} alt="" />`,
    render: () => (
      <div className="mi mi-inline">
        <div className="mi-grid">
          {Object.keys(BENNY_REACTIONS).map((mood) => (
            <figure key={mood} className="mi-cell" title={mood}>
              <span className="mi-thumb mi-thumb-lg">
                <Img name={mood} size={64} alt={mood} />
              </span>
              <figcaption>{mood}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    ),
  },
]
