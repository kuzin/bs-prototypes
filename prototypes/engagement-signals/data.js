// Reading Engagement Signals — the model behind the signal.
//
// The ticket asks for "a simple (at first) Reading Engagement Signal such as
// Increasing, Consistent, or Declining based on patterns across" six inputs,
// with Benny explaining what's driving it and recommending questions or
// actions. So the shape here is deliberately a *direction plus its drivers* —
// there is no composite score, and no new number competing with the RMI total.
//
// The numbers are the Student Profile's own mocks (`student-profile`'s
// STUDENTS), read a second way. A signal that contradicted the profile it sits
// on would be worse than no signal, so every stat below traces to a figure the
// profile already shows: Marcus's 21-of-30 days, Anne's 10-of-30 and falling
// flag count, Tyler's 30-day gap and 7 unfinished conversations.

// ─── The three signals (and the fourth state) ────────────────────────────────
// Colours are the app's own tag pairs — a hue's 50 fill under its 500/800 text,
// out of bs-product's `admin/_admin_flagged_entries.scss`, the same pairs
// `TrendChip` uses. Consistent gets the neutral blue rather than a green,
// because "no change" is not an achievement and shouldn't read as one.
export const SIGNALS = {
  increasing: {
    label: 'Increasing',
    color: '#017841',
    bg: '#CBFCE5',
    icon: 'arrow-up',
    short: 'Reading more, or more often, than the weeks before.',
  },
  consistent: {
    label: 'Consistent',
    color: '#1D4ED8',
    bg: '#E8EFFE',
    icon: 'arrow-right',
    short: 'Holding steady — no meaningful move either way.',
  },
  declining: {
    label: 'Declining',
    color: '#DF3F30',
    bg: '#FDD2CE',
    icon: 'arrow-down',
    short: 'Reading less, or less often, than the weeks before.',
  },
  // Not a signal — the absence of one. A roster always has a reader who
  // enrolled last week, and calling them "Declining" off two logs would be the
  // fastest way to lose a teacher's trust in the whole column.
  pending: {
    label: 'Not enough data',
    color: '#64748B',
    bg: '#F1F5F9',
    icon: 'minus',
    short: 'Needs about three weeks of logging before a signal appears.',
  },
}

export const SIGNAL_ORDER = ['increasing', 'consistent', 'declining', 'pending']

// ─── The six drivers ──────────────────────────────────────────────────────────
// One row per input the ticket names, in the ticket's own order. They are all
// listed for every reader, present or not: a teacher asking "why does it say
// Declining?" is owed the whole basis, including the parts that had nothing to
// say. `weight` is what the driver contributed to *this* reading, so a row can
// be shown as considered-but-quiet rather than silently dropped.
export const DRIVERS = [
  {
    key: 'frequency',
    label: 'Reading frequency and consistency',
    icon: 'calendar',
    color: '#16A97A',
  },
  { key: 'volume', label: 'Reading volume', icon: 'clock', color: '#0DA7BC' },
  { key: 'logging', label: 'Logging behaviors', icon: 'shield-check', color: '#1D4ED8' },
  { key: 'talks', label: 'Book Talks with Benny', icon: 'message-circle', color: '#7C3AED' },
  { key: 'rmi', label: 'RMI insights and growth', icon: 'flame', color: '#E8866A' },
  { key: 'words', label: 'Words with Benny', icon: 'vocabulary', color: '#B45309' },
]

// Words with Benny is itself still a proposal ("(TBD)" in the ticket), and a
// site either has it or doesn't — so it can't be live for one reader in a
// class. It stays in the list, greyed, saying what it will contribute. That is
// the honest state, and it also shows the signal is extensible without a
// redesign every time an input lands.
export const SITE = { wordsWithBenny: false }

// ─── The three built-out readers ──────────────────────────────────────────────
// Only Marcus, Anne and Tyler have a profile behind them in the Student
// Profile prototype, so only they get a full signal page. The rest of the
// roster carries roster-level data, which is all the class table shows anyway.
//
// The trio is chosen to make the one point the signal has to land: **it reads
// change, not standing.** Marcus is the strongest reader in the class and his
// signal is Consistent. Anne is mid-pack and hers is Increasing. If the column
// just re-sorted the class by how good its readers are, it would be telling
// teachers something they already knew.

