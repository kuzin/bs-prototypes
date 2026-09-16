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
        {shown.map((b) => (
          <Badge key={b.id} {...b} onPress={() => onOpenBadge?.(b)} />
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
