import { useState } from 'react'
import { PageHeader } from '@components/PageHeader/PageHeader'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { Flyout, FlyoutMenu, FlyoutMenuItem } from '@components/Flyout/Flyout'
import '@components/Flyout/Flyout.css'
import { Table } from '@components/Table/Table'
import { SearchBar } from '../components/SearchBar'
import { EmptyState } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import {
  ClassBookList,
  ScoreCards,
  BennySays,
  ReadingGoalAndActions,
  FactorTable,
  FactorIcon,
} from '../components/ReportBlocks'
import { summaryFor, recommendationsFor, readingGoalFor, topThreeFactors } from '../scoring'
import { studentById, SURVEY_URL, EDUCATOR } from '../data'
import { bandForGrades } from '../titles'
import { formatLongRange, formatAnalysedAt, fractionCollected } from '../format'
import './IndexView.css'

/**
 * One index period — `classroom/survey_requests/show` and its Students tab
 * (`classroom/survey_responses/index`). Both sit under the shared header
 * partial, which is why the header and tab strip live here and the two tabs
 * are just bodies.
 */
const ACTIONS = [
  { label: 'Edit Index', icon: 'pencil' },
  { label: 'Print Access Codes', icon: 'printer' },
  { label: 'Download', icon: 'download' },
]

export function IndexView({ index, tab, onTab, onOpenStudent }) {
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const scored = index.responses.length > 0

  function copyUrl() {
    navigator.clipboard?.writeText(`https://${SURVEY_URL}`).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <>
      {/* `.page-header__actions-index-tags` — the buttons and the two tags are
          one right-hand column in the header, not a strip under it. */}
      <PageHeader
        title={index.name}
        subtitle={formatLongRange(index.startDate, index.endDate)}
        actions={
          <div className="rmi-header-stack">
            <div className="rmi-header-buttons">
              {tab === 'students' && (
                <Button
                  variant="secondary"
                  size="md"
                  iconOnly
                  aria-label="Toggle search"
                  aria-expanded={searchOpen}
                  onClick={() => setSearchOpen((o) => !o)}
                >
                  <Icon name={searchOpen ? 'x' : 'search'} size={18} />
                </Button>
              )}
              <ActionsMenu />
            </div>

            <div className="rmi-index-tags">
              <div className="rmi-index-tag">
                Results collected
                <span className="rmi-index-tag-highlight">{fractionCollected(index)}</span>
              </div>
              <div className="rmi-index-tag">
                Index URL
                <button
                  type="button"
                  className="rmi-index-tag-highlight rmi-index-tag-copy"
                  onClick={copyUrl}
                  aria-label="Copy survey URL"
                >
                  {SURVEY_URL}
                  <Icon name={copied ? 'check' : 'copy'} size={16} />
                </button>
              </div>
            </div>
          </div>
        }
      />

      <Tabs
        active={tab}
        onChange={onTab}
        items={[
          { id: 'summary', label: 'Summary' },
          { id: 'students', label: 'Students' },
          { id: 'books', label: 'Book List' },
        ]}
      />

      <div className="rmi-report">
        {tab === 'summary' ? (
          <SummaryTab index={index} scored={scored} />
        ) : tab === 'books' ? (
          <BooksTab index={index} />
        ) : (
          <StudentsTab
            index={index}
            query={query}
            onQuery={setQuery}
            searchOpen={searchOpen}
            onCloseSearch={() => setSearchOpen(false)}
            onOpenStudent={onOpenStudent}
          />
        )}
      </div>
    </>
  )
}

/**
 * `Actions` — the header's three buttons behind one control.
 *
 * Three buttons of near-equal weight is three decisions to make before reading
 * the report, and two of them were primary, which made the page look like it
 * wanted something. One trigger says the page has actions without arguing about
 * which one matters; the search toggle stays out of it because it acts on the
 * table below rather than on the index.
 */
