// The reader's own content for the pages logging-flow's dashboard doesn't
// carry — badges, achievements, and the rest as they arrive.
//
// It lives here rather than in `logging-flow/data.js` because it belongs to the
// reader app as a whole, not to the logging flow: this prototype is where the
// four tabs that had never had a page (Friends, Leaderboards, Reviews, All
// Badges) get built out.

// ─── Badges ──────────────────────────────────────────────────────────────────
// The profile's "Earned Badges" page lists only what a reader has
// (`profiles/_badges_list.html.haml`); a challenge's Badges tab shows the whole
// set, graying what's still to come and stating the requirement in the footer
// (`earnables/grid/_earnable.html.haml`). This page does both, so a reader can
// see what's next without opening a challenge.
//
// `type` is the app's own badge taxonomy — `appropriate_badges_title` yields
// Reading/Logging, Activity, Review, Point, Challenge and Donation Badges.

const earned = (name, date, blurb, color, icon, type = 'logging') => ({
  name,
  date,
  blurb,
  color,
  icon,
  type,
})

// `have`/`need` drive the ring and the footer line the app writes as
// "12/30 Minutes Completed".
const locked = (name, blurb, color, icon, have, need, unit, type = 'logging') => ({
  name,
  blurb,
  color,
  icon,
  have,
  need,
  unit,
  type,
  locked: true,
})

export const BADGES = [
  earned(
    '2-Week Streak',
    'Jun 24, 2026',
    'Earned for logging 14 days in a row!',
    '#F0A024',
    'flame',
  ),
  earned(
    'Spring Into Reading',
    'Apr 30, 2026',
    'Earned for completing Spring Into Reading!',
    '#0CA7BC',
    'trophy',
    'challenge',
  ),
  earned(
    'First Review',
    'Apr 18, 2026',
    'Earned for writing your first review!',
    '#0BA85F',
    'writing',
    'review',
  ),
  earned('Ten Titles', 'Apr 6, 2026', 'Earned for finishing 10 books!', '#2563EB', 'book-2'),
  earned(
    'Comic Collector',
    'Mar 22, 2026',
    'Earned for finishing 5 graphic novels!',
    '#B43DD0',
    'book-2',
  ),
  locked(
    '1,000 Minutes',
    'Log 1,000 minutes of reading.',
    '#0B6B78',
    'clock',
    620,
    1000,
    'Minutes',
  ),
  locked(
    'Arresting Strangeness',
    'Complete the Arresting Strangeness challenge.',
    '#5FA052',
    'trophy',
    2,
    5,
    'Activity',
    'challenge',
  ),
  locked(
    'Genre Explorer',
    'Log a title from five different genres.',
    '#B45309',
    'compass',
    3,
    5,
    'Books',
  ),
  locked(
    'Three Reviews',
    'Write reviews for three different titles.',
    '#0BA85F',
    'writing',
    1,
    3,
    'Reviews',
    'review',
  ),
  locked(
    'Month of Reading',
    'Log reading on 30 days in a single month.',
    '#DC493A',
    'calendar',
    11,
    30,
    'Days',
  ),
  locked(
    'Museum Hop',
    'Finish every activity in the Museums badge.',
    '#4F46E5',
    'building-monument',
    0,
    3,
    'Activity',
    'activity',
  ),
  locked('Page Turner', 'Read 2,000 pages.', '#6761A8', 'file-text', 88, 2000, 'Pages'),
]

// ─── Achievements ────────────────────────────────────────────────────────────
// `art` picks the illustrated medallion in books/AchievementArt.jsx.

const achievement = (name, date, detail, art = 'books') => ({ name, date, detail, art })

export const ACHIEVEMENTS = [
  achievement('Read 12 books', 'Jun 22, 2026', 'Grade 6 goal was 10', 'books'),
  achievement('Logged 40 sessions', 'Jun 18, 2026', 'Most in Room 14 this term', 'streak'),
  achievement('Wrote 4 reviews', 'May 30, 2026', 'Two of them on nonfiction', 'reviews'),
  achievement('Finished a series', 'May 12, 2026', 'All nine Amulet books', 'series'),
  achievement('Top of the class', 'Apr 28, 2026', 'Most minutes in Room 14 in April', 'top'),
]
