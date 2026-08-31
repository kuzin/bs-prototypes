import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { Modal } from '@components/Modal/Modal'
import { BennyChat } from '../components/BennyChat'
// Entry point 4 uses the REAL logging flow, reused from the Logging Flow
// prototype — Benny's hand-off is an additive prop on its success step.
import { LogFlow } from '../../logging-flow/components/LogFlow'
import { CHALLENGE, BENNY_FACE } from '../data'

import bannerImg from '../assets/challenge/banner.png'
import sampleImg from '../assets/challenge/badge-2.png'
import deepImg from '../assets/challenge/badge-3.png'

import '@components/Button/Button.css'
import '@components/Tabs/Tabs.css'
import '@components/Modal/Modal.css'
// Reuse the web-app reader chrome (top bar, logo, user pill, nav tabs).
import '../../web-app/index.css'

const NAV_TABS = [
  { id: 'challenges', label: 'Challenges' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'all-badges', label: 'All Badges' },
  { id: 'reading-log', label: 'Reading Log' },
  { id: 'wish-list', label: 'Wish List' },
  { id: 'recs', label: 'Recommendations' },
]
const CHALLENGE_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'badges', label: 'Badges' },
  { id: 'rewards', label: 'Rewards' },
  { id: 'log', label: 'Challenge Log' },
]
const BADGE_TYPE_TABS = [
  { id: 'challenge', label: 'Challenge Badges' },
  { id: 'logging', label: 'Logging Badges' },
  { id: 'activity', label: 'Activity Badges' },
  { id: 'booktalk', label: 'Book Talk Badges' },
  { id: 'review', label: 'Review Badges' },
]

// One badge card — circular art ringed green when completed (greyed when not),
// name + sub-label, the Benny-talk requirement spelled out, and a status footer.
function BadgeCard({ name, sublabel, img, reqLabel, completed, footer, onClick }) {
  const clickable = !!onClick
  return (
    <div
      className={`bt-rcard${clickable ? ' is-clickable' : ''}`}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      <div className={`bt-rcard-ring${completed ? ' is-done' : ''}`}>
        <div className="bt-rcard-art">
          <img src={img} alt="" />
        </div>
        {completed && (
          <span className="bt-rcard-check">
            <Icon name="circle-check-filled" size={20} color="#16A97A" />
          </span>
        )}
      </div>
      <div className="bt-rcard-name">{name}</div>
      <div className="bt-rcard-sub">{sublabel}</div>
      {/* The requirement, stated on the badge itself — and launchable below. */}
      {!!reqLabel && (
        <div className="bt-rcard-req">
          <Icon name="message-chatbot" size={13} />
          {reqLabel}
        </div>
      )}
      <div
        className={`bt-rcard-foot${completed ? ' is-done' : footer?.cta ? ' is-cta' : ' is-todo'}`}
      >
        {footer?.label}
        {footer?.cta && <Icon name="arrow-right" size={13} stroke={2.4} />}
      </div>
    </div>
  )
}

// Earned-badge detail modal — what a reader sees when they tap a badge.
function BadgeDetailModal({ detail, open, onClose, onReplay }) {
  if (!detail) return null
  return (
    <Modal open={open} onClose={onClose} variant="center" ariaLabel="Badge detail">
      <div className="bt-detail">
        <button className="bt-detail-close" onClick={onClose} aria-label="Close">
          <Icon name="x" size={16} stroke={2.2} />
        </button>
        <div className="bt-detail-ring">
          <div className="bt-detail-art">
            <img src={detail.img} alt="" />
          </div>
          <span className="bt-detail-check">
            <Icon name="circle-check-filled" size={26} color="#16A97A" />
          </span>
        </div>
        <div className="bt-detail-type">Book Talk Badge · Earned</div>
        <h3 className="bt-detail-name">{detail.name}</h3>
        <div className="bt-detail-earned">
          <Icon name="calendar" size={13} />
          Earned {detail.completedAt}
        </div>
        <p className="bt-detail-desc">{detail.desc}</p>
        {detail.booktalk && (
          <Button
            variant="secondary"
            size="md"
            icon={<Icon name="message-chatbot" size={16} />}
            onClick={onReplay}
          >
            View conversation
          </Button>
        )}
      </div>
    </Modal>
  )
}

