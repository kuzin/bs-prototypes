import { Fragment } from 'react'
import { useState } from 'react'
import { Img, ProfileRow, EmptyStateView, FilterBar, SelectSheet } from '@mobile/components'
import './Reviews.css'

/**
 * `src/components/Reviews.tsx` with `type='log'` — the reader's own reviews.
 *
 * The same component serves Discover via `<Reviews type="discover" />`, and the `type` fork is
 * bigger than it looks:
 *
 *   log       no avatar AT ALL, and no author name
 *   discover  a 40pt initials avatar, and the author's name above the date
 *
 * The missing avatar is not an omission here. `showProfileCircleIcon={type !== 'log'}` is false on
 * the log tab, and ProfileRow's first branch is `if (!showProfileCircleIcon) return <View />` — an
 * empty, zero-size View. So the row opens straight onto the date. On your own tab there is nobody
 * to attribute to, which is presumably the reasoning. The list's top padding differs too (8 here,
 * 16 on Discover).
 *
 * TWO separators are drawn between rows, which is not a translation artefact: `renderReviewsItem`
 * appends a 1pt greyLight3 View for every item but the last, AND the FlatList carries an
 * `ItemSeparatorComponent` that draws a hairline in `colors.border`. Both ship. Flagged as a
 * finding rather than tidied away, since the brief is to copy what is there.
 *
 * A rejected review is its own state: a warning strip ABOVE the row on the plain white ground
 * (the header sits outside the pressable and is given no background of its own), the row itself
 * on yellowLight with its top padding zeroed, and the options dots moved from the meta row up
 * into that strip.
 */
function Review({ review, profile, type, onOptions, onOpenReview }) {
  const rejected = review.status === 'rejected'
  const isDiscover = type === 'discover'

  /**
   * `showOptions` in the source reads:
   *
   *     (type === 'log' && !reviewStatus === 'rejected') || isMyReviewOnDiscover(item)
   *
   * The first clause is dead. `!reviewStatus === 'rejected'` parses as `(!reviewStatus) === 'rejected'`
   * — a boolean compared to a string, so always false; the author meant `reviewStatus !== 'rejected'`.
   * What actually decides it is the second clause, and on the Log tab the list being rendered IS
   * `profileReviews`, so every row matches and the dots show — rejected ones included, which is
   * why the rejected strip has a slot for them.
   *
   * So the shipped behaviour is: always on Log, own-reviews-only on Discover. Reproduced as that
   * rather than as the expression, since copying the expression would copy the bug into a spec.
   */
  const showOptions = !isDiscover || review.isMine

  const dots = showOptions ? (
    <button
      type="button"
      className="m-rv-dots"
      aria-label="Review options"
      onClick={(e) => {
        e.stopPropagation()
        onOptions?.(review)
      }}
    >
      <Img name="option_dots" size={24} />
    </button>
  ) : null

  return (
    <>
      {/* The ROW navigates to `reviewDetails`; the “…” opens the options sheet. Two targets, two
          destinations — which is why the dots stop the press from reaching the row. */}
      <article
        className={`m-rv-item${rejected ? ' is-rejected' : ''}`}
        role="button"
        tabIndex={0}
        onClick={() => onOpenReview?.(review)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onOpenReview?.(review)
          }
        }}
      >
        {/* The meta row is Discover's: the avatar, the author, and the dots. `showProfileCircleIcon`
            is false on the Log tab, where ProfileRow renders an empty View and there is no author
            — so the row has nothing to hold and is not rendered at all; the dots ride the TITLE
            row instead. */}
        {isDiscover && (
          <div className="m-rv-meta">
            <div className="m-rv-who">
              <ProfileRow showOnlyInitials name={review.author ?? profile} />
              <p className="m-t-title-small m-rv-author">{review.author}</p>
            </div>
            {dots}
          </div>
        )}

        <div className="m-rv-head">
          <p className="m-t-title-small m-rv-title">{review.bookTitle}</p>
          {!isDiscover && dots}
        </div>
        {/* The date sits UNDER its title, not above it. The app leads with the date because on
            Discover it shares that row with the author; on the Log tab there is no author, so the
            date was heading a card it only annotates. */}
        <p className="m-t-body-smaller m-rv-date">{review.date}</p>

        {/* numberOfLines={4} with ellipsizeMode 'tail'. */}
        <p className="m-t-body-regular m-rv-text">{review.text}</p>

        {/* DIVERGENCE — an INFOBOX inside the card, not a colour wash over the whole row.
            The app puts a bare strip ABOVE the Pressable and turns the row beneath it yellow, so
            a rejected review is a full-width block of colour with its reason floating off the top
            — and the “…” moves up into that strip, changing position with status. A bordered
            notice keeps the card white like its neighbours and puts the colour only where the
            message is, which is the part that wants attention. */}
        {rejected && (
          <p className="m-rv-notice">
            <Img name="rejected_warning_icon" size={20} />
            <span className="m-t-body-small">
              This review was rejected. Edit it and send it back.
            </span>
          </p>
        )}
      </article>
    </>
  )
}

