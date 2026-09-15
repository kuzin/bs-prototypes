import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { FilterMenuBar } from '@components/FilterMenu/FilterMenu'
import { byEarnedState, EarnedFilter } from '@components/EarnedFilter/EarnedFilter'
import { Pill } from '@components/Pill/Pill'
import { Modal, ModalClose } from '@components/Modal/Modal'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import { GoalTile, GoalTiles } from '@components/GoalTile/GoalTile'
import { BadgeShelf } from '@components/CollectionShelf/CollectionShelf'
import { StatCard } from '@components/Cards/Cards'
import { EmptyState } from '@components/Primitives/Primitives'
import { badgeSrc, bannerSrc, ReaderBack } from '@components/ReaderApp/ReaderApp'
import { ProgramHeader } from '@components/ProgramHeader/ProgramHeader'
import { ReaderPageHead } from '@components/ReaderPageHead/ReaderPageHead'
import { ToastStack, useToasts } from '@components/Toast/Toast'

import { ReadingLog } from '../../logging-flow/components/ReadingLog'
import { BADGES } from '../data'
import './FundraiserPage.css'

import '@components/Button/Button.css'
import '@components/Tabs/Tabs.css'
import '@components/Pill/Pill.css'
import '@components/Modal/Modal.css'
import '@components/ProgressBar/ProgressBar.css'
import '@components/Primitives/Primitives.css'
import '@components/Toast/Toast.css'

/**
 * A fundraiser, from the reader's side — `fundraisers#show`.
 *
 * A read-a-thon is a challenge with money attached: the reader logs as they
 * always do, and the people who sponsor them turn that reading into funds for
 * the site. So the page is the challenge page's furniture — a nav, an Overall
 * Progress strip, badges, prizes, a log — with two things a challenge doesn't
 * have and can't do without.
 *
 * The first is **the two numbers**: raised against the goal, for the site on
 * the banner and for this reader here (`_total_donations`). The second is **the
 * share card** — "Get Donations, Get Rewarded" over the reader's own donation
 * page and a Copy button. A read-a-thon nobody shares raises nothing, which is
 * why the app gives that card the whole of the right rail rather than a line in
 * a menu.
 *
 * The nav is `navigation/sidebar/_fundraiser_nav`: Overview, Badges, Prizes
 * (only where the fundraiser has any), Donations, Challenge Log.
 */

const money = (n) => `$${n.toLocaleString()}`

/* Where each Overall Progress tile goes, from `_overall_progress`'s own hrefs:
   the money tiles to Donations, the prizes to Prizes, everything the badges
   measure to Badges. */
const TILE_TAB = {
  raised: 'donations',
  donations: 'donations',
  prizes: 'prizes',
}

