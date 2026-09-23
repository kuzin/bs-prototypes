import { Modal, ModalClose } from '@components/Modal/Modal'
import { Icon } from '@components/Icon/Icon'
import { Pill } from '@components/Pill/Pill'
import { BookCover } from '@components/BookCover/BookCover'
import { Tabs } from '@components/Tabs/Tabs'
import { Button } from '@components/Button/Button'
import { SectionCardTitle } from '@components/SectionCard/SectionCard'
import { Stars, RatingBlock } from '@components/Stars/Stars'
import { EmptyState, Tooltip } from '@components/Primitives/Primitives'
import { useStickyState } from '@components/useStickyState/useStickyState'
import '@components/Modal/Modal.css'
import '@components/Pill/Pill.css'
import '@components/BookCover/BookCover.css'
import '@components/Tabs/Tabs.css'
import '@components/Button/Button.css'
import '@components/Stars/Stars.css'
import '@components/Primitives/Primitives.css'

import { SOURCES, SIGNALS, CERTAINTY, LIST_KINDS, LIST_KIND_ORDER } from '../data'
import { TALK_KINDS } from '../../sfr/data'
import { HoldingPills } from './Bits'
import './BookModal.css'

/* A "reader" of a title and someone the engine *offered* it to are two
   different people, and the panel was showing them as one list. They are the
   two ends of the same funnel, so they stay one list with a filter over it
   rather than two tabs — the whole point is the drop between them. */
const WHO = {
  read: {
    label: 'Read',
    emptyTitle: 'No logged reads yet',
    emptyBody: 'Nobody the engine suggested it to has logged a session against it.',
    match: (x) => x.viaEngine && x.outcome === 'read',
  },
  saved: {
    label: 'Wish Listed',
    emptyTitle: 'Nobody has wish listed it',
    emptyBody: 'Nobody the engine suggested it to is holding it to read.',
    match: (x) => x.viaEngine && x.outcome === 'saved',
  },
  shown: {
    label: 'Did not interact',
    emptyTitle: 'Everyone did something with it',
    emptyBody: 'Nobody the engine offered it to left it alone.',
    match: (x) => x.viaEngine && x.outcome === 'shown',
  },
  own: {
    label: 'Found it themselves',
    emptyTitle: 'Nobody found this one on their own',
    emptyBody: 'Every reader who touched this title was shown it by the engine first.',
    match: (x) => !x.viaEngine,
  },
}
const WHO_ORDER = ['read', 'saved', 'shown', 'own']

/* What a reader can actually be handed, read off the holdings rather than
   stored on the title: the format a school can supply *is* which of its
   catalogs carry the book. */
const FORMAT_OF = { destiny: 'Print', clc: 'Print', sora: 'Ebook', comicsplus: 'Digital comic' }
const FORMAT_ORDER = ['Print', 'Ebook', 'Digital comic']
const formatsOf = (holdings) =>
  FORMAT_ORDER.filter((f) => holdings.some((h) => FORMAT_OF[h.source] === f)).join(' · ')

/* The three kinds of Book Talk, as SfR names them. A librarian looking at one
   title wants to know which sort of conversation it produced: a warm chat, a
   check on what the reader took from it, or a check on the log. */
const KIND_ORDER = ['all', 'engagement', 'comprehension', 'integrity']
const KIND_LABEL = {
  all: 'All talks',
  engagement: TALK_KINDS.engagement.short,
  comprehension: TALK_KINDS.comprehension.short,
  integrity: TALK_KINDS.integrity.short,
}

/* Reviews filter by the rating they carry — the one axis that matters to
   someone deciding whether to buy the book again. (The app's own review filter
   is pending / approved / rejected, which is moderation, a different job from
   this panel.) */
const STAR_ORDER = ['all', '5', '4', '3']
const STAR_LABEL = { all: 'All reviews', 5: '5 stars', 4: '4 stars', 3: '3 stars' }
const matchesStars = (rev, band) => band === 'all' || rev.stars === Number(band)

