import { Fragment } from 'react'
import { Badge, EmptyStateView } from '@mobile/components'
import './ChallengeBadges.css'

/**
 * `challenges/components/ChallengeBadges.tsx` — ONE component behind two tabs.
 *
 * Badges and Activities are the same list rendered twice, and the only thing that differs is
 * what it groups on. That is worth preserving rather than writing two screens: a challenge's
 * activities ARE badges, they are just grouped by whether you can do them again.
 *
 *   • badges     group by `badge_type`, and the heading is MAPPED from that enum
 *   • activities group by `repeatable` → "Repeatable Activities" / "Activity Badges"
 *
 * Two of the mappings depend on the challenge rather than the badge, which is why the kind of
 * challenge has to reach this far down: `BadgeRequirement` is "Book Badges" on a reading-list
 * challenge and "Logging Badges" everywhere else, and `Completion` is "Bingo Badge" on a bingo
 * card. Anything unmapped falls back to `${badge_type} Badge`, so a new requirement type gets a
 * readable heading without a release.
 *
 * `has_certificates` / `has_tickets` / `has_rewards` are what the badge PAYS OUT, and they are
 * independent of whether it is earned — an unearned badge still advertises its prize. Order is
 * fixed: certificates, tickets, rewards.
 */
const BADGE_SECTION = (type, { isBookList = false, isBingo = false } = {}) =>
  ({
    BadgeRequirement: isBookList ? 'Book Badges' : 'Logging Badges',
    ReviewRequirement: 'Review Badges',
    PointRequirement: 'Point Badges',
    DonationRequirement: 'Donation Badges',
    Completion: isBingo ? 'Bingo Badge' : 'Completion Badge',
  })[type] ?? `${type} Badge`

/** `badgeIconView` — the markers in the source's own order, by the source's own names. */
function markersOf(b) {
  const m = []
  if (b.has_certificates) m.push('CertificatesMarker')
  if (b.has_tickets) m.push('TicketsMarker')
  if (b.has_rewards) m.push('RewardsMarker')
  return m
}

/** `_.groupBy` then `_.map` — insertion order, so the sections follow the data's own order. */
function groupBy(list, keyOf) {
  const out = []
  for (const item of list) {
    const key = keyOf(item)
    const found = out.find((s) => s.key === key)
    if (found) found.data.push(item)
    else out.push({ key, data: [item] })
  }
  return out
}

export function ChallengeBadges({
  items = [],
  challengeName,
  activityBadge = false,
  isBookList = false,
  isBingo = false,
  onOpenBadge,
}) {
  if (items.length === 0) {
    return (
      <div className="m-chb-empty">
        <EmptyStateView
          source="my_badges_empty_state"
          boldText={`No ${activityBadge ? 'Activities' : 'Badges'} To Show`}
          middleText={
            activityBadge
              ? 'There are no activities running at this time.'
              : "This challenge doesn't have any badges yet."
          }
        />
      </div>
    )
  }

  const sections = activityBadge
    ? groupBy(items, (b) => (b.repeatable ? 'Repeatable Activities' : 'Activity Badges')).map(
        (s) => ({ ...s, title: s.key }),
      )
    : groupBy(items, (b) => b.badge_type).map((s) => ({
        ...s,
        title: BADGE_SECTION(s.key, { isBookList, isBingo }),
      }))

  return (
    <div className="m-chb">
      {sections.map((section) => (
        <Fragment key={section.key}>
          {/* `SectionSmallTitle`, and `stickySectionHeadersEnabled={false}` — these scroll away
              rather than pinning, because a badge list is read straight through. */}
          <h2 className="m-chb-section">{section.title}</h2>
          {section.data.map((b) => (
            <Badge
              key={b.id}
              /* The badge's "title" line is the CHALLENGE's name — the same badge can belong to
                 more than one, and in a reader's own collection that line is what says which. */
              title={challengeName}
              name={b.name}
              earnedOn={b.earnedOn}
              earnedText={b.earnedText}
              art={b.art}
              repeatable={b.repeatable}
              completedItems={b.completedItems}
              markers={markersOf(b)}
              onPress={() => onOpenBadge?.(b)}
            />
          ))}
        </Fragment>
      ))}
    </div>
  )
}
