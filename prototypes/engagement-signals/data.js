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
// Each carries the face Benny wears to deliver it. He has a set of them, and
// which one he's wearing is part of what he's saying — a bubble reporting that
// a reader has stopped shouldn't use the same portrait as one celebrating a
// reader who's picked up.
// Colours are the app's own tag pairs — a hue's 50 fill under its 500/800 text,
// out of bs-product's `admin/_admin_flagged_entries.scss`, the same pairs
// `TrendChip` uses. Consistent gets the neutral blue rather than a green,
// because "no change" is not an achievement and shouldn't read as one.
export const SIGNALS = {
  increasing: {
    avatar: '/bs-prototypes/benny-excited.svg',
    label: 'Increasing',
    color: '#017841',
    bg: '#CBFCE5',
    icon: 'arrow-up',
    short: 'Reading more, or more often, than the weeks before.',
  },
  consistent: {
    avatar: '/bs-prototypes/benny-happy.svg',
    label: 'Consistent',
    color: '#196DD5',
    bg: '#E8EFFE',
    icon: 'arrow-right',
    short: 'Holding steady — no meaningful move either way.',
  },
  declining: {
    avatar: '/bs-prototypes/benny-sad.svg',
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
    avatar: '/bs-prototypes/benny-thinking.svg',
    label: 'Not enough data',
    color: '#707070',
    bg: '#F5F5F5',
    icon: 'minus',
    short: 'Needs about three weeks of logging before a signal appears.',
  },
}

export const SIGNAL_ORDER = ['increasing', 'consistent', 'declining', 'pending']

// ─── The six drivers ──────────────────────────────────────────────────────────
// One row per input the ticket names, in the ticket's own order. They are all
// listed for every reader, present or not: a teacher asking "why does it say
// Declining?" is owed the whole basis, including the parts that had nothing to
// say — a driver that had nothing to add is shown as considered, not dropped.
export const DRIVERS = [
  {
    key: 'frequency',
    label: 'Reading frequency and consistency',
    icon: 'calendar-stats',
    accent: { bg: '#E6F8EF', text: '#0BA85F' },
  },
  {
    key: 'volume',
    label: 'Reading volume',
    icon: 'clock',
    accent: { bg: '#E4F6F9', text: '#0CA7BC' },
  },
  {
    key: 'logging',
    label: 'Logging behaviors',
    icon: 'shield-check',
    accent: { bg: '#E8EFFE', text: '#196DD5' },
  },
  {
    key: 'talks',
    label: 'Book Talks with Benny',
    icon: 'chat',
    accent: { bg: '#F1EBFF', text: '#B43DD0' },
  },
  {
    key: 'rmi',
    label: 'RMI insights and growth',
    icon: 'fire',
    accent: { bg: '#FDEEE6', text: '#F26430' },
  },
  {
    key: 'words',
    label: 'Words with Benny',
    icon: 'vocabulary',
    accent: { bg: '#FFECC8', text: '#B45309' },
  },
]

// A driver with nothing behind it takes the neutral chip rather than its own
// colour — it's listed as considered, not as contributing.
export const DRIVER_OFF_ACCENT = { bg: '#F2F2F2', text: '#929292' }