/* Every reader row is a link, as long as the host knows how to open one. Only
   three children have a profile genuinely their own; the rest carry a
   `profileKey` standing in for theirs, because a name you can't click reads as
   a dead end — see PROFILED in data.js. */
function ReaderRow({ reader, right, sub, onOpen }) {
  const openable = Boolean(onOpen)
  const Tag = openable ? 'button' : 'div'
  return (
    <li>
      <Tag
        className={`bkm-reader${openable ? ' bkm-reader--link' : ''}`}
        type={openable ? 'button' : undefined}
        onClick={openable ? () => onOpen(reader.profileKey ?? reader.key ?? reader.id) : undefined}
      >
        <div className="bkm-reader-text">
          <span className="bkm-reader-name">{reader.name}</span>
          {sub && <span className="bkm-reader-sub">{sub}</span>}
        </div>
        {right}
        {openable && <Icon name="chevron-right" size={16} className="bkm-reader-chev" />}
      </Tag>
    </li>
  )
}

/**
 * One title, everything the school knows about it.
 *
 * The reader's own book page shows a book to someone deciding whether to read
 * it. This shows the same book to someone deciding whether the collection is
 * working: who it reached, who finished it, what they said, and where a copy
 * actually is. Same anatomy, different question.
 */
export function BookModal({
  detail,
  onClose,
  onOpenReader,
  onOpenTitle,
  onOpenTalk,
  hidden = false,
  onToggleHidden,
}) {
  const [tab, setTab] = useStickyState('ce:book-tab', 'readers')
  // "Readers" means the people who read it; the filter widens that out to
  // everyone the engine offered it to.
  const [who, setWho] = useStickyState('ce:book-who', 'read')
  const [kind, setKind] = useStickyState('ce:book-kind', 'all')
  const [band, setStars] = useStickyState('ce:book-stars', 'all')
  // A title nobody has finished yet would open on an empty list, which reads as
  // a broken panel rather than as a fact about the book. The three filters are
  // exhaustive, so fall through to the first one that has anybody in it — the
  // counts beside the others still tell the story.
  const active =
    detail && !detail.recommended.some(WHO[who].match)
      ? (WHO_ORDER.find((id) => detail.recommended.some(WHO[id].match)) ?? who)
      : who
  const shown = detail ? detail.recommended.filter(WHO[active].match) : []
  const talks = detail ? detail.bookTalks.filter((t) => kind === 'all' || t.kindId === kind) : []

  const shownReviews = (detail?.reviews ?? []).filter((rev) => matchesStars(rev, band))

  return (
    <Modal
      open={Boolean(detail)}
      onClose={onClose}
      variant="center"
      className="bkm-modal"
      closeBadge
      ariaLabel="Book details"
    >
      {({ close }) =>
        detail && (
          <>
            <ModalClose onClick={close} />
            <div className="bkm">
              {/* Three panels: the book down the left, the tab bar across the
                top of the right, and the panel it opens under it. Only that
                last one scrolls — the book and the way back out both hold
                still, however far down a list of thirty you get. */}
              <aside className="bkm-rail">
                <BookCover
                  book={{ coverId: detail.title.coverId, title: detail.title.title }}
                  size="md"
                />
                <div className="bkm-head-text">
                  <h2 className="bkm-title">{detail.title.title}</h2>
                  <p className="bkm-author">{detail.title.author}</p>
                  <RatingBlock
                    value={detail.rating.avg}
                    count={detail.rating.count}
                    empty="Not rated yet"
                  />
                </div>

                {/* The funnel, down the rail: how many were offered it, how many
                  kept it, how many finished it, how many talked about it. It
                  holds still beside whichever tab you are reading, because it
                  is the thing every tab is a slice of. */}
                <dl className="bkm-stats">
                  <div>
                    <dt>Suggested to</dt>
                    <dd>{detail.stats.suggested}</dd>
                  </div>
                  <div>
                    <dt>Wish listed</dt>
                    <dd>{detail.stats.saved}</dd>
                  </div>
                  <div>
                    <dt>Read</dt>
                    <dd>{detail.stats.read}</dd>
                  </div>
                  <div>
                    <dt>Book talks</dt>
                    <dd>{detail.bookTalks.length}</dd>
                  </div>
                </dl>
              </aside>

              <div className="bkm-tabs">
                <Tabs
                  active={tab}
                  onChange={setTab}
                  ariaLabel="Book details"
                  collapse={false}
                  items={[
                    { id: 'readers', label: 'Readers' },
                    { id: 'talks', label: 'Book talks' },
                    { id: 'reviews', label: 'Reviews' },
                    { id: 'lists', label: 'Lists' },
                    { id: 'similar', label: 'Similar' },
                    { id: 'about', label: 'Details' },
                  ]}
                />
              </div>

              <div className="bkm-panel">
                {tab === 'readers' && (
                  <section>
                    <SectionCardTitle>Readers</SectionCardTitle>
                    <div className="bkm-filter">
                      <Tabs
                        variant="pill"
                        size="sm"
                        block
                        onTint
                        active={active}
                        onChange={setWho}
                        ariaLabel="Which readers"
                        items={WHO_ORDER.map((id) => ({
                          id,
                          label: WHO[id].label,
                          count: detail.recommended.filter(WHO[id].match).length,
                        }))}
                      />
                    </div>
                    {shown.length ? (
                      <ul className="bkm-list">
                        {shown.slice(0, 40).map((x) => (
                          <ReaderRow
                            key={x.reader.key ?? x.reader.id}
                            reader={x.reader}
                            onOpen={onOpenReader}
                            sub={x.note}
                            right={
                              <span className="bkm-readerright">
                                {/* The signal is *why* the engine picked them.
                                    A reader who found it themselves has none,
                                    so their row says what they did instead. */}
                                {x.viaEngine ? (
                                  SIGNALS[x.signal] && (
                                    <Tooltip content={SIGNALS[x.signal].blurb} placement="auto">
                                      <Pill color={SIGNALS[x.signal].color} size="sm">
                                        {SIGNALS[x.signal].label}
                                      </Pill>
                                    </Tooltip>
                                  )
                                ) : (
                                  <Pill
                                    color={x.outcome === 'read' ? '#0BA85F' : '#196DD5'}
                                    size="sm"
                                  >
                                    {x.outcome === 'read' ? 'Read it' : 'Wish listed it'}
                                  </Pill>
                                )}
                              </span>
                            }
                          />
                        ))}
                      </ul>
                    ) : (
                      <EmptyState
                        title={WHO[active].emptyTitle}
                        description={WHO[active].emptyBody}
                      />
                    )}
                  </section>
                )}

                {tab === 'talks' && (
                  <section>
                    <SectionCardTitle>Book talks about this title</SectionCardTitle>
                    <div className="bkm-filter">
                      <Tabs
                        variant="pill"
                        size="sm"
                        block
                        onTint
                        active={kind}
                        onChange={setKind}
                        ariaLabel="Which kind of talk"
                        items={KIND_ORDER.map((id) => ({
                          id,
                          label: KIND_LABEL[id],
                          count:
                            id === 'all'
                              ? detail.bookTalks.length
                              : detail.bookTalks.filter((t) => t.kindId === id).length,
                        }))}
                      />
                    </div>
                    {talks.length ? (
                      <ul className="bkm-list">
                        {talks.map((t) => (
                          <ReaderRow
                            key={t.reader.key ?? t.reader.id}
                            reader={t.reader}
                            /* The row opens the talk itself — SfR's own
                               session panel — not the reader behind it. */
                            onOpen={onOpenTalk && (() => onOpenTalk(t))}
                            sub={`Talked in ${t.month}`}
                            right={
                              <span className="bkm-readerright">
                                <Pill color={TALK_KINDS[t.kindId].color} size="sm">
                                  {TALK_KINDS[t.kindId].short}
                                </Pill>
                                {t.flagged ? (
                                  <Pill color="#D97706" size="sm">
                                    Flagged
                                  </Pill>
                                ) : (
                                  <Pill color="#0BA85F" size="sm">
                                    Complete
                                  </Pill>
                                )}
                              </span>
                            }
                          />
                        ))}
                      </ul>
                    ) : (
                      <EmptyState
                        title="No book talks yet"
                        description="Nobody who finished it has talked to Benny about it."
                      />
                    )}
                  </section>
                )}

                {tab === 'reviews' && (
                  <section>
                    <SectionCardTitle>What readers said</SectionCardTitle>
                    {detail.reviews.length > 0 && (
                      <div className="bkm-filter">
                        <Tabs
                          variant="pill"
                          size="sm"
                          block
                          onTint
                          active={band}
                          onChange={setStars}
                          ariaLabel="Which reviews"
                          items={STAR_ORDER.map((id) => ({
                            id,
                            label: STAR_LABEL[id],
                            count: detail.reviews.filter((rev) => matchesStars(rev, id)).length,
                          }))}
                        />
                      </div>
                    )}
                    {shownReviews.length ? (
                      <ul className="bkm-reviews">
                        {shownReviews.map((rev) => (
                          <li key={rev.reader.key ?? rev.reader.id} className="bkm-review">
                            <div className="bkm-review-head">
                              <span className="bkm-reader-name">{rev.reader.name}</span>
                              <Stars value={rev.stars} size={14} />
                            </div>
                            <p className="bkm-review-text">{rev.text}</p>
                          </li>
                        ))}
                      </ul>
                    ) : detail.reviews.length ? (
                      <EmptyState
                        title={`No ${STAR_LABEL[band].toLowerCase()} reviews`}
                        description="Nobody who reviewed this title gave it that rating."
                      />
                    ) : (
                      <EmptyState
                        title="No reviews yet"
                        description="Readers have to be asked to rate a book before this fills up — it's a setting on Setup."
                      />
                    )}
                  </section>
                )}

                {tab === 'lists' && (
                  <section>
                    <SectionCardTitle>Where this title already sits</SectionCardTitle>
                    {detail.lists.length ? (
                      <div className="bkm-lists">
                        {LIST_KIND_ORDER.map((k) => {
                          const group = detail.lists.filter((l) => l.kind === k)
                          if (!group.length) return null
                          const meta = LIST_KINDS[k]
                          return (
                            <div key={k} className="bkm-listgroup">
                              <h4 className="bkm-listgroup-head">
                                {meta.label}
                                <span className="bkm-listgroup-count">{group.length}</span>
                              </h4>
                              <ul className="bkm-listrows">
                                {group.map((l) => (
                                  <li key={l.id} className="bkm-listrow">
                                    <div className="bkm-listrow-text">
                                      <span className="bkm-listrow-name">
                                        {l.name}
                                        {l.external && (
                                          <Icon
                                            name="external-link"
                                            size={14}
                                            className="bkm-listrow-ext"
                                          />
                                        )}
                                      </span>
                                      <span className="bkm-listrow-sub">
                                        {[
                                          `${l.books} books`,
                                          l.dates,
                                          l.require && `Read ${l.require} to finish`,
                                          l.owner && `Created by ${l.owner}`,
                                        ]
                                          .filter(Boolean)
                                          .join(' · ')}
                                      </span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <EmptyState
                        title="Not on any list"
                        description="Nobody has curated it onto a Book List, no challenge requires it, and the engine hasn't shelved it on Discover."
                      />
                    )}
                  </section>
                )}

                {tab === 'similar' && (
                  <section>
                    <SectionCardTitle>Similar in your catalogs</SectionCardTitle>
                    {detail.similar.length ? (
                      <ul className="bkm-similar">
                        {detail.similar.map((t) => {
                          /* A row you can open, when the host knows how — a list
                           of what to hand a reader next is only useful if you
                           can look at one of them. */
                          const Tag = onOpenTitle ? 'button' : 'div'
                          return (
                            <li key={t.id}>
                              <Tag
                                className={`bkm-simrow${onOpenTitle ? ' bkm-simrow--link' : ''}`}
                                type={onOpenTitle ? 'button' : undefined}
                                onClick={onOpenTitle ? () => onOpenTitle(t.id) : undefined}
                              >
                                <BookCover
                                  book={{ coverId: t.coverId, title: t.title }}
                                  size="sm"
                                />
                                <div className="bkm-reader-text">
                                  <span className="bkm-reader-name">{t.title}</span>
                                  <span className="bkm-reader-sub">{t.author}</span>
                                </div>
                                <HoldingPills holdings={t.holdings} />
                                {onOpenTitle && (
                                  <Icon
                                    name="chevron-right"
                                    size={16}
                                    className="bkm-reader-chev"
                                  />
                                )}
                              </Tag>
                            </li>
                          )
                        })}
                      </ul>
                    ) : (
                      <EmptyState
                        title="Nothing similar in your catalogs"
                        description="No other title in this genre is in a catalog you have switched on."
                      />
                    )}
                  </section>
                )}

                {tab === 'about' && (
                  <>
                    {/* Where a copy actually is. Everything else on this panel
                          is interesting; this is the bit somebody acts on. */}
                    <section>
                      <SectionCardTitle>Where it is</SectionCardTitle>
                      <ul className="bkm-wherelist">
                        {detail.title.holdings.map((h) => {
                          const src = SOURCES[h.source]
                          const cert = CERTAINTY[src.kind]
                          return (
                            <li key={h.source} className="bkm-whererow">
                              <Pill color={src.color} size="sm">
                                {src.name}
                              </Pill>
                              {/* The claim, and nothing else. A call number is
                                  how you fetch the copy once you know there is
                                  one — not what this row is answering — and it
                                  put a second grey string on a line whose whole
                                  job is one plain statement. */}
                              <Tooltip content={cert.sub} placement="auto">
                                <span className="bkm-cert">{cert.label}</span>
                              </Tooltip>
                            </li>
                          )
                        })}
                      </ul>
                    </section>

                    <section>
                      <SectionCardTitle>Book details</SectionCardTitle>
                      {/* The catalog record, in the order the reader's own book
                          page states it — what it is, who it suits, the edition,
                          then the identifiers. `Formats` is read off the
                          holdings rather than stored: the format a school can
                          hand over *is* which catalogs carry it. */}
                      <dl className="bkm-facts">
                        <div>
                          <dt>Genre</dt>
                          <dd>{detail.title.genre}</dd>
                        </div>
                        <div>
                          <dt>Reading level</dt>
                          <dd>{detail.title.lexile}L</dd>
                        </div>
                        <div>
                          <dt>Best for ages</dt>
                          <dd>{detail.title.ageRange}</dd>
                        </div>
                        <div>
                          <dt>Formats</dt>
                          <dd>{formatsOf(detail.title.holdings)}</dd>
                        </div>
                        <div>
                          <dt>Length</dt>
                          <dd>{detail.title.pageCount} pages</dd>
                        </div>
                        <div>
                          <dt>Published</dt>
                          <dd>{detail.title.published}</dd>
                        </div>
                        <div>
                          <dt>Language</dt>
                          <dd>{detail.title.language}</dd>
                        </div>
                        <div>
                          <dt>ISBN</dt>
                          <dd>{detail.title.isbn}</dd>
                        </div>
                        <div>
                          <dt>In the collection since</dt>
                          <dd>{detail.title.addedYear}</dd>
                        </div>
                      </dl>
                    </section>
                  </>
                )}
              </div>

              {/* The catalogs are switched on and off at the source; this is the
                  same control one level down, for a title that shouldn't be
                  going out however good a match it looks — a damaged copy, a
                  duplicate record, a book this school has decided isn't for its
                  age range. It stops the engine suggesting it; it does not
                  remove it from the catalog, because the catalog isn't ours to
                  edit.

                  In the footer rather than at the foot of the rail: it acts on
                  the whole title, not on the column it sat under, and the rail
                  had to be scrolled to reach it. */}
              {onToggleHidden && (
                <div className="bkm-foot">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => onToggleHidden(detail.title.id)}
                  >
                    {hidden ? 'Suggest it again' : 'Stop suggesting it'}
                  </Button>
                </div>
              )}
            </div>
          </>
        )
      }
    </Modal>
  )
}
