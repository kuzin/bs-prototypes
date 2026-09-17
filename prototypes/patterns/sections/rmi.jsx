import {
  ScoreCards,
  BennySays,
  ReadingGoalAndActions,
  FactorTable,
  FactorIcon,
} from '../../rmi/components/ReportBlocks'
import { ALL_FACTORS, recommendationsFor, readingGoalFor, summaryFor } from '../../rmi/scoring'
import { INDEXES } from '../../rmi/data'
import { FACTORS } from '../../rmi/domain'
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
]