export function FundraiserPage({ fundraiser, entries, onBack }) {
  const [tab, setTab] = useState('overview')
  const { toasts, push, dismiss } = useToasts()

  const f = fundraiser
  const hasPrizes = f.progress.some((p) => p.id === 'prizes')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'badges', label: 'Badges' },
    ...(hasPrizes ? [{ id: 'prizes', label: 'Prizes' }] : []),
    { id: 'donations', label: 'Donations', count: f.donations.length },
    { id: 'log', label: 'Challenge Log' },
  ]

  return (
    <div className="fnd">
      {onBack && <ReaderBack onClick={onBack}>Back to Challenges</ReaderBack>}

      <ProgramHeader banner={bannerSrc(f.banner)} title={f.name} dates={f.dates} tint={f.tint} />

      <div className="fnd-head">
        <div className="fnd-tabs">
          <Tabs
            variant="pill"
            plain
            size="md"
            active={tab}
            onChange={setTab}
            ariaLabel="Fundraiser sections"
            items={tabs}
          />
        </div>
      </div>

      <div className="fnd-body">
        {tab === 'overview' && (
          <div className="fnd-overview">
            <div className="fnd-main">
              {f.shortDescription && <h2 className="fnd-sub">{f.shortDescription}</h2>}
              <p className="fnd-desc">{f.description}</p>
            </div>

            <aside className="fnd-rail">
              {/* `_total_donations` — what this reader has raised, against what
                they said they'd raise. */}
              <div className="fnd-card fnd-total">
                <h2 className="fnd-card-h">Total Donations</h2>
                <p className="fnd-total-nums">
                  <strong>{money(f.myRaised)}</strong>
                  {f.myGoal ? <span> / {money(f.myGoal)}</span> : null}
                </p>
                {f.myGoal ? (
                  <ProgressBar value={f.myRaised} max={f.myGoal} color="#0F7A55" />
                ) : null}
              </div>

              {/* The card the whole thing turns on. */}
              <div className="fnd-card fnd-share">
                <span className="fnd-share-face" aria-hidden="true">
                  😃
                </span>
                <h2 className="fnd-card-h">Get Donations, Get Rewarded</h2>
                <p className="fnd-share-text">
                  Share your donation page with your friends and family to rack up those donation
                  dollars and earn badges.
                </p>
                <div className="fnd-share-icons">
                  {[
                    { id: 'facebook', label: 'Share on Facebook', icon: 'brand-facebook' },
                    { id: 'twitter', label: 'Share on X', icon: 'brand-x' },
                    { id: 'email', label: 'Share via email', icon: 'mail' },
                    { id: 'sms', label: 'Share via text', icon: 'message' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className="fnd-share-icon"
                      aria-label={s.label}
                      onClick={() =>
                        push({ tone: 'info', title: s.label, body: 'Not wired up in a prototype.' })
                      }
                    >
                      <Icon name={s.icon} size={18} />
                    </button>
                  ))}
                </div>
                <div className="fnd-share-link">
                  <span className="fnd-share-url">{f.shareUrl}</span>
                  <Button
                    size="sm"
                    onClick={() => push({ title: 'Fundraiser link copied to clipboard' })}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </aside>

            {/* `.challenge-content-goals` — the app puts Overall Progress
                under the two columns and across the page, not inside the prose
                column. Seven tiles in an 828px column wrapped 3–3–1; the same
                seven across the page are two clean rows. Each one is a link in
                the app, and to the tab that explains it. */}
            <section className="fnd-goals">
              <h2 className="fnd-h2">Overall Progress</h2>
              <GoalTiles>
                {f.progress.map((p) =>
                  p.need != null ? (
                    <GoalTile
                      key={p.id}
                      label={p.label}
                      have={p.have}
                      need={p.need}
                      onClick={() => setTab(TILE_TAB[p.id] ?? 'badges')}
                    />
                  ) : (
                    <GoalTile
                      key={p.id}
                      label={p.label}
                      value={p.value}
                      accent={p.accent}
                      icon={<Icon name={p.icon} size={24} />}
                      onClick={() => setTab(TILE_TAB[p.id] ?? 'badges')}
                    />
                  ),
                )}
              </GoalTiles>
            </section>
          </div>
        )}

        {tab === 'badges' && (
          <>
            <ReaderPageHead as="h2" title="Badges" />
            <BadgeShelf
              badges={BADGES}
              src={(b) => badgeSrc(b.set, b.art)}
              emptyIcon={<Icon name="award" size={26} />}
            />
          </>
        )}

        {tab === 'prizes' && <Prizes fundraiser={f} />}

        {tab === 'donations' && <Donations fundraiser={f} />}

        {tab === 'log' && (
          <ReadingLog
            entries={entries}
            heading="Challenge Log"
            subtabs={false}
            defaultView="titles"
            viewSwitch={false}
            stats={false}
          />
        )}
      </div>

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}

/**
 * `_fundraiser_rewards` — what raising a given amount earns, and which of them
 * this reader has banked. The same All / Earned / Unearned the badge shelf
 * takes, since it is the same question: what have I got, and what is left.
 */