// Words with Benny is itself still a proposal ("(TBD)" in the ticket), and a
// site either has it or doesn't — so it can't be live for one reader in a class.
// Modelled here as on, so the sixth input is shown doing its job: vocabulary a
// reader picks up by logging, read the same way as everything else. Flip this to
// `false` and the row stays in the list, greyed and saying what it will
// contribute — which is what a site without the feature sees.
export const SITE = { wordsWithBenny: true }

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
  // Consistent for eight windows, with one input finally moving: his minutes
  // are down on the same number of days, which is the early shape of the
  // boredom his summary warns about.
  marcus: {
    studentKey: 'marcus',
    name: 'Marcus Chen',
    // Every window carries its own reading — signal, headline, Benny's summary
    // and the six drivers — so a past period can be opened and read the way the
    // current one is, rather than being a coloured cell with nothing behind it.
    // Rolling 30-day windows, oldest first; the last is the live one.
    trajectory: [
      {
        label: 'Dec 16',
        range: 'Nov 17 – Dec 16',
        signal: 'consistent',
        headline: 'Steady, and at the top of the class',
        explanation:
          'Reading on **19 of 30 days** with **640 minutes** behind it — the shape he has held all year.',
        drivers: {
          frequency: {
            direction: 'flat',
            value: '19',
            unit: 'of last 30 days',
          },
          volume: {
            direction: 'flat',
            value: '640',
            unit: 'min in 30 days',
          },
          logging: {
            direction: 'flat',
            value: '0',
            unit: 'flagged in 30 days',
          },
          talks: {
            direction: 'flat',
            value: '3',
            unit: 'talks in 30 days',
          },
          rmi: {
            direction: 'flat',
            value: '31.2',
            unit: '/ 40 motivation',
          },
          words: {
            direction: 'flat',
            value: '8',
            unit: 'words in 30 days',
          },
        },
      },
      {
        label: 'Jan 15',
        range: 'Dec 17 – Jan 15',
        signal: 'consistent',
        headline: 'Steady, and at the top of the class',
        explanation: 'Up a little on every input, and **no flagged sessions** in either window.',
        drivers: {
          frequency: {
            direction: 'up',
            delta: 1,
            deltaFormat: (n) => `${n} days`,
            value: '20',
            unit: 'of last 30 days',
          },
          volume: {
            direction: 'up',
            delta: 9,
            deltaFormat: (n) => `${n}%`,
            value: '700',
            unit: 'min in 30 days',
          },
          logging: {
            direction: 'flat',
            value: '0',
            unit: 'flagged in 30 days',
          },
          talks: {
            direction: 'up',
            delta: 1,
            deltaFormat: (n) => `${n} talks`,
            value: '4',
            unit: 'talks in 30 days',
          },
          rmi: {
            direction: 'up',
            delta: 4,
            deltaFormat: (n) => `${n}%`,
            value: '32.5',
            unit: '/ 40 motivation',
          },
          words: {
            direction: 'up',
            delta: 1,
            deltaFormat: (n) => `${n} words`,
            value: '9',
            unit: 'words in 30 days',
          },
        },
      },
      {
        label: 'Feb 14',
        range: 'Jan 16 – Feb 14',
        signal: 'consistent',
        headline: 'Steady, and at the top of the class',
        explanation: '**20 of 30 days** again. One flagged session, cleared on review.',
        drivers: {
          frequency: {
            direction: 'flat',
            value: '20',
            unit: 'of last 30 days',
          },
          volume: {
            direction: 'up',
            delta: 3,
            deltaFormat: (n) => `${n}%`,
            value: '720',
            unit: 'min in 30 days',
          },
          logging: {
            direction: 'down',
            delta: 1,
            deltaFormat: (n) => `${n} flags`,
            value: '1',
            unit: 'flagged in 30 days',
          },
          talks: {
            direction: 'flat',
            value: '4',
            unit: 'talks in 30 days',
          },
          rmi: {
            direction: 'up',
            delta: 2,
            deltaFormat: (n) => `${n}%`,
            value: '33.1',
            unit: '/ 40 motivation',
          },
          words: {
            direction: 'up',
            delta: 1,
            deltaFormat: (n) => `${n} words`,
            value: '10',
            unit: 'words in 30 days',
          },
        },
      },
      {
        label: 'Mar 16',
        range: 'Feb 15 – Mar 16',
        signal: 'consistent',
        headline: 'His best month of the year so far',
        explanation:
          'His strongest window yet: **21 of 30 days**, **745 minutes**, and **five talks**, all rated Engaged.',
        drivers: {
          frequency: {
            direction: 'up',
            delta: 1,
            deltaFormat: (n) => `${n} days`,
            value: '21',
            unit: 'of last 30 days',
          },
          volume: {
            direction: 'up',
            delta: 3,
            deltaFormat: (n) => `${n}%`,
            value: '745',
            unit: 'min in 30 days',
          },
          logging: {
            direction: 'up',
            delta: -1,
            deltaFormat: (n) => `${n} flags`,
            value: '0',
            unit: 'flagged in 30 days',
          },
          talks: {
            direction: 'up',
            delta: 1,
            deltaFormat: (n) => `${n} talks`,
            value: '5',
            unit: 'talks in 30 days',
          },
          rmi: {
            direction: 'up',
            delta: 2,
            deltaFormat: (n) => `${n}%`,
            value: '33.8',
            unit: '/ 40 motivation',
          },
          words: {
            direction: 'flat',
            value: '10',
            unit: 'words in 30 days',
          },
        },
      },
      {
        label: 'Apr 15',
        range: 'Mar 17 – Apr 15',
        signal: 'consistent',
        headline: 'Steady, and at the top of the class',
        explanation:
          'Holding. Motivation is still climbing — **35.1 / 40**, his best index of the year at that point.',
        drivers: {
          frequency: {
            direction: 'down',
            delta: -1,
            deltaFormat: (n) => `${n} days`,
            value: '20',
            unit: 'of last 30 days',
          },
          volume: {
            direction: 'up',
            delta: 2,
            deltaFormat: (n) => `${n}%`,
            value: '760',
            unit: 'min in 30 days',
          },
          logging: {
            direction: 'flat',
            value: '0',
            unit: 'flagged in 30 days',
          },
          talks: {
            direction: 'down',
            delta: -1,
            deltaFormat: (n) => `${n} talks`,
            value: '4',
            unit: 'talks in 30 days',
          },
          rmi: {
            direction: 'up',
            delta: 4,
            deltaFormat: (n) => `${n}%`,
            value: '35.1',
            unit: '/ 40 motivation',
          },
          words: {
            direction: 'up',
            delta: 1,
            deltaFormat: (n) => `${n} words`,
            value: '11',
            unit: 'words in 30 days',
          },
        },
      },
      {
        label: 'May 15',
        range: 'Apr 16 – May 15',
        signal: 'consistent',
        current: true,
        headline: 'Steady, and at the top of the class',
        explanation:
          "Marcus has read on **21 of the last 30 days**, almost exactly what he did the 30 days before that — this is his normal, and it has been for **eight weeks**. Talks and motivation are holding at the top of the class, with **1 flagged session all year**. The one thing moving is minutes: **down 9%** on the 30 days before, over the same number of days, so his sittings are getting shorter. Not enough to move the signal, and worth watching — the risk with a reader like Marcus isn't drop-off, it's boredom. He's at **870L** and reading titles he's already comfortable with.",
        drivers: {
          frequency: {
            direction: 'up',
            delta: 1,
            deltaFormat: (n) => `${n} days`,
            value: '21',
            unit: 'of last 30 days',
          },
          volume: {
            direction: 'down',
            delta: -9,
            deltaFormat: (n) => `${n}%`,
            value: '690',
            unit: 'min in 30 days',
          },
          logging: {
            direction: 'down',
            delta: 1,
            deltaFormat: (n) => `${n} flags`,
            value: '1',
            unit: 'flagged in 30 days',
          },
          talks: {
            direction: 'up',
            delta: 2,
            deltaFormat: (n) => `${n} talks`,
            value: '6',
            unit: 'talks in 30 days',
          },
          rmi: {
            direction: 'up',
            delta: 4,
            deltaFormat: (n) => `${n}%`,
            value: '36.4',
            unit: '/ 40 motivation',
          },
          words: {
            direction: 'up',
            delta: 1,
            deltaFormat: (n) => `${n} words`,
            value: '12',
            unit: 'words in 30 days',
          },
        },
      },
    ],
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

  // The clearest turn in the class: two declining windows, two flat, then two
  // up. Stepping back through them is how you tell momentum from a good week.
  anne: {
    studentKey: 'anne',
    name: 'Anne Boonchuy',
    // Every window carries its own reading — signal, headline, Benny's summary
    // and the six drivers — so a past period can be opened and read the way the
    // current one is, rather than being a coloured cell with nothing behind it.
    // Rolling 30-day windows, oldest first; the last is the live one.
    trajectory: [
      {
        label: 'Dec 16',
        range: 'Nov 17 – Dec 16',
        signal: 'declining',
        headline: 'Slipping, and logging she can’t rely on',
        explanation:
          'Down to **5 of 30 days**, and **6 flagged sessions** make what she did log hard to read.',
        drivers: {
          frequency: {
            direction: 'flat',
            value: '5',
            unit: 'of last 30 days',
          },
          volume: {
            direction: 'flat',
            value: '150',
            unit: 'min in 30 days',
          },
          logging: {
            direction: 'flat',
            value: '6',
            unit: 'flagged in 30 days',
          },
          talks: {
            direction: 'flat',
            value: '1',
            unit: 'unfinished talks',
          },
          rmi: {
            direction: 'flat',
            value: '24.1',
            unit: '/ 40 motivation',
          },
          words: {
            direction: 'flat',
            value: '2',
            unit: 'words in 30 days',
          },
        },
      },
      {
        label: 'Jan 15',
        range: 'Dec 17 – Jan 15',
        signal: 'declining',
        headline: 'Her quietest window of the year',
        explanation:
          '**4 of 30 days** and **120 minutes** — her lowest window of the year, with flags still climbing.',
        drivers: {
          frequency: {
            direction: 'down',
            delta: -1,
            deltaFormat: (n) => `${n} days`,
            value: '4',
            unit: 'of last 30 days',
          },
          volume: {
            direction: 'down',
            delta: -20,
            deltaFormat: (n) => `${n}%`,
            value: '120',
            unit: 'min in 30 days',
          },
          logging: {
            direction: 'down',
            delta: 1,
            deltaFormat: (n) => `${n} flags`,
            value: '7',
            unit: 'flagged in 30 days',
          },
          talks: {
            direction: 'down',
            delta: 1,
            deltaFormat: (n) => `${n} unfinished`,
            value: '2',
            unit: 'unfinished talks',
          },
          rmi: {
            direction: 'down',
            delta: -3,
            deltaFormat: (n) => `${n}%`,
            value: '23.4',
            unit: '/ 40 motivation',
          },
          words: {
            direction: 'down',
            delta: -1,
            deltaFormat: (n) => `${n} words`,
            value: '1',
            unit: 'words in 30 days',
          },
        },
      },
      {
        label: 'Feb 14',
        range: 'Jan 16 – Feb 14',
        signal: 'consistent',
        headline: 'Bottomed out, and holding',
        explanation: 'No further fall: **5 of 30 days** again. Nothing recovering yet either.',
        drivers: {
          frequency: {
            direction: 'up',
            delta: 1,
            deltaFormat: (n) => `${n} days`,
            value: '5',
            unit: 'of last 30 days',
          },
          volume: {
            direction: 'up',
            delta: 17,
            deltaFormat: (n) => `${n}%`,
            value: '140',
            unit: 'min in 30 days',
          },
          logging: {
            direction: 'flat',
            value: '7',
            unit: 'flagged in 30 days',
          },
          talks: {
            direction: 'flat',
            value: '2',
            unit: 'unfinished talks',
          },
          rmi: {
            direction: 'up',
            delta: 3,
            deltaFormat: (n) => `${n}%`,
            value: '24.0',
            unit: '/ 40 motivation',
          },
          words: {
            direction: 'up',
            delta: 1,
            deltaFormat: (n) => `${n} words`,
            value: '2',
            unit: 'words in 30 days',
          },
        },
      },
      {
        label: 'Mar 16',
        range: 'Feb 15 – Mar 16',
        signal: 'consistent',
        headline: 'Holding, with the flag count finally moving',
        explanation:
          'Steady on days, and the **flag count turned** for the first time since October.',
        drivers: {
          frequency: {
            direction: 'flat',
            value: '5',
            unit: 'of last 30 days',
          },
          volume: {
            direction: 'up',
            delta: 4,
            deltaFormat: (n) => `${n}%`,
            value: '145',
            unit: 'min in 30 days',
          },
          logging: {
            direction: 'up',
            delta: -1,
            deltaFormat: (n) => `${n} flags`,
            value: '6',
            unit: 'flagged in 30 days',
          },
          talks: {
            direction: 'flat',
            value: '2',
            unit: 'unfinished talks',
          },
          rmi: {
            direction: 'up',
            delta: 5,
            deltaFormat: (n) => `${n}%`,
            value: '25.2',
            unit: '/ 40 motivation',
          },
          words: {
            direction: 'up',
            delta: 1,
            deltaFormat: (n) => `${n} words`,
            value: '3',
            unit: 'words in 30 days',
          },
        },
      },
      {
        label: 'Apr 15',
        range: 'Mar 17 – Apr 15',
        signal: 'increasing',
        headline: 'The first real month of momentum',
        explanation:
          'Minutes **doubled to 298** on one extra day — longer sittings, which is how her run started.',
        drivers: {
          frequency: {
            direction: 'up',
            delta: 1,
            deltaFormat: (n) => `${n} days`,
            value: '6',
            unit: 'of last 30 days',
          },
          volume: {
            direction: 'up',
            delta: 106,
            deltaFormat: (n) => `${n}%`,
            value: '298',
            unit: 'min in 30 days',
          },
          logging: {
            direction: 'down',
            delta: 1,
            deltaFormat: (n) => `${n} flags`,
            value: '7',
            unit: 'flagged in 30 days',
          },
          talks: {
            direction: 'up',
            delta: -1,
            deltaFormat: (n) => `${n} unfinished`,
            value: '1',
            unit: 'unfinished talks',
          },
          rmi: {
            direction: 'up',
            delta: 4,
            deltaFormat: (n) => `${n}%`,
            value: '26.2',
            unit: '/ 40 motivation',
          },
          words: {
            direction: 'up',
            delta: 1,
            deltaFormat: (n) => `${n} words`,
            value: '4',
            unit: 'words in 30 days',
          },
        },
      },
      {
        label: 'May 15',
        range: 'Apr 16 – May 15',
        signal: 'increasing',
        current: true,
        headline: 'Real momentum from a slow start',
        explanation:
          'Anne has read on **10 of the last 30 days**, up from **6** in the 30 days before, and her flagged sessions are **down from 7 to 4**. Lexile is **up 50 points since April**. She is still under her 20-minute goal most days, so this is momentum rather than arrival — but it is the clearest upward move in the class. Worth knowing: **2 Book Talks are unfinished**, both on the same title.',
        drivers: {
          frequency: {
            direction: 'up',
            delta: 4,
            deltaFormat: (n) => `${n} days`,
            value: '10',
            unit: 'of last 30 days',
          },
          volume: {
            direction: 'up',
            delta: 21,
            deltaFormat: (n) => `${n}%`,
            value: '360',
            unit: 'min in 30 days',
          },
          logging: {
            direction: 'up',
            delta: -3,
            deltaFormat: (n) => `${n} flags`,
            value: '4',
            unit: 'flagged in 30 days',
          },
          talks: {
            direction: 'down',
            delta: 1,
            deltaFormat: (n) => `${n} unfinished`,
            value: '2',
            unit: 'unfinished talks',
          },
          rmi: {
            direction: 'up',
            delta: 9,
            deltaFormat: (n) => `${n}%`,
            value: '28.6',
            unit: '/ 40 motivation',
          },
          words: {
            direction: 'up',
            delta: 3,
            deltaFormat: (n) => `${n} words`,
            value: '7',
            unit: 'words in 30 days',
          },
        },
      },
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

  // Steady until February, then down on every input at once — the run that
  // makes the current window a conversation rather than a nudge.
  tyler: {
    studentKey: 'tyler',
    name: 'Tyler Voss',
    // Every window carries its own reading — signal, headline, Benny's summary
    // and the six drivers — so a past period can be opened and read the way the
    // current one is, rather than being a coloured cell with nothing behind it.
    // Rolling 30-day windows, oldest first; the last is the live one.
    trajectory: [
      {
        label: 'Dec 16',
        range: 'Nov 17 – Dec 16',
        signal: 'consistent',
        headline: 'Reading steadily, and on his own',
        explanation:
          '**18 of 30 days** and **520 minutes**. This is the reader the rest of the year is measured against.',
        drivers: {
          frequency: {
            direction: 'flat',
            value: '18',
            unit: 'of last 30 days',
          },
          volume: {
            direction: 'flat',
            value: '520',
            unit: 'min in 30 days',
          },
          logging: {
            direction: 'flat',
            value: '2',
            unit: 'flagged in 30 days',
          },
          talks: {
            direction: 'flat',
            value: '1',
            unit: 'unfinished talks',
          },
          rmi: {
            direction: 'flat',
            value: '26.8',
            unit: '/ 40 motivation',
          },
          words: {
            direction: 'flat',
            value: '5',
            unit: 'words in 30 days',
          },
        },
      },
      {
        label: 'Jan 15',
        range: 'Dec 17 – Jan 15',
        signal: 'consistent',
        headline: 'Holding, with nothing to flag',
        explanation:
          'Holding at **17 of 30 days**, with only **3 flagged sessions** and both talks finished.',
        drivers: {
          frequency: {
            direction: 'down',
            delta: -1,
            deltaFormat: (n) => `${n} days`,
            value: '17',
            unit: 'of last 30 days',
          },
          volume: {
            direction: 'down',
            delta: -4,
            deltaFormat: (n) => `${n}%`,
            value: '500',
            unit: 'min in 30 days',
          },
          logging: {
            direction: 'down',
            delta: 1,
            deltaFormat: (n) => `${n} flags`,
            value: '3',
            unit: 'flagged in 30 days',
          },
          talks: {
            direction: 'flat',
            value: '1',
            unit: 'unfinished talks',
          },
          rmi: {
            direction: 'down',
            delta: -3,
            deltaFormat: (n) => `${n}%`,
            value: '26.1',
            unit: '/ 40 motivation',
          },
          words: {
            direction: 'down',
            delta: -1,
            deltaFormat: (n) => `${n} words`,
            value: '4',
            unit: 'words in 30 days',
          },
        },
      },
      {
        label: 'Feb 14',
        range: 'Jan 16 – Feb 14',
        signal: 'declining',
        headline: 'The month it started to come apart',
        explanation:
          'Down to **13 of 30 days**, and flagged sessions **doubled to 6**. The first window that moved.',
        drivers: {
          frequency: {
            direction: 'down',
            delta: -4,
            deltaFormat: (n) => `${n} days`,
            value: '13',
            unit: 'of last 30 days',
          },
          volume: {
            direction: 'down',
            delta: -24,
            deltaFormat: (n) => `${n}%`,
            value: '380',
            unit: 'min in 30 days',
          },
          logging: {
            direction: 'down',
            delta: 3,
            deltaFormat: (n) => `${n} flags`,
            value: '6',
            unit: 'flagged in 30 days',
          },
          talks: {
            direction: 'down',
            delta: 2,
            deltaFormat: (n) => `${n} unfinished`,
            value: '3',
            unit: 'unfinished talks',
          },
          rmi: {
            direction: 'down',
            delta: -10,
            deltaFormat: (n) => `${n}%`,
            value: '23.5',
            unit: '/ 40 motivation',
          },
          words: {
            direction: 'down',
            delta: -2,
            deltaFormat: (n) => `${n} words`,
            value: '2',
            unit: 'words in 30 days',
          },
        },
      },
      {
        label: 'Mar 16',
        range: 'Feb 15 – Mar 16',
        signal: 'declining',
        headline: 'Falling on every input at once',
        explanation:
          '**11 of 30 days**, **9 flags**, and **5 unfinished talks** — every input pointing the same way.',
        drivers: {
          frequency: {
            direction: 'down',
            delta: -2,
            deltaFormat: (n) => `${n} days`,
            value: '11',
            unit: 'of last 30 days',
          },
          volume: {
            direction: 'down',
            delta: -18,
            deltaFormat: (n) => `${n}%`,
            value: '310',
            unit: 'min in 30 days',
          },
          logging: {
            direction: 'down',
            delta: 3,
            deltaFormat: (n) => `${n} flags`,
            value: '9',
            unit: 'flagged in 30 days',
          },
          talks: {
            direction: 'down',
            delta: 2,
            deltaFormat: (n) => `${n} unfinished`,
            value: '5',
            unit: 'unfinished talks',
          },
          rmi: {
            direction: 'down',
            delta: -9,
            deltaFormat: (n) => `${n}%`,
            value: '21.4',
            unit: '/ 40 motivation',
          },
          words: {
            direction: 'down',
            delta: -1,
            deltaFormat: (n) => `${n} words`,
            value: '1',
            unit: 'words in 30 days',
          },
        },
      },
      {
        label: 'Apr 15',
        range: 'Mar 17 – Apr 15',
        signal: 'declining',
        headline: 'Still falling, and the logs stopped being trustworthy',
        explanation:
          '**9 of 30 days** and **11 flagged sessions**, most of them over the daily limit.',
        drivers: {
          frequency: {
            direction: 'down',
            delta: -2,
            deltaFormat: (n) => `${n} days`,
            value: '9',
            unit: 'of last 30 days',
          },
          volume: {
            direction: 'down',
            delta: -23,
            deltaFormat: (n) => `${n}%`,
            value: '240',
            unit: 'min in 30 days',
          },
          logging: {
            direction: 'down',
            delta: 2,
            deltaFormat: (n) => `${n} flags`,
            value: '11',
            unit: 'flagged in 30 days',
          },
          talks: {
            direction: 'down',
            delta: 1,
            deltaFormat: (n) => `${n} unfinished`,
            value: '6',
            unit: 'unfinished talks',
          },
          rmi: {
            direction: 'down',
            delta: -5,
            deltaFormat: (n) => `${n}%`,
            value: '20.4',
            unit: '/ 40 motivation',
          },
          words: {
            direction: 'flat',
            value: '1',
            unit: 'words in 30 days',
          },
        },
      },
      {
        label: 'May 15',
        range: 'Apr 16 – May 15',
        signal: 'declining',
        current: true,
        headline: 'Stopped, and the last data is unreliable',
        explanation:
          'Tyler has logged **nothing in 30 days** — the only reader in the class with a gap that long — after **9 days** in the 30 days before. Minutes are **down 58% on last year**, Lexile is **down 20 points**, and his motivation index fell **11%**. The reading he did log is hard to trust: **13 flagged sessions**, most over the daily limit, and **7 Book Talks left unfinished**. His account is frozen, so nothing new is coming in. This is the one signal in the class worth a conversation this week.',
        drivers: {
          frequency: {
            direction: 'down',
            delta: -9,
            deltaFormat: (n) => `${n} days`,
            value: '0',
            unit: 'of last 30 days',
          },
          volume: {
            direction: 'down',
            delta: -100,
            deltaFormat: (n) => `${n}%`,
            value: '0',
            unit: 'min in 30 days',
          },
          logging: {
            direction: 'down',
            delta: 2,
            deltaFormat: (n) => `${n} flags`,
            value: '13',
            unit: 'flagged in 30 days',
          },
          talks: {
            direction: 'down',
            delta: 1,
            deltaFormat: (n) => `${n} unfinished`,
            value: '7',
            unit: 'unfinished talks',
          },
          rmi: {
            direction: 'down',
            delta: -11,
            deltaFormat: (n) => `${n}%`,
            value: '18.2',
            unit: '/ 40 motivation',
          },
          words: {
            direction: 'down',
            delta: -1,
            deltaFormat: (n) => `${n} words`,
            value: '0',
            unit: 'words in 30 days',
          },
        },
      },
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
// A `null` or `0` delta draws no trend chip (see `TrendChip`): the signal
// ignores a move it considers noise, so the column shouldn't put an arrow on
// one either. A Consistent reader can still carry one — Marcus's minutes are
// down 9% on the same number of days — because "Consistent" is a reading of all
// six inputs together, not a claim that none of them moved.
export const ROSTER = [
  {
    key: 'marcus',
    name: 'Marcus Chen',
    signal: 'consistent',
    days30: 21,
    days30Delta: 0,
    mins30: 690,
    minsDelta: -9,
    lastLogged: 'Today',
  },
  {
    key: 'anne',
    name: 'Anne Boonchuy',
    signal: 'increasing',
    days30: 10,
    days30Delta: 4,
    mins30: 360,
    minsDelta: 21,
    lastLogged: 'Yesterday',
  },
  {
    key: 'tyler',
    name: 'Tyler Voss',
    signal: 'declining',
    days30: 0,
    days30Delta: -9,
    mins30: 0,
    minsDelta: -58,
    lastLogged: '36 days ago',
  },
  {
    key: 'priya',
    name: 'Priya Shah',
    signal: 'consistent',
    days30: 19,
    days30Delta: 0,
    mins30: 650,
    minsDelta: 0,
    lastLogged: 'Today',
  },
  {
    key: 'devon',
    name: 'Devon Brooks',
    signal: 'increasing',
    days30: 17,
    days30Delta: 2,
    mins30: 590,
    minsDelta: 34,
    lastLogged: 'Today',
  },
  {
    key: 'mei',
    name: 'Mei Tanaka',
    signal: 'consistent',
    days30: 16,
    days30Delta: 0,
    mins30: 520,
    minsDelta: 0,
    lastLogged: 'Yesterday',
  },
  {
    key: 'omar',
    name: 'Omar Haddad',
    signal: 'declining',
    days30: 8,
    days30Delta: -7,
    mins30: 275,
    minsDelta: -41,
    lastLogged: '9 days ago',
  },
  {
    key: 'sofia',
    name: 'Sofía Reyes',
    signal: 'consistent',
    days30: 13,
    days30Delta: 0,
    mins30: 420,
    minsDelta: 0,
    lastLogged: 'Yesterday',
  },
  {
    key: 'liam',
    name: 'Liam O’Donnell',
    signal: 'increasing',
    days30: 12,
    days30Delta: 5,
    mins30: 375,
    minsDelta: 26,
    lastLogged: 'Today',
  },
  {
    key: 'ava',
    name: 'Ava Nwosu',
    signal: 'declining',
    days30: 9,
    days30Delta: -3,
    mins30: 250,
    minsDelta: -19,
    lastLogged: '5 days ago',
  },
  {
    key: 'noah',
    name: 'Noah Feldman',
    signal: 'increasing',
    days30: 11,
    days30Delta: 6,
    mins30: 445,
    minsDelta: 61,
    lastLogged: 'Today',
  },
  {
    key: 'zara',
    name: 'Zara Mahmood',
    signal: 'declining',
    days30: 7,
    days30Delta: -4,
    mins30: 180,
    minsDelta: -28,
    lastLogged: '4 days ago',
  },
  {
    key: 'jonah',
    name: 'Jonah Whitfield',
    signal: 'pending',
    days30: 3,
    days30Delta: null,
    mins30: 155,
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

/** The window a reader is in — the signal they "have" is this one's. */
export function currentPeriod(sig) {
  if (!sig) return null
  return sig.trajectory.find((p) => p.current) ?? sig.trajectory[sig.trajectory.length - 1]
}
