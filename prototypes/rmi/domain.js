// RMI domain data, lifted verbatim from the rmi-engine gem's YAML
// (`config/factors.yml`, `questions.yml`, `recommendations.yml`). The standalone
// app reads these same definitions at runtime, so the copy here is the product's
// copy — don't paraphrase it.
//
//   factors          11 — the 10 scored factors plus "mystery" (no strong signal)
//   questions        20 — 2 per factor; `order` is the survey position, not `id`
//   recommendations  62 — across six kinds (group / reader_internal /
//                         reader_external, each with a *_low_scores variant)
//
// Scoring (rmi-engine `lib/rmi/engine/survey_response_scorer.rb`): a factor
// scores the mean of its 2 answers on the 1–4 Likert scale, so a factor runs
// 1.0–4.0; each motivation axis is the sum of its 5 factors (5.0–20.0); overall
// is the sum of both axes (10.0–40.0).
export const INTRINSIC_FACTORS = ['confidence', 'challenge', 'curiosity', 'enjoyment', 'importance']

export const EXTRINSIC_FACTORS = ['compliance', 'recognition', 'grades', 'social', 'competition']

export const FACTORS = {
  confidence: {
    educator_definition: "A student's belief that they can be successful at reading",
    student_name: 'The Lion',
    student_definition:
      'You have the confidence of a lion and believe that you are a great reader.',
  },
  challenge: {
    educator_definition: 'The satisfaction of understanding complex or difficult texts.',
    student_name: 'The Climber',
    student_definition:
      'You are like a mountain climber scaling a cliff and enjoy books that are hard to read.',
  },
  curiosity: {
    educator_definition: 'The desire to learn new things through reading.',
    student_name: 'The Detective',
    student_definition: 'You always uncover new clues and enjoy learning new things by reading.',
  },
  enjoyment: {
    educator_definition: 'Reading for entertainment or to be deeply engaged.',
    student_name: 'The Fan',
    student_definition: 'You are the biggest fan of books and like to read for fun.',
  },
  importance: {
    educator_definition: 'The belief that reading is important.',
    student_name: 'The Guardian',
    student_definition:
      'You protect your reading time because you believe it is important to read.',
  },
  compliance: {
    educator_definition: 'Reading because of an external goal or requirement',
    student_name: 'The Closer',
    student_definition:
      'You are serious about finishing your reading, especially when it is required for a class or activity.',
  },
  recognition: {
    educator_definition: 'Reading to achieve social recognition',
    student_name: 'The Star',
    student_definition: 'You shine like a star when others celebrate you for reading!',
  },
  grades: {
    educator_definition: 'The desire to earn good grades by reading more.',
    student_name: 'The Scholar',
    student_definition: 'You are a serious reading scholar and read to do better in school.',
  },
  social: {
    educator_definition: 'Reading to share insights or information with friends and family',
    student_name: 'The Butterfly',
    student_definition:
      'You are a social butterfly and enjoy talking with friends and family about your reading.',
  },
  competition: {
    educator_definition: 'The desire to outperform others in reading.',
    student_name: 'The Champion',
    student_definition: 'You are a true competitor who wants to be the best at reading.',
  },
  mystery: {
    educator_definition:
      'A student whose motivation for reading is unclear or does not fit into the other factors.',
    student_name: 'The Mystery',
    student_definition:
      "You're a total enigma! We haven't cracked the code on what motivates you... yet.",
  },
}

export const MOTIVATION_OF = Object.fromEntries([
  ...INTRINSIC_FACTORS.map((f) => [f, 'intrinsic']),
  ...EXTRINSIC_FACTORS.map((f) => [f, 'extrinsic']),
  ['mystery', 'unknown'],
])