export const STUDENT_SIGNALS = {
  marcus: {
    studentKey: 'marcus',
    name: 'Marcus Chen',
    signal: 'consistent',
    // How long it has read this way — a signal with no duration behind it
    // invites a teacher to act on a single quiet week.
    since: 'Consistent for 8 weeks',
    headline: 'Steady, and at the top of the class',
    // Benny's read. `**` marks the load-bearing figures (see `emphasize`).
    explanation:
      "Marcus has read on **21 of the last 30 days**, almost exactly what he did the 30 days before that — this is his normal, and it has been for **eight weeks**. Volume, talks and motivation are all holding at the top of the class, with **1 flagged session all year**. Nothing here needs fixing. The risk with a reader like Marcus isn't drop-off, it's boredom: he's at **870L** and reading titles he's already comfortable with.",
    drivers: {
      frequency: {
        direction: 'flat',
        weight: 'lead',
        stat: '21 of the last 30 days',
        prev: '20 in the 30 before',
        note: 'Reads every school day and most Saturdays. Longest gap this month is one day.',
      },
      volume: {
        direction: 'flat',
        weight: 'supporting',
        stat: '185 minutes this week',
        prev: 'averaging 178 a week',
        note: 'Up 25 minutes on last week, which is inside his normal week-to-week swing.',
      },
      logging: {
        direction: 'flat',
        weight: 'supporting',
        stat: '1 flagged session all year',
        prev: '3 last year',
        note: 'Verified reader, so his read-a-thon day stands. No repeated titles, no backdating.',
      },
      talks: {
        direction: 'up',
        delta: 2,
        deltaFormat: (n) => `${n} talks`,
        weight: 'supporting',
        stat: '6 talks in 30 days',
        prev: '4 in the 30 before',
        note: 'Every engagement talk came back Engaged. Comprehension is strong on all six.',
      },
      rmi: {
        direction: 'up',
        delta: 12,
        deltaFormat: (n) => `${n}%`,
        weight: 'supporting',
        stat: 'Motivation 36.4 / 40',
        prev: 'up 12% on the March index',
        note: 'Enjoyment, Curiosity and Challenge all at or near ceiling. Intrinsic is his best of the year.',
      },
    },
    // Trajectory — the signal itself, month by month. Categorical on purpose:
    // drawing a line through it would be inventing the score we chose not to
    // have. Six periods is enough to see "this is new" versus "this is him".
    trajectory: [
      { label: 'Dec', signal: 'consistent' },
      { label: 'Jan', signal: 'consistent' },
      { label: 'Feb', signal: 'consistent' },
      { label: 'Mar', signal: 'consistent' },
      { label: 'Apr', signal: 'consistent' },
      { label: 'May', signal: 'consistent', current: true },
    ],
    // "Recommend questions or actions for the educator" — two different jobs,
    // so two lists. The questions are the ones a teacher can ask in the two
    // minutes they actually have with this reader.
    ask: [
      'What was the last book that genuinely surprised you?',
      'Is anything you’re reading right now actually hard?',
      'Who in here would you hand The Hobbit to?',
    ],
    actions: [
      {
        title: 'Stretch the material, not the goal',
        body: "He clears 30 minutes without trying. Titles in the 950–1000L range are the change that would show up in his Lexile, and a higher minute goal wouldn't.",
      },
      {
        title: 'Give the consistency somewhere to go',
        body: 'A class book talk or a reading-buddy pairing channels a reader who is already doing everything asked of him. Social Connection is climbing in his index.',
      },
    ],
  },

  anne: {
    studentKey: 'anne',
    name: 'Anne Boonchuy',
    signal: 'increasing',
    since: 'Increasing since mid-April',
    headline: 'Real momentum from a slow start',
    explanation:
      'Anne has read on **10 of the last 30 days**, up from **6** the month before, and her flagged sessions are **down from 7 to 4**. Lexile is **up 50 points since April**. She is still under her 20-minute goal most days, so this is momentum rather than arrival — but it is the clearest upward move in the class. Worth knowing: **2 Book Talks are unfinished**, both on the same title.',
    drivers: {
      frequency: {
        direction: 'up',
        delta: 4,
        deltaFormat: (n) => `${n} days`,
        weight: 'lead',
        stat: '10 of the last 30 days',
        prev: '6 in the 30 before',
        note: 'Mondays are her day. Weekends are still empty, and her longest gap is 3 days.',
      },
      volume: {
        direction: 'up',
        delta: 21,
        deltaFormat: (n) => `${n}%`,
        weight: 'lead',
        stat: '85 minutes this week',
        prev: '70 a week in April',
        note: 'Sessions average 24 minutes, so the gain is more days rather than longer sittings.',
      },
      logging: {
        direction: 'up',
        delta: -3,
        deltaFormat: (n) => `${n} flags`,
        inverse: true,
        weight: 'supporting',
        stat: '4 flagged sessions',
        prev: 'down from 7',
        note: 'The over-limit entries have stopped since her tandem library account was linked.',
      },
      talks: {
        direction: 'down',
        delta: 2,
        deltaFormat: (n) => `${n} unfinished`,
        inverse: true,
        weight: 'counter',
        stat: '2 unfinished conversations',
        prev: 'both on Wings of Fire',
        note: 'She starts the talk and leaves it. The one she did finish came back Mixed on engagement.',
      },
      rmi: {
        direction: 'up',
        delta: 9,
        deltaFormat: (n) => `${n}%`,
        weight: 'supporting',
        stat: 'Motivation 28.6 / 40',
        prev: 'up 9% on the March index',
        note: 'Recognition and Social Connection lead. Intrinsic slipped 5% — the lift is coming from outside.',
      },
    },
    trajectory: [
      { label: 'Dec', signal: 'declining' },
      { label: 'Jan', signal: 'declining' },
      { label: 'Feb', signal: 'consistent' },
      { label: 'Mar', signal: 'consistent' },
      { label: 'Apr', signal: 'increasing' },
      { label: 'May', signal: 'increasing', current: true },
    ],
    ask: [
      'You stopped two Book Talks on Wings of Fire — what happened with that one?',
      'What made you pick it up again in April?',
      'Would you rather read with someone, or on your own?',
    ],
    actions: [
      {
        title: 'Name the streak out loud',
        body: 'Recognition is her top motivator and this is the month to spend it on. A shoutout now is worth more than one after she plateaus.',
      },
      {
        title: 'Clear the two unfinished conversations',
        body: 'Both are on the same book. Sitting with her for one of them tells you whether it is the title, the questions, or the timing.',
      },
      {
        title: 'Aim at the weekend, not the goal',
        body: 'She reads on school days only. Two weekend days would move her further than raising a 20-minute goal she already misses.',
      },
    ],
  },

  tyler: {
    studentKey: 'tyler',
    name: 'Tyler Voss',
    signal: 'declining',
    since: 'Declining since mid-March',
    headline: 'Stopped, and the last data is unreliable',
    explanation:
      'Tyler has logged **nothing in 30 days** — the only reader in the class with a gap that long — after **9 days** in the month before. Minutes are **down 58% on last year**, Lexile is **down 20 points**, and his motivation index fell **11%**. The reading he did log is hard to trust: **13 flagged sessions**, most over the daily limit, and **7 Book Talks left unfinished**. His account is frozen, so nothing new is coming in. This is the one signal in the class worth a conversation this week.',
    drivers: {
      frequency: {
        direction: 'down',
        delta: -9,
        deltaFormat: (n) => `${n} days`,
        weight: 'lead',
        stat: '0 of the last 30 days',
        prev: '9 in the 30 before',
        note: 'A 30-day gap. His longest before this was 5 days, back in January.',
      },
      volume: {
        direction: 'down',
        delta: -58,
        deltaFormat: (n) => `${n}%`,
        weight: 'lead',
        stat: '0 minutes this week',
        prev: '470 minutes all year',
        note: 'Down 58% year over year. The last session logged was 22 minutes on May 5.',
      },
      logging: {
        direction: 'down',
        delta: 5,
        deltaFormat: (n) => `${n} flags`,
        inverse: true,
        weight: 'counter',
        stat: '13 flagged sessions',
        prev: 'up 5 this year',
        note: 'Mostly over-limit, and Holes was logged five times in nine days. Account is frozen.',
      },
      talks: {
        direction: 'down',
        delta: 7,
        deltaFormat: (n) => `${n} unfinished`,
        inverse: true,
        weight: 'lead',
        stat: '7 unfinished conversations',
        prev: 'of 13 held',
        note: 'Two engagement talks came back Disengaged, and 5 of 6 integrity talks raised a concern.',
      },
      rmi: {
        direction: 'down',
        delta: -11,
        deltaFormat: (n) => `${n}%`,
        weight: 'supporting',
        stat: 'Motivation 18.2 / 40',
        prev: 'down 11% on the March index',
        note: 'No clear motivator — the index cannot tell what reading is for, for him.',
      },
    },
    trajectory: [
      { label: 'Dec', signal: 'consistent' },
      { label: 'Jan', signal: 'consistent' },
      { label: 'Feb', signal: 'declining' },
      { label: 'Mar', signal: 'declining' },
      { label: 'Apr', signal: 'declining' },
      { label: 'May', signal: 'declining', current: true },
    ],
    ask: [
      'What were you reading in February? That was your best month.',
      'Is there a book you started and gave up on?',
      'What would make reading at home easier than it is right now?',
    ],
    actions: [
      {
        title: 'One-on-one this week',
        body: 'Thirty days with nothing logged is not a nudge problem. Everything else on this page is downstream of a conversation that has not happened yet.',
      },
      {
        title: 'Unfreeze on a plan, not on a promise',
        body: 'His account is frozen over the over-limit entries. Lifting it alongside an agreed daily goal gives the next 30 days data you can actually read.',
      },
      {
        title: 'Start from what worked in February',
        body: 'He read 5 days a week on The One and Only Bob. A sequel or a read-alike is a cheaper first step than a new habit.',
      },
    ],
  },
}

