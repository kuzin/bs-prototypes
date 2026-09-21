import { SectionHeader, DailyGoalBanner } from '@mobile/components'
import { ChallengeCarouselCard } from './components/ChallengeCarouselCard'
import { MyStats } from './components/MyStats'
import { HomeBadges } from './components/HomeBadges'
import { StreaksMessage } from './components/StreaksMessage'
import { PendingBookTalks } from './components/PendingBookTalks'
import { MotivatorSurveyCard } from './components/MotivatorSurveyCard'
import { FundraisersHomeCard } from './components/FundraisersHomeCard'
import { ActivitiesList } from './components/ActivitiesList'
import { ReviewsList } from './components/ReviewsList'
import {
  HOME_CHALLENGES,
  RECENT_TITLES,
  ALL_TIME_STATS,
  EARNED_BADGES,
  STREAK,
  FUNDRAISER,
  HOME_ACTIVITIES,
  HOME_REVIEWS,
} from './data'
import './HomeScreen.css'

/**
 * The Home tab — `src/screens/home/Home.tsx`, in its own order:
 *
 *   PendingBookTalksConversation · MotivatorSurveyCard · DailyGoalBanner · StreaksMessage
 *   FundraisersHomeCard · ChallengesList · BookList · MyStats · HomeBadges
 *   HomeActivitiesList · ReviewsList
 *
 * Five of those are conditional — on a microsite flag, on the reader's grade, or simply on the
 * account having the thing at all. `flags` drives them here so every combination is reachable;
 * on device a given reader usually sees three or four of the eleven.
 *
 * The rhythm is the important part: every section is wrapped at `marginTop: 56` by
 * EmptyHomeContainer / EmptyHorizontalScrollableContainer. The screen ground is WHITE, not the
 * grey used elsewhere in the app.
 *
 * **Every section here goes somewhere**, and in the app each one owns its own route rather than
 * being handed one — `HomeBadges` navigates to the Log's badges tab itself, `MyStats` to
 * statistics, `BookList` to the reading log. Home is a set of doors, and the destinations are all
 * elsewhere: `onGoTo(tab, subTab)` is those jumps, and the three `onOpen*` are the detail screens
 * a single card opens.
 *
 * Two doors lead nowhere yet and say so below: the survey the motivator card starts
 * (`rmiSurvey`), and a challenge's own page (`challengePageHome`).
 */
export function HomeScreen({
  flags = {},
  onGoTo,
  onOpenBook,
  onOpenBadge,
  onOpenReview,
  streakClosed = false,
  onCloseStreak,
}) {
  const {
    bookTalks = false,
    rmi = false,
    dailyGoal = true,
    streaks = true,
    fundraiser = false,
    activities = false,
    reviews = false,
  } = flags

  return (
    <div className="m-home">
      {bookTalks && <PendingBookTalks count={2} onPress={() => onGoTo?.('log', 'bookTalks')} />}

      {/* DIVERGENCE — the app opens `rmiSurvey`, the twenty-question flow itself, which this
          prototype doesn't carry. The Reading Motivation tab is where that flow starts from, and
          its own "Answer Questions" button is the same missing door. */}
      {rmi && <MotivatorSurveyCard onPress={() => onGoTo?.('log', 'readingMotivation')} />}
      {dailyGoal && (
        <DailyGoalBanner goalMinutes={STREAK.goalMinutes} totalMinutes={STREAK.totalMinutes} />
      )}

      {/* Closing the streak card is real and it sticks: the app keeps a `streakComponentClosed`
          list of profile ids and leaves a 24pt spacer where the card was. */}
      {streaks && !streakClosed && (
        <StreaksMessage
          title={STREAK.title}
          message={STREAK.message}
          streak={STREAK.streak}
          onViewStreaks={() => onGoTo?.('log', 'streaks')}
          onClose={onCloseStreak}
        />
      )}
      {streaks && streakClosed && <div className="m-home-streak-gap" />}

      {/* The one door on Home with nothing behind it: the app opens `fundraiserScreen`, a
          surface this prototype doesn't carry. */}
      {fundraiser && <FundraisersHomeCard {...FUNDRAISER} onButtonPress={() => {}} />}

      {/* challengeListContainer pulls the section up 20 against its own 56 — netting 36. */}
      <section className="m-home-section m-home-section--challenges">
        <SectionHeader
          title="Current Challenges"
          onViewAll={() => onGoTo?.('discover', 'challenges')}
        />
        <div className="m-home-rail">
          {/* DIVERGENCE — a card opens `challengePageHome`, that challenge's own screen, which
              this prototype doesn't have. It goes to the list the card came from instead. */}
          {HOME_CHALLENGES.map((c, i) => (
            <ChallengeCarouselCard
              key={c.id}
              {...c}
              isFirst={i === 0}
              onPress={() => onGoTo?.('discover', 'challenges')}
            />
          ))}
        </div>
      </section>

      <section className="m-home-section">
        {/* `BookList`'s View All goes to the READING LOG, not All Titles — these are the titles
            you have been logging, so the list of sessions is the fuller version of them. */}
        <SectionHeader title="Recent Titles" onViewAll={() => onGoTo?.('log', 'readingLog')} />
        <div className="m-home-rail m-home-books">
          {RECENT_TITLES.map((b, i) => (
            <button
              key={b.id}
              type="button"
              className={`m-home-book${i === 0 ? ' is-first' : ''}`}
              aria-label={`${b.title} Book`}
              onClick={() => onOpenBook?.(b)}
            >
              <span className="m-home-cover" style={{ background: b.cover }}>
                <span className="m-home-cover-title">{b.title}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="m-home-section">
        <SectionHeader title="My Badges" onViewAll={() => onGoTo?.('log', 'badges')} />
        <HomeBadges badges={EARNED_BADGES} onPress={onOpenBadge} />
      </section>

      {activities && (
        <section className="m-home-section">
          <SectionHeader
            title="My Activities"
            onViewAll={() => onGoTo?.('discover', 'activities')}
          />
          {/* A card's own button goes where View All goes — `onPressButton={viewAllNavigationFn}`
              in the source, the same function passed twice. */}
          <ActivitiesList
            horizontal
            activities={HOME_ACTIVITIES}
            onPress={() => onGoTo?.('discover', 'activities')}
          />
        </section>
      )}

      {reviews && (
        <section className="m-home-section">
          <SectionHeader title="My Reviews" onViewAll={() => onGoTo?.('log', 'reviews_profiles')} />
          <ReviewsList reviews={HOME_REVIEWS} onPress={onOpenReview} />
        </section>
      )}

      {/* Last on the column. Everything above it is something to act on right now — today's goal,
          the streak, the challenges you are in, what you just read. My Stats is the running total
          those produce, so it reads as the summing-up rather than another thing to do. */}
      <div className="m-home-section">
        <MyStats stats={ALL_TIME_STATS} onViewDetailed={() => onGoTo?.('log', 'statistics')} />
      </div>
    </div>
  )
}
