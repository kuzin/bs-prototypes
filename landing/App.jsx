import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { PROTOTYPES } from '@components/prototypes'
import { Button } from '@components/Button/Button'
import { Modal, ModalClose } from '@components/Modal/Modal'
import { PlumpyIcon } from '@components/PlumpyIcon/PlumpyIcon'
import { RowAction } from '@components/RowAction/RowAction'
import { Tabs } from '@components/Tabs/Tabs'
// Narrated click-throughs, written by the demo-video skill's `site` stage.
import DEMO_VIDEOS from '@components/demoVideos.json'

// Files in public/ are served under the site's base (/bs-prototypes/). A bare
// relative path only resolves when the page URL is that folder exactly — the
// dev server also answers at `/`, where `bs.svg` meant `/bs.svg`, a 404.
const BASE = import.meta.env.BASE_URL

const PATTERNS = PROTOTYPES.find((p) => p.id === 'patterns')
const CARDS = PROTOTYPES.filter((p) => p.id !== 'patterns')

// Group cards by their `section` (default "Prototypes"). Preserve first-seen order.
const SECTION_ORDER = ['Prototypes', 'Experiments', 'Completed']
const SECTIONS = (() => {
  const groups = new Map()
  for (const p of CARDS) {
    const key = p.section || 'Prototypes'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(p)
  }
  const sorted = [...groups.entries()].sort(([a], [b]) => {
    const ai = SECTION_ORDER.indexOf(a)
    const bi = SECTION_ORDER.indexOf(b)
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
  })
  // Within a tab, cards are grouped again by `category` — "Prototypes" alone
  // was a flat list of thirteen unrelated things. Registry order decides both
  // the category order and the order inside each one, so reordering the list
  // is still the only place you arrange anything.
  const byCategory = (items) => {
    const cats = new Map()
    for (const p of items) {
      const key = p.category || 'Other'
      if (!cats.has(key)) cats.set(key, [])
      cats.get(key).push(p)
    }
    return [...cats.entries()].map(([title, list]) => ({ title, items: list }))
  }

  return sorted.map(([title, items]) => ({ title, items, categories: byCategory(items) }))
})()

// Each category in one of the app's eight hues (components/ui/tokens.css): its
// heading in the hue's ink, its cards' icon tiles on the wash with the glyph in
// the hue. No two categories in a tab share one, and a category keeps its hue
// in every tab it turns up in (Analytics is blue in both). A category missing
// here falls back to teal.
const CATEGORY_HUES = {
  Challenges: 'orange',
  Profiles: 'pink',
  Analytics: 'blue',
  'Book Talks': 'purple',
  'Collection Engine': 'teal',
  Integrations: 'green',
  Other: 'yellow',
  'Reader experience': 'teal',
  'Mobile app': 'purple',
  'Reading integrity': 'red',
  Admin: 'blue',
  Rostering: 'green',
}
const hueVars = (category) => {
  const hue = CATEGORY_HUES[category] ?? 'teal'
  return {
    '--cat': `var(--c-${hue})`,
    '--cat-wash': `var(--c-${hue}-wash)`,
    '--cat-ink': `var(--c-${hue}-ink)`,
    // Yellow is too pale to draw on its own wash; it takes its ink instead.
    '--cat-glyph': hue === 'yellow' ? 'var(--c-yellow-ink)' : `var(--c-${hue})`,
  }
}

// Per-prototype card glyphs, keyed by prototype id: <PlumpyIcon> names — the
// duotone pack the admin chrome uses. A prototype that comes in levels
// (School / District / Teacher) gets the level's glyph; the category heading
// names the product. `pnpm check` keeps every name on the pack.
const ICON_NAMES = {
  'm-app': 'phone',
  'challenge-creator': 'challenges',
  'student-profile': 'user',
  'ris-school': 'school-building',
  'ris-district': 'district',
  sfr: 'flag',
  patterns: 'grid-view',
  'admin-dashboard': 'dashboard',
  'web-app': 'browser',
  footers: 'footer',
  rostering: 'school-building',
  'rostering-district': 'district',
  insights: 'insights',
  'book-talks': 'medal',
  books: 'book',
  'logging-flow': 'news', // built around a Scholastic magazine
  'pick-your-path': 'signpost',
  btwb: 'chat',
  gameboard: 'dice',
  'gameboard-reader': 'pawn', // the reader's piece on the board
  beeverso: 'connected',
  'words-with-benny': 'vocabulary',
  'reader-profile': 'people',
  'engagement-signals': 'heart-monitor',
  rmi: 'fire',
  'collection-engine': 'school-building',
  'collection-engine-district': 'district',
  'collection-engine-teacher': 'classroom',
  'discover-lists': 'list-view',
}

const VIDEOS_TAB = 'Demo videos'
const TABS = [...SECTIONS.map((s) => s.title), ...(DEMO_VIDEOS.length ? [VIDEOS_TAB] : [])]

// Where you are lives in the URL hash — the tab, and on the Demo videos tab the
// open video — so it survives a trip into a prototype and back, and a link can
// open straight onto either: …/bs-prototypes/#demo-videos, or
// …/bs-prototypes/#demo-videos/collection-engine-demo for one video.
const slug = (tab) => tab.toLowerCase().replace(/\s+/g, '-')
const fromHash = () => {
  const [tabSlug, videoId] = window.location.hash.slice(1).split('/')
  const tab = TABS.find((t) => slug(t) === tabSlug) ?? TABS[0]
  const video = tab === VIDEOS_TAB && DEMO_VIDEOS.some((v) => v.id === videoId) ? videoId : null
  return { tab, video }
}
// The link a video's copy buttons hand out: the site's own landing page (under
// its base), whatever address this copy of the page was opened at.
const videoLink = (id) => `${window.location.origin}${BASE}#${slug(VIDEOS_TAB)}/${id}`