// ─── The rest of the roster ───────────────────────────────────────────────────
// Class A as the Student Profile prototype's daily-reading table has it, in the
// same order, so the Engagement tab is recognisably the same 13 readers. These
// rows carry roster-level figures only — enough for the column a teacher scans,
// which is all the class page ever shows.
// A `null` or `0` delta draws no trend chip (see `TrendChip`), which is what a
// Consistent reader should look like: the signal ignores a move it considers
// noise, so the column shouldn't put an arrow on one either. A row with a pill
// saying "Consistent" and two green arrows beside it argues with itself.
export const ROSTER = [
  {
    key: 'marcus',
    name: 'Marcus Chen',
    signal: 'consistent',
    days30: 21,
    days30Delta: 0,
    minsWeek: 185,
    minsDelta: 0,
    lastLogged: 'Today',
  },
  {
    key: 'anne',
    name: 'Anne Boonchuy',
    signal: 'increasing',
    days30: 10,
    days30Delta: 4,
    minsWeek: 85,
    minsDelta: 21,
    lastLogged: 'Yesterday',
  },
  {
    key: 'tyler',
    name: 'Tyler Voss',
    signal: 'declining',
    days30: 0,
    days30Delta: -9,
    minsWeek: 0,
    minsDelta: -58,
    lastLogged: '36 days ago',
  },
  {
    key: 'priya',
    name: 'Priya Shah',
    signal: 'consistent',
    days30: 19,
    days30Delta: 0,
    minsWeek: 152,
    minsDelta: 0,
    lastLogged: 'Today',
  },
  {
    key: 'devon',
    name: 'Devon Brooks',
    signal: 'increasing',
    days30: 17,
    days30Delta: 2,
    minsWeek: 138,
    minsDelta: 34,
    lastLogged: 'Today',
  },
  {
    key: 'mei',
    name: 'Mei Tanaka',
    signal: 'consistent',
    days30: 16,
    days30Delta: 0,
    minsWeek: 121,
    minsDelta: 0,
    lastLogged: 'Yesterday',
  },
  {
    key: 'omar',
    name: 'Omar Haddad',
    signal: 'declining',
    days30: 8,
    days30Delta: -7,
    minsWeek: 64,
    minsDelta: -41,
    lastLogged: '9 days ago',
  },
  {
    key: 'sofia',
    name: 'Sofía Reyes',
    signal: 'consistent',
    days30: 13,
    days30Delta: 0,
    minsWeek: 98,
    minsDelta: 0,
    lastLogged: 'Yesterday',
  },
  {
    key: 'liam',
    name: 'Liam O’Donnell',
    signal: 'increasing',
    days30: 12,
    days30Delta: 5,
    minsWeek: 88,
    minsDelta: 26,
    lastLogged: 'Today',
  },
  {
    key: 'ava',
    name: 'Ava Nwosu',
    signal: 'declining',
    days30: 9,
    days30Delta: -3,
    minsWeek: 58,
    minsDelta: -19,
    lastLogged: '5 days ago',
  },
  {
    key: 'noah',
    name: 'Noah Feldman',
    signal: 'increasing',
    days30: 11,
    days30Delta: 6,
    minsWeek: 104,
    minsDelta: 61,
    lastLogged: 'Today',
  },
  {
    key: 'zara',
    name: 'Zara Mahmood',
    signal: 'declining',
    days30: 7,
    days30Delta: -4,
    minsWeek: 42,
    minsDelta: -28,
    lastLogged: '4 days ago',
  },
  {
    key: 'jonah',
    name: 'Jonah Whitfield',
    signal: 'pending',
    days30: 3,
    days30Delta: null,
    minsWeek: 36,
    minsDelta: null,
    lastLogged: '2 days ago',
  },
]

// The profile hands its extra sections the *student object*, not the key it was
// opened with — the pager can step to another reader inside the panel, and the
// signal has to follow. Names are unique across the roster, so they're the join.
export function signalFor(student) {
  if (!student) return null
  return Object.values(STUDENT_SIGNALS).find((s) => s.name === student.name) ?? null
}
