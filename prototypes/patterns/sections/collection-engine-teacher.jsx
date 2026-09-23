import { ClassRecommendations } from '../../collection-engine-teacher/components/ClassRecommendations'
import { ReaderRecommendations } from '../../collection-engine-teacher/components/ReaderRecommendations'
import { classroomPicks, PICK_REASONS } from '../../collection-engine-teacher/data'
import { Variant } from './_shared'

const PICKS = classroomPicks()

export const collectionEngineTeacherSections = [
  {
    group: 'collection-engine-teacher',
    id: 'cet-class',
    name: 'ClassRecommendations',
    desc: (
      <>
        The Recommendations tab of a classroom page — what this room should have on its own shelf.
        Not a report on what the engine did: a teacher plans in books, so every row is a title with
        a reason to have it, ranked by how much a copy in <em>this</em> room would change.
        <br />
        <br />
        Three reasons, capped separately rather than taken off one ranked list — most titles are
        wanted by a single reader, so a straight sort buried the other two and a teacher lost the
        easiest win on the page. <strong>{PICK_REASONS.asked.label}</strong>,{' '}
        <strong>{PICK_REASONS.popular.label}</strong>, <strong>{PICK_REASONS.fit.label}</strong> —
        each carries its reasoning as a tooltip.
        <br />
        <br />
        Everything on the list is a title the school can already reach. The engine never suggests
        from outside a switched-on catalog, so a row saying &ldquo;you would need to order it&rdquo;
        could only ever be noise here — what a reader wants and the school doesn&rsquo;t hold is
        demand, and it belongs on their profile and in the district&rsquo;s buying view. And the
        source pills carry no copy counts: a MARC record says how many copies a school owns, but
        nothing says how many are on a shelf right now.
      </>
    ),
    usage: `import { ClassRecommendations } from './components/ClassRecommendations'

<ClassRecommendations />`,
    render: () => (
      <Variant label={`the tab's content — ${PICKS.length} titles for this room`} full>
        <div style={{ padding: '24px 24px 0' }}>
          <ClassRecommendations />
        </div>
      </Variant>
    ),
  },
  {
    group: 'collection-engine-teacher',
    id: 'cet-reader',
    name: 'ReaderRecommendations',
    desc: (
      <>
        The Recommendations section of a reader&rsquo;s profile — what the engine has put in front
        of them, and what came of it. It rides in on the profile&rsquo;s own <code>extraNav</code> /{' '}
        <code>renderExtra</code> slots, so it is a section of the real profile rather than a second
        window onto the same reader.
        <br />
        <br />
        Two tabs, because they answer two questions. <strong>Recommendations</strong> is what the
        engine did — what the reader kept, and what never reached their shelf.{' '}
        <strong>Their shelf</strong> is what the reader is holding, however it got there. They
        overlap — a suggestion they kept is on both — and that is right.
        <br />
        <br />
        Seven signals feed a suggestion, so each title&rsquo;s pill names the one that produced it
        and carries the reasoning as a tooltip: a sentence with this reader&rsquo;s own numbers in
        it, rather than twelve reasons stacked under twelve titles. And a title is never described
        as <em>passed on</em> — a reader doesn&rsquo;t decline each book, it simply never reaches
        their shelf, which is a signal about taste rather than a decision they made.
        <br />
        <br />
        The shelf is one feature area, not a wish list beside a saved list — a title the reader
        added themselves and one they kept off a suggestion are the same object in the same place,
        and the row says which. Titles the school <em>can&rsquo;t supply</em> sort to the top of
        each state, because that is demand stated by name and the one thing a teacher can act on
        today. Props: <code>studentKey</code>.
      </>
    ),
    usage: `import { ReaderRecommendations } from './components/ReaderRecommendations'

<ReaderRecommendations studentKey="tyler" />`,
    render: () => (
      <>
        <Variant label="a reader who saves and doesn't finish — Tyler" full>
          <div style={{ padding: 24, maxWidth: 720 }}>
            <ReaderRecommendations studentKey="tyler" />
          </div>
        </Variant>
        <Variant label="a reader the engine is reaching — Anne" full>
          <div style={{ padding: 24, maxWidth: 720 }}>
            <ReaderRecommendations studentKey="anne" />
          </div>
        </Variant>
      </>
    ),
  },
]
