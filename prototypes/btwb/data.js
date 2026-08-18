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
//   3. Warning-level talk (integrity)

export const SITE = {
  name: 'Maplewood Elementary',
}

// ─── The three types of book talk ────────────────────────────────────────────
// Integrity talks belong to the warning threshold — that trigger always runs
// one, and it isn't an option for completions. Completion talks are the other
// two: the ticket leaves the default open ("we could, by default, make these
// engagement OR integrity book talks - or we could let the admin choose"), so
// this models the admin-choice version across Engagement and Comprehension.
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

// The two an admin can pick from for completion talks. Integrity is reserved for
// the warning threshold, so it isn't offered here.
export const COMPLETION_KINDS = [TALK_KINDS.engagement, TALK_KINDS.comprehension]

// ─── Conversation Focus (comprehension talks only) ───────────────────────────
// A comprehension talk needs a focus. Benny *weaves* it into the conversation
// rather than asking it as a quiz item — `benny` is the question he actually
// opens with. He also scales the wording and what he expects to the reader's
// grade, so one focus gets more sophisticated as students mature.
export const CONVERSATION_FOCUSES = [
  {
    id: 'theme',
    label: 'Theme',
    benny:
      'If Benny recommended this book to another student, what is one lesson you hope they’d learn from it? What happened in the story made you think that?',
    alsoAsks:
      'If you could tell the author one thing you took away from this book, what would you say?',
  },
  {
    id: 'character',
    label: 'Character',
    benny:
      'If you could trade places with someone in this book for one day, who would you pick? What do you think would surprise you most about being them?',
    alsoAsks:
      'Who in this book would you want as a friend, and who would you keep your distance from? What made you decide that?',
  },
  {
    id: 'point-of-view',
    label: 'Point of View',
    benny:
      'Whose eyes are we seeing this story through? If a different character had told it, what do you think they’d want us to know that we never got to hear?',
    alsoAsks:
      'Was there a moment where you really wanted to know what someone else was thinking? What do you think was going on for them?',
  },
  {
    id: 'summarizing',
    label: 'Summarizing',
    benny:
      'If a friend asked what happens in this book but you only had a minute before class started, what would you tell them?',
    alsoAsks:
      'If this book had a movie trailer, what would it show — and what would you leave out so you didn’t spoil it?',
  },
  {
    id: 'text-evidence',
    label: 'Text Evidence',
    benny:
      'You sound sure about that — what happened in the book that made you think so? Is there another moment that backs it up?',
    alsoAsks:
      'If a friend read this and disagreed with you, what moment from the book would you point them to?',
  },
]

export const focusById = (id) =>
  CONVERSATION_FOCUSES.find((f) => f.id === id) ?? CONVERSATION_FOCUSES[0]

// Composer emoji shortcuts — readers are grade 3+, and a tap beats typing.
export const EMOJIS = ['😀', '😂', '🥺', '😮', '❤️', '🔥', '👍', '👎', '🤔', '📚', '⭐', '🎉']

// What the ticket proposes as the shipped default: completion talks on with
// BTWB, engagement flavored. `completionFocus` only applies once the kind is
// comprehension.
export const DEFAULT_SETTINGS = {
  btwbOn: true,
  onCompletion: true,
  completionKind: 'engagement',
  completionFocus: 'theme',
  onWarning: true,
}

// ─── What the educator gets back ─────────────────────────────────────────────
// Deliberately not another score. Two things: how confident Benny is that the
// reader actually knew the book, and a short written read — one strength, one
// next step. Every talk type produces both; only comprehension talks name a
// Reading Focus, since that's the only type that has one.
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

// Keyed by talk kind; comprehension is keyed again by Conversation Focus. Only
// the integrity talk carries a `confidence` — Reading Confidence is about whether
// the reading was authentic, which is that talk's whole job.
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
    theme: {
      strength: 'The student identified a meaningful lesson from the story.',
      nextStep:
        'Encourage the student to support their thinking with multiple events from the text.',
    },
    character: {
      strength:
        'The student described the main character vividly and noticed how she changed by the end.',
      nextStep: 'Ask the student what caused that change, not just that it happened.',
    },
    'point-of-view': {
      strength: 'The student recognized the story is told by one character rather than everyone.',
      nextStep:
        'Practice imagining the same scene from a second character’s perspective to build the skill.',
    },
    summarizing: {
      strength: 'The student recalled the main events and put them in the right order.',
      nextStep: 'Work on separating the events that matter most from the smaller details.',
    },
    'text-evidence': {
      strength: 'The student pointed to a specific moment in the book to back up an opinion.',
      nextStep:
        'Push for a second piece of evidence, so one moment isn’t carrying the whole claim.',
    },
  },
}

export const takeawayFor = (kindId, focusId) =>
  kindId === 'comprehension' ? TAKEAWAYS.comprehension[focusId] : TAKEAWAYS[kindId]

