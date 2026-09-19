import { Fragment, useState } from 'react'
import { Img, TextPill, ActionsModal } from '@mobile/components'
import './Challenges.css'

/**
 * `src/challenges/components/Challenges` → ChallengesListComponent → ChallengesList — the default
 * Discover tab.
 *
 * It is a SectionList whose sections are derived from the filter, not fetched as sections. On the
 * default `Current` filter it shows exactly two: the reader's own registered challenges, and
 * "More Challenges" — everything current or upcoming they have NOT registered for and that has no
 * challenge code. Any other filter collapses to that one section.
 *
 * Section titles and subtitles are built from the reader's first name and the microsite name, and
 * the possessive comes from `CheckLastLetter` — a name ending in "s" takes a bare apostrophe.
 *
 * Only the section at `index > 0` takes a 32pt top margin, which is why "More Challenges" is
 * spaced off the list above it while the first section sits flush.
 */

/** `checkLastLetter` — "Maya" → "Maya's", "Chris" → "Chris'". */
const possessive = (name = '') => (name.endsWith('s') ? `${name}'` : `${name}'s`)

/**
 * `getLogChallengeTypes` — a Logging or Reading List challenge contributes one pill per LOG type
 * (pluralised), then every challenge type except 'Logging' contributes its own.
 */
function logChallengeTypes({ challengeTypes = [], logTypes = [] }) {
  const types = []
  if (challengeTypes.includes('Logging') || challengeTypes.includes('Reading List')) {
    logTypes.forEach((t) => types.push(`${t[0].toUpperCase() + t.slice(1)}s`))
  }
  challengeTypes.filter((t) => t !== 'Logging').forEach((t) => types.push(t))
  return types
}

function ChallengeCard({ challenge, onPress }) {
  const types = logChallengeTypes(challenge)
  return (
    <button type="button" className="m-chl-card" onClick={() => onPress?.(challenge)}>
      <span className="m-chl-card-inner">
        <span className="m-chl-banner">
          {/* headerImageWrapper rounds only the TOP corners; the card's own border does the rest. */}
          <span className="m-chl-banner-wrap">
            {challenge.banner ? (
              <span className="m-chl-banner-img" style={{ background: challenge.banner }} />
            ) : (
              <Img name="emptyChallengeImage" className="m-chl-banner-img" fit="cover" />
            )}
          </span>
          {/* challengeStateContainer — a white-backed pill hung 25pt BELOW the banner's edge. */}
          {challenge.state === 'upcoming' && (
            <span className="m-chl-state">
              <TextPill size="small" tone="orange" text="Upcoming" />
            </span>
          )}
        </span>

        <span className="m-chl-meta">
          <span className="m-t-title-regular">{challenge.name}</span>
          <span className="m-t-body-small m-chl-dates">{challenge.dates}</span>
        </span>

        <span className="m-chl-types">
          {types.map((t) => (
            <span key={t} className="m-chl-type">
              {/* No colour passed, so these take TextPill's green default. */}
              <TextPill size="small" text={t} />
            </span>
          ))}
        </span>
      </span>
    </button>
  )
}

export function Challenges({ challenges, user, micrositeName, onOpenChallenge, onCodeSearch }) {
  /* `challengeListFilter` lives in redux in the app, because the same value is read by the list
     and written by a modal mounted outside it. Here the modal is a sibling, so it is state. */
  const [filter, setFilter] = useState('Current')
  const [picking, setPicking] = useState(false)

  const hasChallengeCode = challenges.some(
    (c) => c.challengeCode && !c.isRegistered && c.state !== 'past' && c.state !== 'ignored',
  )

  const all = [
    {
      type: 'current',
      index: 0,
      title: `${possessive(user)} Challenges`,
      subtitle: `Challenges ${user} is participating in at ${micrositeName}.`,
      data: challenges.filter(
        (c) => (c.state === 'current' || c.state === 'upcoming') && c.isRegistered,
      ),
    },
    {
      type: 'more',
      index: 1,
      title: 'More Challenges',
      subtitle: `Other available challenges at ${micrositeName}.`,
      data: challenges.filter(
        (c) =>
          (c.state === 'current' || c.state === 'upcoming') && !c.isRegistered && !c.challengeCode,
      ),
    },
    {
      type: 'past',
      index: 0,
      title: 'Past Challenges',
      subtitle: `Challenges that ${user} is participating in and have ended at ${micrositeName}.`,
      data: challenges.filter((c) => c.state === 'past'),
    },
    {
      type: 'ignored',
      index: 0,
      title: 'Ignored Challenges',
      subtitle: `Challenges that ${user} has ignored at ${micrositeName}.`,
      data: challenges.filter((c) => c.state === 'ignored'),
    },
  ]

  const sections =
    filter === 'Current'
      ? all.filter((s) => s.type === 'current' || s.type === 'more')
      : all.filter((s) => s.type === filter.toLowerCase())

  return (
    <div className="m-chl">
      <div className="m-chl-list">
        {/* ListHeaderComponent — the filter bar scrolls with the list rather than pinning. */}
        <div className="m-chl-filter">
          <button type="button" className="m-chl-filter-btn" onClick={() => setPicking(true)}>
            <span className="m-chl-filter-text">{filter}</span>
            <Img name="filterArrow" className="m-chl-filter-arrow" />
          </button>
          {/* Only when there IS a coded challenge to find. A code that matches nothing is the
              error case, not the empty case, so the button does not offer itself otherwise. */}
          {hasChallengeCode && (
            <button type="button" className="m-chl-code" onClick={onCodeSearch}>
              <span className="m-t-small-title m-chl-code-text">Challenge Code</span>
            </button>
          )}
        </div>

        {sections.map((s) => (
          <Fragment key={s.type}>
            <div className={`m-chl-secthead${s.index > 0 ? ' has-gap' : ''}`}>
              <h2 className="m-t-section-title">{s.title}</h2>
              <p className="m-t-body-small m-chl-subtitle">{s.subtitle}</p>
            </div>
            {s.data.map((c) => (
              <ChallengeCard key={c.id} challenge={c} onPress={onOpenChallenge} />
            ))}
          </Fragment>
        ))}
      </div>

      {/* `OptionsModal` — an `ActionsModal` with `isDateRangeItem`, titled "View Options". The
          selectable variant rather than the picker sheet: you are choosing a value from a named
          set, and the app gives that a title and a Cancel. Past and Ignored each collapse the
          two-section Current view down to one. */}
      <ActionsModal
        open={picking}
        selectable
        title="View Options"
        options={['Current', 'Past', 'Ignored'].map((id) => ({
          title: id,
          isActive: filter === id,
          onPress: () => setFilter(id),
        }))}
        onClose={() => setPicking(false)}
      />
    </div>
  )
}
