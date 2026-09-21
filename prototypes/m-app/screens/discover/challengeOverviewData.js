/**
 * `challenges/functions/GetCardOverviewData.ts` — the Overview grid, ported entry for entry.
 *
 * Seventeen possible cards in a fixed order, each one a pairing of something you have done with
 * something there is to do. The order is the source's and is not alphabetical or grouped: it is
 * the order someone decided the grid should read in, so it is kept.
 *
 * Two shapes of card, and `PROGRESS_ITEMS` is what separates them:
 *
 *   • a PROGRESS card — minutes, reviews, days, books, pictures, pages, challenge_books — shows
 *     `data / total` and a percentage, and turns green with a tick at 100%.
 *   • a COUNT card — badges, rewards, tickets, certificates, activities and the log types —
 *     shows a bare number. There is no goal to be a percentage of.
 *
 * `total` is doing double duty and that is the source's design, not a mistake here: on a
 * progress card it is a NUMBER (the goal), and on a log-type card it is a BOOLEAN (whether that
 * log type is enabled at all). Both are only ever tested for truthiness when deciding whether
 * the card appears, so the two meanings never collide.
 *
 * The colours are literal rgb() from the source rather than tokens. They are a seventeen-card
 * pastel set that exists nowhere else in the app, and mapping them onto the nearest brand token
 * would quietly redesign the grid.
 */

/** `showPercentageOrTotal` — the items that have a goal to be a fraction of. */
const PROGRESS_ITEMS = [
  'minutes',
  'reviews',
  'days',
  'books',
  'pictures',
  'pages',
  'challenge_books',
]

export const isProgressItem = (item) => PROGRESS_ITEMS.includes(item)

/** Capped at 100 — a challenge you have overshot does not read as 140%. */
export function cardPercentage(detail) {
  if (detail.data >= detail.total && detail.total !== 0) return '100%'
  if (detail.total > 0) return `${Math.round((detail.data / detail.total) * 100)}%`
  return ''
}

/**
 * `pluralTitle` — a count card singularises its own title when the count is exactly 1.
 *
 * Note how crudely the source does it: `title.replace('s', '')` strips the FIRST "s" in the
 * string, so "Badges Earned" → "Badge Earned" works by luck and the two titles where it would
 * not are special-cased above it. Ported as-is, because the two special cases only make sense
 * as compensation for the blunt instrument underneath them.
 */
export function cardTitle(detail) {
  if (isProgressItem(detail.item)) return detail.title
  if (detail.data === 1) {
    if (detail.item === 'activities') return 'Activity Completed'
    if (detail.item === 'learning') return 'Learning Moment Logged'
    return detail.title.replace('s', '')
  }
  return detail.title
}

