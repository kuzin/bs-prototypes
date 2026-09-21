import { useState } from 'react'
import { Header, BookListItem, EmptyStateView, RefreshControl } from '@mobile/components'
import './FriendFullLog.css'

/**
 * `friendsAndLeaderboards/components/FriendFullLog.tsx` — behind "View Full Reading Log" on a
 * friend's Reading Log tab.
 *
 * The tab itself shows a handful of recent titles; this is the whole thing. It is the ONLY place
 * a friend's log is paginated and refreshable, which is why the tab keeps a text button rather
 * than growing a list.
 *
 * Rows are the app's shared `BookListItem` with `disabled` — the same row the reader's own log
 * uses, but inert. You can read what a friend has logged and you cannot open it, because there is
 * no session of theirs for you to see.
 *
 * `isSelf` hides the entry point entirely: your own full log is the Log tab, and offering it here
 * would be a second way into a screen you already have.
 */
export function FriendFullLog({ friend, titles = [], onBack }) {
  const [refreshing, setRefreshing] = useState(false)

  const refresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1200)
  }

  return (
    <div className="m-ffl">
      <Header variant="stack" title={`${friend?.firstName ?? ''}'s Log`} onBack={onBack} />

      {titles.length === 0 ? (
        <EmptyStateView
          source="recent_titles_empty_state"
          boldText="No Reading Sessions"
          middleText="have been recorded"
        />
      ) : (
        <RefreshControl className="m-ffl-scroll" refreshing={refreshing} onRefresh={refresh}>
          <div className="m-ffl-list">
            {titles.map((t) => (
              <BookListItem
                key={t.id}
                disabled
                title={t.title}
                author={t.author}
                /* `cover` is a background the caller supplies; `coverColor` is a BARE hex the
                   component prefixes with #. The fixture's covers are gradients, so they are the
                   former — passing one as the latter yields `#linear-gradient(…)` and no cover. */
                cover={t.cover}
              />
            ))}
          </div>
          <div className="m-ffl-foot" />
        </RefreshControl>
      )}
    </div>
  )
}
