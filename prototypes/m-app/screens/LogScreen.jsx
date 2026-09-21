import { useState } from 'react'
import {
  TopTabs,
  LoadingIndicator,
  LogLoader,
  CompletedLoader,
  RefreshControl,
  ListFooter,
  SelectSheet,
} from '@mobile/components'
import { ReadingLog } from './log/ReadingLog'
import { BookTalks } from './log/BookTalks'
import { AllTitles } from './log/AllTitles'
import { Streaks } from './log/Streaks'
import { Highlights } from './log/Highlights'
import { Badges } from './log/Badges'
import { Achievements } from './log/Achievements'
import { ReadingMotivation } from './log/ReadingMotivation'
import { Reviews } from './log/Reviews'
import {
  READING_LOG_MONTHS,
  BOOK_TALKS_IN_PROGRESS,
  BOOK_TALKS_COMPLETED,
  ALL_TITLES_SECTIONS,
  COMPLETED_TITLES,
  LOG_BADGES,
  ACHIEVEMENTS,
  RMI_SURVEYS,
  PROFILE_REVIEWS,
  STREAK_NUMBERS,
  TIMES_GOAL_MET,
  STREAK_CALENDAR,
  HIGHLIGHT_STATS,
  HIGHLIGHT_PEAKS,
} from '../data'
import './Screens.css'

/**
 * The Log tab — `navigation/logTab/logTabNavigator/LogTabNavigator.tsx`.
 *
 * Nine top tabs, four of them feature-gated in the real app (Book Talks additionally requires
 * grade_level_id >= 6). `statistics` is the route name but the label is "Highlights", which is
 * the sort of divergence worth preserving rather than tidying.
 */
/**
 * PRESSED STATES — most of these tabs deliberately have none, and that is the app, not an omission.
 *
 * The app reaches for `Pressable` with a STATIC style far more often than with a `({ pressed })`
 * function, and a static Pressable gives no visual feedback at all. Audited element by element:
 *
 *   feedback        Reviews row (TouchableHighlight, `activeOpacity: 1` — underlay only, no fade)
 *                   Reviews “…” (TouchableOpacity 0.5)
 *                   All Titles completed covers (TouchableOpacity, RN default 0.2)
 *                   ToggleTabs (TouchableOpacity, RN default 0.2)
 *                   ReadingLog month arrows (Pressable, opacity 0.5)
 *                   Badge (circle fades 0.5, list variant washes greyLight4)
 *
 *   NONE, correctly Book Talks rows · Achievements items · Reading Log session cards ·
 *                   Benny's Finish Later and send button · the RMI survey filter
 *
 * Worth writing down because the second list looks like a bug and is not. Adding a wash to a Book
 * Talks row would be inventing a state the app does not have.
 */

/** The four whose presence depends on a microsite flag or the reader's profile. */
export const GATED = ['bookTalks', 'achievements', 'readingMotivation', 'reviews_profiles']

export const LOG_TABS = [
  { id: 'readingLog', label: 'Reading Log' },
  { id: 'allTitles', label: 'All Titles' },
  { id: 'bookTalks', label: 'Book Talks' },
  { id: 'badges', label: 'Badges' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'streaks', label: 'Streaks' },
  { id: 'readingMotivation', label: 'Reading Motivation' },
  { id: 'reviews_profiles', label: 'Reviews' },
  { id: 'statistics', label: 'Highlights' },
]

