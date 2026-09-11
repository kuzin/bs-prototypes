import {
  SignalPill,
  SignalTrajectory,
  DriverList,
} from '../../engagement-signals/components/Signal'
import {
  StudentSignal,
  SignalOverviewCard,
} from '../../engagement-signals/components/StudentSignal'
import { ClassEngagement } from '../../engagement-signals/components/ClassEngagement'
import { ClassroomView } from '../../student-profile/BeanstackProfile'
import { STUDENT_SIGNALS, SIGNAL_ORDER } from '../../engagement-signals/data'
import { Variant } from './_shared'

const noop = () => {}

// The three built-out readers stand for the three signals, so every showcase
// below can be driven by real prototype data rather than a fixture.
const MARCUS = STUDENT_SIGNALS.marcus
const ANNE = STUDENT_SIGNALS.anne
const TYLER = STUDENT_SIGNALS.tyler

// `StudentSignal` and `SignalOverviewCard` are handed the profile's student
// object, which they join to the signal on name.
const asStudent = (sig) => ({ name: sig.name })

export const engagementSignalsSections = [
  {
    group: 'engagement-signals',
    id: 'es-pill',
    name: 'SignalPill',
    desc: (
      <>
        The signal itself, and the only way it is ever drawn. Three readings —{' '}
        <strong>Increasing</strong>, <strong>Consistent</strong>, <strong>Declining</strong> — plus
        the state that matters as much as any of them: <strong>Not enough data</strong>, for a
        reader with too little logging behind them to say. Colours are the app&rsquo;s own tag pairs
        (a hue&rsquo;s <code>50</code> fill under its <code>500</code>/<code>800</code> text), the
        same pairs <code>TrendChip</code> uses. Consistent takes the neutral blue rather than a
        green on purpose: no change is not an achievement and shouldn&rsquo;t read as one. Props:{' '}
        <code>signal</code>, <code>size</code> (<code>md</code> for a table cell, <code>lg</code>{' '}
        for a page headline).
      </>
    ),
    render: () => (
      <>
        <Variant label="md — the table cell and the Overview card">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {SIGNAL_ORDER.map((s) => (
              <SignalPill key={s} signal={s} />
            ))}
          </div>
        </Variant>
        <Variant label="lg — the profile page headline">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {SIGNAL_ORDER.map((s) => (
              <SignalPill key={s} signal={s} size="lg" />
            ))}
          </div>
        </Variant>
      </>
    ),
  },
  {
    group: 'engagement-signals',
    id: 'es-trajectory',
    name: 'SignalTrajectory',
    desc: (
      <>
        The signal month by month, so &ldquo;Declining&rdquo; and &ldquo;declining since
        March&rdquo; arrive together — a signal with no duration behind it invites acting on one
        quiet week. Categorical rather than a line, because there is no composite score underneath
        to plot: this feature deliberately has a direction and its drivers, not a number. The
        current period carries the outline; everything left of it is history. Each cell names its
        month and reading on hover. Props: <code>trajectory</code> —{' '}
        <code>{'[{ label, signal, current }]'}</code>.
      </>
    ),
    render: () => (
      <>
        <Variant label="steady — six periods of Consistent (Marcus)">
          <SignalTrajectory trajectory={MARCUS.trajectory} />
        </Variant>
        <Variant label="turning up — declining, flat, then two months of gains (Anne)">
          <SignalTrajectory trajectory={ANNE.trajectory} />
        </Variant>
        <Variant label="turning down — steady until February (Tyler)">
          <SignalTrajectory trajectory={TYLER.trajectory} />
        </Variant>
      </>
    ),
  },
  {
    group: 'engagement-signals',
    id: 'es-drivers',
    name: 'DriverList / DriverRow',
    desc: (
      <>
        The six inputs the signal reads, in the ticket&rsquo;s own order: reading frequency and
        consistency, volume, logging behaviours, Book Talks with Benny, RMI growth, and Words with
        Benny. Every row is shown for every reader, including the ones that had nothing to say — a
        teacher asking &ldquo;why does it say Declining?&rdquo; is owed the whole basis, not the
        flattering half. Two tags carry the reading: <strong>Driving the signal</strong> and{' '}
        <strong>Points the other way</strong>, so the counter-evidence is on the page rather than
        smoothed out of it.
        <br />
        <br />
        The arrow is <code>TrendChip</code>: it says which way the number moved, and its colour says
        whether that is good news — so a falling flag count is a green down arrow (
        <code>inverse</code>). A move the signal considers noise draws no chip at all, just{' '}
        <em>Steady</em>, which is what a Consistent reader should look like. Words with Benny is a
        site-level feature and off here, so it renders greyed and says what it will contribute once
        it lands.
      </>
    ),
    render: () => (
      <>
        <Variant label="all six, on a Declining reader (Tyler)">
          <DriverList drivers={TYLER.drivers} />
        </Variant>
        <Variant label="a Consistent reader — no arrows, because nothing moved (Marcus)">
          <DriverList drivers={MARCUS.drivers} />
        </Variant>
      </>
    ),
  },
  {
    group: 'engagement-signals',
    id: 'es-overview-card',
    name: 'SignalOverviewCard',
    desc: (
      <>
        The compact form, which leads the profile&rsquo;s Overview through the{' '}
        <code>renderOverviewTop</code> slot added to <code>StudentProfileView</code> for it. The
        Overview is where a teacher lands, so the signal has to be legible there — but this is a
        pointer to the Engagement section, not a second copy of it: the pill, how long it has read
        that way, the headline, and a way in. Props: <code>student</code>, <code>onNavigate</code>.
      </>
    ),
    render: () => (
      <Variant label="one per signal">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SignalOverviewCard student={asStudent(ANNE)} onNavigate={noop} />
          <SignalOverviewCard student={asStudent(MARCUS)} onNavigate={noop} />
          <SignalOverviewCard student={asStudent(TYLER)} onNavigate={noop} />
        </div>
      </Variant>
    ),
  },
  {
    group: 'engagement-signals',
    id: 'es-student-signal',
    name: 'StudentSignal',
    desc: (
      <>
        The Engagement section of the student profile, rendered inside the real profile panel
        through its <code>extraNav</code>/<code>renderExtra</code> slots. Five cards, in the order
        the question gets asked: the signal and its trajectory, Benny explaining what is driving it,
        the six drivers, the questions to ask this reader, and the actions to take. The last two are
        separate lists because they are separate jobs — the ticket asks for &ldquo;questions{' '}
        <em>or</em> actions&rdquo;, and a question you can ask in the two minutes you have with a
        student is not the same artefact as a plan for the term. Props: <code>student</code>.
      </>
    ),
    render: () => (
      <Variant label="Increasing, from a slow start (Anne)" full>
        <StudentSignal student={asStudent(ANNE)} />
      </Variant>
    ),
  },
  {
    group: 'engagement-signals',
    id: 'es-class-engagement',
    name: 'ClassEngagement',
    desc: (
      <>
        The Engagement tab of the classroom page — the scan a teacher does before opening
        anybody&rsquo;s profile, and nothing more than that: the roster, its signals, and a way in.
        Assembled entirely from shared parts (<code>Table</code>, <code>SignalPill</code>,{' '}
        <code>TrendChip</code>, <code>Banner</code>, <code>RowAction</code>), with no summary tiles
        or filters above it — the reasoning behind any one reading lives on that reader&rsquo;s
        profile, and this page is the list.
        <br />
        <br />
        The table sorts on a triage rank rather than the label, so Declining leads and alphabetical
        order can&rsquo;t put Consistent above it — the reason to open the tab is the first thing on
        it. Each row carries the app&rsquo;s two row actions, opening the real profile on the
        Overview or on its Reading Log; both are disabled for the roster rows with no profile behind
        them. Props: <code>onOpenStudent(key, section)</code>.
      </>
    ),
    render: () => (
      <>
        <Variant label="the tab's content on its own" full>
          <ClassEngagement onOpenStudent={noop} />
        </Variant>
        <Variant label="in place, as a tab on the real classroom page" full>
          <ClassroomView
            onStudentClick={noop}
            extraTabs={[{ id: 'engagement', label: 'Engagement' }]}
            initialTab="engagement"
            renderExtra={() => <ClassEngagement onOpenStudent={noop} />}
          />
        </Variant>
      </>
    ),
  },
]
