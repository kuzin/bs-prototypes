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
 */
export function HomeScreen({ flags = {} }) {
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
      {bookTalks && <PendingBookTalks count={2} onPress={() => {}} />}

      {rmi && <MotivatorSurveyCard onPress={() => {}} />}
      {dailyGoal && (
        <DailyGoalBanner goalMinutes={STREAK.goalMinutes} totalMinutes={STREAK.totalMinutes} />
      )}

      {streaks && (
        <StreaksMessage
          title={STREAK.title}
          message={STREAK.message}
          streak={STREAK.streak}
          onViewStreaks={() => {}}
          onClose={() => {}}
        />
      )}

      {fundraiser && <FundraisersHomeCard {...FUNDRAISER} onButtonPress={() => {}} />}

      {/* challengeListContainer pulls the section up 20 against its own 56 — netting 36. */}
      <section className="m-home-section m-home-section--challenges">
        <SectionHeader title="Current Challenges" onViewAll={() => {}} />
        <div className="m-home-rail">
          {HOME_CHALLENGES.map((c, i) => (
            <ChallengeCarouselCard key={c.id} {...c} isFirst={i === 0} onPress={() => {}} />
          ))}
        </div>
      </section>

      <section className="m-home-section">
        <SectionHeader title="Recent Titles" onViewAll={() => {}} />
        <div className="m-home-rail m-home-books">
          {RECENT_TITLES.map((b, i) => (
            <button
              key={b.id}
              type="button"
              className={`m-home-book${i === 0 ? ' is-first' : ''}`}
              aria-label={`${b.title} Book`}
            >
              <span className="m-home-cover" style={{ background: b.cover }}>
                <span className="m-home-cover-title">{b.title}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="m-home-section">
        <SectionHeader title="My Badges" onViewAll={() => {}} />
        <HomeBadges badges={EARNED_BADGES} />
      </section>

      {activities && (
        <section className="m-home-section">
          <SectionHeader title="My Activities" onViewAll={() => {}} />
          <ActivitiesList horizontal activities={HOME_ACTIVITIES} onPress={() => {}} />
        </section>
      )}

      {reviews && (
        <section className="m-home-section">
          <SectionHeader title="My Reviews" onViewAll={() => {}} />
          <ReviewsList reviews={HOME_REVIEWS} onPress={() => {}} />
        </section>
      )}

      {/* Last on the column. Everything above it is something to act on right now — today's goal,
          the streak, the challenges you are in, what you just read. My Stats is the running total
          those produce, so it reads as the summing-up rather than another thing to do. */}
      <div className="m-home-section">
        <MyStats stats={ALL_TIME_STATS} onViewDetailed={() => {}} />
      </div>
    </div>
  )
}
