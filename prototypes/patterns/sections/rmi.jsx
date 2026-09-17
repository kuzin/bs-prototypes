import {
  ScoreCards,
  BennySays,
  ReadingGoalAndActions,
  FactorTable,
  FactorIcon,
  TopMotivationTypes,
  GenreRecommendations,
  TitleRecommendations,
} from '../../rmi/components/ReportBlocks'
import { ALL_FACTORS, recommendationsFor, readingGoalFor, summaryFor } from '../../rmi/scoring'
import { INDEXES, EDUCATOR } from '../../rmi/data'
import { bandForGrades } from '../../rmi/titles'
import { FACTORS } from '../../rmi/domain'
import { useState } from 'react'
import { SearchBar } from '../../rmi/components/SearchBar'
import { ConfirmModal } from '../../rmi/components/ConfirmModal'
import { Button } from '@components/Button/Button'
import { Variant } from './_shared'
import '../../rmi/components/ReportBlocks.css'

// Real data from the prototype rather than a fixture: the Fall index's class
// aggregate, and one reader inside it whose scores are unremarkable enough to
// show the blocks at their normal size.
const FALL = INDEXES[0]
const READER = FALL.responses[0]

// A reader who answered "very different from me" to all twenty — every factor
// lands on the 1.0 threshold, which is the state that produces The Mystery.
const LOW = {
  factors: Object.fromEntries(ALL_FACTORS.map((f) => [f, 1])),
  intrinsic: 5,
  extrinsic: 5,
  overall: 10,
}

