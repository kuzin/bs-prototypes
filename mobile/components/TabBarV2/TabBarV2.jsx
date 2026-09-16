import './TabBarV2.css'

/**
 * A PROPOSAL, not a port. The shipped `TabBar` stays exactly as it is — this sits beside it behind
 * a stage toggle so the two can be compared on the same screen, and so the handoff can show "here
 * is what ships, here is what we are asking for".
 *
 * What changes:
 *
 *   1. **Vector icons instead of the active/inactive PNG pairs.** The app ships two rasters per
 *      tab (`Home_Active.png` / `Home_Inactive.png`) and swaps the asset. One vector per tab means
 *      one asset, any size, any colour — and it is what lets the active state tint the icon at all.
 *      They are SOLID in both states; only the colour changes.
 *   2. **A rounded active state** — a tinted pill behind the icon. The colours are NOT invented:
 *      they are the app's own `activeTab` PressableButton pair, `lightness(accent, 90)` ground with
 *      `darken(accent, 0.3)` ink, so the proposal reuses a state the design system already defines.
 *   3. **The plus sits INSIDE the bar.** Today it is a 56pt circle lifted 10pt clear of it, which
 *      is why the bar needs a spacer slot and why the button overlaps the content above. Here it is
 *      a 44pt circle, vertically centred, so the bar is a single unbroken surface.
 *   4. **No labels.** With a solid icon and a tinted pill behind it, the word underneath was doing
 *      no work the two were not already doing, and dropping it lets the tap target grow. Each tab
 *      keeps its `aria-label`, so nothing is lost to a screen reader.
 *   5. **A dot rather than a count** on notified tabs — the number never said much, and a dot
 *      leaves the pill uncluttered.
 *
 * `variant="floating"` is the third option in the toggle: the bar leaves the screen edge entirely,
 * inset 16 either side, sitting on the safe-area boundary at a rounded-rectangle radius with a real
 * shadow. Content then scrolls UNDERNEATH it rather than stopping above it — that is the trade, and
 * why `.has-floating-bar` makes every scroller pay the clearance back.
 */

/**
 * ONE path per tab, SOLID, drawn identically in both states — the active tab differs only in
 * colour. That reconciles two notes: the filled drawings read better, and the silhouette must not
 * change on tap.
 *
 * (A first pass had a stroked outline for inactive and a solid for active, and the home icon was
 * visibly a different drawing between them — an outlined house with a doorway against a solid one
 * without. The pill is already signalling active; the icon does not need to.)
 */
const ICONS = {
  home: {
    d: 'M12 3.1 2.6 11.2a1 1 0 0 0 1.3 1.5l.6-.5v7.2a1.4 1.4 0 0 0 1.4 1.4h4V15.4h4.2v5.4h4a1.4 1.4 0 0 0 1.4-1.4v-7.2l.6.5a1 1 0 0 0 1.3-1.5L12 3.1Z',
  },
  log: {
    // An open book: two page shapes in one path, separated by a 1.6-unit gap that reads as the
    // spine. Kept as subpaths rather than two <path>s so the icon stays a single fill.
    d: 'M11.2 6.7C9.6 5.4 7.4 4.7 4.8 4.7A1.3 1.3 0 0 0 3.5 6v10.8a1.3 1.3 0 0 0 1.3 1.3c2.4 0 4.4.6 5.8 1.6a.9.9 0 0 0 .6.2V6.7Zm1.6 0c1.6-1.3 3.8-2 6.4-2A1.3 1.3 0 0 1 20.5 6v10.8a1.3 1.3 0 0 1-1.3 1.3c-2.4 0-4.4.6-5.8 1.6a.9.9 0 0 1-.6.2V6.7Z',
  },
  discover: {
    // The needle is knocked out of the disc with evenodd, so the icon stays one solid shape.
    d: 'M12 2.6a9.4 9.4 0 1 0 0 18.8 9.4 9.4 0 0 0 0-18.8Zm3.9 5.1-2.1 5.5a1 1 0 0 1-.6.6l-5.5 2.1a.5.5 0 0 1-.6-.6l2.1-5.5a1 1 0 0 1 .6-.6l5.5-2.1a.5.5 0 0 1 .6.6ZM12 10.8a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z',
    rule: 'evenodd',
  },
  community: {
    d: 'M9.1 11.6a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8Zm0 1.5c-3.7 0-6.6 2-6.6 5.1a1.3 1.3 0 0 0 1.3 1.3h10.6a1.3 1.3 0 0 0 1.3-1.3c0-3.1-2.9-5.1-6.6-5.1ZM16.6 11a2.9 2.9 0 1 0 0-5.8 2.9 2.9 0 0 0 0 5.8Zm1.2 1.8a7 7 0 0 1 2.3 1.5 5.6 5.6 0 0 1 1.4 3.9 1.3 1.3 0 0 1-1.3 1.3h-2.4c.1-.4.1-.8.1-1.2 0-2.1-.8-3.9-2.1-5.2a9.9 9.9 0 0 1 2-.3Z',
  },
}

function TabIcon({ name }) {
  const icon = ICONS[name]
  if (!icon) return null
  return (
    <svg className="m-tb2-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path d={icon.d} fill="currentColor" fillRule={icon.rule ?? 'nonzero'} />
    </svg>
  )
}

export function TabBarV2({
  tabs,
  active,
  onChange,
  onPlus,
  plusOpen = false,
  variant = 'attached',
}) {
  // The plus is the middle ITEM, not an overlay — so the tabs split either side of it. It has to
  // be a SIBLING of the two groups rather than living inside one: nested in the first group, that
  // group's content is wider and the button lands right of centre.
  const half = Math.ceil(tabs.length / 2)
  const groups = [tabs.slice(0, half), tabs.slice(half)]

  const renderGroup = (group, gi) => (
    <div className="m-tb2-group" key={gi}>
      {group.map((t) => {
        const isActive = t.id === active
        return (
          <button
            key={t.id}
            type="button"
            className={`m-tb2-tab${isActive ? ' is-active' : ''}`}
            onClick={() => onChange?.(t.id)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`${t.label} tab`}
          >
            <span className="m-tb2-pill">
              <TabIcon name={t.id} />
              {t.badge ? (
                <span
                  className={`m-tb2-badge${t.badge === true ? ' is-dot' : ''}`}
                  aria-hidden="true"
                >
                  {t.badge === true ? '' : t.badge}
                </span>
              ) : null}
            </span>
          </button>
        )
      })}
    </div>
  )

  return (
    <nav className={`m-tb2 m-tb2--${variant}`} aria-label="Main">
      {renderGroup(groups[0], 0)}

      <button
        type="button"
        className={`m-tb2-plus${plusOpen ? ' is-open' : ''}`}
        onClick={() => onPlus?.(!plusOpen)}
        aria-label="Log reading"
        aria-expanded={plusOpen}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
          <path
            d="M11 4v14M4 11h14"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {renderGroup(groups[1], 1)}
    </nav>
  )
}