export function getCardOverviewData(wordForDrawings, a = {}) {
  const logTypes = a.log_types ?? []
  const hasLog = (t) => logTypes.includes(t)

  return [
    {
      item: 'challenge_books',
      tab: 'Reading List',
      backgroundColor: 'rgb(244,226,248)',
      borderColor: 'rgb(252,247,253)',
      icon: 'challengeStatsBookLists',
      title: 'Reading List Titles Completed',
      data: a.challenge_book_lists_total,
      total: a.goals_book_list_total,
    },
    {
      item: 'badges',
      tab: 'Badges',
      backgroundColor: 'rgb(221,246,249)',
      borderColor: 'rgb(243,252,253)',
      icon: 'challengeStatsBadges',
      title: 'Badges Earned',
      data: a.earned_badges_total,
      total: 0,
    },
    {
      item: 'minutes',
      tab: 'Badges',
      backgroundColor: 'rgb(252,224,214)',
      borderColor: 'rgb(254,242,238)',
      icon: 'challengeStatsMinutes',
      title: 'Minutes Logged',
      data: a.challenge_minutes_total,
      total: a.goals_minutes_total,
    },
    {
      item: 'pages',
      tab: 'Badges',
      backgroundColor: 'rgb(252,224,214)',
      borderColor: 'rgb(254,242,238)',
      icon: 'challengeStatsPages',
      title: 'Pages Read',
      data: a.challenge_pages_total,
      total: a.goals_pages_total,
    },
    {
      item: 'reviews',
      tab: 'Badges',
      backgroundColor: 'rgb(221,233,249)',
      borderColor: 'rgb(243,247,253)',
      icon: 'challengeStatsReviews',
      title: 'Reviews Written',
      data: a.challenge_reviews_total,
      total: a.goals_reviews_goal_total ?? a.goals_reviews_total,
    },
    {
      item: 'events',
      tab: 'Badges',
      backgroundColor: 'rgb(252,224,214)',
      borderColor: 'rgb(254,242,238)',
      icon: 'challengeStatsEvents',
      title: 'Events Logged',
      data: a.challenge_events_total,
      total: hasLog('event'),
    },
    {
      item: 'days',
      tab: 'Badges',
      backgroundColor: 'rgb(221,233,249)',
      borderColor: 'rgb(243,247,253)',
      icon: 'challengeStatsDays',
      title: 'Days Logged',
      data: a.challenge_days_total,
      total: a.goals_days_total,
    },
    {
      item: 'learning',
      tab: 'Badges',
      backgroundColor: 'rgb(255,236,200)',
      borderColor: 'rgb(255,245,226)',
      icon: 'challengeStatsMoments',
      title: 'Learning Moments Logged',
      data: a.challenge_learning_moments_total,
      total: hasLog('moment'),
    },
    {
      item: 'hours',
      tab: 'Badges',
      backgroundColor: 'rgb(221,246,249)',
      borderColor: 'rgb(243,252,253)',
      icon: 'challengeStatsHours',
      title: 'Hours Logged',
      data: a.challenge_hours_total,
      total: hasLog('hour'),
    },
    {
      item: 'videos',
      tab: 'Badges',
      backgroundColor: 'rgb(244,226,248)',
      borderColor: 'rgb(252,247,253)',
      icon: 'challengeStatsVideos',
      title: 'Videos Logged',
      data: a.challenge_videos_total,
      total: hasLog('video'),
    },
    {
      item: 'magazines',
      tab: 'Badges',
      backgroundColor: 'rgb(221,246,249)',
      borderColor: 'rgb(243,252,253)',
      icon: 'challengeStatsMagazines',
      title: 'Magazines Logged',
      data: a.challenge_magazines_total,
      total: hasLog('magazine'),
    },
    {
      item: 'books',
      tab: 'Badges',
      backgroundColor: 'rgb(221,233,249)',
      borderColor: 'rgb(243,252,253)',
      icon: 'challengeStatsBooks',
      title: 'Books Completed',
      data: a.challenge_books_total,
      total: a.goals_books_total,
    },
    {
      item: 'picture',
      tab: 'Badges',
      backgroundColor: 'rgb(221,246,249)',
      borderColor: 'rgb(243,252,253)',
      icon: 'challengeStatsPictureReviews',
      title: 'Picture Reviews Logged',
      data: a.challenge_picture_reviews_total,
      total: 0,
    },
    {
      item: 'activities',
      tab: 'Activities',
      backgroundColor: 'rgb(219,242,231)',
      borderColor: 'rgb(238,249,243)',
      icon: 'challengeStatsActivities',
      title: 'Activities Completed',
      data: a.challenge_activites_total,
      total: a.has_activities,
    },
    {
      item: 'rewards',
      tab: 'Rewards',
      backgroundColor: 'rgb(244,226,248)',
      borderColor: 'rgb(252,247,253)',
      icon: 'challengeStatsRewards',
      title: 'Rewards Earned',
      data: a.challenge_rewards,
      total: 0,
    },
    {
      item: 'tickets',
      tab: `Ticket ${wordForDrawings}`,
      backgroundColor: 'rgb(255,236,200)',
      borderColor: 'rgb(255,245,226)',
      icon: 'challengeStatsTickets',
      title: 'Tickets Earned',
      data: a.challenge_tickets_total,
      total: 0,
    },
    {
      item: 'certificate',
      tab: 'Certificates',
      backgroundColor: 'rgb(221,246,249)',
      borderColor: 'rgb(243,252,253)',
      icon: 'challengeStatsCertificates',
      title: 'Certificates Earned',
      data: a.challenge_certificates,
      total: 0,
    },
  ]
}

/**
 * `challengeTabs` in `ChallengeDetailScreen` — the tab row is DERIVED, not configured.
 *
 * Overview and Description always exist. Everything after them is a Map of tab → total, walked
 * in insertion order, and a tab joins the row only when its total is above zero. So a challenge
 * with no rewards has no Rewards tab at all rather than an empty one, and the row is a summary
 * of what the challenge is before you have read a word of it.
 *
 * Badges is the sum of FOUR totals, which is why a challenge can have a Badges tab without any
 * one of goals/logging/points/reviews being interesting on its own.
 */
export function challengeTabsFor(a = {}, wordForDrawings = 'Drawings') {
  const badges =
    (a.goals_challenges_total ?? 0) +
    (a.goals_logging_total ?? 0) +
    (a.goals_points_total ?? 0) +
    (a.goals_reviews_total ?? 0)

  const conditional = [
    ['Bingo Card', a.is_bingo_challenge],
    ['Reading List', a.is_book_list_challenge],
    ['Badges', badges],
    ['Activities', a.goals_activities_total],
    ['Rewards', a.rewards_total],
    [`Ticket ${wordForDrawings}`, a.drawings_total],
    ['Certificates', a.certificates_total],
    ['Challenge Log', a.challenge_log_total],
  ]

  return ['Overview', 'Description', ...conditional.filter(([, v]) => v > 0).map(([k]) => k)]
}
