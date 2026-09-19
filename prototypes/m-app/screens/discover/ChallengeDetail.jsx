import { useState } from 'react'
import { Img, TopTabs, EmptyStateView } from '@mobile/components'
import {
  getCardOverviewData,
  isProgressItem,
  cardPercentage,
  cardTitle,
  challengeTabsFor,
} from './challengeOverviewData'
import { ChallengeBadges } from './ChallengeBadges'
import './ChallengeDetail.css'

/**
 * `challenges/components/ChallengeDetailScreen.tsx` — what a challenge card opens.
 *
 * The header is four layers stacked, and the order matters because they overlap:
 *
 *   1. a 60pt bar holding only the back arrow, in the challenge's colour
 *   2. a 110pt band in the same colour, so the two read as one 170pt field
 *   3. `headerCurveGrey`, 44pt, pinned to the band's BOTTOM — the band does not end in a
 *      straight line, it ends in a curve that the page's grey rises into
 *   4. the banner image at `marginTop: -80`, which lifts it out of the page and halfway into
 *      the band. That overlap is the whole composition: the colour is a backdrop for the
 *      banner rather than a header above it.
 *
 * Then a CENTRED title and dates — centred, unlike every other title in the app, because they
 * sit under a centred image rather than at the head of a list.
 *
 * The tab row is DERIVED from the challenge's totals (see `challengeTabsFor`), so it describes
 * the challenge before you have read anything: a challenge with no rewards has no Rewards tab.
 *
 * `bgColorToSet` arrives from the row you tapped rather than from the detail payload, so the
 * colour is right on the first frame instead of arriving with the data.
 */

/** `ChallengeOverviewCard` — the grid, and a card is a shortcut to the tab that explains it. */
function OverviewCard({ detail, onOpenTab }) {
  const progress = isProgressItem(detail.item)
  const pct = cardPercentage(detail)
  const complete = progress && pct === '100%'

  return (
    <button type="button" className="m-chd-card" onClick={() => onOpenTab(detail)}>
      {/* The double border is two elements, not one: a 2pt outer wrapper in greyLight6 and a
          2pt inner in greyLight2, which is how the card gets its soft doubled edge. */}
      <span className="m-chd-card-inner">
        <span className="m-chd-card-top">
          <span
            className="m-chd-ring"
            /* The ring turns green at 100% and is otherwise the card's own pale border — the
               same two-state trick the Badge medallion uses. */
            style={{ borderColor: complete ? 'var(--m-green)' : detail.borderColor }}
          >
            <span className="m-chd-disc" style={{ background: detail.backgroundColor }}>
              <Img name={detail.icon} className="m-chd-icon" />
            </span>
            {complete && (
              <span className="m-chd-tick">
                <Img name="badgeCheckmark" className="m-chd-tick-img" />
              </span>
            )}
          </span>
          {progress && <span className={`m-chd-pct${complete ? ' is-complete' : ''}`}>{pct}</span>}
        </span>

        <span className="m-chd-card-text">
          {progress ? (
            <span className="m-chd-total">
              <span className="m-chd-data">{detail.data}</span>
              <span className="m-chd-slash">/</span>
              <span className="m-chd-goal">{detail.total}</span>
            </span>
          ) : (
            <span className="m-chd-data">{detail.data}</span>
          )}
          <span className="m-chd-card-title">{cardTitle(detail)}</span>
        </span>
      </span>
    </button>
  )
}

function Overview({ attributes, wordForDrawings, activitiesOnly, onOpenTab }) {
  /* The render condition is the source's, and it is not just `total > 0`: a card also shows
     when there is no goal but you have logged something anyway, which is the case for badges,
     rewards, tickets and certificates — they are counts with nothing to be a fraction of. */
  const cards = getCardOverviewData(wordForDrawings, attributes).filter(
    (d) => (d.total === 0 && d.data > 0) || (d.total !== 0 && d.total !== false && d.total != null),
  )

  return (
    <div className="m-chd-overview">
      <h2 className="m-chd-section">Overall Progress</h2>
      <div className="m-chd-grid">
        {cards.map((d) => (
          <OverviewCard
            key={d.item}
            detail={d}
            /* `checkSetTab` — on an activities-only challenge the Badges card goes to
               Activities instead, because there is no Badges tab for it to reach. */
            onOpenTab={(detail) =>
              onOpenTab(detail.item === 'badges' && activitiesOnly ? 'Activities' : detail.tab)
            }
          />
        ))}
      </div>
    </div>
  )
}

