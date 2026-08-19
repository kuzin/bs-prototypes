import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Toggle } from '@components/Toggle/Toggle'
import { SectionCard } from '@components/SectionCard/SectionCard'
import { Stepper } from '@components/Stepper/Stepper'
import { Tabs } from '@components/Tabs/Tabs'
import { Table } from '@components/Table/Table'
import { CoverTile, BadgeDisc, WordChips } from './common'
import { badgesForPath } from '../data'
import { DESTINATION, DESTINATION_CATALOG, PATHS, VOCAB } from '../data'

// What each badge kind is called in the Badges table's Type column.
const BADGE_KIND_LABEL = {
  reading: 'Per title',
  activity: 'Per activity',
  destination: 'Destination',
}

const SETUP_STEPS = [
  { id: 'destination', name: 'Destination' },
  { id: 'paths', name: 'Paths' },
]

// One offerable path — a bold illustrated card. The Offered switch lives in the
// header, next to the path name. The teacher is vetting what they're assigning,
// so the open state shows the FULL shelf (every title, captioned) and every badge
// with its name and requirement — no previews or "+N more" folds. That runs long,
// so the whole thing folds behind a counts summary: collapsed, the three paths
// read as one scannable list; expanded, one path is vetted in full.
function PathOffer({ path, on, disabled, onToggle, open, onToggleOpen }) {
  // Shown fully earned — this is what the path offers, not a student's progress.
  const badges = badgesForPath(
    path,
    path.titles.map((t) => t.id),
    path.activities.map((a) => a.id),
  )
  const bodyId = `pyp-pathoffer-body-${path.id}`
  const [tab, setTab] = useState('books')

  return (
    <div
      className={`pyp-pathoffer${on ? ' is-on' : ' is-off'}${open ? ' is-open' : ' is-collapsed'}`}
      style={{ '--path-color': path.color }}
    >
      {/* Header row: name and tagline as dark type on white — the full-bleed
          illustrated band this replaced read poorly with text over it. The path's
          identity is carried by its icon tile and its accent color. */}
      <div className="pyp-pathoffer-row">
        <button
          type="button"
          className="pyp-pathoffer-disclose"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={onToggleOpen}
        >
          <span className="pyp-pathoffer-chev">
            <Icon name="chevron-down" size={18} stroke={2.4} />
          </span>
          <span className="pyp-pathoffer-thumb">
            <Icon name={path.icon} size={20} stroke={1.9} />
          </span>
          <span className="pyp-pathoffer-text">
            <span className="pyp-pathoffer-name">{path.name}</span>
            <span className="pyp-pathoffer-tag">{path.tagline}</span>
          </span>
        </button>

        <span className="pyp-pathoffer-toggle">
          <Toggle checked={on} onChange={onToggle} disabled={disabled}>
            {on ? 'Offered' : 'Not offered'}
          </Toggle>
        </span>
      </div>

      <div className="pyp-pathoffer-body" id={bodyId} hidden={!open}>
        {/* One facet at a time. All three stacked at once — a 10-cover grid, the
            activities, and 13 badges — was too much to take in, so the body
            previews the same way the student's own destination page is split. */}
        <div className="pyp-pathoffer-tabs">
          <Tabs
            variant="pill"
            size="lg"
            block
            active={tab}
            accent={path.color}
            onChange={setTab}
            ariaLabel={`${path.name} contents`}
            items={[
              { id: 'books', label: 'Books', count: path.titles.length },
              { id: 'vocabulary', label: 'Vocabulary', count: VOCAB.length },
              { id: 'activities', label: 'Activities', count: path.activities.length },
              { id: 'badges', label: 'Badges', count: badges.length },
            ]}
          />
        </div>

        {/* All four panels are the same shared Table, so switching tabs changes
            the data and not the furniture. */}
        {tab === 'books' && (
          <div className="pyp-paneltable pyp-paneltable--books">
            <Table
              columns={[
                { key: 'book', label: 'Title' },
                { key: 'level', label: 'Reading level' },
                { key: 'pages', label: 'Pages', align: 'right' },
              ]}
              rows={path.titles.map((t) => ({
                id: t.id,
                book: (
                  <span className="pyp-cell-media">
                    <span className="pyp-cell-cover">
                      <CoverTile cover={t.cover} label={t.title} path={path} />
                    </span>
                    <span className="pyp-cell-text">
                      <span className="pyp-cell-name">{t.title}</span>
                      <span className="pyp-cell-sub">by {t.author}</span>
                    </span>
                  </span>
                ),
                level: t.level,
                pages: t.pages,
              }))}
              zebra
              compact
            />
          </div>
        )}

        {tab === 'vocabulary' && (
          <div className="pyp-paneltable pyp-paneltable--vocabulary">
            <Table
              columns={[
                { key: 'word', label: 'Word' },
                { key: 'meaning', label: 'What it means' },
                { key: 'titles', label: 'Titles', align: 'right' },
                { key: 'activities', label: 'Practiced in' },
              ]}
              rows={VOCAB.map((v) => {
                const inTitles = path.titles.filter((t) => t.words.includes(v.word))
                const inActivities = path.activities.filter((a) => a.words.includes(v.word))
                return {
                  id: v.word,
                  word: <span className="pyp-cell-name pyp-cell-word">{v.word}</span>,
                  meaning: v.definition,
                  titles: inTitles.length,
                  activities: inActivities.length ? (
                    inActivities.map((a) => a.name).join(', ')
                  ) : (
                    <span className="pyp-cell-none">Reading only</span>
                  ),
                }
              })}
              zebra
              compact
            />
          </div>
        )}

        {tab === 'activities' && (
          <div className="pyp-paneltable pyp-paneltable--activities">
            <Table
              columns={[
                { key: 'activity', label: 'Activity' },
                { key: 'prompt', label: 'What students do offline' },
                { key: 'requirement', label: 'To earn the badge' },
              ]}
              rows={path.activities.map((a) => ({
                id: a.id,
                activity: (
                  <span className="pyp-cell-media">
                    <span className="pyp-cell-icon">
                      <Icon name={a.icon} size={16} stroke={1.9} />
                    </span>
                    <span className="pyp-cell-text">
                      <span className="pyp-cell-name">{a.name}</span>
                      <WordChips words={a.words} size="xs" />
                    </span>
                  </span>
                ),
                prompt: a.prompt,
                requirement: a.requirement,
              }))}
              zebra
              compact
            />
          </div>
        )}

        {tab === 'badges' && (
          <div className="pyp-paneltable pyp-paneltable--badges">
            <Table
              columns={[
                { key: 'badge', label: 'Badge' },
                { key: 'earned', label: 'How it’s earned' },
                { key: 'kind', label: 'Type' },
              ]}
              rows={badges.map((b) => ({
                id: b.id,
                badge: (
                  <span className="pyp-cell-media">
                    <BadgeDisc badge={b} size={34} showLabel={false} showStatus={false} />
                    <span className="pyp-cell-name">{b.name}</span>
                  </span>
                ),
                earned: b.sub,
                kind: <span className="pyp-cell-kind">{BADGE_KIND_LABEL[b.kind]}</span>,
              }))}
              zebra
              compact
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Screen 1 — the teacher sets the academic Destination and chooses which
// interest Paths students may pick from.
export function TeacherSetup({ offered, onTogglePath }) {
  const offeredCount = offered.length
  // Paths showing their full contents. Independent, not an accordion — a teacher
  // comparing two paths shouldn't have one snap shut to open the other.
  const [expanded, setExpanded] = useState([])
  const toggleExpanded = (id) =>
    setExpanded((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))

  return (
    <div className="pyp-teacher">
      <div className="pyp-stepbar">
        <div className="pyp-stepbar-inner">
          <Stepper steps={SETUP_STEPS} current="paths" accent="#0F766E" />
        </div>
      </div>

      <div className="pyp-teacher-body">
        <header className="pyp-page-head">
          <h1 className="pyp-page-title">Set a destination</h1>
          <p className="pyp-page-sub">
            Choose a vocabulary cluster, then pick the interest paths your students can practice
            through.
          </p>
        </header>

        {/* Step 1 — the destination */}
        <SectionCard title="Choose the destination" className="pyp-panel">
          <p className="pyp-panel-sub">The Tier-2 vocabulary cluster every path will practice.</p>
          <div className="pyp-dest-grid">
            {DESTINATION_CATALOG.map((d) => {
              const selected = d.id === DESTINATION.id
              return (
                <button
                  key={d.id}
                  type="button"
                  className={`pyp-dest-card${selected ? ' is-selected' : ''}${d.ready ? '' : ' is-disabled'}`}
                  disabled={!d.ready}
                  aria-pressed={selected}
                >
                  <span className="pyp-dest-icon">
                    <Icon name={d.icon} size={22} stroke={1.8} />
                  </span>
                  <span className="pyp-dest-text">
                    <span className="pyp-dest-subject">{d.subject}</span>
                    <span className="pyp-dest-title">{d.title}</span>
                  </span>
                  {/* selected = filled corner triangle carrying the check, the
                      same treatment as the completion-kind cards in `btwb` */}
                  {selected && (
                    <Icon name="check" size={14} stroke={2.6} className="pyp-dest-check" />
                  )}
                </button>
              )
            })}
          </div>
        </SectionCard>

        {/* Step 2 — the paths */}
        <SectionCard title="Choose the paths students can pick" className="pyp-panel">
          <p className="pyp-panel-sub">
            Same four words, different vehicle — students pick the subject that excites them.
          </p>
          <div className="pyp-pathset">
            {PATHS.map((path) => {
              const on = offered.includes(path.id)
              return (
                <PathOffer
                  key={path.id}
                  path={path}
                  on={on}
                  disabled={on && offeredCount === 1}
                  onToggle={() => onTogglePath(path.id)}
                  open={expanded.includes(path.id)}
                  onToggleOpen={() => toggleExpanded(path.id)}
                />
              )
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
