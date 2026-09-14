import { useState, useRef, useEffect } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { SearchInput } from '@components/SearchInput/SearchInput'
import '@components/SearchInput/SearchInput.css'
import { BookCard } from './BookCard'
import { recommend } from '../data'

// A working (simulated) recommendation prompt: type a request and — after a
// short "Benny is thinking" beat — Benny answers with a message + matching books.
export function AskBenny({ onOpen, onWish, wishlist }) {
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
        <>
          <div className="bk-ask-head">
            <img src="/bs-prototypes/benny-excited.svg" alt="" className="bk-ask-avatar" />
            <div className="bk-ask-headtext">
              <h2 className="bk-ask-title">
                Ask Benny <Icon name="sparkles" size={16} />
              </h2>
              <p className="bk-ask-sub">
                Tell me what you’re in the mood for and I’ll find your next read.
              </p>
            </div>
          </div>

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
              placeholder="e.g. funny graphic novels, or something like The Wild Robot…"
              ariaLabel="Ask Benny for a recommendation"
            />
            {/* The brand's teal, not the page's action blue — this is Benny's
                panel, and the button is the one thing on it that acts. */}
            <Button
              type="submit"
              variant="accent"
              accent="var(--c-teal)"
              icon={<Icon name="sparkles" size={15} />}
            >
              Ask Benny
            </Button>
          </form>
        </>
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
          <div className="bk-ask-track" aria-hidden="true">
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
          <div className="bk-ask-track">
            {result.books.map((b) => (
              <BookCard
                key={b.id}
                book={b}
                onOpen={onOpen}
                onWish={onWish}
                wished={wishlist.has(b.id)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