function Prizes({ fundraiser }) {
  const [state, setState] = useState('all')
  const all = fundraiser.prizes ?? []
  const isEarned = (p) => Boolean(p.earned)
  const shown = byEarnedState(all, state, isEarned)

  return (
    <>
      <ReaderPageHead as="h2" title="Prizes" />
      <FilterMenuBar className="fnd-prizefilters">
        <EarnedFilter
          items={all}
          isEarned={isEarned}
          value={state}
          onChange={setState}
          ariaLabel="Which prizes"
        />
      </FilterMenuBar>

      {shown.length === 0 ? (
        <EmptyState
          variant="dashed"
          icon={<Icon name="gift" size={26} />}
          title="No prizes here"
          description="Nothing in this fundraiser matches that filter."
        />
      ) : (
        <div className="fnd-prizes">
          {shown.map((p) => (
            <div className="fnd-prize" key={p.id}>
              <span className="fnd-prize-art" aria-hidden="true">
                {p.art}
              </span>
              <div className="fnd-prize-copy">
                <h3 className="fnd-prize-name">{p.name}</h3>
                <p className="fnd-prize-at">Raise {money(p.at)}</p>
              </div>
              {p.earned ? (
                <Pill color="#0F7A55" variant="soft" size="sm">
                  Earned {p.on}
                </Pill>
              ) : (
                <Pill color="#656565" variant="soft" size="sm">
                  {money(p.at - fundraiser.myRaised)} to go
                </Pill>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

/**
 * `fundraisers/overview/_donations` — who sponsored this reader and what they
 * said. A `donation_sponsor` is a business the site lined up rather than
 * somebody who knows the reader, so it carries no message: it sponsored the
 * fundraiser, not them.
 */
function Donations({ fundraiser }) {
  const total = fundraiser.donations.reduce((n, d) => n + d.amount, 0)

  if (fundraiser.donations.length === 0) {
    return (
      <EmptyState
        variant="dashed"
        icon={<Icon name="coin" size={26} />}
        title="No Donations to Show"
        description="Olivia has not received any donations yet."
      />
    )
  }

  const count = fundraiser.donations.length

  return (
    <div className="fnd-donations">
      <ReaderPageHead as="h2" title="Donations" />
      {/* What the count line said, on the design system's own tile — the same
          one the Overview's totals and the reading log's streaks sit on, and
          the same colours `_overall_progress` gives these two figures. */}
      <div className="fnd-donationnums">
        <StatCard
          value={money(total)}
          label="Total raised"
          color="#0F7A55"
          icon={<Icon name="coin" size={20} />}
        />
        <StatCard
          value={count}
          label={count === 1 ? 'Donation' : 'Donations'}
          color="#1A6DD5"
          icon={<Icon name="users" size={20} />}
        />
      </div>
      <ul className="fnd-donors">
        {fundraiser.donations.map((d) => (
          <li className="fnd-donor" key={d.id}>
            <span className="fnd-donor-icon" aria-hidden="true">
              <Icon name={d.sponsor ? 'building-store' : 'heart'} size={18} />
            </span>
            <div className="fnd-donor-body">
              <p className="fnd-donor-text">
                {d.name} donated <strong>{money(d.amount)}</strong>
              </p>
              {d.message && <p className="fnd-donor-message">{d.message}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * The modal a reader gets the first time they land on a site running one —
 * `_fundraiser_notification`. Shown once and remembered in localStorage, which
 * is a `once` flag here.
 *
 * The art is the app's own `rectangle-group-mask.svg`, the drawn crowd it puts
 * over this one modal and nowhere else. Its copy is left-aligned against it the
 * way the app sets it, and "Get Started" opens the fundraiser: a button that
 * only dismissed the thing it was on was an OK button wearing a verb.
 */
export function FundraiserWelcome({ open, onClose, onStart, school = true }) {
  const where = school ? 'school' : 'library'
  return (
    <Modal open={open} onClose={onClose} variant="center" closeBadge ariaLabel="Fundraiser">
      <ModalClose onClick={onClose} />
      <img className="fnd-welcome-art" src="/bs-prototypes/fundraiser-header.svg" alt="" />
      <div className="modal-body fnd-welcome">
        <h2 className="fnd-welcome-title">
          Raise funds for your {where} and earn prizes by reading!
        </h2>
        <p className="fnd-welcome-text">
          Your {where} is running a fundraiser! Share your sponsor page and raise funds to earn
          badges and prizes!
        </p>
      </div>
      <div className="modal-footer">
        <Button onClick={onStart ?? onClose}>Get Started</Button>
      </div>
    </Modal>
  )
}
