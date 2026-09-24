import { useState, useRef, useEffect } from 'react'
import { Icon } from '@components/Icon/Icon'
import { CoverShelf } from '@components/CoverShelf/CoverShelf'
import { Button } from '@components/Button/Button'
import { SearchInput } from '@components/SearchInput/SearchInput'
import '@components/SearchInput/SearchInput.css'
import { BookCard } from './BookCard'
import { recommend } from '../data'

// A working (simulated) recommendation prompt: type a request and — after a
// short "Benny is thinking" beat — Benny answers with a message + matching books.
export function AskBenny({ onOpen, onWish, wishlist, settings }) {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const ask = (q) => {
    const text = (q ?? query).trim()
    if (!text) return
    setQuery(text)
    setResult(null)
    setLoading(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setResult(recommend(text))
      setLoading(false)
    }, 900)
  }
  const clear = () => {
    clearTimeout(timer.current)
    setLoading(false)
    setResult(null)
    setQuery('')
  }

  return (
    <section className={`bk-ask ${result || loading ? 'is-answered' : ''}`}>
      {!result && !loading && (
        <div className="bk-ask-prompt">
          {/* Benny on the bar's white disc, the way the quiz banner above
              carries its mark — and the field says the rest, so there's no
              title or line of copy beside him taking its width. */}
          <img src="/bs-prototypes/benny-excited.svg" alt="" className="bk-ask-avatar" />

          <form
            className="bk-ask-form"
            onSubmit={(e) => {
              e.preventDefault()
              ask()
            }}
          >
            <SearchInput
              value={query}
              onChange={setQuery}
              /* Sparkles, not a loupe: you are describing a mood to Benny, not
                 looking up a title you already know the name of. */
              icon="sparkles"
              placeholder="What are you in the mood for? Try “funny graphic novels” or “something like The Wild Robot”"
              ariaLabel="Ask Benny for a recommendation"
            />
            {/* The brand's teal, not the page's action blue — this is Benny's
                panel, and the button is the one thing on it that acts. */}
            <Button type="submit" variant="accent" accent="var(--c-teal)">
              Ask Benny
            </Button>
          </form>
        </div>
      )}

      {loading && (
        <div className="bk-ask-result">
          <div className="bk-ask-answer">
            <img
              src="/bs-prototypes/benny-thinking.svg"
              alt=""
              className="bk-ask-answer-avatar bk-ask-thinking-avatar"
            />
            <p className="bk-ask-answer-text bk-ask-thinking">
              Benny is thinking
              <span className="bk-ask-dots">
                <span />
                <span />
                <span />
              </span>
            </p>
          </div>
          {/* The same rail shape the answer lands in, so the panel doesn't
              change size when the covers arrive. It was still on the class the
              results used before they moved to `CoverShelf`, and with that
              class gone the skeletons had no row to sit in and stacked down
              the page. */}
          <div className="bk-ask-skelrow" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="bk-ask-skel">
                <span className="bk-ask-skel-cover" />
                <span className="bk-ask-skel-line" />
                <span className="bk-ask-skel-line short" />
              </div>
            ))}
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="bk-ask-result">
          <div className="bk-ask-answer">
            <img src="/bs-prototypes/benny-happy.svg" alt="" className="bk-ask-answer-avatar" />
            <p className="bk-ask-answer-text">{result.message}</p>
            <button className="bk-ask-clear" onClick={clear}>
              <Icon name="x" size={14} /> Clear
            </button>
          </div>
          <CoverShelf className="bk-ask-shelf">
            {result.books.map((b) => (
              <BookCard
                settings={settings}
                key={b.id}
                book={b}
                onOpen={onOpen}
                onWish={onWish}
                wished={wishlist.has(b.id)}
              />
            ))}
          </CoverShelf>
        </div>
      )}
    </section>
  )
}
