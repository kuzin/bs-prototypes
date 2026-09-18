import { TopTabs, Text, TextPill, Img, EmptyStateView } from '@mobile/components'
import { Challenges } from './discover/Challenges'
import { Events } from './discover/Events'
import { BookLists } from './discover/BookLists'
import { ActivitiesList } from '../components/ActivitiesList'
import { Reviews } from './log/Reviews'
import { DISCOVER_CHALLENGES, ACTIVITIES, BOOK_LISTS, EVENTS, DISCOVER_REVIEWS } from '../data'
import './Screens.css'

/**
 * The Discover tab — `navigation/discoverTab/ChallengesTopTabNavigator.tsx`.
 *
 * Note the naming: the bottom tab's route is `challengesContainer` and its label is "Discover",
 * and `ChallengesBottomTabNavigator` is actually a stack. Real names, kept.
 */
export const GATED = ['reviews_discover', 'libraries_discover', 'book_lists']

export const DISCOVER_TABS = [
  { id: 'challenges', label: 'Challenges' },
  { id: 'activities', label: 'Activities' },
  { id: 'reviews_discover', label: 'Reviews' },
  { id: 'libraries_discover', label: 'Libraries' },
  { id: 'book_lists', label: 'Book Lists' },
  { id: 'events', label: 'Events' },
]

export function DiscoverScreen({ tab, onTab, flags = {}, onOpenList, onOpenEvent }) {
  const visible = DISCOVER_TABS.filter((t) => !GATED.includes(t.id) || flags[t.id])
  return (
    <>
      <TopTabs tabs={visible} active={tab} onChange={onTab} />
      <div className="m-scroll">
        {tab === 'challenges' && (
          <Challenges
            challenges={DISCOVER_CHALLENGES}
            user="Maya"
            micrositeName="Lakeside Elementary"
          />
        )}
        {/* `screens/activities/Activities.tsx` — the SAME ActivitiesList as Home, but with
            `horizontal` omitted, so it renders the ringed ActivityItem rows rather than the
            87pt badge rail. */}
        {tab === 'activities' &&
          (ACTIVITIES.length > 0 ? (
            <ActivitiesList activities={ACTIVITIES} onPress={() => {}} />
          ) : (
            <EmptyStateView
              source="my_badges_empty_state"
              boldText="No Activities to Show"
              middleText="There are no activities running at this time."
            />
          ))}
        {tab === 'book_lists' && <BookLists lists={BOOK_LISTS} onOpenList={onOpenList} />}
        {tab === 'events' && <Events events={EVENTS} onOpenEvent={onOpenEvent} />}
        {/* The same component the Log tab uses — `<Reviews type="discover" />` in the real
            navigator, which adds the author's name and the profile circle. */}
        {tab === 'reviews_discover' && (
          <Reviews reviews={DISCOVER_REVIEWS} profile="Maya Chen" type="discover" />
        )}
        {/* ClassroomLibraries' own empty state — `recent_titles_empty_state` artwork, and the
            copy is the patron branch. A non-patron sees a different message entirely. */}
        {tab === 'libraries_discover' && (
          <EmptyStateView
            source="recent_titles_empty_state"
            boldText="No classroom libraries to show"
            middleText="Your teachers haven’t added any books to their libraries yet."
          />
        )}
      </div>
    </>
  )
}
