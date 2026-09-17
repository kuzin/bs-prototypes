// Genre recommendations per motivation type, from the RMI toolkit's "Genre
// Recommendations" sheet — three genres for each of the ten personas, each with
// the reason it suits them. Keyed by factor, since that's what the engine
// scores and what `topThreeFactors` returns.
//
// `mystery` has none: it isn't a persona with a reading taste, it's the absence
// of a clear one, so there is nothing to recommend against.

export const GENRES_BY_FACTOR = {
  confidence: [
    {
      name: 'Epic Fantasy',
      why: 'Appeals to their love for grand leadership, quests, and classic "good vs. evil" struggles (e.g., Chronicles of Narnia, Percy Jackson).',
    },
    {
      name: 'Historical Fiction',
      why: 'Offers a look at powerful historical figures, young leaders, and legacies of the past.',
    },
    {
      name: 'Biographies of Leaders',
      why: 'Provides real-life examples of strength, leadership, and influential lives they can look up to.',
    },
  ],
  challenge: [
    {
      name: 'Dystopian/Sci-Fi',
      why: 'Provides high-stakes, fast-paced environments that keep them engaged and moving forward (e.g., The Hunger Games).',
    },
    {
      name: 'Survival/Adventure',
      why: 'Satisfies their desire to see characters overcome immense odds and complex challenges.',
    },
    {
      name: 'Realistic Fiction (Complex Themes)',
      why: 'Offers intellectual depth and sophisticated character growth without being dry.',
    },
  ],
  curiosity: [
    {
      name: 'Mystery/Whodunit',
      why: 'Directly engages their desire to solve puzzles, find clues, and uncover hidden truths.',
    },
    {
      name: 'Puzzle/Interactive Books',
      why: 'Books like "Choose Your Own Adventure" or escape-room style books that let them participate in the logic.',
    },
    {
      name: 'Narrative Non-Fiction',
      why: 'Appeals to their need for factual information, especially books about historical mysteries, forensics, or how things work.',
    },
  ],
  enjoyment: [
    {
      name: 'Graphic Novels & Manga',
      why: 'Combines visual storytelling with dynamic narratives, perfect for high engagement and fandom culture.',
    },
    {
      name: 'Series/Franchise Books',
      why: 'Allows for complete immersion in expansive worlds with dedicated fanbases (e.g., Harry Potter, Wings of Fire).',
    },
    {
      name: 'Media Tie-ins',
      why: 'Books based on their favorite video games, movies, or shows.',
    },
  ],
  importance: [
    {
      name: 'Social Issues/Realistic Fiction',
      why: 'Aligns with their desire to protect others, understand empathy, and advocate for a better world.',
    },
    {
      name: 'Animal Rescue/Nature Books',
      why: 'Appeals to their nurturing side and desire to care for the vulnerable.',
    },
    {
      name: 'Historical Fiction (Civil Rights)',
      why: 'Focuses on individuals who stood up for their values and helped others.',
    },
  ],
  compliance: [
    {
      name: 'Short Story Collections',
      why: 'Provides a complete and satisfying narrative arc in a shorter, more efficient format.',
    },
    {
      name: 'Hi-Lo Books (High Interest, Low Readability)',
      why: 'Fast-paced, engaging books that are quick to finish, giving them a sense of accomplishment.',
    },
    {
      name: 'Graphic Novels',
      why: 'Offers a visual, fast-moving format that is highly rewarding to complete.',
    },
  ],
  recognition: [
    {
      name: 'Trending/New Releases',
      why: 'Keeps them in the loop with what is currently popular and highly discussed among their peers.',
    },
    {
      name: 'Books with Movie/TV Adaptations',
      why: 'Connects their reading to broader pop culture conversations.',
    },
    {
      name: 'School/Social Dynamics Fiction',
      why: 'Reflects their interest in modern trends, friendships, and social relevance.',
    },
  ],
  grades: [
    {
      name: 'Informational Texts/Encyclopedias',
      why: 'Satisfies a rigorous need for learning, collecting facts, and deep-diving into specific topics (e.g., DK Eyewitness books).',
    },
    {
      name: 'STEM Deep-Dives',
      why: 'Highly detailed books about space, dinosaurs, technology, or history.',
    },
    {
      name: 'Highly Accurate Historical Fiction',
      why: 'Provides a narrative context for understanding specific eras and events with factual precision.',
    },
  ],
  social: [
    {
      name: 'Friendship/School Stories',
      why: 'Focuses on emotional connections, peer relationships, and the beauty of human interaction.',
    },
    {
      name: 'Humor/Diary-Format Books',
      why: 'Offers light, energetic, and highly relatable stories (e.g., Diary of a Wimpy Kid).',
    },
    {
      name: 'Lighthearted Contemporary Fiction',
      why: 'Reflects modern life and relatable, everyday experiences without heavy stakes.',
    },
  ],
  competition: [
    {
      name: 'Sports Fiction',
      why: 'Mirrors the thrill of competition, teamwork, and the drive for victory.',
    },
    {
      name: 'Tournament/Competition Books',
      why: 'Provides high-energy quests where characters must train and compete to win.',
    },
    {
      name: 'Biographies of Athletes/Innovators',
      why: 'Offers inspiration through the stories of high-achievers who worked hard to reach the top of their fields.',
    },
  ],
}
