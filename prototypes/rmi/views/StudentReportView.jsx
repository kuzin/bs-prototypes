import { PageHeader } from '@components/PageHeader/PageHeader'
import { Button } from '@components/Button/Button'
import { BackBar } from '@components/BackBar/BackBar'
import { Tabs } from '@components/Tabs/Tabs'
import { Select } from '@components/Form/Form'
import '@components/Form/Form.css'
import { EmptyState } from '@components/Primitives/Primitives'
import {
  ScoreCards,
  BennySays,
  ReadingGoalAndActions,
  TopMotivationTypes,
  GenreRecommendations,
  BookLists,
  FactorTable,
} from '../components/ReportBlocks'
import {
  summaryFor,
  recommendationsFor,
  readingGoalFor,
  percentChange,
  ALL_FACTORS,
  topThreeFactors,
} from '../scoring'
import { responseFor, studentById, EDUCATOR } from '../data'
import { bandForGrades } from '../titles'
import { formatAnalysedAt } from '../format'
import './StudentReportView.css'

/**
 * `classroom/survey_responses/show` — one reader inside one index.
 *
 * The distinctive part is the filter bar: pick another index to compare
 * against and every score grows a ± against that period, which is how an
 * educator sees whether a reader moved between the fall and the winter. It
 * belongs to the summary — a comparison changes the scores, and there is
 * nothing on a book list for it to change.
 *
 * The lists sit on their own tab, as they do on the index: a report is
 * something you read and a book list is something you act on somewhere else,
 * at the shelves or in a purchase order, and thirty-six jackets underneath the
 * factor table buried the report they were meant to follow from.
 */
export function StudentReportView({
  index,
  indexes,
  studentId,
  tab,
  onTab,
  comparisonId,
  onComparison,
  onBack,
}) {
  const student = studentById(studentId)
  const indexId = index.id
  const response = responseFor(indexId, studentId)

  const comparison = comparisonId ? responseFor(comparisonId, studentId) : null

  // Every index except this one, and only those this reader actually sat.
  const options = indexes.filter(
    (i) => i.id !== indexId && i.responses.some((r) => r.studentId === studentId),
  )

  const deltas = {}
  if (comparison) {
    deltas.intrinsic = percentChange(response.scores.intrinsic, comparison.scores.intrinsic)
    deltas.extrinsic = percentChange(response.scores.extrinsic, comparison.scores.extrinsic)
    deltas.overall = percentChange(response.scores.overall, comparison.scores.overall)
  }

  const factorDeltas = {}
  if (comparison) {
    for (const f of ALL_FACTORS) {
      factorDeltas[f] = percentChange(response.scores.factors[f], comparison.scores.factors[f])
    }
  }

  const firstName = student.name.split(' ')[0]

  return (
    <>
      <BackBar label="Back to Index" onClick={onBack} />

      <PageHeader
        title={student.name}
        actions={
          <Button variant="primary" size="md">
            Download Report
          </Button>
        }
      />

      <Tabs
        active={tab}
        onChange={onTab}
        items={[
          { id: 'summary', label: 'Summary' },
          { id: 'books', label: 'Book List' },
        ]}
      />

      <div className="rmi-report">
        {!response ? (
          <EmptyState
            variant="dashed"
            title="No data collected."
            description={`${firstName} hasn't completed this index yet.`}
          />
        ) : tab === 'books' ? (
          <BookLists
            factor={topThreeFactors(response.scores)[0].name}
            band={bandForGrades(EDUCATOR.grades)}
            forReader={firstName}
          />
        ) : (
          <>
            <div className="rmi-filter-bar">
              <Select value={indexId} disabled onChange={() => {}} className="rmi-filter-survey">
                <option value={indexId}>{index.name}</option>
              </Select>

              <label className="rmi-filter-field">
                <span>Compare against:</span>
                <Select
                  value={comparisonId ?? ''}
                  onChange={(e) => onComparison(e.target.value || null)}
                >
                  <option value="">Select a survey to compare against</option>
                  {options.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </Select>
              </label>
            </div>

            <ScoreCards scores={response.scores} deltas={deltas} />
            <BennySays
              summary={summaryFor(response.scores, { subject: firstName })}
              analysedAt={formatAnalysedAt(index.analysedAt)}
            />
            <ReadingGoalAndActions
              goal={readingGoalFor(response.scores)}
              recommendations={recommendationsFor(response.scores, {
                kind: 'reader_internal',
                seed: student.name,
              })}
            />
            <TopMotivationTypes scores={response.scores} />
            <GenreRecommendations
              scores={response.scores}
              action={
                <Button variant="secondary" size="md" onClick={() => onTab('books')}>
                  View Recommendations
                </Button>
              }
            />
            <FactorTable scores={response.scores} deltas={factorDeltas} />
          </>
        )}
      </div>
    </>
  )
}