// ─── The reader + book the talk demo runs on ─────────────────────────────────
export const READER = { name: 'Marcus Chen', grade: 4, gradeLabel: '4th grade' }

export const BOOK = {
  title: 'The Wild Robot',
  author: 'Peter Brown',
  pages: 288,
  cover: 'https://covers.openlibrary.org/b/isbn/9780316381994-L.jpg',
}

// ─── The conversations ───────────────────────────────────────────────────────
// Scripted per talk kind; comprehension is scripted per Conversation Focus.
// Benny opens warmly, works the point of the talk in as conversation rather than
// as a quiz item, follows up on the answer, then closes. `replies` are the
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

const COMPREHENSION_SCRIPTS = {
  theme: [
    {
      benny: 'You finished *The Wild Robot*! Nice work. Did you like how it ended?',
      replies: ['I loved it', 'It was sad but good', 'It was okay'],
    },
    {
      benny:
        'If Benny recommended this book to another student, what is one lesson you hope they’d learn from it? What happened in the story made you think that?',
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
  ],
  character: [
    {
      benny: 'You finished *The Wild Robot*! What did you think of Roz?',
      replies: ['She was awesome', 'She was kind of strange', 'I liked her a lot'],
    },
    {
      benny:
        'If you could trade places with someone in this book for one day, who would you pick? What do you think would surprise you most about being them?',
      replies: [
        'Roz — being a robot in a forest would be weird',
        'Brightbill, so I could fly',
        'One of the other animals',
      ],
    },
    {
      benny: 'Ha! What do you think changed the most about Roz from the start to the end?',
      replies: [
        'She started out not caring and then she really loved Brightbill',
        'She got braver',
        'She learned how to talk to the animals',
      ],
    },
    { benny: 'That’s a great read on her. Thanks for chatting with me!', replies: [] },
  ],
  'point-of-view': [
    {
      benny: 'You finished *The Wild Robot*! Who was telling you this story?',
      replies: ['Roz, mostly', 'A narrator', 'I’m not sure'],
    },
    {
      benny:
        'Whose eyes are we seeing this story through? If a different character had told it, what do you think they’d want us to know that we never got to hear?',
      replies: [
        'Brightbill — how it felt to have a robot for a mom',
        'The other animals, maybe',
        'I don’t know',
      ],
    },
    {
      benny: 'Interesting. What do you think Brightbill worried about that we didn’t get to see?',
      replies: [
        'That the other geese would think he was weird',
        'That Roz would leave',
        'Not sure',
      ],
    },
    { benny: 'Good thinking. Thanks for talking it through with me!', replies: [] },
  ],
  summarizing: [
    {
      benny: 'You finished *The Wild Robot*! How was it?',
      replies: ['Really good', 'Pretty good', 'It was long'],
    },
    {
      benny:
        'If a friend asked what happens in this book but you only had a minute before class started, what would you tell them?',
      replies: [
        'A robot washes up on an island and learns to survive and raise a gosling',
        'It’s about a robot and some animals',
        'A robot gets stuck on an island',
      ],
    },
    {
      benny: 'Nice — and how does it all wrap up at the end?',
      replies: [
        'Ships come to take her back and she has to leave the island',
        'She fights off the robots',
        'I forget exactly',
      ],
    },
    { benny: 'You had the shape of it. Thanks for the recap!', replies: [] },
  ],
  'text-evidence': [
    {
      benny: 'You finished *The Wild Robot*! Was Roz a good mom to Brightbill?',
      replies: ['Definitely', 'She tried her best', 'Not at first'],
    },
    {
      benny:
        'You sound sure about that — what happened in the book that made you think so? Is there another moment that backs it up?',
      replies: [
        'She taught him to swim and fly even though she couldn’t do either',
        'She protected him from the other animals',
        'I just think she was nice',
      ],
    },
    {
      benny: 'That’s a strong example. Can you think of one more moment like that?',
      replies: [
        'She built him a nest before winter',
        'She stayed behind so he could go with the flock',
        'That’s the only one I remember',
      ],
    },
    { benny: 'Two solid examples — that’s exactly it. Thanks for chatting!', replies: [] },
  ],
}

export const scriptFor = (kindId, focusId) =>
  kindId === 'comprehension'
    ? COMPREHENSION_SCRIPTS[focusId]
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
function buildTranscript(kindId, focusId, picks, flaggedTurns = [], leftAfter = null) {
  const script = scriptFor(kindId, focusId)
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
    focusId: null,
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
    focusId: 'theme',
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
    focusId: null,
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
  messages: buildTranscript(s.kindId, s.focusId, s.picks, s.flaggedTurns, s.leftAfter ?? null),
  // SFR's flag shape: each carries its own id so cards can be keyed + removed.
  positiveFlags: s.positiveFlags.map((type, i) => ({ id: `${s.id}-p${i}`, type })),
  flags: s.flags.map((type, i) => ({ id: `${s.id}-f${i}`, type })),
}))