export const QUESTIONS = [
  {
    id: 1,
    question: 'I am a good reader.',
    factor: 'confidence',
    motivation: 'intrinsic',
    order: 11,
  },
  {
    id: 2,
    question: "Reading is the thing I'm best at in school.",
    factor: 'confidence',
    motivation: 'intrinsic',
    order: 3,
  },
  {
    id: 3,
    question: 'I like books that are hard to read.',
    factor: 'challenge',
    motivation: 'intrinsic',
    order: 16,
  },
  {
    id: 4,
    question: "If a book is interesting, I don't care how hard it is to read.",
    factor: 'challenge',
    motivation: 'intrinsic',
    order: 6,
  },
  {
    id: 5,
    question: 'I like to read about things that interest me.',
    factor: 'curiosity',
    motivation: 'intrinsic',
    order: 1,
  },
  {
    id: 6,
    question: 'I like to read about new things.',
    factor: 'curiosity',
    motivation: 'intrinsic',
    order: 18,
  },
  {
    id: 7,
    question: 'I like reading for fun.',
    factor: 'enjoyment',
    motivation: 'intrinsic',
    order: 13,
  },
  {
    id: 8,
    question: 'I like to escape into another world by reading.',
    factor: 'enjoyment',
    motivation: 'intrinsic',
    order: 8,
  },
  {
    id: 9,
    question: 'It is very important to me to be a good reader.',
    factor: 'importance',
    motivation: 'intrinsic',
    order: 15,
  },
  {
    id: 10,
    question: 'Reading is an important part of my life.',
    factor: 'importance',
    motivation: 'intrinsic',
    order: 5,
  },
  {
    id: 11,
    question: 'It is important to me to finish all of my reading school work.',
    factor: 'compliance',
    motivation: 'extrinsic',
    order: 12,
  },
  {
    id: 12,
    question: 'I always try to finish my reading on time.',
    factor: 'compliance',
    motivation: 'extrinsic',
    order: 9,
  },
  {
    id: 13,
    question: 'I like to get compliments for my reading.',
    factor: 'recognition',
    motivation: 'extrinsic',
    order: 17,
  },
  {
    id: 14,
    question: 'I read so I can get a prize or a reward.',
    factor: 'recognition',
    motivation: 'extrinsic',
    order: 2,
  },
  {
    id: 15,
    question: 'Grades are a good way to see how well you are doing in reading.',
    factor: 'grades',
    motivation: 'extrinsic',
    order: 19,
  },
  {
    id: 16,
    question: 'I read to earn better grades.',
    factor: 'grades',
    motivation: 'extrinsic',
    order: 7,
  },
  {
    id: 17,
    question: 'I like to read what my friends read.',
    factor: 'social',
    motivation: 'extrinsic',
    order: 4,
  },
  {
    id: 18,
    question: 'I like to tell my family and friends about what I am reading.',
    factor: 'social',
    motivation: 'extrinsic',
    order: 14,
  },
  {
    id: 19,
    question: 'I like being the best at reading.',
    factor: 'competition',
    motivation: 'extrinsic',
    order: 10,
  },
  {
    id: 20,
    question: 'It is important for me to see my name on a list of good readers.',
    factor: 'competition',
    motivation: 'extrinsic',
    order: 20,
  },
]

// Survey order —  is the position a reader sees, which is deliberately
// not the id order (the two questions for a factor are spread apart).
export const QUESTIONS_IN_ORDER = [...QUESTIONS].sort((a, b) => a.order - b.order)