export function StudentView({ badge, selfStart = true }) {
  // chat: null = closed · { mode: 'badge' | 'self', badge } — a badge-launched
  // talk runs against that badge's bar; a self-started one runs against them all.
  const [chat, setChat] = useState(null)
  const [earnedNames, setEarnedNames] = useState([])
  const [talksDone, setTalksDone] = useState(0) // Book Talks this reader has completed
  const [detail, setDetail] = useState(null)
  const [logOpen, setLogOpen] = useState(false)

  const earned = (name) => earnedNames.includes(name)

  // Book Talk badges in this challenge. The requirement is a NUMBER OF
  // CONVERSATIONS — one talk, or a few of them — not a number of answers.
  //
  // Distinct bars (1 · 2 · 3), and none of them pre-earned: two badges with the
  // same conversation count can't be in different states, so faking one as
  // already-complete just reads as a bug. The reader earns them on the way up.
  const bookTalkBadges = [
    {
      name: badge.name,
      sublabel: 'Talk with Benny',
      img: badge.img,
      color: badge.color,
      promptId: badge.promptId,
      talks: badge.talks,
      booktalk: true,
      completed: earned(badge.name),
      completedAt: 'just now',
      desc: 'Earned by having a Book Talk with Benny about your reading.',
    },
    {
      name: 'Book Buddy',
      sublabel: 'Talk with Benny',
      img: sampleImg,
      color: '#0DA7BC',
      promptId: 'favorites',
      talks: 2,
      booktalk: true,
      completed: earned('Book Buddy'),
      completedAt: 'just now',
      desc: 'Earned by coming back for a second Book Talk with Benny.',
    },
    {
      name: 'Deep Reader',
      sublabel: 'Talk with Benny',
      img: deepImg,
      color: '#7C3AED',
      promptId: 'why-reading',
      talks: 3,
      booktalk: true,
      completed: earned('Deep Reader'),
      completedAt: 'just now',
      desc: 'Earned by keeping the conversation going — three Book Talks with Benny.',
    },
  ]

  // "1 Book Talk with Benny" for a single talk; a running count for the rest.
  const reqLabelFor = (b) => {
    const noun = `Book Talk${b.talks === 1 ? '' : 's'} with Benny`
    if (b.completed || b.talks === 1) return `${b.talks} ${noun}`
    return `${Math.min(talksDone, b.talks)} of ${b.talks} ${noun}`
  }
  // 5 earned on the other badge tabs; the Book Talk ones all start unearned.

  const totalBadges = 16
  const earnedBadges = 5 + earnedNames.length

  // A reader-started talk: no badge tapped, Benny credits whatever it earns.
  const startSelfTalk = () => {
    setLogOpen(false)
    setChat({ mode: 'self', badge })
  }
  // A badge-launched talk: that badge's requirement, that badge's bar.
  const startBadgeTalk = (b) =>
    setChat({
      mode: 'badge',
      badge: {
        ...badge,
        name: b.name,
        img: b.img,
        color: b.color || badge.color,
        promptId: b.promptId || badge.promptId,
      },
    })

  // Tapping a card: earned → detail modal; unearned Book Talk → start its talk.
  const handleCardClick = (b) => {
    if (b.completed) setDetail(b)
    else if (b.booktalk) startBadgeTalk(b)
  }

  // A conversation counted. Credit every Book Talk badge whose conversation
  // requirement that just met — however the talk was started — and report back
  // what was earned (plus where the reader stands on the next one).
  const handleComplete = () => {
    const n = talksDone + 1
    setTalksDone(n)
    const pending = bookTalkBadges.filter((b) => b.booktalk && !b.completed)
    const won = pending.filter((b) => b.talks <= n)
    const next = pending.filter((b) => b.talks > n).sort((a, b) => a.talks - b.talks)[0]
    if (won.length) setEarnedNames((prev) => [...prev, ...won.map((b) => b.name)])
    return {
      badges: won.map((b) => ({ name: b.name, img: b.img, color: b.color })),
      note: next
        ? `${n} of ${next.talks} Book Talks toward “${next.name}”`
        : `That's ${n} Book Talk${n === 1 ? '' : 's'} so far.`,
    }
  }

  return (
    <div className="bt-reader">
      {/* App top bar */}
      <header className="wa-topbar">
        <div className="wa-topbar-inner">
          <div className="wa-logo">
            <img src="/bs-prototypes/bs.svg" alt="" className="wa-logo-mark" />
            <span className="wa-logo-word">beanstack</span>
          </div>
          <div className="wa-topbar-actions">
            <Button variant="primary" size="sm" onClick={() => setLogOpen(true)}>
              Log Reading and Activities
            </Button>
            <Button variant="secondary" size="sm" icon={<Icon name="chevron-down" size={13} />}>
              Add Review
            </Button>
          </div>
          <div className="wa-topbar-user">
            <span className="wa-user-pill">
              <span className="wa-user-avatar">O</span>
              Olivia
            </span>
            <button className="wa-icon-btn" aria-label="Settings">
              <Icon name="settings" size={20} />
            </button>
          </div>
        </div>
        <div className="wa-tabsbar">
          <Tabs
            variant="underline"
            size="md"
            active="challenges"
            accent="#0DA7BC"
            items={NAV_TABS}
          />
        </div>
      </header>

      {/* Challenge banner header */}
      <div className="bt-reader-band">
        <img className="bt-reader-banner" src={bannerImg} alt={CHALLENGE.title} />
      </div>

      <div className="bt-reader-head">
        <h1 className="bt-reader-title">{CHALLENGE.title}</h1>
        <div className="bt-reader-dates">{CHALLENGE.dates}</div>
        <div className="bt-reader-subtabs">
          <Tabs
            variant="underline"
            size="md"
            active="badges"
            accent="#0DA7BC"
            items={CHALLENGE_TABS}
          />
        </div>
      </div>

      {/* Badges body */}
      <div className="bt-reader-body">
        <div className="bt-reader-inner">
          <h2 className="bt-reader-h2">Badges</h2>
          <p className="bt-reader-badgecount">
            {earnedBadges}/{totalBadges} Badges Earned
          </p>

          <div className="bt-badgetype-tabs">
            <Tabs
              variant="underline"
              size="md"
              active="booktalk"
              accent="#0DA7BC"
              items={BADGE_TYPE_TABS}
            />
          </div>

          {/* Entry point 2 — start a talk from the top of the badges page. */}
          {selfStart && (
            <div className="bt-selfstart">
              <img src={BENNY_FACE.excited} alt="" className="bt-selfstart-face" />
              <div className="bt-selfstart-copy">
                <div className="bt-selfstart-title">Feel like talking about a book?</div>
                <p className="bt-selfstart-sub">
                  You don’t have to wait for a badge. Start a Book Talk whenever you want — I’ll
                  give you every badge our chat earns.
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                icon={<Icon name="message-chatbot" size={16} />}
                onClick={startSelfTalk}
              >
                Start a Book Talk
              </Button>
            </div>
          )}

          <div className="bt-reader-badgegrid">
            {bookTalkBadges.map((b, i) => (
              <BadgeCard
                key={i}
                {...b}
                reqLabel={reqLabelFor(b)}
                footer={
                  b.completed
                    ? { label: 'Completed' }
                    : // Entry point 3 — the requirement itself launches the talk.
                      b.booktalk
                      ? { label: 'Talk to Benny', cta: true }
                      : { label: 'Not Completed' }
                }
                onClick={b.completed || b.booktalk ? () => handleCardClick(b) : undefined}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Entry point 1 — Benny floating on every page, always one tap away. */}
      {selfStart && !chat && (
        <button className="bt-benny-fab" onClick={startSelfTalk} aria-label="Talk to Benny">
          <img src={BENNY_FACE.happy} alt="" />
          <span className="bt-benny-fab-label">Talk to Benny</span>
        </button>
      )}

      <BennyChat
        // Keyed on the launch, NOT on talksDone — crediting a talk must not
        // remount the chat out from under its own celebration.
        key={chat ? `${chat.mode}-${chat.badge.name}` : 'closed'}
        badge={chat?.badge ?? badge}
        selfStart={chat?.mode === 'self'}
        open={!!chat}
        onClose={() => setChat(null)}
        onComplete={handleComplete}
      />

      {logOpen && (
        <LogFlow
          open
          onClose={() => setLogOpen(false)}
          // Only offer the hand-off when the self-start trigger is on.
          onTalkToBenny={selfStart ? startSelfTalk : undefined}
        />
      )}

      <BadgeDetailModal
        detail={detail}
        open={!!detail}
        onClose={() => setDetail(null)}
        onReplay={() => {
          setDetail(null)
          startBadgeTalk(detail)
        }}
      />
    </div>
  )
}
