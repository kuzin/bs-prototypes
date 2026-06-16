import { Hero } from '@components/Hero/Hero'
import { Banner } from '@components/Primitives/Primitives'
import { ColorInput, NumberInput, MultiSelect } from '@components/Form/Form'
import { Icon } from '@components/Icon/Icon'
import { TEMPLATE_PRESETS, badgeImage } from '../data'

// ─── shared bits ──────────────────────────────────────────────────────────────
// Page-header icons per step (drawn by the shared <Hero>).
export const STEP_ICONS = {
  details: <Icon name="settings" size={22} />,
  badges: <Icon name="award" size={22} />,
  bingo: <Icon name="layout-grid" size={22} />,
  gameboard: <Icon name="route" size={22} />,
  readingList: <Icon name="list" size={22} />,
  prizes: <Icon name="gift" size={22} />,
  completion: <Icon name="flag" size={22} />,
}
export function StepHead({ title, sub }) {
  return (
    <div className="cc-step-head">
      <Hero title={title} subtitle={sub} accent="#0DA7BC" />
    </div>
  )
}

export function Tip({ children }) {
  return (
    <Banner level="info" className="cc-tip-note">
      {children}
    </Banner>
  )
}

// Preset color dots + a custom picker.
// The one color-chip picker for challenge creator: a row of round preset
// swatches followed by a custom hex input, wrapping together as needed.
// Exported so the pattern library can catalog it.
export function ColorPicker({ value, presets = [], fallback, onColor, maxPresets = 8 }) {
  return (
    <div className="cc-colorpick">
      <ColorInput size="sm" value={value || fallback} onChange={onColor} />
      {presets.length > 0 && <span className="cc-colorpick-divider" aria-hidden="true" />}
      {presets.slice(0, maxPresets).map((c) => (
        <button
          key={c}
          type="button"
          className={`cc-accent-dot${(value || '').toLowerCase() === c.toLowerCase() ? ' is-on' : ''}`}
          style={{ background: c }}
          aria-label={`Use ${c}`}
          onClick={() => onColor(c)}
        />
      ))}
    </div>
  )
}

