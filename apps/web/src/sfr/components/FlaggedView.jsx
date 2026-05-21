import { useState } from 'react'
import { SessionsTable } from './SessionsTable'
import { ReaderGroupedView } from './ReaderGroupedView'
import './ListView.css'

export function FlaggedView({ sessions, onSelectSession, groupBy }) {
  const [search, setSearch] = useState('')

  const flagged = sessions.filter(s => s.type === 'flagged' || s.type === 'both')
  const filtered = search
    ? flagged.filter(s =>
        s.student.name.toLowerCase().includes(search.toLowerCase()) ||
        s.book.title.toLowerCase().includes(search.toLowerCase())
      )
    : flagged

  return (
    <div className="lv-shell">
      <div className="lv-toolbar">
        <div className="lv-count">
          {flagged.length} flagged {flagged.length === 1 ? 'session' : 'sessions'}
        </div>
        <div className="lv-search-wrap">
          <svg className="lv-search-icon" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="7" cy="7" r="4.5"/>
            <line x1="10.5" y1="10.5" x2="14" y2="14"/>
          </svg>
          <input
            className="lv-search"
            type="search"
            placeholder="Search student or book…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      {groupBy === 'reader'
        ? <ReaderGroupedView sessions={filtered} onSelectSession={onSelectSession} showTypeColumn={false} />
        : <SessionsTable sessions={filtered} onSelectSession={onSelectSession} showTypeColumn={false} />
      }
    </div>
  )
}
