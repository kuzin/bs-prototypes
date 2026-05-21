import { useState } from 'react'
import { FilterBar, FilterItem } from '../../ris/components/FilterBar'
import { Select } from '../../ris/components/Form'
import { SessionsTable } from './SessionsTable'
import { ReaderGroupedView } from './ReaderGroupedView'
import '../../ris/components/FilterBar.css'
import '../../ris/components/Form.css'
import './ListView.css'

export function AllBTWBView({ sessions, onSelectSession, groupBy }) {
  const [search, setSearch] = useState('')
  const [type,   setType]   = useState('all')
  const [rating, setRating] = useState('all')

  const filtered = sessions.filter(s => {
    const matchType   = type === 'all' || s.type === type
    const matchRating = rating === 'all' || s.engagementRating === rating
    const matchSearch = !search || (
      s.student.name.toLowerCase().includes(search.toLowerCase()) ||
      s.book.title.toLowerCase().includes(search.toLowerCase())
    )
    return matchType && matchRating && matchSearch
  })

  return (
    <div className="lv-shell">
      <div className="lv-toolbar">
        <div className="lv-count">
          {sessions.length} Book Talks total
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
      <FilterBar>
        <FilterItem label="Type">
          <Select value={type} onChange={e => setType(e.target.value)}>
            <option value="all">All types</option>
            <option value="flagged">Flagged</option>
            <option value="engagement">Engagement</option>
          </Select>
        </FilterItem>
        <FilterItem label="Engagement rating">
          <Select value={rating} onChange={e => setRating(e.target.value)}>
            <option value="all">All ratings</option>
            <option value="green">Positive</option>
            <option value="yellow">Mixed</option>
            <option value="red">Disengaged</option>
          </Select>
        </FilterItem>
      </FilterBar>
      {groupBy === 'reader'
        ? <ReaderGroupedView sessions={filtered} onSelectSession={onSelectSession} showTypeColumn />
        : <SessionsTable sessions={filtered} onSelectSession={onSelectSession} showTypeColumn />
      }
    </div>
  )
}
