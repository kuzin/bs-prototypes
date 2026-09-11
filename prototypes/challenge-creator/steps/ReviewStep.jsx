import { Icon } from '@components/Icon/Icon'
import {
  CHALLENGE_TYPES,
  TEMPLATE_PRESETS,
  TEMPLATES,
  BANNER_THEMES,
  getBannerTheme,
} from '../data'
import { StepHead, Screen, badgePoolOf } from './shared'

// ─── Final screen · Review ────────────────────────────────────────────────────
// The recap that closes the walk-through: every decision the wizard asked for,
// grouped by phase, each with an Edit link back to the screen that set it. Rows
// are built from the *visible* screens, so a recap never mentions a question
// this creator was never asked (rewards for a teacher, titles for a non-list…).

const dateLabel = (iso) => {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Strip the rich-text description down to a one-line excerpt.
const plain = (html) =>
  (html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const count = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`

function Row({ label, value, missing, screen, onEdit }) {
  return (
    <div className="cc-review-row">
      <span className="cc-review-label">{label}</span>
      <span className={`cc-review-value${missing ? ' is-missing' : ''}`}>{value || 'Not set'}</span>
      {screen && (
        <button type="button" className="cc-review-edit" onClick={() => onEdit(screen)}>
          Edit
        </button>
      )}
    </div>
  )
}

function Group({ title, children }) {
  return (
    <div className="cc-panel cc-review-group">
      <h3 className="cc-panel-title">{title}</h3>
      {children}
    </div>
  )
}

export function ReviewStep({ challenge, role, type, screens = [], phases = [], onEdit }) {
  const d = challenge.details || {}
  const has = (id) => screens.some((s) => s.id === id)
  const phaseName = (id) => phases.find((p) => p.id === id)?.name
  // Every screen id that exists, so an Edit link never points nowhere.
  const to = (id) => (has(id) ? id : null)

  const template =
    challenge.templateId === 'scratch'
      ? 'Built from scratch'
      : TEMPLATES.find((t) => t.id === challenge.templateId)?.name

  const themeId = TEMPLATE_PRESETS[challenge.templateId]?.theme || getBannerTheme(d.background?.id)
  const themeName =
    d.background?.kind === 'upload'
      ? d.background?.name || 'Uploaded image'
      : BANNER_THEMES.find((t) => t.id === themeId)?.name

  // Audience reads back in the same words the audience screen asked in.
  const basis = d.basis || 'grade'
  const audience =
    basis === 'age'
      ? `Ages ${d.ageMin ?? 0}–${d.ageMax ?? 109}`
      : basis === 'branch'
        ? d.branches?.length
          ? d.branches.join(', ')
          : 'All branches'
        : role?.tier === 'simple'
          ? d.classrooms?.length
            ? d.classrooms.join(', ')
            : null
          : d.grades?.length
            ? d.grades.join(', ')
            : 'All grades'

  const badges = challenge.badges || []
  const activityBadges = challenge.activityBadges || []
  const reviewBadges = challenge.reviewBadges || []
  const bookTalkBadges = challenge.bookTalkBadges || []
  const pointsBadges = challenge.pointsBadges || []
  const rewards = challenge.rewards || {}
  const setup = challenge.setup || {}
  const completion = challenge.completion || {}
  const completionLabel = {
    all: 'Earn every badge',
    specific: `Earn ${count((completion.required || []).length, 'specific badge')}`,
    some: `Earn any ${count(completion.count || 1, 'badge')}`,
  }[completion.mode || 'all']

  return (
    <Screen>
      <StepHead
        title="Review & publish"
        sub="Here's everything you set up. Change anything that isn't right, then publish."
      />

      <Group title={phaseName('type') || 'Type'}>
        <Row
          label="Challenge type"
          value={CHALLENGE_TYPES.find((t) => t.id === challenge.typeId)?.name}
          screen="type"
          onEdit={onEdit}
        />
        {has('details.template') && (
          <Row label="Starting point" value={template} screen="details.template" onEdit={onEdit} />
        )}
      </Group>

      <Group title={phaseName('details') || 'Details'}>
        <Row
          label="Name"
          value={d.name?.trim()}
          missing={!d.name?.trim()}
          screen={to('details.basics')}
          onEdit={onEdit}
        />
        <Row
          label="Description"
          value={plain(d.description).slice(0, 120) || null}
          screen={to('details.basics')}
          onEdit={onEdit}
        />
        <Row
          label="Runs"
          value={
            d.start && d.end ? `${dateLabel(d.start)} – ${dateLabel(d.end)}` : dateLabel(d.start)
          }
          screen={to('details.dates')}
          onEdit={onEdit}
        />
        <Row label="Look" value={themeName} screen={to('details.look')} onEdit={onEdit} />
        <Row
          label="Who it’s for"
          value={audience}
          missing={!audience}
          screen={to('details.audience')}
          onEdit={onEdit}
        />
      </Group>

      <Group title={phaseName('badges') || 'Badges'}>
        {has('badges.logging') && (
          <Row
            label="Logging badges"
            value={badges.length ? count(badges.length, 'badge') : null}
            screen="badges.logging"
            onEdit={onEdit}
          />
        )}
        {has('badges.activities') && (
          <Row
            label="Activity badges"
            value={activityBadges.length ? count(activityBadges.length, 'badge') : null}
            screen="badges.activities"
            onEdit={onEdit}
          />
        )}
        {has('badges.reviews') && (
          <Row
            label="Review badges"
            value={reviewBadges.length ? count(reviewBadges.length, 'badge') : null}
            screen="badges.reviews"
            onEdit={onEdit}
          />
        )}
        {has('badges.bookTalks') && (
          <Row
            label="Book Talks"
            value={
              challenge.bookTalks?.onTitleCompletions
                ? 'Benny talks on title completions'
                : 'Site-wide triggers only'
            }
            screen="badges.bookTalks"
            onEdit={onEdit}
          />
        )}
        {has('badges.bookTalks') && (
          <Row
            label="Book Talk badges"
            value={bookTalkBadges.length ? count(bookTalkBadges.length, 'badge') : null}
            screen="badges.bookTalks"
            onEdit={onEdit}
          />
        )}
        {has('badges.points') && (
          <Row
            label="Points badges"
            value={pointsBadges.length ? count(pointsBadges.length, 'badge') : null}
            screen="badges.points"
            onEdit={onEdit}
          />
        )}
        <Row
          label="Registration badge"
          value={
            challenge.registrationBadge?.name || (challenge.registrationBadge ? 'Set' : 'None')
          }
          screen={to('badges.special')}
          onEdit={onEdit}
        />
        <Row
          label="Badges can be earned"
          value={challenge.badgeTime === 'restricted' ? 'In a set window' : 'Any time'}
          screen={to('badges.methods')}
          onEdit={onEdit}
        />
      </Group>

      {has('setup') && (
        <Group title={phaseName('setup') || 'Setup'}>
          {challenge.typeId === 'reading-list' && (
            <Row
              label="Titles"
              value={setup.titles?.length ? count(setup.titles.length, 'title') : null}
              screen="setup"
              onEdit={onEdit}
            />
          )}
          {challenge.typeId === 'bingo' && (
            <Row label="Card size" value={setup.bingoSize} screen="setup" onEdit={onEdit} />
          )}
          {challenge.typeId === 'gameboard' && (
            <Row
              label="Board"
              value={`${count(setup.gbBadges ?? 8, 'badge space')} · ${setup.gameboardTheme || 'template theme'}`}
              screen="setup"
              onEdit={onEdit}
            />
          )}
        </Group>
      )}

      {has('rewards.prizes') && (
        <Group title={phaseName('rewards') || 'Rewards'}>
          <Row
            label="Prizes"
            value={rewards.items?.length ? count(rewards.items.length, 'prize') : 'None'}
            screen="rewards.prizes"
            onEdit={onEdit}
          />
          <Row
            label="Raffle tickets"
            value={rewards.ticketsEnabled ? 'On' : 'Off'}
            screen="rewards.tickets"
            onEdit={onEdit}
          />
          <Row
            label="Certificates"
            value={
              rewards.certificates?.length
                ? count(rewards.certificates.length, 'certificate')
                : 'None'
            }
            screen="rewards.certificates"
            onEdit={onEdit}
          />
        </Group>
      )}

      {has('completion') ? (
        <Group title={phaseName('completion') || 'Completion'}>
          <Row
            label="To finish the challenge"
            value={completionLabel}
            screen="completion"
            onEdit={onEdit}
          />
          <Row
            label="Completion badge"
            value={challenge.completionBadge?.name || (challenge.completionBadge ? 'Set' : 'None')}
            screen={to('badges.special')}
            onEdit={onEdit}
          />
        </Group>
      ) : (
        <Group title="Completion">
          <p className="cc-review-note">
            <Icon name="info-circle" size={15} />
            {type?.name} challenges complete themselves — a reader finishes by filling the board.
          </p>
        </Group>
      )}

      <div className="cc-review-cta">
        <p>
          <strong>{badgePoolOf(challenge).length}</strong> badges are waiting for your readers.
        </p>
        <p className="cc-review-cta-sub">
          Publishing makes this challenge visible to everyone it’s available to. You can keep
          editing after it’s live.
        </p>
      </div>
    </Screen>
  )
}
