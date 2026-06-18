import { useState } from 'react'
import { Cover } from '../../books/components/Cover'
import { Stars, RatingInline, StarInput } from '../../books/components/Stars'
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
    group: 'books',
    id: 'bk-cover',
    name: 'Cover',
    desc: (
      <>
        A book cover. Renders the real Open Library image when it loads, otherwise a designed
        color-gradient placeholder built from <code>book.color</code> plus the title — so misses
        still look intentional (magazines and unlisted titles fall back gracefully). Props:{' '}
        <code>book</code>, <code>size</code> (<code>xs/sm/md/lg</code>).
      </>
    ),
    render: () => (
      <div className="bk-catalog">
        <Variant label="real cover / gradient fallback">
          <div style={{ display: 'flex', gap: 18, padding: 16 }}>
            <div style={{ width: 120 }}>
              <Cover book={getBook('wild-robot')} size="md" />
            </div>
            <div style={{ width: 120 }}>
              <Cover book={getBook('natgeo-kids')} size="md" />
            </div>
          </div>
        </Variant>
      </div>
    ),
  },
  {
    group: 'books',
    id: 'bk-stars',
    name: 'Stars · Rating',
    desc: (
      <>
        The rating family (no star component existed in the system before this). <code>Stars</code>{' '}
        shows a read-only rating with fractional fill; <code>RatingInline</code> adds the numeric
        value and count; <code>StarInput</code> is the interactive picker used by the review
        composer.
      </>
    ),
    render: () => (
      <div className="bk-catalog">
        <Variant label="Stars (read-only, fractional)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
            <Stars value={5} size={20} />
            <Stars value={4.6} size={20} />
            <Stars value={3.2} size={20} />
          </div>
        </Variant>
        <Variant label="RatingInline">
          <div style={{ padding: 16 }}>
            <RatingInline value={4.8} count={1247} size={16} />
          </div>
        </Variant>
        <Variant label="StarInput (interactive)" bare>
          <div style={{ padding: 16 }}>
            <StarInputDemo />
          </div>
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
        Comics Plus mark appears when the title is available there. Variants: <code>default</code>,{' '}
        <code>reason</code> (adds Benny's "why" line), and <code>rank</code> (trending number +
        reader count).
      </>
    ),
    render: () => {
      const wild = getBook('wild-robot')
      const amari = getBook('amari')
      const dogman = getBook('dog-man')
      return (
        <div className="bk-catalog">
          <Variant label="default / reason / rank">
            <div style={{ display: 'flex', gap: 18, padding: 16, alignItems: 'flex-start' }}>
              <BookCard book={wild} onOpen={noop} onWish={noop} wished={false} />
              <BookCard
                book={amari}
                onOpen={noop}
                onWish={noop}
                wished
                variant="reason"
                reason={amari.bennyReason}
              />
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