/** `HtmlContent` — the description is authored HTML, so it arrives with its own markup. */
function Description({ html }) {
  return (
    <div
      className="m-chd-description"
      /* The app renders this field through `HtmlContent`, because a challenge description is
         authored HTML on the server. Here the only source is the local fixture in data.js —
         nothing user-supplied and nothing fetched reaches this prop. */
      dangerouslySetInnerHTML={{ __html: html ?? '' }}
    />
  )
}

export function ChallengeDetail({ attributes, wordForDrawings = 'Drawings', onOpenBadge, onBack }) {
  const tabs = challengeTabsFor(attributes, wordForDrawings)
  const [tab, setTab] = useState('Overview')
  const active = tabs.includes(tab) ? tab : 'Overview'
  const bg = attributes.bgColorToSet

  return (
    <div className="m-chd">
      {/* Bar and band are separate elements sharing one colour — the bar is a fixed 60 and the
          band a fixed 110, and the curve belongs to the band. */}
      <div className="m-chd-backbar" style={{ background: bg }}>
        <button type="button" className="m-chd-back" aria-label="Back" onClick={onBack}>
          <Img name="back_arrow_icon" className="m-chd-back-img" />
        </button>
      </div>

      <div className="m-chd-scroll">
        <div className="m-chd-band" style={{ background: bg }}>
          <Img name="headerCurveGrey" className="m-chd-curve" fit="fill" />
        </div>

        {/* `marginTop: -80` — the banner climbs into the band above it. */}
        <div className="m-chd-banner">
          <span className="m-chd-banner-wrap">
            {attributes.banner ? (
              <span className="m-chd-banner-img" style={{ background: attributes.banner }} />
            ) : (
              <Img name="emptyChallengeImage" className="m-chd-banner-img" fit="cover" />
            )}
          </span>
        </div>

        <div className="m-chd-title-section">
          <h1 className="m-chd-title">{attributes.challenge_name}</h1>
          <p className="m-chd-dates">{attributes.challenge_dates}</p>
        </div>

        <TopTabs tabs={tabs.map((t) => ({ id: t, label: t }))} active={active} onChange={setTab} />

        {active === 'Overview' && (
          <Overview
            attributes={attributes}
            wordForDrawings={wordForDrawings}
            activitiesOnly={attributes.activities_only}
            onOpenTab={setTab}
          />
        )}
        {active === 'Description' && <Description html={attributes.challenge_description} />}

        {/* Both tabs are the SAME component — `<ChallengeBadges goalType="challenge_badges" />`
            and `<ChallengeBadges goalType="activity_goals" activityBadge />`. */}
        {active === 'Badges' && (
          <ChallengeBadges
            items={attributes.badges ?? []}
            challengeName={attributes.challenge_name}
            isBookList={attributes.is_book_list_challenge}
            isBingo={attributes.is_bingo_challenge}
            onOpenBadge={onOpenBadge}
          />
        )}
        {active === 'Activities' && (
          <ChallengeBadges
            activityBadge
            items={attributes.activities ?? []}
            challengeName={attributes.challenge_name}
            onOpenBadge={onOpenBadge}
          />
        )}

        {/* Still real screens in the app and still to build: Rewards, Ticket Drawings,
            Certificates, Challenge Log, Reading List and the Bingo Card. They are tabs here
            because this challenge's totals put them here, not because they are placeholders. */}
        {!['Overview', 'Description', 'Badges', 'Activities'].includes(active) && (
          <div className="m-chd-pending">
            <EmptyStateView
              source="my_badges_empty_state"
              boldText={`${active} is not built yet`}
              middleText="The tab is real — it is here because this challenge's totals put it here."
            />
          </div>
        )}
      </div>
    </div>
  )
}
