import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Pill } from '@components/Pill/Pill'
import { SessionModal } from '../components/SessionModal'
import { SESSIONS, TALK_KINDS } from '../data'

import '@components/Modal/Modal.css'
import '@components/Primitives/Primitives.css'
// Chat bubbles for the transcript inside the session modal.
import '../../book-talks/index.css'

// The educator's side: a completed book talk per talk type, so you can compare
// what each kind of conversation actually hands back — plus a second
// comprehension talk, the one that stalls, since a mixed result is where the
// per-answer flags and their reasoning do the most work. Open one to see the
// session modal — Benny's summary, Reading Confidence, and the transcript.
export function SessionsView() {
  const [active, setActive] = useState(null)

  return (
    <div className="bw-scroll">
      <div className="bw-page">
        <header className="bw-page-head">
          <div>
            <h1 className="bw-h1">Book talk sessions</h1>
            <p className="bw-sub">
              What lands on the educator’s side — each talk type, and what its flags explain
            </p>
          </div>
        </header>

        <ul className="bw-session-list">
          {SESSIONS.map((s) => {
            const kind = TALK_KINDS[s.kindId]
            return (
              <li key={s.id}>
                <button
                  className="bw-session-card"
                  style={{ '--kind': kind.color }}
                  onClick={() => setActive(s)}
                >
                  <span className="bw-session-card-body">
                    <span className="bw-session-card-top">
                      <span className="bw-session-card-name">{s.student.name}</span>
                      <Pill color={kind.color} size="sm">
                        {kind.short}
                      </Pill>
                    </span>
                    <span className="bw-session-card-book">
                      {s.book.title} · {s.book.author}
                    </span>
                    <span className="bw-session-card-trigger">
                      <Icon name="bolt" size={13} />
                      {s.trigger}
                    </span>
                  </span>

                  <span className="bw-session-card-right">
                    {/* Both polarities, the way SFR surfaces flag counts. */}
                    {s.positiveFlags.length > 0 && (
                      <span className="bw-session-card-flags bw-session-card-flags--pos">
                        <Icon name="flag" size={13} />
                        {s.positiveFlags.length}
                      </span>
                    )}
                    {s.flags.length > 0 && (
                      <span className="bw-session-card-flags">
                        <Icon name="flag" size={13} />
                        {s.flags.length}
                      </span>
                    )}
                    <Icon name="chevron-right" size={18} className="bw-session-card-chev" />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <SessionModal session={active} onSelectSession={setActive} onClose={() => setActive(null)} />
    </div>
  )
}
