import { useState } from 'react'
import { Stars, RatingInline, RatingBlock, StarInput } from '@components/Stars/Stars'
import { BookCard } from '../../books/components/BookCard'
import { Shelf } from '../../books/components/Shelf'
import { PartnerBrand, PartnerTag, PartnerMark } from '../../books/components/PartnerBits'
import { AskBenny } from '../../books/components/AskBenny'
import { ExpandableText } from '../../books/components/ExpandableText'
import { getBook, getBooks, SHELVES } from '../../books/data'
import { Variant } from './_shared'

const noop = () => {}

function StarInputDemo() {
  const [v, setV] = useState(4)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <StarInput value={v} onChange={setV} />
      <span style={{ fontWeight: 800, color: '#18324a' }}>{v} / 5</span>
    </div>
  )
}

export const booksSections = [
  {
    group: 'badges',
    id: 'bk-stars',
    name: 'Stars · Rating',
    desc: (
      <>
        The system&rsquo;s one star rating. <code>Stars</code> is the read-only scale, and the fill
        on the last star is <strong>fractional</strong> — a 4.3 draws four stars and a third,
        because rounding to whole stars makes a 4.5 and a 4.9 look identical, which is the one thing
        a rating is for.
        <br />
        <br />
        Three wrappers, by how much room the rating gets. <code>RatingInline</code> is the summary
        for a card or a row — figure, stars, count on one line. <code>RatingBlock</code> is for a
        panel that is <em>about</em> the thing being rated: the figure leads at display size because
        it is the reading, the stars are the scale it sits on, and the count is how much to trust
        it. <code>StarInput</code> is the picker in a review composer.
        <br />
        <br />
        The two colours live on <code>.stars</code> as <code>--star-on</code> /{' '}
        <code>--star-off</code>, so a rating on a tinted wash can lift the empty star without a
        consumer redefining the amber.
      </>
    ),
    usage: `import { Stars, RatingInline, RatingBlock, StarInput } from '@components/Stars/Stars'

<Stars value={4.3} size={18} />
<RatingInline value={4.8} count={1247} />
<RatingBlock value={4.3} count={12} />
<StarInput value={stars} onChange={setStars} />`,
    render: () => (
      <div className="bk-catalog">
        <Variant label="Stars — read-only, fractional fill">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
            <Stars value={5} size={20} />
            <Stars value={4.6} size={20} />
            <Stars value={3.2} size={20} />
          </div>
        </Variant>
        <Variant label="RatingInline — one line, for a card or a row">
          <div style={{ padding: 16 }}>
            <RatingInline value={4.8} count={1247} size={16} />
          </div>
        </Variant>
        <Variant label="RatingBlock — for a panel about the thing being rated">
          <div style={{ display: 'flex', gap: 40, padding: 16 }}>
            <RatingBlock value={4.3} count={12} />
            <RatingBlock value={null} count={0} />
          </div>
        </Variant>
        <Variant label="StarInput — the review composer's picker">
          <StarInputDemo />
        </Variant>
      </div>
    ),
  },
  {
    group: 'books',
    id: 'bk-book-card',
    name: 'BookCard',
    usage: `import { BookCard } from './components/BookCard'

<BookCard book={book} onOpen={open} onWish={toggleWish} wished={wishlist.has(book.id)} />
<BookCard book={book} variant="rank" … />
<BookCard book={book} variant="audio" onPlay={play} … />
<BookCard book={book} variant="reason" reason="Because you loved Hilda" … />`,
    desc: (
      <>
        The cover-forward card on every Discover shelf. The jacket carries the title, so there is{' '}
        <strong>no caption</strong> — a shelf is a wall of covers you scan, and a title under each
        one left the ratings on a ragged line. Under the cover sits one fact: the rating, or on a
        trending shelf the readers at school.
        <br />
        <br />
        Two marks ride on the cover. The bookmark toggles the reader&rsquo;s list. A small dot says
        the title <strong>opens right now</strong> in a linked app, in that app&rsquo;s colour — no
        logo, because five logos down a shelf read as five different statuses, and which app it is
        belongs on the book&rsquo;s own page. Pass <code>settings</code> so the dot only promises an
        app the site has switched on.
        <br />
        <br />
        Variants: <code>default</code>, <code>rank</code> (reader count), <code>audio</code> (square
        art, a play button and the running time) and <code>reason</code> (Benny&rsquo;s one-line
        why).
      </>
    ),
    render: () => {
      const wild = getBook('wild-robot')
      const dogman = getBook('dog-man')
      const audio = getBooks(SHELVES.find((sh) => sh.id === 'audio').books)[0]
      return (
        <div className="bk-catalog">
          <Variant label="default · rank · audio · reason">
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 18,
                padding: 16,
                alignItems: 'flex-start',
              }}
            >
              <BookCard book={wild} onOpen={noop} onWish={noop} wished={false} />
              <BookCard book={dogman} onOpen={noop} onWish={noop} wished variant="rank" />
              <BookCard book={audio} onOpen={noop} onWish={noop} onPlay={noop} variant="audio" />
              <BookCard
                book={wild}
                onOpen={noop}
                onWish={noop}
                variant="reason"
                reason="Because you loved Hilda"
              />
            </div>
          </Variant>
        </div>
      )
    },
  },
  {
    group: 'books',
    id: 'bk-shelf',
    name: 'Shelf',
    usage: `import { Shelf } from './components/Shelf'

<Shelf
  shelf={shelf}
  books={getBooks(shelf.books)}
  onOpen={open}
  onWish={toggleWish}
  wishlist={wishlist}
  onViewAll={viewAll}
/>`,
    desc: (
      <>
        A titled row of <code>BookCard</code>s. Every shelf shares one header — title over a
        subtitle — and a curated shelf swaps the subtitle for its curator&rsquo;s line, because that
        is who is speaking.
        <br />
        <br />
        The row is a <strong>grid, not a scrolling track</strong>: six equal cells, so every jacket
        on the page is the same size. It shows five titles and, when there are more and{' '}
        <code>onViewAll</code> is passed, ends in a <strong>View More</strong> card — a shelf that
        ends in a card reads as continuing, where a button up in the corner read as a separate thing
        to press. <code>shelf.kind</code> picks the cards: <code>rank</code> numbers them by
        readers, <code>audio</code> goes square. Props: <code>shelf</code>, <code>books</code>,{' '}
        <code>onOpen</code>, <code>onWish</code>, <code>wishlist</code>, <code>onPlay</code>,{' '}
        <code>onViewAll</code>, <code>settings</code>.
      </>
    ),
    render: () => {
      const shelf = (id) => SHELVES.find((sh) => sh.id === id)
      const row = (id, label) => (
        <Variant label={label} full>
          <div style={{ padding: 16 }}>
            <Shelf
              shelf={shelf(id)}
              books={getBooks(shelf(id).books)}
              onOpen={noop}
              onWish={noop}
              onPlay={noop}
              onViewAll={noop}
              wishlist={new Set()}
            />
          </div>
        </Variant>
      )
      return (
        <div className="bk-catalog">
          {row('reyes-picks', 'curated — the curator speaks in the subtitle')}
          {row('trending', 'rank — readers at school')}
          {row('audio', 'audio — square covers, ending in a square View More')}
        </div>
      )
    },
  },
  {
    group: 'books',
    id: 'bk-ask-benny',
    name: 'AskBenny',
    usage: `import { AskBenny } from './components/AskBenny'

<AskBenny onOpen={open} onWish={toggleWish} wishlist={wishlist} settings={settings} />`,
    desc: (
      <>
        Discover&rsquo;s recommendation prompt. A reader describes a mood — &ldquo;funny graphic
        novels&rdquo;, &ldquo;something like The Wild Robot&rdquo; — and after a short thinking beat
        Benny answers with a line and a row of <code>BookCard</code>s. The field wears{' '}
        <strong>sparkles, not a loupe</strong>: this is asking, not looking up a title you already
        know. The button takes Benny&rsquo;s teal rather than the page&rsquo;s action blue.
        <br />
        <br />
        Three states: the prompt, <em>thinking</em> (skeleton covers in the same rail the answer
        lands in, so the panel doesn&rsquo;t change size), and the answer with a Clear that goes
        back to the prompt. Try typing <em>funny</em> or <em>dragons</em>, or submit it empty.
      </>
    ),
    render: () => (
      <div className="bk-catalog">
        <Variant label="type a mood, then Ask Benny" full>
          <div style={{ padding: 16 }}>
            <AskBenny onOpen={noop} onWish={noop} wishlist={new Set()} />
          </div>
        </Variant>
      </div>
    ),
  },
  {
    group: 'books',
    id: 'bk-expandable-text',
    name: 'ExpandableText',
    usage: `import { ExpandableText } from './components/ExpandableText'

<ExpandableText text={book.description} lines={3} />`,
    desc: (
      <>
        A clamped paragraph with a <strong>View more</strong> toggle — a book&rsquo;s blurb on its
        detail page. The toggle only appears when the text actually runs past the clamp, so a short
        blurb is just a paragraph. Props: <code>text</code>, <code>lines</code> (default 3),{' '}
        <code>className</code>.
      </>
    ),
    render: () => (
      <div className="bk-catalog">
        <Variant label="overflows — the toggle appears">
          <div style={{ maxWidth: 420 }}>
            <ExpandableText text={getBook('wild-robot').description} lines={3} />
          </div>
        </Variant>
        <Variant label="fits — no toggle">
          <div style={{ maxWidth: 420 }}>
            <ExpandableText text="A short blurb that fits in three lines." lines={3} />
          </div>
        </Variant>
      </div>
    ),
  },
  {
    group: 'books',
    id: 'bk-partner-bits',
    name: 'Partner branding',
    desc: (
      <>
        Partner identity pieces. <code>PartnerBrand</code> renders the lockup (Comics Plus uses the
        real brand assets; Scholastic and Sora are tasteful wordmarks). <code>PartnerMark</code> is
        the small square badge for a cover corner, and <code>PartnerTag</code> is the inline "Read
        now · Comics Plus" availability pill.
      </>
    ),
    render: () => (
      <div className="bk-catalog">
        <Variant label="PartnerBrand lockups">
          <div
            style={{
              display: 'flex',
              gap: 28,
              alignItems: 'center',
              padding: 16,
              flexWrap: 'wrap',
            }}
          >
            <PartnerBrand id="comicsplus" />
            <PartnerBrand id="scholastic" />
            <PartnerBrand id="sora" />
          </div>
        </Variant>
        <Variant label="PartnerMark + PartnerTag">
          <div
            style={{
              display: 'flex',
              gap: 14,
              alignItems: 'center',
              padding: 16,
              flexWrap: 'wrap',
            }}
          >
            <PartnerMark id="comicsplus" size={30} />
            <PartnerMark id="sora" size={30} />
            <PartnerTag partner="comicsplus" action="Read now" />
            <PartnerTag partner="sora" action="Borrow" format="audiobook" />
          </div>
        </Variant>
      </div>
    ),
  },
]
