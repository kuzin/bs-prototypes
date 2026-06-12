import { useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { Modal } from '@components/Modal/Modal'
import { BennyChat } from '../components/BennyChat'
import { CHALLENGE } from '../data'

import bannerImg from '../assets/challenge/banner.png'
import sampleImg from '../assets/challenge/badge-2.png'

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
// name + sub-label, and a status footer. Mirrors the reader challenge grid.
function BadgeCard({ name, sublabel, img, completed, footer, onClick }) {
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
        <div className="bt-detail-type">Activity Badge · Earned</div>
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

export function StudentView({ badge }) {
  const [chatOpen, setChatOpen] = useState(false)
  const [earned, setEarned] = useState(false)
  const [detail, setDetail] = useState(null)

  // Book Talk badges for this challenge — the teacher's badge is the focal one.
  const bookTalkBadges = [
    {
      name: badge.name,
      sublabel: 'Talk with Benny',
      img: badge.img,
      completed: earned,
      completedAt: 'just now',
      booktalk: true,
      desc: 'Earned by having a Book Talk with Benny about a book you read recently.',
    },
    {
      name: 'Poetry Corner Chat',
      sublabel: 'Talk with Benny',
      img: sampleImg,
      completed: true,
      completedAt: 'June 8, 2026',
      desc: 'Earned by chatting with Benny about a poem you read.',
    },
  ]

  const totalBadges = 16
  const earnedBadges = 5 + (earned ? 1 : 0)

  // Tapping a card: earned → detail modal; unearned Book Talk → start the chat.
  const handleCardClick = (b) => {
    if (b.completed) setDetail(b)
    else if (b.booktalk) setChatOpen(true)
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
            <Button variant="primary" size="sm">
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

          <div className="bt-reader-badgegrid">
            {bookTalkBadges.map((b, i) => (
              <BadgeCard
                key={i}
                {...b}
                footer={
                  b.completed
                    ? { label: 'Completed' }
                    : b.booktalk
                      ? { label: 'Talk to Benny', cta: true }
                      : { label: 'Not Completed' }
                }
                onClick={b.completed || b.booktalk ? () => handleCardClick(b) : undefined}
              />
            ))}
          </div>
        </div>
      </div>

      <BennyChat
        badge={badge}
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        onComplete={() => setEarned(true)}
      />

      <BadgeDetailModal
        detail={detail}
        open={!!detail}
        onClose={() => setDetail(null)}
        onReplay={() => {
          setDetail(null)
          setChatOpen(true)
        }}
      />
    </div>
  )
}
