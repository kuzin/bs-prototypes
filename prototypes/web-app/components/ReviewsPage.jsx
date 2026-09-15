import { useEffect, useState } from 'react'
import { Tabs } from '@components/Tabs/Tabs'

import { Reviews } from './Reviews'
import { PeerReviews } from './PeerReviews'
import '@components/CollectionShelf/CollectionShelf.css'

import '@components/Tabs/Tabs.css'

/**
 * Reviews as its own destination in the reader nav, holding the two pages that
 * are counterparts of each other: the reader's own reviews
 * (`profiles/reviews.html.haml`) and everybody else's
 * (`microsite#peer_reviews`).
 *
 * They were both sub-tabs under Reading, which put four things on that strip
 * and buried the peer page two levels down — it's a browse of its own, not a
 * view of your log.
 */

const TABS = [
  { id: 'mine', label: 'Reviews' },
  { id: 'peer', label: 'Peer Reviews' },
]

export function ReviewsPage({ composing, onCompose }) {
  const [tab, setTab] = useState('mine')

  // Starting a review from the top bar lands on the reader's own page, not
  // on everybody else's.
  useEffect(() => {
    if (composing) setTab('mine')
  }, [composing])
  return (
    <div className="rvp">
      {/* The pane switcher sits on a full-bleed band flush under the main nav —
          the same shape Collections and the Reading Log use next door. */}
      <div className="co-subtabs">
        <Tabs
          variant="pill"
          plain
          size="md"
          active={tab}
          accent="#1A6DD5"
          onChange={setTab}
          ariaLabel="Whose reviews"
          items={TABS}
        />
      </div>
      {tab === 'mine' ? <Reviews composing={composing} onCompose={onCompose} /> : <PeerReviews />}
    </div>
  )
}
