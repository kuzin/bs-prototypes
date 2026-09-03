import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { Pill } from '@components/Pill/Pill'
import { PartnerMark } from '@components/PartnerBrand/PartnerBrand'

import { READING_LOG, LOG_STREAK, LOG_MONTH } from '../data'
import { CONNECTIONS, CONNECTION_LIST } from '../connections'
import './ReadingLog.css'

import '@components/Button/Button.css'
import '@components/Tabs/Tabs.css'
import '@components/Pill/Pill.css'

// Beanstack's Reading Log — calendar and list views over the same entries.
// Sessions that arrived from a linked reading app are tagged with that app's
// mark and say when they were imported, so a reader can tell at a glance which
// rows they logged themselves.

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const entriesOn = (key) => READING_LOG.filter((e) => e.date === key)

/** The calendar grid always shows whole weeks, so it spills into both neighbours. */
function monthGrid(year, month) {
  const first = new Date(year, month, 1)
  const start = new Date(year, month, 1 - first.getDay())
  const weeks = []
  const cursor = new Date(start)
  while (weeks.length < 6) {
    const week = []
    for (let i = 0; i < 7; i++) {
      week.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
    // Stop once we've passed the last day of the month.
    if (cursor.getMonth() !== month && cursor.getDate() > 7) break
  }
  return weeks
}

function amount(e) {
  const bits = []
  if (e.minutes) bits.push(`${e.minutes} Minutes`)
  if (e.pages) bits.push(`${e.pages} Pages`)
  return bits
}

/** "Imported from Comics Plus on 6/3/26" — hover the partner mark to see it. */
function ImportedTag({ entry }) {
  const p = CONNECTIONS[entry.source]
  if (!p) return null
  return (
    <span className="rl-imported" tabIndex={0}>
      <PartnerMark id={entry.source} size={16} />
      <span className="rl-tip" role="tooltip">
        Imported from {p.name} on {entry.importedOn}
      </span>
    </span>
  )
}

function EntryChip({ entry, dense, showImported = true }) {
  const amounts = amount(entry)
  return (
    <div className={`rl-entry rl-entry--${entry.tone}${dense ? ' rl-entry--dense' : ''}`}>
      <div className="rl-entry-main">
        <div className="rl-entry-title">{entry.title}</div>
        {entry.author && <div className="rl-entry-author">{entry.author}</div>}
        {amounts.length > 0 && (
          <div className="rl-entry-amounts">
            {amounts.map((a) => (
              <span key={a}>{a}</span>
            ))}
          </div>
        )}
        {entry.completed && (
          <span className="rl-entry-pill">
            <Pill color="#0F7A55" variant="soft" size="sm">
              Completed
            </Pill>
          </span>
        )}
      </div>
      {showImported && entry.source && <ImportedTag entry={entry} />}
    </div>
  )
}

function CalendarView({ showImported }) {
  const weeks = monthGrid(LOG_MONTH.year, LOG_MONTH.month)
  return (
    <div className="rl-cal">
      <div className="rl-cal-head">
        {WEEKDAYS.map((d) => (
          <div key={d} className="rl-cal-dow">
            {d}
          </div>
        ))}
      </div>
      <div className="rl-cal-body">
        {weeks.map((week, wi) => (
          <div key={wi} className="rl-cal-week">
            {week.map((day) => {
              const key = iso(day)
              const rows = entriesOn(key)
              const outside = day.getMonth() !== LOG_MONTH.month
              const streak = rows.find((r) => r.streak)?.streak
              return (
                <div key={key} className={`rl-cal-cell${outside ? ' is-outside' : ''}`}>
                  <div className="rl-cal-date">{day.getDate()}</div>
                  {streak && (
                    <div className="rl-cal-streak">
                      {streak} day streak
                      <Icon name="flame-filled" size={13} />
                    </div>
                  )}
                  {rows.map((e) => (
                    <EntryChip key={e.id} entry={e} dense showImported={showImported} />
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function ListView({ showImported }) {
  const weeks = monthGrid(LOG_MONTH.year, LOG_MONTH.month)
  return (
    <div className="rl-list">
      {weeks.map((week, wi) => {
        const days = week.filter((d) => entriesOn(iso(d)).length > 0)
        if (days.length === 0) return null
        const first = week[0]
        const last = week[6]
        const range =
          first.getMonth() === last.getMonth()
            ? `${MONTHS[first.getMonth()]} ${first.getDate()}–${last.getDate()}`
            : `${MONTHS[first.getMonth()]} ${first.getDate()}–${MONTHS[last.getMonth()]} ${last.getDate()}`
        return (
          <section key={wi} className="rl-week">
            <div className="rl-week-range">{range}</div>
            {/* Most recent day first, matching the product. */}
            {[...days].reverse().map((day) => {
              const rows = entriesOn(iso(day))
              const streak = rows.find((r) => r.streak)?.streak
              return (
                <div key={iso(day)} className="rl-day">
                  <div className="rl-day-when">
                    <div className="rl-day-num">{day.getDate()}</div>
                    <div className="rl-day-name">{DAY_NAMES[day.getDay()]}</div>
                    {streak && (
                      <div className="rl-day-streak">
                        <Icon name="flame-filled" size={12} /> {streak}
                      </div>
                    )}
                  </div>
                  <div className="rl-day-rows">
                    {rows.map((e) => (
                      <EntryChip key={e.id} entry={e} showImported={showImported} />
                    ))}
                  </div>
                </div>
              )
            })}
          </section>
        )
      })}
    </div>
  )
}

/** "All Titles" — the same entries rolled up per book. */
function TitlesView() {
  const byTitle = new Map()
  for (const e of READING_LOG) {
    if (e.kind !== 'log') continue
    const row = byTitle.get(e.title) ?? {
      title: e.title,
      author: e.author,
      minutes: 0,
      pages: 0,
      sessions: 0,
      sources: new Set(),
      completed: false,
    }
    row.minutes += e.minutes ?? 0
    row.pages += e.pages ?? 0
    row.sessions += 1
    row.completed = row.completed || Boolean(e.completed)
    if (e.source) row.sources.add(e.source)
    byTitle.set(e.title, row)
  }
  const rows = [...byTitle.values()].sort((a, b) => b.minutes - a.minutes)

  return (
    <div className="rl-titles">
      <div className="rl-titles-row rl-titles-row--head">
        <span>Title</span>
        <span>Sessions</span>
        <span>Minutes</span>
        <span>Pages</span>
        <span>Source</span>
      </div>
      {rows.map((r) => (
        <div key={r.title} className="rl-titles-row">
          <span className="rl-titles-title">
            {r.title}
            <span className="rl-titles-author">{r.author}</span>
            {r.completed && (
              <Pill color="#0F7A55" variant="soft" size="sm">
                Completed
              </Pill>
            )}
          </span>
          <span>{r.sessions}</span>
          <span>{r.minutes || '—'}</span>
          <span>{r.pages || '—'}</span>
          <span className="rl-titles-source">
            {r.sources.size === 0 ? (
              <span className="rl-titles-manual">Logged by hand</span>
            ) : (
              [...r.sources].map((s) => (
                <span key={s} className="rl-titles-src">
                  <PartnerMark id={s} size={16} /> {CONNECTIONS[s].name}
                </span>
              ))
            )}
          </span>
        </div>
      ))}
    </div>
  )
}

// `partners` is the list of reading apps this prototype offers to link; pass
// `[]` and the log drops everything about imported sessions — the note and the
// per-entry partner marks — since with nothing linked there's nothing to
// explain. Defaults to logging-flow's own list, so that prototype is unchanged.
//
// `titlesView={false}` leaves the "All Titles" tab standing but inert — it is
// part of the real page's furniture, so it stays visible, it just doesn't go
// anywhere in a prototype that isn't about it.
export function ReadingLog({ partners = CONNECTION_LIST, titlesView = true }) {
  const [tab, setTab] = useState('log')
  const [view, setView] = useState('calendar')

  const imported = partners.length ? READING_LOG.filter((e) => e.source).length : 0

  return (
    <div className="rl-page">
      <div className="rl-subtabs">
        <Tabs
          variant="pill"
          plain
          size="md"
          active={tab}
          onChange={(id) => (id !== 'titles' || titlesView) && setTab(id)}
          items={[
            { id: 'log', label: 'Reading Log' },
            { id: 'titles', label: 'All Titles' },
          ]}
        />
      </div>

      <div className="rl-head">
        <h1 className="rl-title">Reading Log</h1>
        <div className="rl-head-actions">
          <Button variant="secondary" size="md">
            Print log
          </Button>
          {tab === 'log' && (
            <div className="rl-viewtoggle">
              {[
                { id: 'calendar', icon: 'layout-grid', label: 'Calendar view' },
                { id: 'list', icon: 'list', label: 'List view' },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  aria-label={v.label}
                  className={`rl-viewbtn${view === v.id ? ' is-active' : ''}`}
                  onClick={() => setView(v.id)}
                >
                  <Icon name={v.icon} size={17} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rl-streaks">
        <div className="rl-streak rl-streak--current">
          <Icon name="flame-filled" size={20} />
          <div>
            <div className="rl-streak-num">{LOG_STREAK.current} Days</div>
            <div className="rl-streak-lbl">Current streak</div>
          </div>
        </div>
        <div className="rl-streak rl-streak--longest">
          <Icon name="flame-filled" size={20} />
          <div>
            <div className="rl-streak-num">{LOG_STREAK.longest} Days</div>
            <div className="rl-streak-lbl">Longest streak</div>
          </div>
        </div>
      </div>

      {imported > 0 && (
        <p className="rl-importnote">
          <Icon name="bolt" size={15} />
          {imported} of these sessions came in from your linked reading apps — hover a logo to see
          where and when.
        </p>
      )}

      {tab === 'log' ? (
        <>
          <div className="rl-month">
            <h2 className="rl-month-label">{LOG_MONTH.label}</h2>
            <div className="rl-month-nav">
              <button type="button" className="rl-navbtn" aria-label="Previous month">
                <Icon name="chevron-left" size={17} />
              </button>
              <button type="button" className="rl-navbtn" aria-label="Next month">
                <Icon name="chevron-right" size={17} />
              </button>
            </div>
          </div>
          {view === 'calendar' ? (
            <CalendarView showImported={imported > 0} />
          ) : (
            <ListView showImported={imported > 0} />
          )}
        </>
      ) : (
        <TitlesView />
      )}
    </div>
  )
}