// Copy, and say so for a moment — the profile panel's "Copy link to this view".
function useCopy() {
  const [copied, setCopied] = useState(false)
  const copy = (text) => {
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }
  return [copied, copy]
}

const byId = Object.fromEntries(PROTOTYPES.map((p) => [p.id, p]))
const recordedOn = (iso) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

// The Demo videos tab is laid out like the others: each video under the
// category of the first prototype it covers, in that category's hue.
const VIDEO_GROUPS = (() => {
  const groups = new Map()
  for (const v of DEMO_VIDEOS) {
    const key = byId[v.prototypes[0]]?.category || 'Other'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(v)
  }
  return [...groups.entries()].map(([title, items]) => ({ title, items }))
})()

/* A category's card: its name as the title, its rows below. */
function Category({ title, count, children }) {
  return (
    <section className="cat" style={hueVars(title)}>
      <h2 className="cat-title">
        {title}
        <span className="cat-count">{count}</span>
      </h2>
      <div className="list">{children}</div>
    </section>
  )
}

/* A demo video as a row like a prototype's, a play glyph where the icon would
   be. Pressing it opens the full view — the player in a modal, portalled to
   <body> so the page's zoom doesn't scale it; nothing downloads until then.
   Its link button sits outside the row's own button (a button can't hold
   another), so a link can be copied without opening the video. */
function VideoRow({ id, title, duration, recorded, src, poster, open, onOpen, onClose }) {
  const [rowCopied, copyFromRow] = useCopy()
  const [copied, copy] = useCopy()
  const link = videoLink(id)
  return (
    <div className="video-row">
      <button type="button" className="card" onClick={onOpen}>
        <span className="card-icon">
          <PlumpyIcon name="play" size={18} className="card-icon-play" />
        </span>
        <span className="card-title">{title}</span>
        <span className="card-meta">{duration}</span>
      </button>
      <RowAction
        icon={rowCopied ? 'check' : 'link'}
        label={rowCopied ? 'Link copied' : 'Copy link to this video'}
        done={rowCopied}
        onClick={() => copyFromRow(link)}
        className="video-copy"
      />
      {createPortal(
        <Modal
          open={open}
          onClose={onClose}
          variant="center"
          closeBadge
          className="video-modal"
          ariaLabel={title}
        >
          <ModalClose onClick={onClose} />
          {/* Mounted only while open, so closing the modal stops the sound. */}
          {open && <video src={BASE + src} poster={BASE + poster} controls autoPlay playsInline />}
          <div className="video-modal-foot">
            <div>
              <h3>{title}</h3>
              <span className="video-date">
                {duration} · Recorded {recordedOn(recorded)}
              </span>
            </div>
            <Button variant="secondary" size="sm" onClick={() => copy(link)}>
              {copied ? 'Link copied' : 'Copy link'}
            </Button>
          </div>
        </Modal>,
        document.body,
      )}
    </div>
  )
}

function ProtoCard({ id, name, href }) {
  return (
    <a href={href} className="card">
      {ICON_NAMES[id] && (
        <span className="card-icon">
          <PlumpyIcon name={ICON_NAMES[id]} size={20} />
        </span>
      )}
      <span className="card-title">{name}</span>
      <span className="card-arrow">→</span>
    </a>
  )
}

export default function App() {
  const [{ tab: activeTab, video: openVideo }, setView] = useState(fromHash)
  useEffect(() => {
    const onHash = () => setView(fromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  // Written back to the URL with replace, not push: a tab or an open video
  // isn't a page for Back to step through.
  const show = (tab, video = null) => {
    setView({ tab, video })
    const { pathname, search } = window.location
    const hash = tab === TABS[0] ? '' : `#${slug(tab)}${video ? `/${video}` : ''}`
    window.history.replaceState(null, '', hash || pathname + search)
  }
  const choose = (tab) => show(tab)

  const videos = activeTab === VIDEOS_TAB
  const active = SECTIONS.find((s) => s.title === activeTab) || SECTIONS[0]
  return (
    <div className="page">
      <header>
        <h1>
          <img src={`${BASE}bs.svg`} alt="Beanstack" className="logo-mark" />
          Prototypes
        </h1>
        {PATTERNS && (
          <Button as="a" href={PATTERNS.href} variant="secondary" size="sm">
            Pattern Library
          </Button>
        )}
      </header>

      {/* The system's segmented control, full width. On a phone (`collapse`)
          it becomes a select with ‹ › steppers — four labels don't fit 375px. */}
      <Tabs
        variant="pill"
        size="sm"
        block
        onTint
        collapse
        className="page-tabs"
        ariaLabel="Prototype sections"
        active={activeTab}
        onChange={choose}
        items={TABS.map((tab) => ({
          id: tab,
          label: tab,
          count:
            tab === VIDEOS_TAB
              ? DEMO_VIDEOS.length
              : SECTIONS.find((s) => s.title === tab).items.length,
        }))}
      />

      <main>
        {videos
          ? VIDEO_GROUPS.map((g) => (
              <Category key={g.title} title={g.title} count={g.items.length}>
                {g.items.map((v) => (
                  <VideoRow
                    key={v.id}
                    {...v}
                    open={openVideo === v.id}
                    onOpen={() => show(VIDEOS_TAB, v.id)}
                    onClose={() => show(VIDEOS_TAB)}
                  />
                ))}
              </Category>
            ))
          : active.categories.map((cat) => (
              <Category key={cat.title} title={cat.title} count={cat.items.length}>
                {cat.items.map((p) => (
                  <ProtoCard key={p.href} {...p} />
                ))}
              </Category>
            ))}
      </main>
    </div>
  )
}
