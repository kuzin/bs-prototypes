import { SignalPill, DriverList } from '../../engagement-signals/components/Signal'
import {
  StudentSignal,
  SignalOverviewCard,
} from '../../engagement-signals/components/StudentSignal'
import { ClassEngagement } from '../../engagement-signals/components/ClassEngagement'
import { STUDENT_SIGNALS, SIGNAL_ORDER, currentPeriod } from '../../engagement-signals/data'
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

// The six drivers belong to a *window*, not to the reader — each entry in
// `trajectory` carries its own reading. `currentPeriod` is the live one, which
// is the reading the reader is said to "have".
const driversOf = (sig) => currentPeriod(sig).drivers

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
    id: 'es-drivers',
    name: 'DriverList / DriverRow',
    desc: (
      <>
        The six inputs the signal reads: reading frequency and consistency, volume, logging
        behaviours, Book Talks with Benny, RMI growth, and Words with Benny. Every input is shown
        for every reader — a teacher asking &ldquo;why does it say Declining?&rdquo; is owed the
        whole basis, not the flattering half — sorted into what each one did to this reading:{' '}
        <strong>Lifting the signal</strong>, <strong>Holding it back</strong>,{' '}
        <strong>No change</strong>. The case for and the case against are two lists, not one list
        you decode by arrow colour.
        <br />
        <br />
        Each row is the profile&rsquo;s own <code>StatRow</code>, the component every other
        at-a-glance figure on that panel is drawn with — label left, figure and unit right, trend
        after it. <code>TrendChip</code> follows the figure and nothing else: up is green, down is
        red, whatever the figure happens to be, because whether the move is good news is the group
        heading&rsquo;s job. A move the signal treats as noise draws the same chip in the neutral
        pair, holding a dash — three states in one box, so the column reads as a column rather than
        a scatter of arrows with gaps in it. A reader&rsquo;s opening window, with no earlier period
        behind it to compare against, is a page of them.
        <br />
        <br />
        Words with Benny is site-level — a site either has it or it doesn&rsquo;t, so it can never
        be live for one reader and not another. With <code>SITE.wordsWithBenny</code> off, the row
        stays in the list under <strong>Not measured yet</strong>, saying what it will contribute.
      </>
    ),
    render: () => (
      <>
        <Variant label="all six, on a Declining reader (Tyler)">
          <div className="section-card bp-card bp-statlist">
            <DriverList drivers={driversOf(TYLER)} />
          </div>
        </Variant>
        <Variant label="an opening window — nothing behind it yet, so six neutral chips (Marcus)">
          <div className="section-card bp-card bp-statlist">
            <DriverList drivers={MARCUS.trajectory[0].drivers} />
          </div>
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
        <code>renderAfterSummary</code> slot added to <code>StudentProfileView</code> for it. It
        sits directly under &ldquo;Benny says&hellip;&rdquo;, where a teacher has just read the
        summary the signal is a verdict on — and it is a pointer to the Engagement section, not a
        second copy of it: the headline, the reading, and a way in.
        <br />
        <br />
        It takes the profile&rsquo;s own titled head row (<code>bp-latest-head</code>), the same one
        the Daily Goals and Latest titles cards below it use, so the Overview reads as one page
        rather than a card with a heading of its own invention — and the pill sits at the
        row&rsquo;s trailing edge, where the stat rows under it put their figure. Props:{' '}
        <code>student</code>, <code>onNavigate</code>.
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
        through its <code>extraNav</code>/<code>renderExtra</code> slots. It is one statement
        followed by its reasons: the reading gets a block of its own, drawn as a three-band scale
        with the reader&rsquo;s band lit — worst to best, left to right — so it says the signal and
        what it is a signal out of in the same object. Three bands rather than a gradient, because
        there are three readings and no continuum underneath. Then the period picker, Benny
        explaining what is driving the signal (wearing the face that goes with it — <code>sad</code>{' '}
        for a reader who has stopped, <code>excited</code> for one picking up), the six drivers, the
        questions to ask, and the actions to take. The last two are separate lists because they are
        separate jobs.
        <br />
        <br />
        The picker is a compact <code>FilterBar</code> above everything, the same call the
        Motivation tab makes for its RMI index period: it filters the whole page, so it sits in the
        bar every other tab filters from rather than inside the first card it changes. Choosing a
        closed window swaps the headline, the summary and every driver figure for that
        period&rsquo;s, and drops the questions and actions — both are advice for now, and what to
        ask in March is not something you can act on. Props: <code>student</code>.
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
        it. A row opens that reader&rsquo;s Engagement section — you were already asking about their
        signal — and the app&rsquo;s two row actions open the rest of the profile, on the Overview
        or on its Reading Log. All three are inert for the roster rows with no profile behind them.
        Props: <code>onOpenStudent(key, section)</code>.
      </>
    ),
    render: () => (
      <Variant label="the tab's content on its own" full>
        <div style={{ padding: '24px 24px 0' }}>
          <ClassEngagement onOpenStudent={noop} />
        </div>
      </Variant>
    ),
  },
]