/**
 * `ReviewStatus` in `types/api/enums.ts` is `'approved' | 'pending' | 'rejected'` — three real
 * states the reader's own reviews move between, and nothing in the app lets you see them
 * separately. On a list of any length "which of mine came back rejected?" is the question you
 * actually have, and scrolling for yellow is the only way to answer it.
 *
 * On the shared `FilterBar` + `SelectSheet`, the pair Reading Motivation uses to pick a survey.
 * A `ToggleTabs` was tried and four options do not fit it: the pill is built for two, and at four
 * each label gets about 80pt. Discover has no filter — the statuses are the author's business.
 */
const FILTERS = [
  { id: 'all', label: 'All Reviews' },
  { id: 'approved', label: 'Approved' },
  { id: 'pending', label: 'Pending' },
  { id: 'rejected', label: 'Rejected' },
]

export function Reviews({ reviews, profile, type = 'log', onOptions, onOpenReview }) {
  const [filter, setFilter] = useState('all')
  const [pickerOpen, setPickerOpen] = useState(false)
  const isDiscover = type === 'discover'
  const active = FILTERS.find((f) => f.id === filter) ?? FILTERS[0]
  const shown =
    isDiscover || filter === 'all' ? reviews : reviews.filter((r) => r.status === filter)

  if (reviews.length === 0) {
    return (
      /* The BADGES artwork on the reviews tab — the same off-by-one the Badges tab has with the
         challenges artwork. Both ship. */
      <EmptyStateView
        source="my_badges_empty_state"
        boldText="No Reviews to Show"
        middleText="You haven’t logged any reviews yet."
      />
    )
  }

  return (
    <div className={`m-rv${isDiscover ? ' is-discover' : ''}`}>
      {!isDiscover && <FilterBar label={active.label} onPress={() => setPickerOpen(true)} />}

      {shown.length === 0 ? (
        <EmptyStateView
          source="my_badges_empty_state"
          boldText={`No ${active.label} to Show`}
          middleText={`None of your reviews are ${active.label.toLowerCase()} right now.`}
        />
      ) : (
        <div className="m-rv-list">
          {shown.map((r, i) => (
            <Fragment key={r.id}>
              <Review
                review={r}
                profile={profile}
                type={type}
                onOptions={onOptions}
                onOpenReview={onOpenReview}
              />
              {/* ONE separator. The app draws two: `renderReviewsItem` appends a 1pt greyLight3
                View after every item but the last, AND the FlatList sets
                `ItemSeparatorComponent={renderFullScreenSeparator}`, a hairline in
                `colors.border`. They stack, in two different greys, between every pair of rows —
                which is what makes the list look fuzzy rather than ruled. The FlatList's is the
                one kept: it is the idiomatic mechanism and its colour is the app's standard
                separator, used by ActionsModal and the rest. */}
              {i < shown.length - 1 && <div className="m-rv-sep" />}
            </Fragment>
          ))}
        </div>
      )}

      {!isDiscover && (
        <SelectSheet
          open={pickerOpen}
          items={FILTERS}
          selectedId={filter}
          onSelect={setFilter}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  )
}
