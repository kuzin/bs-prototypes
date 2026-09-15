import { Tabs } from '@components/Tabs/Tabs'

import '@components/Tabs/Tabs.css'

/**
 * All / Earned / Unearned — the question a reader turns up to a set of
 * earnables with: what have I got, and what is left.
 *
 * It is a segmented control, which in this system is a pill `Tabs`, with the
 * counts on the tabs so the answer is readable without picking one.
 *
 * **It renders nothing unless the set has both halves.** A shelf of things you
 * have all earned — or none of — can only answer one way, and a reader's own
 * badge collection is earned-only by definition, since an unearned badge
 * belongs to the challenge that sets its requirement and exists nowhere else.
 *
 * `isEarned` is how a set says which half a thing is in: badges carry
 * `locked`, prizes and rewards carry `earned`. `labels` renames the two halves
 * for a set that isn't earned but read — a reading list is Completed / To Read.
 *
 *   const [state, setState] = useState('all')
 *   <EarnedFilter items={prizes} isEarned={(p) => p.earned} value={state} onChange={setState} />
 *   {byEarnedState(prizes, state, (p) => p.earned).map(…)}
 */

const DEFAULT_EARNED = (item) => !item.locked

/** Whether the control would show anything — both halves present. */
export function hasBothStates(items, isEarned = DEFAULT_EARNED) {
  return items.some((i) => isEarned(i)) && items.some((i) => !isEarned(i))
}

/** The set the control's current value asks for. */
export function byEarnedState(items, state, isEarned = DEFAULT_EARNED) {
  if (!hasBothStates(items, isEarned)) return items
  if (state === 'earned') return items.filter((i) => isEarned(i))
  if (state === 'unearned') return items.filter((i) => !isEarned(i))
  return items
}

export function EarnedFilter({
  items,
  isEarned = DEFAULT_EARNED,
  value,
  onChange,
  ariaLabel = 'Which of these',
  labels,
}) {
  if (!hasBothStates(items, isEarned)) return null

  const earned = items.filter((i) => isEarned(i)).length
  // Badges and prizes are earned; a book on a reading list is read. Same three
  // states either way — the words are the caller's.
  const { earned: earnedLabel = 'Earned', unearned: unearnedLabel = 'Unearned' } = labels ?? {}

  return (
    <Tabs
      variant="pill"
      size="md"
      active={value}
      accent="#1A6DD5"
      onChange={onChange}
      ariaLabel={ariaLabel}
      items={[
        { id: 'all', label: 'All', count: items.length },
        { id: 'earned', label: earnedLabel, count: earned },
        { id: 'unearned', label: unearnedLabel, count: items.length - earned },
      ]}
    />
  )
}