export const rmiSections = [
  {
    group: 'rmi',
    id: 'rmi-score-cards',
    name: 'ScoreCards',
    usage: `import { ScoreCards } from './components/ReportBlocks'

<ScoreCards scores={index.scores} average />
<ScoreCards scores={response.scores} deltas={{ overall: 12.5 }} />`,
    desc: (
      <>
        The three gauges every RMI report opens with. Intrinsic and Extrinsic each fill against{' '}
        <strong>20</strong>; the Overall card stacks both against <strong>40</strong>, so its ring
        reads as the two halves of one score rather than a third number. Geometry and colour are the
        app&rsquo;s <code>summary_controller.ts</code> — a 360° sweep at radius 38 on a 12px stroke,{' '}
        <code>#17BFD5</code> intrinsic and <code>#C849E5</code> extrinsic — and the outer two cards
        point a triangle at the middle one. <code>average</code> switches the labels to &ldquo;Avg
        …&rdquo; for a class; <code>deltas</code> adds the ± shown when an index is being compared
        against another.
      </>
    ),
    render: () => (
      <div className="rmi-report">
        <Variant label="A class — average scores, no comparison">
          <ScoreCards scores={FALL.scores} average />
        </Variant>
        <Variant label="One reader, compared against a previous index">
          <ScoreCards
            scores={READER.scores}
            deltas={{ intrinsic: 8.4, overall: -3.1, extrinsic: 0 }}
          />
        </Variant>
      </div>
    ),
  },
  {
    group: 'rmi',
    id: 'rmi-benny-says',
    name: 'BennySays',
    usage: `import { BennySays } from './components/ReportBlocks'

<BennySays summary={summary} analysedAt="Sep 26 at 4:42 pm" />`,
    desc: (
      <>
        The generated summary, in Benny&rsquo;s speech bubble, with the time the analysis last ran
        under it. The text is assembled by <code>summaryFor()</code> from the engine&rsquo;s{' '}
        <code>summaries.yml</code> templates — the reader&rsquo;s top three factors, then two of
        their recommendations quoted mid-sentence.
      </>
    ),
    render: () => (
      <div className="rmi-report">
        <Variant label="A class">
          <BennySays
            summary={summaryFor(FALL.scores, { subject: FALL.name, kind: 'group' })}
            analysedAt="Sep 26 at 4:42 pm"
          />
        </Variant>
        <Variant label="A reader with no strong preference — the low-score copy">
          <BennySays summary={summaryFor(LOW, { subject: 'Jonah' })} />
        </Variant>
      </div>
    ),
  },
  {
    group: 'rmi',
    id: 'rmi-factor-icon',
    name: 'FactorIcon',
    usage: `import { FactorIcon } from './components/ReportBlocks'

<FactorIcon factor="curiosity" />`,
    desc: (
      <>
        A factor&rsquo;s own drawing on its axis&rsquo;s tinted square — teal for the five intrinsic
        factors, purple for the five extrinsic, grey for <strong>mystery</strong>, the placeholder
        for a reader with no strong preference. The drawings come from the shared{' '}
        <code>RMI_ICONS</code> set (bs-product&rsquo;s own art) and are masks painted in{' '}
        <code>currentColor</code>, so each axis sets both its ground and its ink. Hovering gives the
        educator-facing definition.
      </>
    ),
    render: () => (
      <div className="rmi-report">
        <Variant label="Intrinsic · Extrinsic · Mystery">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[...ALL_FACTORS, 'mystery'].map((f) => (
              <span
                key={f}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
              >
                <FactorIcon factor={f} />
                <span style={{ fontSize: 11, color: 'var(--c-gray-600)' }}>
                  {FACTORS[f].student_name}
                </span>
              </span>
            ))}
          </div>
        </Variant>
      </div>
    ),
  },
  {
    group: 'rmi',
    id: 'rmi-goal-actions',
    name: 'ReadingGoalAndActions',
    usage: `import { ReadingGoalAndActions } from './components/ReportBlocks'

<ReadingGoalAndActions goal={25} recommendations={recs} />`,
    desc: (
      <>
        The recommended daily minutes beside the two things to try. The goal is banded off the
        overall score (15 / 20 / 25 / 30); the recommendations are drawn from the engine&rsquo;s 62
        YAML entries, each tagged with the factor that earned it so it can carry that factor&rsquo;s
        icon. An educator reading one student sees the <code>reader_internal</code> set
        (&ldquo;them&rdquo;), a class report the <code>group</code> set (&ldquo;students&rdquo;).
      </>
    ),
    render: () => (
      <div className="rmi-report">
        <Variant label="A class — group recommendations">
          <ReadingGoalAndActions
            goal={readingGoalFor(FALL.scores)}
            recommendations={recommendationsFor(FALL.scores, { kind: 'group', seed: FALL.name })}
          />
        </Variant>
      </div>
    ),
  },
  {
    group: 'rmi',
    id: 'rmi-top-types',
    name: 'TopMotivationTypes',
    usage: `import { TopMotivationTypes } from './components/ReportBlocks'

<TopMotivationTypes scores={response.scores} />`,
    desc: (
      <>
        The three motivation types a reader came out as &mdash; the same ones their own reveal shows
        them, named the way they were named there. An educator needs both vocabularies at once: the
        reader was told they are <strong>The Lion</strong>, while the factor table, the summary and
        the recommendation copy all say <strong>confidence</strong>. So each row carries the
        persona, the factor it stands for, and the educator&rsquo;s definition.{' '}
        <strong>The Mystery</strong> is a motivation type like any other &mdash; it&rsquo;s what{' '}
        <code>top_three_factors</code> returns when nothing clears the threshold, so it renders as a
        row rather than as an absence.
      </>
    ),
    render: () => (
      <div className="rmi-report">
        <Variant label="A reader with clear motivators">
          <TopMotivationTypes scores={READER.scores} />
        </Variant>
        <Variant label="Nothing above the threshold — The Mystery">
          <TopMotivationTypes scores={LOW} />
        </Variant>
      </div>
    ),
  },
  {
    group: 'rmi',
    id: 'rmi-genres',
    name: 'GenreRecommendations',
    usage: `import { GenreRecommendations } from './components/ReportBlocks'

<GenreRecommendations scores={response.scores} />
<GenreRecommendations scores={index.scores} subject="class" />`,
    desc: (
      <>
        Three genres for each of the top motivation types, from the RMI toolkit&rsquo;s own mapping
        &mdash; ten personas, three genres each, with the reason every one suits that type. This is
        the reader&rsquo;s-advisory half of a report: the recommended <em>actions</em> tell an
        educator what to do, and these tell them what to put in the reader&rsquo;s hands. The reason
        matters more than the list &mdash; it&rsquo;s what lets a librarian explain the choice.{' '}
        <strong>The Mystery</strong> has none: it isn&rsquo;t a reading taste but the absence of a
        clear one, so the block doesn&rsquo;t render rather than inventing a shelf.
      </>
    ),
    render: () => (
      <div className="rmi-report">
        <Variant label="One reader">
          <GenreRecommendations scores={READER.scores} />
        </Variant>
        <Variant label="A class">
          <GenreRecommendations scores={FALL.scores} subject="class" />
        </Variant>
      </div>
    ),
  },
  {
    group: 'rmi',
    id: 'rmi-titles',
    name: 'TitleRecommendations',
    usage: `import { TitleRecommendations } from './components/ReportBlocks'

<TitleRecommendations
  scores={response.scores}
  band={bandForGrades(EDUCATOR.grades)}
/>`,
    desc: (
      <>
        Five books, chosen by the reader&rsquo;s motivation types &mdash; the thing the genre
        mapping exists for. A librarian doesn&rsquo;t want &ldquo;try mystery&rdquo;, they want five
        titles they can pull off the shelf. Every one is reachable from a type: type &rarr; the
        toolkit&rsquo;s three genres for it &rarr; the catalogue tags those genres cover &rarr; the
        title. Each card says which genre found it, so the recommendation explains itself.
        <br />
        <br />
        The five span the three types rather than emptying the strongest first, and{' '}
        <strong>Refresh</strong> pages through the rest instead of reshuffling the same five.{' '}
        <code>band</code> is the reading-age window &mdash; the grade half of the metadata the doc
        asks JRC to add to Book Contexts. Titles come from the Book Discovery catalogue, so the
        jackets are real.
      </>
    ),
    render: () => (
      <div className="rmi-report">
        <Variant label="One reader — press Refresh for the next five">
          <TitleRecommendations scores={READER.scores} band={bandForGrades(EDUCATOR.grades)} />
        </Variant>
      </div>
    ),
  },
  {
    group: 'rmi',
    id: 'rmi-factor-table',
    name: 'FactorTable',
    usage: `import { FactorTable } from './components/ReportBlocks'

<FactorTable scores={response.scores} deltas={factorDeltas} />`,
    desc: (
      <>
        All ten factors ranked, each with its <strong>1.0–4.0</strong> bar. The first three rows are
        tinted, which is what makes the table read as &ldquo;these are the motivators&rdquo; rather
        than a flat list. <code>deltas</code> adds a ± per factor when an index is being compared
        against another.
      </>
    ),
    render: () => (
      <div className="rmi-report">
        <Variant label="One reader">
          <FactorTable scores={READER.scores} />
        </Variant>
      </div>
    ),
  },
  {
    group: 'rmi',
    id: 'rmi-search-bar',
    name: 'SearchBar',
    usage: `import { SearchBar } from './components/SearchBar'

<SearchBar
  open={searchOpen}
  label="Student Name"
  value={query}
  onChange={setQuery}
  onClose={() => setSearchOpen(false)}
/>`,
    desc: (
      <>
        The app&rsquo;s search is a <em>panel</em>, not an always-on filter box: a white card
        holding the field, a Search button, and a Clear button once there&rsquo;s something to
        clear. It stays hidden until the magnifier in the page header reveals it, which is what that
        toggle in every index and roster header is for. <code>label</code> is the placeholder rather
        than a rendered label &mdash; the panel only ever holds one field, so a heading over it says
        the same thing twice.
      </>
    ),
    render: function SearchBarShowcase() {
      const [value, setValue] = useState('')
      return (
        <>
          <Variant label="open, empty — Search only">
            <SearchBar open label="Student Name" value="" onChange={() => {}} />
          </Variant>
          <Variant label="with a query — Clear appears">
            <SearchBar open label="Student Name" value={value || 'Amara'} onChange={setValue} />
          </Variant>
        </>
      )
    },
  },
  {
    group: 'rmi',
    id: 'rmi-confirm-modal',
    name: 'ConfirmModal',
    usage: `import { ConfirmModal } from './components/ConfirmModal'

<ConfirmModal
  open={!!confirm}
  onClose={() => setConfirm(null)}
  title="Delete Amara Osei"
  confirmLabel="Delete"
  onConfirm={() => remove(student)}
>
  Are you sure? This will delete all of their RMI results, if present.
</ConfirmModal>`,
    desc: (
      <>
        <code>.modal--small</code> &mdash; the dialogue both of the roster&rsquo;s destructive
        actions use. A title, a paragraph saying what the action <em>costs</em>, and Cancel /
        confirm at the foot. The copy is the app&rsquo;s: deleting a student takes their RMI results
        with them, and regenerating a code locks the old one out. Built on the shared{' '}
        <code>Modal</code> at <code>variant=&quot;center&quot;</code>, so it brings the backdrop and
        the corner close badge with it.
      </>
    ),
    render: function ConfirmModalShowcase() {
      const [open, setOpen] = useState(null)
      return (
        <Variant label="the two the roster raises">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button variant="secondary" size="md" onClick={() => setOpen('delete')}>
              Delete a student
            </Button>
            <Button variant="secondary" size="md" onClick={() => setOpen('regenerate')}>
              Regenerate a code
            </Button>
          </div>

          <ConfirmModal
            open={open === 'delete'}
            onClose={() => setOpen(null)}
            title="Delete Amara Osei"
            confirmLabel="Delete"
          >
            Are you sure you want to delete this student? This will delete all of their RMI results,
            if present.
          </ConfirmModal>

          <ConfirmModal
            open={open === 'regenerate'}
            onClose={() => setOpen(null)}
            title="Are you sure you want to regenerate this student's access code?"
            confirmLabel="Regenerate"
          >
            Students with old access codes will be unable to access their survey or results.
            However, students who already took the survey can view results at their new access code.
          </ConfirmModal>
        </Variant>
      )
    },
  },
]