function ActionsMenu() {
  return (
    <Flyout
      placement="bottom-end"
      trigger={({ toggle, open }) => (
        <Button
          variant="primary"
          size="md"
          iconRight={<Icon name="chevron-down" size={15} stroke={2.4} />}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={toggle}
        >
          Actions
        </Button>
      )}
    >
      {({ close }) => (
        <FlyoutMenu>
          {ACTIONS.map(({ label, icon }) => (
            <FlyoutMenuItem key={label} icon={<Icon name={icon} size={17} />} onClick={close}>
              {label}
            </FlyoutMenuItem>
          ))}
        </FlyoutMenu>
      )}
    </Flyout>
  )
}

function SummaryTab({ index, scored }) {
  if (!scored) {
    return (
      <EmptyState
        variant="dashed"
        title="No data collected."
        description="See summary results and recommended actions once a student has completed their survey."
      />
    )
  }

  const summary = summaryFor(index.scores, { subject: index.name, kind: 'group' })
  const recommendations = recommendationsFor(index.scores, { kind: 'group', seed: index.name })

  return (
    <>
      <ScoreCards scores={index.scores} average />
      <BennySays summary={summary} analysedAt={formatAnalysedAt(index.analysedAt)} />
      <ReadingGoalAndActions
        goal={readingGoalFor(index.scores)}
        recommendations={recommendations}
      />
      <FactorTable scores={index.scores} />
    </>
  )
}

/**
 * `Book List` — what to pull off the shelf for this class.
 *
 * Its own tab rather than a block on the summary: it's the one part of a report
 * you act on somewhere else, at the shelves or in a purchase order, so it wants
 * the whole width.
 *
 * No reader filter. One reader's lists are their own report's Book List tab,
 * which is where you'd be if you wanted them — narrowing a class pull list to
 * one child answers a question nobody asks standing at the shelves.
 */
function BooksTab({ index }) {
  return <ClassBookList responses={index.responses} band={bandForGrades(EDUCATOR.grades)} />
}

function StudentsTab({ index, query, onQuery, searchOpen, onCloseSearch, onOpenStudent }) {
  const rows = index.responses
    .map((response) => {
      const student = studentById(response.studentId)
      return {
        id: student.id,
        name: student.name,
        completion: 100,
        top: topThreeFactors(response.scores),
        intrinsic: response.scores.intrinsic,
        extrinsic: response.scores.extrinsic,
        overall: response.scores.overall,
        accessCode: student.accessCode,
      }
    })
    .filter((r) => r.name.toLowerCase().includes(query.trim().toLowerCase()))

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (v, row) => (
        <button type="button" className="rmi-link" onClick={() => onOpenStudent(row.id)}>
          {v}
        </button>
      ),
    },
    { key: 'completion', label: 'Completion %', sortable: true, render: (v) => `${v}%` },
    {
      key: 'top',
      label: 'Top Motivators',
      render: (top) => (
        <div className="rmi-top-motivators">
          {top.map((f) => (
            <FactorIcon key={f.name} factor={f.name} />
          ))}
        </div>
      ),
    },
    {
      key: 'intrinsic',
      label: 'Intrinsic',
      align: 'right',
      sortable: true,
      render: (v) => v.toFixed(1),
    },
    {
      key: 'extrinsic',
      label: 'Extrinsic',
      align: 'right',
      sortable: true,
      render: (v) => v.toFixed(1),
    },
    {
      key: 'overall',
      label: 'Overall',
      align: 'right',
      sortable: true,
      render: (v) => <strong>{v.toFixed(1)}</strong>,
    },
    {
      key: 'accessCode',
      label: 'Access Code',
      render: (v) => <code className="rmi-access-code">{v}</code>,
    },
  ]

  return (
    <>
      <SearchBar
        open={searchOpen}
        label="Student Name"
        value={query}
        onChange={onQuery}
        onClose={onCloseSearch}
      />

      {rows.length > 0 ? (
        <div className="rmi-card-table">
          <Table columns={columns} rows={rows} getRowKey={(r) => r.id} pageSize={12} scrollX />
        </div>
      ) : (
        <EmptyState
          variant="dashed"
          title="No students found."
          description="Try a different student name or clear your search."
        />
      )}
    </>
  )
}
