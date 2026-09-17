import { useState } from 'react'
import { Badge, EmptyStateView, FilterBar, SelectSheet } from '@mobile/components'
import './Badges.css'

/**
 * `src/components/badges/Badges.tsx` on the Log tab, where `home` is false — so it is a vertical,
 * scrollable list of `Badge` rows rather than Home's horizontal circle strip.
 *
 * It is the reader's own collection and therefore EARNED-ONLY: the data comes from
 * `useEarnedBadges(profileId)`. Unearned badges, with their grey rings and progress text, appear
 * inside a challenge — never here.
 *
 * Its list header renders only on the `earnedBadges` route; on the Log tab it is an empty view, so
 * there is no "Earned Badges" title here.
 *
 * Empty state is `EmptyStateView` with the CHALLENGES artwork — `my_challenges_empty_state`, not
 * the badges one, which the Home strip uses. That looks like a mistake in the app, but it is what
 * ships.
 */
/**
 * The month a badge was earned, from `earnedOn` ("September 12, 2026"). Taken off the string
 * rather than through `Date`, which would need a timezone to answer a question that has nothing
 * to do with one.
 */
function monthOf(earnedOn) {
  return earnedOn ? earnedOn.replace(/\s+\d+,/, '') : null
}

/**
 * DIVERGENCE — earned badges grouped by month, the way All Titles groups books and Book Talks
 * groups chats.
 *
 * The app ships one flat list. Two of the three lists on this tab already break by month, and a
 * badge is the same kind of thing they are: a dated event in a reader's year. Ungrouped, a run of
 * sixteen rows gave no sense of when any of it happened, and "Completed on 8/9/26" in a row's own
 * subtitle is not something you can scan for.
 *
 * The badges arrive newest-first and stay that way — the section breaks fall where the month
 * changes, so nothing is re-sorted. A badge with no date (a repeatable one, counted rather than
 * dated) keeps its place and its section renders without a heading rather than inventing one.
 */
function byMonth(badges) {
  const sections = []
  for (const badge of badges) {
    const month = monthOf(badge.earnedOn)
    const last = sections[sections.length - 1]
    if (last && last.month === month) last.badges.push(badge)
    else sections.push({ month, badges: [badge] })
  }
  return sections
}

/** `BadgeType` in `types/api/enums.ts`, given readable labels. */
const TYPE_LABELS = {
  completion: 'Completion',
  registration: 'Registration',
  full_card_bingo: 'Full Card Bingo',
  BadgeRequirement: 'Challenge Badges',
  LearningTrack: 'Learning Tracks',
  PointRequirement: 'Points',
  ReviewRequirement: 'Reviews',
  Program: 'Programs',
}

export function Badges({ badges, onOpenBadge }) {
  const [filter, setFilter] = useState('all')
  const [pickerOpen, setPickerOpen] = useState(false)

  /**
   * Filtered by BADGE TYPE — `earned_badges.badge_type`, the `BadgeType` enum.
   *
   * The raw values are the ids and `TYPE_LABELS` carries the display text, because the enum is
   * not presentable: it mixes `completion` with `BadgeRequirement`, two generations of the schema
   * in one list. A reader should not be shown either spelling.
   *
   * The options are DERIVED from the reader's own badges rather than declared — the way the web
   * app's `BadgeShelf` builds its filters. Eight types exist; a reader typically has two or three,
   * and a control listing the other five would be five dead rows.
   */
  const types = [...new Set(badges.map((b) => b.badgeType).filter(Boolean))]
  const items = [
    { id: 'all', label: 'All Badges' },
    ...types.map((t) => ({ id: t, label: TYPE_LABELS[t] ?? t })),
  ]
  const active = items.find((i) => i.id === filter) ?? items[0]
  const shown = filter === 'all' ? badges : badges.filter((b) => b.badgeType === filter)

  if (badges.length === 0) {
    return (
      <EmptyStateView
        source="my_challenges_empty_state"
        boldText="No Badges to Show"
        middleText="You haven’t earned any badges yet."
      />
    )
  }

  return (
    <div className="m-badges">
      {/* Only worth a control when there is more than one type to choose between. */}
      {types.length > 1 && <FilterBar label={active.label} onPress={() => setPickerOpen(true)} />}

      <div className="m-badges-list">
        {byMonth(shown).map((section) => (
          <section key={section.month ?? 'undated'}>
            {section.month && (
              <div className="m-badges-section-head">
                <h3 className="m-section-head m-badges-section">{section.month}</h3>
                <div className="m-badges-divider" />
              </div>
            )}
            {section.badges.map((b) => (
              <Badge key={b.id} {...b} onPress={() => onOpenBadge?.(b)} />
            ))}
          </section>
        ))}
      </div>

      <SelectSheet
        open={pickerOpen}
        items={items}
        selectedId={filter}
        onSelect={setFilter}
        onClose={() => setPickerOpen(false)}
      />
    </div>
  )
}