export const RECOMMENDATIONS = [
  {
    id: 1,
    kind: 'group',
    text: 'Create a "stretch goal" and award readers for meeting or exceeding this reading goal.',
    factors: ['confidence', 'importance'],
  },
  {
    id: 2,
    kind: 'group',
    text: 'Encourage students to step outside their comfort zone and read a new genre.',
    factors: ['confidence', 'challenge', 'enjoyment'],
  },
  {
    id: 3,
    kind: 'group',
    text: 'Celebrate all reading accomplishments, such as students starting a new book or reading every day for a week.',
    factors: ['confidence', 'recognition'],
  },
  {
    id: 4,
    kind: 'group',
    text: 'Set a daily reading goal that provides them with a healthy challenge.',
    factors: ['confidence'],
  },
  {
    id: 5,
    kind: 'group',
    text: 'Offer extra credit to students who write a short book report on their favorite book.',
    factors: ['challenge', 'compliance', 'grades'],
  },
  {
    id: 6,
    kind: 'group',
    text: "Use your state's book award list to encourage students to read highly acclaimed titles.",
    factors: ['challenge', 'enjoyment', 'importance'],
  },
  {
    id: 7,
    kind: 'group',
    text: 'Feature a list of non-fiction texts that cover a wide range of interesting topics.',
    factors: ['curiosity'],
  },
  {
    id: 8,
    kind: 'group',
    text: 'Encourage students to write book reviews and share their favorite books with other students.',
    factors: ['curiosity', 'enjoyment', 'social'],
  },
  {
    id: 9,
    kind: 'group',
    text: 'Promote free-choice reading by setting aside 15 minutes per week for Drop Everything and Read (D.E.A.R.) time.',
    factors: ['enjoyment', 'importance'],
  },
  {
    id: 10,
    kind: 'group',
    text: 'Offer a reading checklist for students that requires them to read a specific number of titles from the list.',
    factors: ['compliance', 'grades'],
  },
  {
    id: 11,
    kind: 'group',
    text: "Provide special rewards, such as lunch in the library, extra recess, or pajama days, as easy, free ways to celebrate students' reading milestones.",
    factors: ['recognition'],
  },
  {
    id: 12,
    kind: 'group',
    text: 'Offer students the option of replacing a grade with a certain amount of independent reading.',
    factors: ['grades'],
  },
  {
    id: 13,
    kind: 'group',
    text: 'Encourage your students to ask a friend or family member for a book recommendation.',
    factors: ['social'],
  },
  {
    id: 14,
    kind: 'group',
    text: 'Create a classroom leaderboard that allows students to track their reading progress with their peers.',
    factors: ['social', 'competition'],
  },
  {
    id: 15,
    kind: 'group',
    text: 'Challenge your students to read for more minutes than you for a whole week.',
    factors: ['competition', 'social'],
  },
  {
    id: 16,
    kind: 'group',
    text: 'Identify weekly "reader leaders" in your classroom and offer them special rewards, like a traveling trophy or their choice of book for a read-aloud.',
    factors: ['competition', 'confidence'],
  },
  {
    id: 17,
    kind: 'group',
    text: 'Challenge a neighboring classroom to a month-long reading competition where you update your students on your standing every week!',
    factors: ['competition', 'social'],
  },
  {
    id: 18,
    kind: 'reader_internal',
    text: 'Create a "stretch goal" and award them for meeting or exceeding this reading goal.',
    factors: ['confidence', 'importance'],
  },
  {
    id: 19,
    kind: 'reader_internal',
    text: 'Encourage them to step outside their comfort zone and read a new genre.',
    factors: ['confidence', 'challenge', 'enjoyment'],
  },
  {
    id: 20,
    kind: 'reader_internal',
    text: 'Celebrate all of their reading accomplishments, such as starting a new book or reading every day for a week.',
    factors: ['confidence', 'recognition'],
  },
  {
    id: 21,
    kind: 'reader_internal',
    text: 'Set a daily reading goal that provides them with a healthy challenge.',
    factors: ['confidence'],
  },
  {
    id: 22,
    kind: 'reader_internal',
    text: 'Offer extra credit to them for writing a short book report on their favorite book.',
    factors: ['challenge', 'compliance', 'grades'],
  },
  {
    id: 23,
    kind: 'reader_internal',
    text: "Use your state's book award list to encourage them to read highly acclaimed titles.",
    factors: ['challenge', 'enjoyment', 'importance'],
  },
  {
    id: 24,
    kind: 'reader_internal',
    text: 'Feature a list of non-fiction texts that cover a wide range of interesting topics.',
    factors: ['curiosity'],
  },
  {
    id: 25,
    kind: 'reader_internal',
    text: 'Encourage them to write book reviews and share their favorite books with other students.',
    factors: ['curiosity', 'enjoyment', 'social'],
  },
  {
    id: 26,
    kind: 'reader_internal',
    text: 'Promote free-choice reading by setting aside 15 minutes per week for Drop Everything and Read (D.E.A.R.) time.',
    factors: ['enjoyment', 'importance'],
  },
  {
    id: 27,
    kind: 'reader_internal',
    text: 'Offer a reading checklist that requires them to read a specific number of titles from the list.',
    factors: ['compliance', 'grades'],
  },
  {
    id: 28,
    kind: 'reader_internal',
    text: 'Provide special rewards, such as lunch in the library, extra recess, or pajama days, as easy, free ways to celebrate their reading milestones.',
    factors: ['recognition'],
  },
  {
    id: 29,
    kind: 'reader_internal',
    text: 'Offer them the option of replacing a grade with a certain amount of independent reading.',
    factors: ['grades'],
  },
  {
    id: 30,
    kind: 'reader_internal',
    text: 'Encourage them to ask a friend or family member for a book recommendation.',
    factors: ['social'],
  },
  {
    id: 31,
    kind: 'reader_internal',
    text: 'Create a classroom leaderboard that allows them to track their reading progress with their peers.',
    factors: ['social', 'competition'],
  },
  {
    id: 32,
    kind: 'reader_internal',
    text: 'Challenge them to read for more minutes than you for a whole week.',
    factors: ['competition', 'social'],
  },
  {
    id: 33,
    kind: 'reader_internal',
    text: 'Identify weekly "reader leaders" in your classroom and offer them special rewards, like a traveling trophy or their choice of book for a read-aloud.',
    factors: ['competition', 'confidence'],
  },
  {
    id: 34,
    kind: 'reader_internal',
    text: 'Challenge a neighboring classroom to a month-long reading competition where you update them on your standing every week!',
    factors: ['competition', 'social'],
  },
  {
    id: 35,
    kind: 'reader_external',
    text: 'Challenge yourself! Set a new reading goal for the next week or month.',
    factors: ['confidence', 'importance'],
  },
  {
    id: 36,
    kind: 'reader_external',
    text: 'Feeling adventurous? Try a book from a new author or genre.',
    factors: ['confidence', 'challenge', 'enjoyment'],
  },
  {
    id: 37,
    kind: 'reader_external',
    text: 'Read a non-fiction book or article about a new topic.',
    factors: ['curiosity'],
  },
  {
    id: 38,
    kind: 'reader_external',
    text: 'Write a book review and share it with a friend or teacher.',
    factors: ['curiosity', 'enjoyment', 'social'],
  },
  {
    id: 39,
    kind: 'reader_external',
    text: 'Choose a book based only on the cover.',
    factors: ['enjoyment'],
  },
  {
    id: 40,
    kind: 'reader_external',
    text: 'Ask a parent or teacher for a list of 5 book recommendations.',
    factors: ['compliance', 'social'],
  },
  {
    id: 41,
    kind: 'reader_external',
    text: 'Build a week-long reading streak by reading every day!',
    factors: ['compliance', 'recognition'],
  },
  {
    id: 42,
    kind: 'reader_external',
    text: 'Ask your teacher or librarian to offer special rewards, such as lunch in the library, extra recess, or pajama days, if you reach a 10-day reading streak.',
    factors: ['recognition', 'competition', 'social'],
  },
  {
    id: 43,
    kind: 'reader_external',
    text: "Keep a list of words you don't know with you while you read, and ask a parent or teacher to review them with you.",
    factors: ['grades'],
  },
  {
    id: 44,
    kind: 'reader_external',
    text: 'Ask a friend or family member for a book recommendation.',
    factors: ['social'],
  },
  {
    id: 45,
    kind: 'reader_external',
    text: 'Challenge a friend or teacher to read more than you for a week.',
    factors: ['competition', 'social'],
  },
  {
    id: 46,
    kind: 'reader_external',
    text: 'Ask your teacher or librarian to help you find a book that is a small step harder than your last read.',
    factors: ['confidence', 'challenge', 'compliance'],
  },
  {
    id: 47,
    kind: 'reader_external',
    text: 'See how many pages you can finish in 20 minutes.',
    factors: ['challenge'],
  },
  {
    id: 48,
    kind: 'reader_external',
    text: 'Write 3 practice questions for yourself that you think a teacher might ask.',
    factors: ['grades'],
  },
  {
    id: 49,
    kind: 'reader_external',
    text: 'Find your favorite quote from your book and share it in a book review.',
    factors: ['enjoyment', 'social'],
  },
  {
    id: 50,
    kind: 'reader_external',
    text: 'Write a paragraph on how reading has helped you meet your personal learning goals.',
    factors: ['importance', 'grades'],
  },
  {
    id: 51,
    kind: 'reader_external',
    text: 'Read a book in a genre you usually avoid or find difficult.',
    factors: ['challenge'],
  },
  {
    id: 52,
    kind: 'reader_external',
    text: 'Pick one weird fact from the book and share it with a friend or family member.',
    factors: ['curiosity', 'social'],
  },
  {
    id: 53,
    kind: 'reader_external',
    text: "Find a link between what's happening in the book and a real world news event.",
    factors: ['importance', 'grades', 'curiosity'],
  },
  {
    id: 54,
    kind: 'reader_external',
    text: "Keep a list of predictions for the book you're reading.",
    factors: ['enjoyment', 'challenge'],
  },
  {
    id: 55,
    kind: 'reader_external',
    text: 'Write down 5 questions you would ask the main character if they were real.',
    factors: ['curiosity', 'enjoyment'],
  },
  {
    id: 56,
    kind: 'group_low_scores',
    text: 'Talk with students about their responses.',
    factors: [],
  },
  {
    id: 57,
    kind: 'group_low_scores',
    text: 'Try starting with extrinsic motivators, like competition or recognition. A simple shoutout for logging their reading can motivate many students.',
    factors: [],
  },
  {
    id: 58,
    kind: 'reader_internal_low_scores',
    text: 'Talk with them about their responses.',
    factors: [],
  },
  {
    id: 59,
    kind: 'reader_internal_low_scores',
    text: 'Try starting with extrinsic motivators, like competition or recognition. A simple shoutout for logging their reading can motivate many students.',
    factors: [],
  },
  {
    id: 60,
    kind: 'reader_external_low_scores',
    text: 'What kind of stories, movies, or shows do you find the most interesting? Reach out to your librarian for suggestions on what to read next.',
    factors: [],
  },
  {
    id: 61,
    kind: 'reader_external_low_scores',
    text: "What are your favorite interests or hobbies? Ask your librarian to help you find related reading the next time you're in the media center!",
    factors: [],
  },
  {
    id: 62,
    kind: 'reader_external_low_scores',
    text: 'What would motivate you to read more? Share an idea with your teacher or librarian.',
    factors: [],
  },
]
