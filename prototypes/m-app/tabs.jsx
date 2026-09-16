import { Img } from '@mobile/components'

/**
 * The bottom tab bar's four destinations, and the logging menu's actions — all on the app's real
 * art, from the mirrored image registry.
 *
 * Each tab is an active/inactive PNG pair (`Home_Active` / `Home_Inactive` …) rather than one
 * tinted glyph, which is why the active state swaps `source` instead of applying a colour. That
 * detail is the reason the active tab label is `mineBlack` and not the tenant accent.
 */
const tabIcon = (base) => ({
  icon: <Img name={`${base}_inactive`} size={24} />,
  activeIcon: <Img name={`${base}_active`} size={24} />,
})

export const TABS = [
  { id: 'home', label: 'Home', ...tabIcon('home') },
  { id: 'log', label: 'Log', ...tabIcon('log') },
  // profileHasNewChallenges — a red pill with a 4pt white dot inside it.
  { id: 'discover', label: 'Discover', dot: true, ...tabIcon('discover') },
  // totalFriendRequests; the same pill shows the word NEW when there are none but the
  // add-friends nudge is showing.
  { id: 'community', label: 'Community', badge: 3, ...tabIcon('community') },
]

/**
 * PlusMenu's actions. Only Reading is unconditional — Activity needs `profile.has_activities`,
 * Review needs `microsite.reviewsEnabled`, and Import needs `microsite.epicIntegration`. All four
 * are shown here because the four-item fan is the interesting case: its last item drops below the
 * arc rather than extending it.
 */
export const PLUS_ACTIONS = [
  {
    id: 'reading',
    title: 'Reading',
    accessibilityLabel: 'Log reading',
    icon: <Img name="plus_button_books" size={30} />,
  },
  {
    id: 'activity',
    title: 'Activity',
    accessibilityLabel: 'Log activity',
    icon: <Img name="plus_button_activities" size={30} />,
  },
  {
    id: 'review',
    title: 'Review',
    accessibilityLabel: 'Log a review',
    icon: <Img name="plus_button_review" size={30} />,
  },
  {
    id: 'import',
    title: 'Import',
    accessibilityLabel: 'Import from Epic',
    icon: <Img name="plus_button_import" size={30} />,
  },
]
