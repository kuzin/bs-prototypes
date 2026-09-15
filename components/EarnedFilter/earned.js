/**
 * The two halves of a set of earnables, and the filter over them — the plain
 * half of `EarnedFilter`.
 *
 * It lives in its own module so `EarnedFilter.jsx` exports nothing but a
 * component: React Fast Refresh bails on a module that exports anything else,
 * and takes a full page reload with it.
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

export { DEFAULT_EARNED }
