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
//   3. Warning-level talk (integrity by default)

export const SITE = {
  name: 'Maplewood Elementary',
}

// ─── The three types of book talk ────────────────────────────────────────────
// Every trigger picks its own type. The ticket leaves the default open ("we
// could, by default, make these engagement OR integrity book talks - or we could
// let the admin choose"), so this models the admin-choice version — and the
// warning threshold gets the same choice, defaulting to the integrity talk it
// runs today.
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

// Any trigger can run any of the three, so both pickers offer the same list.
export const TALK_KIND_OPTIONS = [
  TALK_KINDS.engagement,
  TALK_KINDS.comprehension,
  TALK_KINDS.integrity,
]

// "an engagement talk" / "a comprehension talk"
export const article = (word) => (/^[aeiou]/i.test(word) ? 'an' : 'a')

// Composer emoji shortcuts — readers are grade 3+, and a tap beats typing.
export const EMOJIS = ['😀', '😂', '🥺', '😮', '❤️', '🔥', '👍', '👎', '🤔', '📚', '⭐', '🎉']

// What the ticket proposes as the shipped default: completion talks on with
// BTWB, engagement flavored. The warning threshold keeps the integrity talk it
// runs today — it's now a choice rather than a fixed behavior.
export const DEFAULT_SETTINGS = {
  btwbOn: true,
  onCompletion: true,
  completionKind: 'engagement',
  onWarning: true,
  warningKind: 'integrity',
}

// ─── What the educator gets back ─────────────────────────────────────────────
// Deliberately not another score. Two things: how confident Benny is that the
// reader actually knew the book, and a short written read — one strength, one
// next step. Every talk type produces both.
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

// The two takeaway cards.
export const TAKEAWAY_META = {
  strength: {
    label: 'Strength',
    color: '#16A97A',
    bg: '#F0FDF4',
    border: '#BBF7D0',
    icon: 'circle-check',
  },
  nextStep: {
    label: 'Next Step',
    color: '#B45309',
    bg: '#FFFBEB',
    border: '#FDE68A',
    icon: 'arrow-right',
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

export const CONFIDENCE_BLURB =
  'Benny’s confidence that the student demonstrated authentic knowledge of the book.'
export const TAKEAWAYS_BLURB = 'Instead of another score, Benny summarizes what it observed.'

// Keyed by talk kind. Only the integrity talk carries a `confidence` — Reading
// Confidence is about whether the reading was authentic, which is that talk's
// whole job.
const TAKEAWAYS = {
  engagement: {
    strength: 'The student spoke warmly about the book and wanted to recommend it to a friend.',
    nextStep: 'Offer a read-alike so the enthusiasm carries into the next book.',
  },
  integrity: {
    confidence: 'low',
    strength: 'The student stayed in the conversation and answered every time Benny asked.',
    nextStep:
      'Worth a quick check-in — the answers stayed vague, and one looked like filler rather than recall.',
  },
  comprehension: {
    strength: 'The student identified a meaningful lesson from the story.',
    nextStep: 'Encourage the student to support their thinking with multiple events from the text.',
  },
}

export const takeawayFor = (kindId) => TAKEAWAYS[kindId]

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
const ENGAGEMENT_SCRIPT = [
  {
    benny: 'You finished *The Wild Robot*! Did you like it?',
    replies: ['I loved it', 'It was pretty good', 'It was just okay'],
  },
  {
    benny: 'What part stuck with you the most?',
    replies: [
      'The ending, when she had to leave',
      'When Brightbill learned to fly',
      'The part with the bear',
    ],
  },
  {
    benny: 'Would you recommend it to a friend? Why or why not?',
    replies: [
      'Yes — my friend Jae would love it',
      'Maybe, if they like animals',
      'Probably not, it’s slow at the start',
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
  },
  {
    benny: 'Nice — can you tell me about one thing that happened in it?',
    replies: ['The robot did things on an island', 'asdkfj', 'I don’t remember'],
  },
  {
    benny: 'No problem. Who was your favorite character?',
    replies: ['The robot one', 'I forget the names', 'idk'],
  },
  { benny: 'Thanks for chatting with me about it!', replies: [] },
]

const COMPREHENSION_SCRIPT = [
  {
    benny: 'You finished *The Wild Robot*! Nice work. Did you like how it ended?',
    replies: ['I loved it', 'It was sad but good', 'It was okay'],
  },
  {
    benny:
      'If you recommended this book to another student, what is one lesson you hope they’d learn from it?',
    replies: [
      'That you can make a family anywhere',
      'That being different is okay',
      'To keep trying even when it’s hard',
    ],
  },
  {
    benny: 'That’s a big one. What happened in the story that made you think of that?',
    replies: [
      'Roz took care of Brightbill even though she wasn’t his real mom',
      'The animals helped her when she was in trouble',
      'I’m not sure, it just felt that way',
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
function buildTranscript(kindId, picks, flaggedTurns = [], leftAfter = null) {
  const script = scriptFor(kindId)
  const messages = []
  script.forEach((step, i) => {
    // `leftAfter` = the reader walked away on this question, so Benny's line is
    // the last thing in the transcript and nothing follows it.
    if (leftAfter !== null && i > leftAfter) return
    messages.push({ role: 'benny', text: step.benny, emotion: i === 0 ? 'excited' : undefined })
    if (leftAfter !== null && i === leftAfter) return
    const reply = step.replies?.[picks[i] ?? 0]
    if (reply) messages.push({ role: 'student', text: reply, flagged: flaggedTurns.includes(i) })
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
    // Benny flagged the second and third answers (gibberish, then vague recall).
    flaggedTurns: [1, 2],
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
  messages: buildTranscript(s.kindId, s.picks, s.flaggedTurns, s.leftAfter ?? null),
  // SFR's flag shape: each carries its own id so cards can be keyed + removed.
  positiveFlags: s.positiveFlags.map((type, i) => ({ id: `${s.id}-p${i}`, type })),
  flags: s.flags.map((type, i) => ({ id: `${s.id}-f${i}`, type })),
}))
