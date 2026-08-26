// Book Talks with Benny (BTWB) — the site-wide completion setting.
//
// Ticket: "BTWB site-wide completion setting" (Asana 1214449706072940).
//
// Today a book talk only starts in two places: when a student logs *above the
// site's warning threshold* (an integrity check-in, part of the Reading
// Integrity Suite), or when an admin switches Book Talks on inside a specific
// challenge (an engagement talk). The ticket adds a third, site-wide trigger —
// every book a student logs as complete — and makes it ON by default whenever
// BTWB is on, so clients don't have to opt in challenge by challenge.
//
// Only one talk ever runs per logged session, resolved in this order:
//   1. Reading engagement talk (challenge)
//   2. Book completion talk (site-wide)   ← new in this ticket
//   3. Warning-level talk (always an integrity talk)

export const SITE = {
  name: 'Maplewood Elementary',
}

// ─── The three types of book talk ────────────────────────────────────────────
// Which types a trigger can run depends on what that trigger is *for*. The
// ticket leaves the completion default open ("we could, by default, make these
// engagement OR integrity book talks - or we could let the admin choose"), so
// completions model the admin-choice version — but only between the two talks
// that fit a finished book. The warning threshold stays the integrity check-in
// it runs today: it exists to tell you whether a log looks authentic, which is
// the one thing the other two types can't report.
export const TALK_KINDS = {
  engagement: {
    id: 'engagement',
    label: 'Engagement talk',
    short: 'Engagement',
    color: '#0D9488',
    tint: '#EFFBF9',
    icon: 'heart',
    // Challenge-triggered talks can award a challenge badge; the site-wide
    // completion and warning-level talks don't.
    badge: 'Book Chatter',
    blurb: 'A warm chat about how the book landed — what they thought, how it made them feel.',
    measures: 'Whether the student had a positive reading experience.',
  },
  comprehension: {
    id: 'comprehension',
    label: 'Comprehension talk',
    short: 'Comprehension',
    color: '#4F46E5',
    tint: '#EEF2FF',
    icon: 'bulb',
    // Engagement and integrity talks exist today; comprehension is the new type.
    isNew: true,
    blurb:
      'A chat about what actually happened in the book — the characters, the events, the ideas behind them.',
    measures: 'How well the student understood what they read.',
  },
  integrity: {
    id: 'integrity',
    label: 'Integrity talk',
    short: 'Integrity',
    color: '#B45309',
    tint: '#FFFBEB',
    icon: 'shield-check',
    blurb:
      'A light check-in on the reading itself. Benny never grades correctness — he only flags concerning patterns.',
    measures: 'Whether the log looks like reading the student actually did.',
  },
}

// What an admin can actually choose, wherever a trigger offers a choice — book
// completions site-wide and title completions in a challenge. Both fire on a
// finished book, so both offer the two conversations *about* a book; neither
// offers an integrity check-in on a reader who did nothing suspicious.
export const TALK_KIND_OPTIONS = [TALK_KINDS.engagement, TALK_KINDS.comprehension]

// Integrity talks are therefore never picked, here or per challenge — they're a
// site-wide behavior of one trigger. Over the warning threshold there is no
// choice to make, and so no picker: that trigger's whole job is to report a
// Reading Confidence back to the educator, and only TALK_KINDS.integrity does
// that. It always runs an integrity talk.

// "an engagement talk" / "a comprehension talk"
export const article = (word) => (/^[aeiou]/i.test(word) ? 'an' : 'a')

// Composer emoji shortcuts — readers are grade 3+, and a tap beats typing.
export const EMOJIS = ['😀', '😂', '🥺', '😮', '❤️', '🔥', '👍', '👎', '🤔', '📚', '⭐', '🎉']

// What the ticket proposes as the shipped default: completion talks on with
// BTWB, engagement flavored. The warning threshold keeps the integrity talk it
// runs today — fixed, so it carries no type of its own.
export const DEFAULT_SETTINGS = {
  btwbOn: true,
  onCompletion: true,
  completionKind: 'engagement',
  onWarning: true,
}

// ─── What the educator gets back ─────────────────────────────────────────────
// Deliberately not another score: a short written summary of the talk, and — on
// comprehension talks — how confident Benny is that the reader actually knew the
// book.
export const CONFIDENCE_LEVELS = [
  { id: 'high', label: 'High', color: '#0D9488' },
  { id: 'moderate', label: 'Moderate', color: '#B45309' },
  { id: 'low', label: 'Low', color: '#DC2626' },
]