// Opt-in color override rendered as an availability-style toggle row + reveal.
export const thumbStyle = (templateId) => ({
  backgroundImage: `url("${TEMPLATE_PRESETS[templateId]?.banner}")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
})

// Count words for the preview-card description helper text.
export const wordCount = (s) => (s || '').trim().split(/\s+/).filter(Boolean).length

// Small inline glyphs for the gallery (search, clear, selected check).
export function GalleryCheck() {
  return <Icon name="check" size={11} stroke={2.6} />
}
export function TrashIcon() {
  return <Icon name="trash" size={15} />
}
// Search / no-results empty state icon.
export const SEARCH_EMPTY_ICON = <Icon name="search" size={26} />
// Open-book empty state icon (reading list).
export const BOOK_EMPTY_ICON = <Icon name="book" size={26} />

// Small badge avatars shown on a reward (the badges that grant it).
export function BadgeAvatars({ badges }) {
  return (
    <span className="cc-badge-avatars">
      {badges.slice(0, 6).map((b) => (
        <span key={b.id} className="cc-badge-avatar" title={b.name}>
          {b.img ? <img src={b.img} alt="" /> : null}
        </span>
      ))}
      <span className="cc-badge-avatars-label">
        {badges.length === 1 ? badges[0].name : `${badges.length} badges`}
      </span>
    </span>
  )
}
// Gallery-style multi-select of the challenge's badges — the one badge selector
// used wherever rewards assign to badges (and which badges earn tickets).
// valueMode adds a per-badge number (e.g. ticket value) on each selected tile.
export function BadgeSelect({
  badges,
  selectedIds,
  onToggle,
  valueMode = false,
  values = {},
  onValue,
  valueLabel = '',
  disabledIds = [],
  disabledHint = 'Already used',
}) {
  if (!badges.length) {
    return (
      <p className="cc-method-note cc-method-note--sm">
        Add badges in the Badges step first, then assign them here.
      </p>
    )
  }
  return (
    <div className="cc-badgeselect">
      {badges.map((b) => {
        const sel = selectedIds.includes(b.id)
        const off = !sel && disabledIds.includes(b.id)
        return (
          <div key={b.id} className={`cc-bsrow${sel ? ' is-on' : ''}${off ? ' is-disabled' : ''}`}>
            <button
              type="button"
              className="cc-bsrow-pick"
              onClick={() => onToggle(b.id)}
              aria-pressed={sel}
              disabled={off}
              title={off ? `${b.name} — ${disabledHint}` : b.name}
            >
              <span className={`cc-bsrow-check${sel ? ' is-on' : ''}`} aria-hidden="true">
                {sel && <GalleryCheck />}
              </span>
              <span className="cc-bsrow-art">
                {b.img ? (
                  <img src={b.img} alt="" draggable={false} />
                ) : (
                  <span className="cc-bsrow-art-ph" />
                )}
              </span>
              <span className="cc-bsrow-name">{b.name}</span>
            </button>
            {off && <span className="cc-bsrow-used">{disabledHint}</span>}
            {valueMode && sel && (
              <div className="cc-bsrow-val">
                <NumberInput
                  value={values[b.id] ?? 1}
                  min={1}
                  max={100}
                  onChange={(v) => onValue(b.id, v)}
                />
                <span>{valueLabel}</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Normalized badge pool ({ id, name, img }) shared by every badge picker.
// Registration/completion badges are opt-in: rewards & certificates can attach
// to them, but completion requirements don't count them.
export function badgePoolOf(challenge, { includeRegComp = false } = {}) {
  const c = challenge || {}
  return [
    ...(includeRegComp && c.registrationBadge?.img
      ? [
          {
            id: 'reg',
            name: c.registrationBadge.name || 'Registration badge',
            img: c.registrationBadge.img,
          },
        ]
      : []),
    ...(includeRegComp && c.completionBadge?.img
      ? [
          {
            id: 'comp',
            name: c.completionBadge.name || 'Completion badge',
            img: c.completionBadge.img,
          },
        ]
      : []),
    ...(c.badges || []).map((b, i) => ({
      id: `log-${i}`,
      name: b.name || 'Logging badge',
      img: b.img || badgeImage(b.icon),
    })),
    ...(c.activityBadges || []).map((b, i) => ({
      id: `act-${i}`,
      name: b.title || b.name || 'Activity badge',
      img: b.badge?.img,
    })),
    ...(c.pointsBadges || []).map((b, i) => ({
      id: `pts-${i}`,
      name: b.name || 'Points badge',
      img: b.img || badgeImage(b.icon),
    })),
    ...(c.reviewBadges || []).map((b, i) => ({
      id: `rev-${i}`,
      name: b.name || 'Review badge',
      img: b.img || badgeImage(b.icon),
    })),
  ]
}

// Badge ids that currently earn a reward: assigned to a reward item or a
// certificate, or earning a raffle ticket when tickets are on (source 'all' =
// every badge; 'specific' = the chosen ones; 'manual' = none). Used to flag
// rewarded badges across the Badges step, gameboard, and bingo.
export function rewardedBadgeIds(challenge) {
  const r = challenge?.rewards || {}
  const ids = new Set([
    ...(r.items || []).flatMap((x) => x.badgeIds || []),
    ...(r.certificates || []).flatMap((x) => x.badgeIds || []),
  ])
  if (r.ticketsEnabled) {
    const source = r.ticketSource || 'all'
    if (source === 'specific') Object.keys(r.ticketBadges || {}).forEach((id) => ids.add(id))
    else if (source !== 'manual')
      badgePoolOf(challenge, { includeRegComp: true }).forEach((b) => ids.add(b.id))
  }
  return ids
}

// The badge-selection pattern: a dropdown multi-select over a normalized badge
// pool, with thumbnails and a consistent "no badges yet" empty state. Use this
// anywhere badges are chosen (certificates, rewards, completion requirements).
export function BadgeMultiSelect({
  badges = [],
  value = [],
  onChange,
  placeholder = 'Select badges…',
  emptyHint = 'Add badges on the Badges step first.',
  disabledIds = [],
}) {
  return (
    <MultiSelect
      options={badges.map((b) => ({
        value: b.id,
        label: b.name,
        image: b.img || null,
        disabled: disabledIds.includes(b.id) && !value.includes(b.id),
      }))}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      emptyText="No badges yet"
      emptyHint={emptyHint}
    />
  )
}
