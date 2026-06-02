import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Ic } from '@components/ui'
import { Icon } from '@components/Icon/Icon'
import {
  getBackground,
  bannerImage,
  fontStack,
  loadFont,
  badgeImage,
  themeBadges,
  getBannerTheme,
  BADGE_COLORS,
} from './data'

// Sample badges use icons that have generated medallion art.
const SAMPLE = ['ti-book-2', 'ti-flame', 'ti-star', 'ti-medal', 'ti-trophy', 'ti-gift'].map(
  (icon, i) => ({ icon, color: BADGE_COLORS[i % BADGE_COLORS.length] }),
)

// ── Color helpers: pick a readable text color for a given background ──────────
function hexToRgb(hex) {
  const h = String(hex || '').replace('#', '')
  const n =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h
  if (n.length !== 6) return null
  const int = parseInt(n, 16)
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255]
}
function mixRgb(hex, withHex, ratio) {
  const a = hexToRgb(hex)
  const b = hexToRgb(withHex)
  if (!a || !b) return null
  return a.map((c, i) => Math.round(c * ratio + b[i] * (1 - ratio)))
}
function luminance([r, g, b]) {
  const f = (c) => {
    c /= 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
// Dark text on light backgrounds, white on dark — so a white/pale accent reverses.
function readableOn(rgb) {
  return rgb && luminance(rgb) > 0.6 ? '#0f172a' : '#ffffff'
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function parseDate(s) {
  if (!s) return null
  const [y, m, dd] = String(s).split('-').map(Number)
  if (!y || !m || !dd) return null
  return { y, m, dd }
}
const fmt = (p) => `${MONTHS[p.m - 1]} ${p.dd}, ${p.y}`
function dateRange(start, end) {
  const a = parseDate(start)
  const b = parseDate(end)
  if (a && b) {
    // Same year → show it once: "Jun 1 – Aug 15, 2026".
    if (a.y === b.y) return `${MONTHS[a.m - 1]} ${a.dd} – ${MONTHS[b.m - 1]} ${b.dd}, ${a.y}`
    return `${fmt(a)} – ${fmt(b)}`
  }
  if (a) return `Starts ${fmt(a)}`
  if (b) return `Ends ${fmt(b)}`
  return null
}

/**
 * Stylized, read-only mock of the reader's challenge page. The name + badges
 * render for real; description/tabs are skeleton. When the background is a
 * user-uploaded image, the title is NOT overlaid — it sits below the image.
 */
export function Preview({ challenge }) {
  const d = challenge.details
  const accent = d.accent || '#0DA7BC'
  // Ribbon color defaults to the accent; the ribbon settings can override it.
  const ribbonColor = d.subheader?.color || accent
  // The ribbon background is the color mixed 84% with white; pick readable text.
  const ribbonBg = mixRgb(ribbonColor, '#ffffff', 0.84)
  const ribbonFont = fontStack(d.subheader?.font || d.headerFont)
  const ribbonStyle = ribbonBg
    ? {
        background: `rgb(${ribbonBg.join(',')})`,
        color: readableOn(ribbonBg),
        fontFamily: ribbonFont,
      }
    : { background: `color-mix(in srgb, ${ribbonColor} 84%, #fff)`, fontFamily: ribbonFont }
  // Title color: white by default, or the reader's opt-in override.
  const titleColor = (d.fontColorOverride && d.fontColor) || undefined
  const dateLabel = dateRange(d.start, d.end)
  // Show the full description (HTML) once it has real content.
  const descHtml = (d.description || '').trim()
  const hasDesc = !!descHtml && descHtml.replace(/<[^>]*>/g, '').trim().length > 0
  const uploaded = d.background?.kind === 'upload'
  const uploadSrc = uploaded ? d.background?.src : null
  const uploadLoading = uploaded && d.background?.loading
  const bg = getBackground(d.background?.id)
  const titleFont = fontStack(d.headerFont)
  const title = d.name || 'My Challenge Name'
  const real = challenge.badges || []
  // Default badges follow the selected theme; fall back to the generic set.
  const themeId = d.background?.kind === 'preset' ? getBannerTheme(d.background?.id) : null
  const themed = themeId ? themeBadges(themeId) : []
  const core = real.length ? real : themed.length ? themed : SAMPLE
  // Registration badge leads and the completion badge anchors the set, mirroring
  // how the reader earns them (on join → … → on finish).
  const reg = challenge.registrationBadge?.img ? challenge.registrationBadge : null
  const completion = challenge.completionBadge?.img ? challenge.completionBadge : null
  const badges = [...(reg ? [reg] : []), ...core, ...(completion ? [completion] : [])]

  // Rewards: prizes + (enabled) ticket prizes + (enabled) certificates, flattened
  // to a simple {art, title, sub} list for the reader card.
  const rw = challenge.rewards || {}
  const rewards = [
    ...(rw.items || []).map((x) => ({
      key: x.id,
      img: x.image,
      icon: x.icon || 'gift',
      title: x.title,
      sub: x.subtitle || 'Prize',
    })),
    ...(rw.ticketsEnabled ? rw.ticketRewards || [] : []).map((x) => ({
      key: x.id,
      img: x.image,
      icon: 'ticket',
      title: x.name || x.title,
      sub: x.cost ? `${x.cost} ticket${x.cost === 1 ? '' : 's'} to enter` : 'Raffle prize',
    })),
    ...(rw.certsEnabled ? rw.certificates || [] : []).map((x) => ({
      key: x.id,
      icon: 'certificate',
      title: x.title,
      sub: 'Certificate',
    })),
  ].filter((x) => x.title)

  const bannerRef = useRef(null)
  const titleRef = useRef(null)

  // Clamp a long description and reveal it with a "View more" toggle. Animate
  // between the clamp height and the full height so it grows instead of snapping.
  const DESC_MAX = 150
  const descRef = useRef(null)
  const [descExpanded, setDescExpanded] = useState(false)
  const [descOverflow, setDescOverflow] = useState(false)
  const [descFullH, setDescFullH] = useState(0)

  // Content tabs — only the sections that actually have content.
  const pvTabs = [
    { id: 'badges', label: 'Badges', count: badges.length },
    rewards.length ? { id: 'rewards', label: 'Rewards', count: rewards.length } : null,
  ].filter(Boolean)
  const [pvTab, setPvTab] = useState('badges')
  const activeTab = pvTabs.some((t) => t.id === pvTab) ? pvTab : pvTabs[0]?.id
  useLayoutEffect(() => {
    const el = descRef.current
    if (!el || !hasDesc) {
      setDescOverflow(false)
      return
    }
    // scrollHeight is the full content height even when clamped by max-height.
    const full = el.scrollHeight
    setDescFullH(full)
    setDescOverflow(full > DESC_MAX + 12)
  }, [descHtml, hasDesc])

  useEffect(() => {
    loadFont(d.headerFont)
    if (d.subheader?.font) loadFont(d.subheader.font)
  }, [d.headerFont, d.subheader?.font])

  // Fit the title to the banner, then express the result in cqw (relative to the
  // banner) so it shrinks long titles AND stays identical at any banner size.
  useLayoutEffect(() => {
    const el = titleRef.current
    const bn = bannerRef.current
    if (uploaded || !el || !bn) return
    const fit = () => {
      const wrap = el.parentElement
      const W = bn.clientWidth
      if (!W) return
      const availH = bn.clientHeight - W * 0.06
      // Apply a trial size to BOTH the title and the ribbon/gap var, so the
      // measured height (which includes the ribbon) reflects this title size.
      const apply = (pxVal) => {
        el.style.fontSize = `${pxVal}px`
        bn.style.setProperty('--cc-title-cqw', ((pxVal / W) * 100).toFixed(3))
      }
      // Base size (9.5cqw) × the user's scale (only when title-size is on); the
      // loop still shrinks to fit.
      let px = 0.095 * W * ((d.titleSizeOn && d.headerFontSize) || 1)
      apply(px)
      let guard = 0
      // Shrink only to fit the banner height; words wrap (never break mid-word).
      while (wrap.scrollHeight > availH && px > W * 0.04 && guard < 120) {
        px -= 1
        apply(px)
        guard += 1
      }
      // Finalize the title in cqw so it scales with the banner everywhere.
      el.style.fontSize = `${((px / W) * 100).toFixed(2)}cqw`
    }
    fit()
    const t = setTimeout(fit, 350) // re-fit once the web font loads
    const ro = new ResizeObserver(fit)
    ro.observe(bn)
    return () => {
      clearTimeout(t)
      ro.disconnect()
    }
  }, [
    title,
    titleFont,
    d.headerFontSize,
    d.titleSizeOn,
    uploaded,
    d.subheader?.enabled,
    d.subheader?.text,
  ])

  return (
    <div className="cc-pv">
      <div
        ref={bannerRef}
        className={`cc-pv-banner${uploaded && !uploadSrc && !uploadLoading ? ' is-image' : ''}`}
        style={
          uploaded
            ? uploadSrc && !uploadLoading
              ? {
                  backgroundImage: `url("${uploadSrc}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : undefined
            : {
                backgroundColor: bg.color,
                backgroundImage: `linear-gradient(rgba(15,23,42,0.16), rgba(15,23,42,0.16)), ${bannerImage(d.background?.id)}`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
        }
      >
        {uploaded ? (
          uploadLoading ? (
            <span className="cc-pv-loading" aria-label="Uploading">
              <span className="cc-pv-spinner" />
            </span>
          ) : uploadSrc ? null : (
            <span className="cc-pv-imgicon">
              <Icon name="photo" size={30} />
            </span>
          )
        ) : (
          <div className="cc-pv-headtext">
            <h3 ref={titleRef} style={{ fontFamily: titleFont, color: titleColor }}>
              {title}
            </h3>
            {d.subheader?.enabled && d.subheader?.text && (
              <span className="cc-pv-ribbon" style={ribbonStyle}>
                {d.subheader.text}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="cc-pv-body">
        {d.name ? (
          <h2 className="cc-pv-title">{d.name}</h2>
        ) : (
          <div className="cc-pv-sk cc-pv-sk-block" />
        )}

        {dateLabel && <div className="cc-pv-dates">{dateLabel}</div>}

        {hasDesc ? (
          <>
            <div
              ref={descRef}
              className={`cc-pv-desc${descOverflow ? ' is-collapsible' : ''}${
                !descExpanded && descOverflow ? ' is-clamped' : ''
              }`}
              style={descOverflow ? { maxHeight: descExpanded ? descFullH : DESC_MAX } : undefined}
              {...{ ['dangerouslySetInner' + 'HTML']: { __html: descHtml } }}
            />
            {descOverflow && (
              <button
                type="button"
                className="cc-pv-more"
                style={{ color: accent }}
                onClick={() => setDescExpanded((v) => !v)}
              >
                {descExpanded ? 'View less' : 'View more'}
              </button>
            )}
          </>
        ) : (
          <>
            <div className="cc-pv-sk cc-pv-sk-line" style={{ width: '52%' }} />
            <div className="cc-pv-sk cc-pv-sk-line" style={{ width: '78%' }} />
            <div className="cc-pv-sk cc-pv-sk-line" style={{ width: '38%' }} />
          </>
        )}

        {pvTabs.length > 0 && (
          <>
            <div className="cc-pv-seg" role="tablist">
              {pvTabs.map((t) => {
                const on = activeTab === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    className={`cc-pv-seg-btn${on ? ' is-active' : ''}`}
                    style={on ? { color: accent } : undefined}
                    onClick={() => setPvTab(t.id)}
                  >
                    {t.label}
                    <span className="cc-pv-seg-count">{t.count}</span>
                  </button>
                )
              })}
            </div>

            {activeTab === 'badges' && (
              <div className="cc-pv-badges">
                {badges.map((b, i) => {
                  const bImg = b.img || badgeImage(b.icon)
                  return (
                    <div key={i} className="cc-pv-badge-cell">
                      <div className="cc-pv-badge-art">
                        {bImg ? (
                          <img className="cc-pv-badge-img" src={bImg} alt="" />
                        ) : (
                          <span className="cc-pv-badge" style={{ '--c': b.color || accent }}>
                            <Ic name={b.icon || 'ti-badge'} size={26} />
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {activeTab === 'rewards' && (
              <div className="cc-pv-rewards">
                {rewards.map((r) => (
                  <div key={r.key} className="cc-pv-reward">
                    <span className="cc-pv-reward-art" style={{ '--c': accent }}>
                      {r.img ? <img src={r.img} alt="" /> : <Icon name={r.icon} size={18} />}
                    </span>
                    <span className="cc-pv-reward-info">
                      <strong>{r.title}</strong>
                      {r.sub && <span>{r.sub}</span>}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