// Reading Confidence as an SFR review card — same shape as its RATING_META.
export const CONFIDENCE_META = {
  high: {
    label: 'High confidence',
    color: '#16A97A',
    bg: '#F0FDF4',
    border: '#BBF7D0',
    icon: 'mood-happy',
  },
  moderate: {
    label: 'Moderate confidence',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
    icon: 'mood-neutral',
  },
  low: {
    label: 'Low confidence',
    color: '#DC2626',
    bg: '#FEF2F2',
    border: '#FECACA',
    icon: 'mood-sad',
  },
}

// ─── Flags ───────────────────────────────────────────────────────────────────
// Same catalogs, palette and card language Sessions for Review uses, so a book
// talk's flags read identically to the ones on a post-logging session. Benny
// raises both kinds: positive flags are the signals worth celebrating, negative
// flags the ones worth a closer look. He still never grades correctness.
export const NEG_FLAG_COLORS = { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' }
export const POS_FLAG_COLORS = { color: '#16A97A', bg: '#F0FDF4', border: '#BBF7D0' }

export const FLAG_DESCS = {
  'copy-paste': {
    label: 'Copied Response',
    desc: 'Response appears to be copied from an external source.',
    icon: 'copy',
  },
  unintelligible: {
    label: 'Unintelligible Response',
    desc: 'We were unable to understand one or more responses.',
    icon: 'wave',
  },
  'no-recall': {
    label: 'Unable to Recall Details',
    desc: 'Student could not describe specific events or characters.',
    icon: 'help',
  },
  minimal: {
    label: 'Minimal Engagement',
    desc: 'Student gave very brief, low-effort responses.',
    icon: 'align-left',
  },
  'quit-early': {
    label: 'Did Not Complete',
    desc: 'Student exited the conversation before finishing.',
    icon: 'circle-x',
  },
}

export const POS_FLAG_DESCS = {
  'positive-sentiment': {
    label: 'Positive Sentiment',
    desc: 'Student expressed positive feeling about the text.',
    icon: 'smile',
  },
  'answer-length': {
    label: 'Long Answer',
    desc: 'Student gave a longer, engaged answer.',
    icon: 'list',
  },
  'references-details': {
    label: 'References Details',
    desc: 'Student included specific details in their response.',
    icon: 'search',
  },
  'makes-connection': {
    label: 'Made a Connection',
    desc: 'Student connected the text to their own life or experiences.',
    icon: 'link',
  },
}

// A flag id resolved for display: its label, glyph, polarity and color. Positive
// and negative flags live in separate catalogs, so this is what lets a caller
// take a bare id — from a session or from a single answer — and render it.
export const flagMeta = (type) => {
  const pos = POS_FLAG_DESCS[type]
  const meta = pos ?? FLAG_DESCS[type]
  if (!meta)
    return {
      type,
      label: type,
      desc: '',
      icon: 'flag',
      polarity: 'negative',
      color: NEG_FLAG_COLORS.color,
    }
  return {
    type,
    ...meta,
    polarity: pos ? 'positive' : 'negative',
    color: pos ? POS_FLAG_COLORS.color : NEG_FLAG_COLORS.color,
  }
}

export const CONFIDENCE_BLURB =
  'Benny’s confidence that the student demonstrated authentic knowledge of the book.'

// Keyed by talk kind. Only the comprehension talk carries a confidence — it's
// the talk that actually probes what the reader took from the book, so it's the
// one that can say how confident Benny is in what they knew.
const CONFIDENCE_BY_KIND = {
  comprehension: 'high',
}

export const confidenceFor = (kindId) => CONFIDENCE_BY_KIND[kindId]

// ─── The reader + book the talk demo runs on ─────────────────────────────────
export const READER = { name: 'Marcus Chen', grade: 4, gradeLabel: '4th grade' }

export const BOOK = {
  title: 'The Wild Robot',
  author: 'Peter Brown',
  pages: 288,
  cover: 'https://covers.openlibrary.org/b/isbn/9780316381994-L.jpg',
}

// ─── The conversations ───────────────────────────────────────────────────────
// Scripted per talk kind. Benny opens warmly, works the point of the talk in as
// conversation rather than as a quiz item, follows up on the answer, then closes. `replies` are the
// tappable answers the demo offers; the last turn has none.
//
// `reasoning` runs parallel to `replies`: for each answer a reader could give,
// the model's written rationale for how it read that answer. It's the evidence
// behind the flags and the confidence — third-person analysis of the response,
// not Benny talking — and it only ever surfaces on the educator's side, folded
// away under each answer in the transcript.
const ENGAGEMENT_SCRIPT = [
  {
    benny: 'You finished *The Wild Robot*! Did you like it?',
    replies: ['I loved it', 'It was pretty good', 'It was just okay'],
    reasoning: [
      'The student gives an unqualified positive reaction, and the phrasing reads as genuine enthusiasm rather than a shrug. On its own it carries no detail about what they liked — the follow-up is what will show whether the enthusiasm is grounded in the book.',
      'A mild positive. The student is engaged enough to answer directly, but the wording is noncommittal and does not yet indicate what held their interest.',
      'A lukewarm reaction. Not a concern by itself — readers finish books they merely tolerated — but it suggests the book may not have connected, which is worth weighing against what they say stuck with them.',
    ],
  },
  {
    benny: 'What part stuck with you the most?',
    replies: [
      'The ending, when she had to leave',
      'When Brightbill learned to fly',
      'The part with the bear',
    ],
    reasoning: [
      'The student names the book’s actual ending — Roz is taken from the island after the animals try to defend her — and frames it in emotional terms rather than plot terms. Choosing the climax and attaching feeling to it is a strong engagement signal.',
      'The student picks a real and specific milestone: Brightbill, the gosling Roz adopts, learning to fly ahead of the migration. Naming a character and an event rather than a general impression shows the story stayed with them.',
      'The student references the bear encounter, an actual early episode in which Roz is attacked and falls from a cliff. Accurate, but thin — no detail about what happened or why it stuck, so engagement reads as moderate.',
    ],
  },
  {
    benny: 'Would you recommend it to a friend? Why or why not?',
    replies: [
      'Yes — my friend Jae would love it',
      'Maybe, if they like animals',
      'Probably not, it’s slow at the start',
    ],
    reasoning: [
      'The student recommends the book and pictures a specific person for it. Naming a real friend is a stronger signal than a generic yes — it suggests they thought about who the book is for.',
      'A conditional recommendation, and a fair read of the book: most of the cast is the island’s animals. Engagement is real but measured — the student is hedging rather than advocating.',
      'The student declines to recommend it but gives a specific reason — the opening stretch, where Roz activates alone on the island before any of the relationships begin. A critical answer with a reason behind it still demonstrates engagement with the text.',
    ],
  },
  { benny: 'Thanks for talking books with me! I’ll find you another one like it.', replies: [] },
]

// The integrity talk is the one triggered by a log above the warning threshold.
// Benny never grades correctness — he just keeps the conversation going and
// notes the patterns worth a closer look.
const INTEGRITY_SCRIPT = [
  {
    benny: 'That’s a lot of reading in one day! What was *The Wild Robot* about?',
    replies: ['It was about a robot', 'Stuff happened, it was good', 'idk'],
    reasoning: [
      'Technically accurate — Roz is a ROZZUM unit stranded on a wild island — but this is the level of detail available from the title and the cover alone. It neither demonstrates nor rules out reading.',
      'The response carries no content. It describes neither plot nor character and could be said about any book, so it offers no evidence of the reading the log claims.',
      'The student declines to answer a question about the book’s basic subject. Paired with a log above the site’s warning level, that gap is the pattern worth a closer look.',
    ],
  },
  {
    benny: 'Nice — can you tell me about one thing that happened in it?',
    replies: ['The robot did things on an island', 'asdkfj', 'I don’t remember'],
    reasoning: [
      'The setting is right — the story takes place on a remote island — but “did things” names no event. The student is echoing the frame of the question back rather than recalling the plot.',
      'Not intelligible language. There is no interpretable content in the response, which points to keyboard input rather than an attempt to answer.',
      'The student cannot recall a single event from the book. For a title logged as finished the same day, the absence of any retrievable plot detail is a meaningful signal.',
    ],
  },
  {
    benny: 'No problem. Who was your favorite character?',
    replies: ['The robot one', 'I forget the names', 'idk'],
    reasoning: [
      'Refers to Roz without naming her, and “the robot” is inferable from the title. The student is identifying a character by category rather than recalling one from the text.',
      'The student recalls no character names. Roz, Brightbill and Fink are named repeatedly across the book, so this is a notable gap rather than a lapse on a minor detail.',
      'A third consecutive non-answer on basic recall. Taken together, these turns are the pattern this talk exists to surface.',
    ],
  },
  { benny: 'Thanks for chatting with me about it!', replies: [] },
]

const COMPREHENSION_SCRIPT = [
  {
    benny: 'You finished *The Wild Robot*! Nice work. Did you like how it ended?',
    replies: ['I loved it', 'It was sad but good', 'It was okay'],
    reasoning: [
      'A positive reaction to the ending, but no comprehension content yet — the student has not indicated what actually happens at the end, so this turn establishes sentiment only.',
      'The student reads the ending as bittersweet, which matches the text: Roz is damaged and carried off the island, away from Brightbill. Holding two feelings at once suggests they followed the ending’s stakes, though they have not cited it directly.',
      'Noncommittal. The response gives no evidence either way about whether the student understood how the book ends.',
    ],
  },
  {
    benny:
      'If you recommended this book to another student, what is one lesson you hope they’d learn from it?',
    replies: [
      'That you can make a family anywhere',
      'That being different is okay',
      'To keep trying even when it’s hard',
    ],
    reasoning: [
      'The student states a defensible central theme. A robot raises an orphaned gosling and is taken in by the island’s animals — family in this book is built rather than inherited. This is a thematic inference rather than a plot restatement, which is the harder move.',
      'A reasonable theme: Roz is the only robot on the island and is feared by the animals before they come to depend on her. Plausible, but broad enough that it could be offered about many books without having read this one.',
      'A generic moral. Nothing in the text contradicts it — Roz survives a brutal winter and repeated setbacks — but nothing in the phrasing is specific to *The Wild Robot* either.',
    ],
  },
  {
    benny: 'That’s a big one. What happened in the story that made you think of that?',
    replies: [
      'Roz took care of Brightbill even though she wasn’t his real mom',
      'The animals helped her when she was in trouble',
      'I’m not sure, it just felt that way',
    ],
    reasoning: [
      'The student supports the theme with the right supporting event: Roz adopts Brightbill after his nest is destroyed and raises him as her own. Naming both characters and the relationship between them grounds the inference in the text rather than asserting it.',
      'Accurate — the animals shelter in the lodge Roz builds and defend her when the RECOs come for her. It supports the theme, though the student describes it generally instead of naming a specific scene or character.',
      'The student cannot connect the theme back to an event in the book. The theme they offered was sound, but without textual support there is no evidence it came from reading rather than from a general impression.',
    ],
  },
  {
    benny: 'I love that you pulled that from the story. Thanks for talking books with me!',
    replies: [],
  },
]

export const scriptFor = (kindId) =>
  kindId === 'comprehension'
    ? COMPREHENSION_SCRIPT
    : kindId === 'integrity'
      ? INTEGRITY_SCRIPT
      : ENGAGEMENT_SCRIPT

// ─── Example completed sessions (teacher-facing review) ──────────────────────
// One per talk type, so the review surface can show what each kind of
// conversation actually produces. All three are the same title on purpose: the
// scripts name the book and its characters, so a different book per session would
// contradict its own transcript. Transcripts are built from the same scripts the
// reader-facing modal uses — `picks` chooses which offered answer the student
// gave, so the integrity example genuinely earns its flags rather than asserting
// them.
function buildTranscript(kindId, picks, flagsByTurn = {}, leftAfter = null) {
  const script = scriptFor(kindId)
  const messages = []
  script.forEach((step, i) => {
    // `leftAfter` = the reader walked away on this question, so Benny's line is
    // the last thing in the transcript and nothing follows it.
    if (leftAfter !== null && i > leftAfter) return
    messages.push({ role: 'benny', text: step.benny, emotion: i === 0 ? 'excited' : undefined })
    if (leftAfter !== null && i === leftAfter) return
    const pick = picks[i] ?? 0
    const reply = step.replies?.[pick]
    if (reply) {
      // The flags this specific answer raised — the transcript is where a flag
      // is traceable to the thing that caused it.
      const flags = (flagsByTurn[i] ?? []).map(flagMeta)
      messages.push({
        role: 'student',
        text: reply,
        flags,
        flagged: flags.some((f) => f.polarity === 'negative'),
        reasoning: step.reasoning?.[pick],
      })
    }
  })
  return messages
}

export const SESSIONS = [
  {
    id: 'se-1',
    kindId: 'engagement',
    student: { name: 'Diego Ramirez', grade: '3rd', initials: 'DR', color: '#0D9488' },
    book: BOOK,
    date: 'Sep 14, 2026',
    trigger: 'Summer Reading 2026 challenge',
    status: 'completed',
    duration: '3 min 10 sec',
    summary:
      'Diego was genuinely enthusiastic about this one. He named the ending as the part that stuck with him and said he’d recommend it to a friend without hesitating.',
    picks: [0, 0, 0],
    positiveFlags: ['positive-sentiment', 'answer-length'],
    flags: [],
    // Which answer earned which flag, by turn.
    flagsByTurn: { 0: ['positive-sentiment'], 2: ['answer-length'] },
    changeLog: [
      {
        id: 'e1',
        label: 'Book talk completed',
        icon: 'circle-check',
        color: '#16A97A',
        by: 'Benny',
        at: 'Sep 14, 9:12 AM',
      },
    ],
  },
  {
    id: 'se-2',
    kindId: 'comprehension',
    student: { name: 'Marcus Chen', grade: '4th', initials: 'MC', color: '#4F46E5' },
    book: BOOK,
    date: 'Sep 14, 2026',
    trigger: 'Site-wide setting · book completion',
    status: 'completed',
    duration: '4 min 45 sec',
    summary:
      'Marcus landed on a real theme — that you can make a family anywhere — and when I asked what made him think that, he pointed straight to Roz raising Brightbill.',
    picks: [0, 0, 0],
    positiveFlags: ['references-details', 'makes-connection'],
    flags: [],
    flagsByTurn: { 1: ['makes-connection'], 2: ['references-details'] },
    changeLog: [
      {
        id: 'e1',
        label: 'Book talk completed',
        icon: 'circle-check',
        color: '#16A97A',
        by: 'Benny',
        at: 'Sep 14, 1:48 PM',
      },
    ],
  },
  {
    id: 'se-3',
    kindId: 'integrity',
    student: { name: 'Priya Patel', grade: '5th', initials: 'PP', color: '#B45309' },
    book: BOOK,
    date: 'Sep 13, 2026',
    trigger: 'Above the warning threshold · 320 min',
    // Left the conversation on Benny's third question — which is what earns the
    // "Did Not Complete" flag alongside the vague answers.
    status: 'unfinished',
    duration: '52 sec',
    summary:
      'Priya’s answers stayed general the whole way through, one was unreadable, and she left before my third question. I couldn’t tell from this chat whether she read the book.',
    picks: [1, 1, 1],
    leftAfter: 2,
    positiveFlags: [],
    flags: ['unintelligible', 'no-recall', 'minimal', 'quit-early'],
    // The vague first answer, then gibberish. "Did Not Complete" is deliberately
    // absent here — no answer caused it, walking away did, so it stays a
    // session-level flag rather than being pinned on a turn.
    flagsByTurn: { 0: ['minimal', 'no-recall'], 1: ['unintelligible'] },
    changeLog: [
      {
        id: 'e2',
        label: 'Flagged for review',
        icon: 'flag',
        color: '#DC2626',
        by: 'Benny',
        at: 'Sep 13, 4:31 PM',
        note: 'Two answers matched concerning patterns.',
      },
      {
        id: 'e1',
        label: 'Book talk completed',
        icon: 'circle-check',
        color: '#16A97A',
        by: 'Benny',
        at: 'Sep 13, 4:30 PM',
      },
    ],
  },
].map((s) => ({
  ...s,
  messages: buildTranscript(s.kindId, s.picks, s.flagsByTurn, s.leftAfter ?? null),
  // SFR's flag shape: each carries its own id so cards can be keyed + removed.
  positiveFlags: s.positiveFlags.map((type, i) => ({ id: `${s.id}-p${i}`, type })),
  flags: s.flags.map((type, i) => ({ id: `${s.id}-f${i}`, type })),
}))
