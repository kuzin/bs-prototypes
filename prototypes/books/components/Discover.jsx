import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { PlumpyIcon } from '@components/PlumpyIcon/PlumpyIcon'
import { ReaderPageHead } from '@components/ReaderPageHead/ReaderPageHead'
import { BannerStack, ReaderBanner, ReaderBannerAction } from '@components/ReaderApp/ReaderApp'
import { SearchInput } from '@components/SearchInput/SearchInput'
import { Button } from '@components/Button/Button'
import '@components/SearchInput/SearchInput.css'
import { Shelf } from './Shelf'
import { AskBenny } from './AskBenny'
import { QuizStickers } from './QuizStickers'
import { READER, BENNY_PICKS, SHELVES, BROWSE, getBooks } from '../data'
import { quizRecommendations, quizSummary } from '../quiz'

// The Benny recommendation row is a normal shelf with a sparkles icon badge.
const BENNY_SHELF = {
  id: 'benny',
  icon: 'sparkles',
  accent: '#0D9488',
  title: 'Benny’s Picks',
  subtitle: (
    <>
      From the Recommendation Engine, because you loved <strong>{READER.justFinished}</strong>
    </>
  ),
}

/* Benny's Picks once the reader has taken the Book Quiz — the same row, saying
   what it was updated from. */
const QUIZ_BENNY_SHELF = (answers) => ({
  ...BENNY_SHELF,
  subtitle: <>Updated from your Book Quiz · {quizSummary(answers)}</>,
})

// Each toggleable feature gates one Discover shelf.
const SHELF_SETTING = { sora: 'sora', epic: 'epic', scholastic: 'scholastic', audio: 'audiobooks' }

export function Discover({
  onOpen,
  onWish,
  wishlist,
  settings,
  onBrowse,
  onPlay,
  onViewAll,
  /* The reader's shelf, and what they last told Benny's Book Quiz — the quiz's
     picks lead the page once they've taken it. */
  shelf,
  quizAnswers,
  onQuiz,
}) {
  const [q, setQ] = useState('')
  const quizPicks = quizAnswers
    ? quizRecommendations(quizAnswers, { shelf, settings, limit: 8 }).map((r) => r.book)
    : []
  const bennyBooks = [...quizPicks, ...getBooks(BENNY_PICKS).filter((b) => !quizPicks.includes(b))]
  return (
    <div className="bk-discover">
      {/* The one page header every view in the web app uses. */}
      <ReaderPageHead
        title="Discover"
        actions={
          /* Catalog search — opens the filterable Browse page. The shared field
             and the shared button, not a composite of its own. */
          <form
            className="bk-search-entry"
            onSubmit={(e) => {
              e.preventDefault()
              onBrowse({ query: q })
            }}
          >
            <SearchInput
              value={q}
              onChange={setQ}
              placeholder="Search books, authors…"
              ariaLabel="Search books and authors"
            />
            {/* Submitting with an empty field opens the full catalog, which is
                what "find a book" means when you don't know the title. */}
            <Button type="submit" variant="secondary" size="md">
              Find a book
            </Button>
          </form>
        }
      />

      {/* Benny's Book Quiz gets a bar of its own — the reader app's banner, the
          one the dashboard's nudges use — rather than a button tucked into Ask
          Benny's card. Once it's taken, the bar says where the answers went. */}
      {onQuiz && (
        <BannerStack className="bk-quiz-banners">
          <ReaderBanner
            tone="amber"
            className="bk-quiz-banner"
            /* No mark in the disc: the stickers are the picture here — a peek
               inside, a few of the quiz's own pictures stuck on at angles
               between what the bar says and its button. A lone glyph on the
               left beside them read as a second, flatter idea. */
            decoration={<QuizStickers />}
            title={
              <strong>
                {quizAnswers
                  ? 'Your quiz picks are in — they’re Benny’s Picks below!'
                  : 'Unicorns or detectives? Laughs or goosebumps?'}
              </strong>
            }
            sub={
              quizAnswers
                ? 'Changed your mind? Take it again any time.'
                : 'Take Benny’s quick Book Quiz and he’ll pick your next favorite books.'
            }
            action={
              <ReaderBannerAction solid={!quizAnswers} onClick={onQuiz}>
                {quizAnswers ? 'Retake the Quiz' : 'Take the Book Quiz'}
              </ReaderBannerAction>
            }
          />
        </BannerStack>
      )}

      <AskBenny onOpen={onOpen} onWish={onWish} wishlist={wishlist} settings={settings} />

      {/* Benny recommendation row — same shelf anatomy as every other row. The
          Book Quiz doesn't add a row of its own: it updates this one. What the
          reader told Benny leads, and the engine's earlier picks follow. */}
      <Shelf
        settings={settings}
        shelf={quizAnswers ? QUIZ_BENNY_SHELF(quizAnswers) : BENNY_SHELF}
        books={bennyBooks}
        onOpen={onOpen}
        onWish={onWish}
        wishlist={wishlist}
        onPlay={onPlay}
        onViewAll={onViewAll}
      />

      {SHELVES.filter((shelf) => {
        const key = SHELF_SETTING[shelf.id]
        return !key || settings[key]
      }).map((shelf) => (
        <Shelf
          settings={settings}
          key={shelf.id}
          shelf={shelf}
          books={getBooks(shelf.books)}
          onOpen={onOpen}
          onWish={onWish}
          wishlist={wishlist}
          onPlay={onPlay}
          onViewAll={onViewAll}
        />
      ))}

      {/* Browse by category — each tile opens Browse with that filter applied */}
      <section className="bk-browse">
        <h2 className="bk-browse-title">Browse by category</h2>
        <div className="bk-browse-grid">
          {BROWSE.map((b) => (
            <button
              key={b.label}
              className="bk-browse-tile"
              style={{ '--c': b.color }}
              onClick={() => onBrowse({ filter: b.filter })}
            >
              <PlumpyIcon name={b.icon} size={22} />
              <span>{b.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