export function LogScreen({
  tab,
  onTab,
  flags = {},
  onOpenChat,
  onOpenBadge,
  onOpenAchievement,
  onOpenBook,
  onReviewOptions,
  onOpenReview,
  listState = 'populated',
  goalVariant = 'compact',
}) {
  // `empty` feeds every list nothing, so each screen takes its own ListEmptyComponent branch —
  // which is the point: the empty states differ per tab and several differ per SUB-tab.
  const empty = listState === 'empty'
  const loading = listState === 'loading'
  const refreshing = listState === 'refreshing'
  const loadingMore = listState === 'loadingMore'
  const some = (rows) => (empty ? [] : rows)

  // `getSelectedSurvey(surveys, id)` — falls back to the FIRST survey when nothing is picked,
  // which is what makes the screen render before you have touched the filter.
  const [surveyId, setSurveyId] = useState(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const selectedSurvey = RMI_SURVEYS.find((s) => s.id === surveyId) ?? RMI_SURVEYS[0]
  // Four of the nine are conditional in LogTabNavigator; the rest always render.
  const [monthIndex, setMonthIndex] = useState(0)
  const logMonth = READING_LOG_MONTHS[monthIndex] ?? READING_LOG_MONTHS[0]

  const visible = LOG_TABS.filter((t) => !GATED.includes(t.id) || flags[t.id])
  return (
    <>
      <TopTabs tabs={visible} active={tab} onChange={onTab} />
      {/* Seven of the nine tabs have a RefreshControl, so it belongs on the scroller they share
          rather than inside each screen. Streaks and Reading Motivation are the two without. */}
      <RefreshControl className="m-scroll" refreshing={refreshing} onRefresh={() => {}}>
        {/* Each tab's loader is the one the app picks for it: All Titles has two bespoke
            skeletons, everything else gets the spinner. */}
        {loading && tab !== 'allTitles' && <LoadingIndicator overlay={false} />}

        {!loading && tab === 'readingLog' && (
          <ReadingLog
            month={logMonth.month}
            weeks={some(logMonth.weeks)}
            hasGoal={flags.dailyGoal}
            goalVariant={goalVariant}
            isCurrentMonth={logMonth.isCurrentMonth}
            isOldestMonth={monthIndex === READING_LOG_MONTHS.length - 1}
            goal={flags.dailyGoal ? logMonth.goal : null}
            /* Newest first, so ‹ walks UP the array and › walks back down it. Both arrows grey
               out at their end rather than wrapping — `disableNext` on the current month is the
               app's own rule, and there is nothing older than the oldest month. */
            onPrevMonth={() =>
              setMonthIndex(Math.min(monthIndex + 1, READING_LOG_MONTHS.length - 1))
            }
            onNextMonth={() => setMonthIndex(Math.max(monthIndex - 1, 0))}
            onOpenBook={onOpenBook}
          />
        )}
        {tab === 'allTitles' && (
          <AllTitles
            sections={some(ALL_TITLES_SECTIONS)}
            completed={some(COMPLETED_TITLES)}
            onOpenBook={onOpenBook}
            loading={loading}
          />
        )}
        {!loading && tab === 'bookTalks' && (
          <BookTalks
            inProgress={some(BOOK_TALKS_IN_PROGRESS)}
            completed={some(BOOK_TALKS_COMPLETED)}
            onOpenChat={onOpenChat}
          />
        )}
        {!loading && tab === 'badges' && (
          <Badges badges={some(LOG_BADGES)} onOpenBadge={onOpenBadge} />
        )}
        {!loading && tab === 'achievements' && (
          <Achievements achievements={some(ACHIEVEMENTS)} onOpenAchievement={onOpenAchievement} />
        )}
        {!loading && tab === 'readingMotivation' && (
          <ReadingMotivation
            survey={selectedSurvey}
            onOpenSurveyPicker={() => setPickerOpen(true)}
          />
        )}
        {!loading && tab === 'reviews_profiles' && (
          <Reviews
            reviews={some(PROFILE_REVIEWS)}
            profile="Maya Chen"
            onOptions={onReviewOptions}
            onOpenReview={onOpenReview}
          />
        )}
        {/* `useReadingGoalActivation` — the sixth card is spliced in at index 2 only when the
            reader HAS a goal, so without one the carousel is five cards, not six with a gap. */}
        {!loading && tab === 'streaks' && (
          <Streaks
            streaks={STREAK_NUMBERS}
            timesGoalMet={flags.dailyGoal ? TIMES_GOAL_MET : null}
            calendar={STREAK_CALENDAR}
            hasGoal={flags.dailyGoal}
          />
        )}
        {!loading && tab === 'statistics' && (
          <Highlights stats={HIGHLIGHT_STATS} peaks={HIGHLIGHT_PEAKS} />
        )}

        {/* `ListFooterComponent` — only the five paginating tabs have one. Streaks, Reading
            Motivation, Reading Log and Highlights fetch a whole period at a time and never
            page, so a footer spinner there would promise a next page that does not exist. */}
        <ListFooter
          loading={
            loadingMore &&
            ['allTitles', 'bookTalks', 'badges', 'achievements', 'reviews_profiles'].includes(tab)
          }
        />
      </RefreshControl>

      {/* SelectSheet — the survey picker the filter bar opens. It is mounted beside the scroller
          rather than inside Reading Motivation because it covers the whole screen. */}
      <SelectSheet
        open={pickerOpen}
        items={RMI_SURVEYS.map((s) => ({ id: s.id, label: s.name }))}
        selectedId={selectedSurvey.id}
        onSelect={setSurveyId}
        onClose={() => setPickerOpen(false)}
      />
    </>
  )
}
