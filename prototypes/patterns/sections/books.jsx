import { useState } from 'react'
import { Stars, RatingInline, RatingBlock, StarInput } from '@components/Stars/Stars'
import { BookCard } from '../../books/components/BookCard'
import { Shelf } from '../../books/components/Shelf'
import { PartnerBrand, PartnerTag, PartnerMark } from '../../books/components/PartnerBits'
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
    desc: (
      <>
        The cover-forward card used on every Discover shelf. A bookmark toggles "want to read"; a
        Comics Plus mark appears when the title is available there. Variants: <code>default</code>{' '}
        and <code>rank</code> (trending number + reader count).
      </>
    ),
    render: () => {
      const wild = getBook('wild-robot')
      const dogman = getBook('dog-man')
      return (
        <div className="bk-catalog">
          <Variant label="default / rank">
            <div style={{ display: 'flex', gap: 18, padding: 16, alignItems: 'flex-start' }}>
              <BookCard book={wild} onOpen={noop} onWish={noop} wished={false} />
              <BookCard
                book={dogman}
                onOpen={noop}
                onWish={noop}
                wished={false}
                variant="rank"
                rank={2}
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
    desc: (
      <>
        A titled, horizontally scrolling row of <code>BookCard</code>s with arrow controls. Partner
        shelves (<code>shelf.partner</code>) render a tinted, branded header; <code>rank</code>{' '}
        shelves number the cards. Props: <code>shelf</code>, <code>books</code>, <code>onOpen</code>
        , <code>onWish</code>, <code>wishlist</code>.
      </>
    ),
    render: () => (
      <div className="bk-catalog">
        <Variant label="partner shelf (Comics Plus)" full>
          <div style={{ padding: 16 }}>
            <Shelf
              shelf={SHELVES[0]}
              books={getBooks(SHELVES[0].books)}
              onOpen={noop}
              onWish={noop}
              wishlist={new Set()}
            />
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
