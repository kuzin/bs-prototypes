import { useState } from 'react'
import { PageHeader } from '@components/PageHeader/PageHeader'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { Table } from '@components/Table/Table'
import { SearchBar } from '../components/SearchBar'
import { EmptyState } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import { Select } from '@components/Form/Form'
import '@components/Form/Form.css'
import {
  BookLists,
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
              <Button variant="secondary" size="md">
                Edit Index
              </Button>
              <Button variant="primary" size="md">
                Print Access Codes
              </Button>
              <Button variant="primary" size="md">
                Download
              </Button>
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
 * you act on somewhere else — at the shelves, or in a purchase order — so it
 * wants the whole width and a way to narrow to the reader in front of you.
 */
function BooksTab({ index }) {
  const [readerId, setReaderId] = useState('all')

  const band = bandForGrades(EDUCATOR.grades)
  const reader = readerId === 'all' ? null : studentById(readerId)
  const response = reader ? index.responses.find((r) => r.studentId === reader.id) : null

  const filter = (
    <label className="rmi-booklist-filter">
      <span>Reader</span>
      <Select value={readerId} onChange={(e) => setReaderId(e.target.value)}>
        <option value="all">All readers</option>
        {index.responses.map((r) => (
          <option key={r.studentId} value={r.studentId}>
            {studentById(r.studentId).name}
          </option>
        ))}
      </Select>
    </label>
  )

  /* Narrowed to one reader it becomes their own three lists — their top type's
     three genres — because that is what this class's copy of the list is made
     of, and it's what you'd hand them. */
  return response ? (
    <BookLists
      factor={topThreeFactors(response.scores)[0].name}
      band={band}
      forReader={reader.name.split(' ')[0]}
      action={filter}
    />
  ) : (
    <ClassBookList responses={index.responses} band={band} action={filter} />
  )
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
