import { Fragment, useState, useEffect, useSyncExternalStore } from 'react'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { BackBar } from '@components/BackBar/BackBar'
import '@components/BackBar/BackBar.css'
import { GROUPS, SECTIONS, GroupHeader, BreakpointIndicator } from './catalog'

// True when this group is the first prototype-specific group — used to drop in
// a "Prototype-specific" divider between the shared groups and the per-prototype ones.
function startsPrototypeSection(i) {
  return GROUPS[i].kind === 'prototype' && GROUPS[i - 1]?.kind !== 'prototype'
}

// ---------------------------------------------------------------------------
// Tiny hash router. Only two real views:
//   #/                       → home (browse every group + component cards)
//   #/<groupId>/<sectionId>  → a single component page
// Group-only paths (#/<groupId>) intentionally don't exist — they fall back
// to home; groups are just collapsible sections in the sidebar.
// ---------------------------------------------------------------------------
function subscribeHash(cb) {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

function useRoute() {
  const hash = useSyncExternalStore(
    subscribeHash,
    () => window.location.hash,
    () => '',
  )
  const path = hash.replace(/^#\/?/, '')
  const segments = path.split('/').filter(Boolean)

  // #/ or a stray #/<group> → home
  if (segments.length < 2) return { view: 'home' }

  const [groupId, sectionId] = segments
  const section = SECTIONS.find((s) => s.id === sectionId && s.group === groupId)
  if (!section) return { view: 'home' }
  const group = GROUPS.find((g) => g.id === groupId)
  return { view: 'component', group, section }
}

function sectionsForGroup(groupId) {
  return SECTIONS.filter((s) => s.group === groupId)
}

// A light, demo-free card linking to a component page.
function CompCard({ groupId, section }) {
  return (
    <a className="pt-comp-card" href={`#/${groupId}/${section.id}`}>
      <div className="pt-comp-card-name">{section.name}</div>
      <div className="pt-comp-card-desc">{section.desc}</div>
    </a>
  )
}

function CardGrid({ groupId }) {
  return (
    <div className="pt-card-grid">
      {sectionsForGroup(groupId).map((s) => (
        <CompCard key={s.id} groupId={groupId} section={s} />
      ))}
    </div>
  )
}

function HomeView() {
  return (
    <>
      <div className="pt-home-intro">
        <h1 className="pt-home-title">Pattern Library</h1>
        <p className="pt-home-lede">
          Shared components used across every prototype. Browse by group below, or jump straight to
          a component from the sidebar.
        </p>
      </div>
      {GROUPS.map((g, i) => (
        <Fragment key={g.id}>
          {startsPrototypeSection(i) && (
            <div className="pt-home-section-label">
              Prototype-specific patterns
              <span>Built for a single prototype, catalogued under its name</span>
            </div>
          )}
          <div className="pt-group">
            <GroupHeader title={g.title} desc={g.desc} />
            <CardGrid groupId={g.id} />
          </div>
        </Fragment>
      ))}
    </>
  )
}

function ComponentView({ section }) {
  return (
    <div className="pt-group">
      <div className="pt-page-bar">
        <BackBar label="Pattern Library" href="#/" />
      </div>
      <section id={section.id} className="pt-section">
        <div className="pt-section-head">
          <h2>{section.name}</h2>
          {section.desc && <div className="pt-section-desc">{section.desc}</div>}
        </div>
        <div className="pt-section-body">{section.render()}</div>
      </section>
    </div>
  )
}

export function App() {
  const route = useRoute()
  const [navOpen, setNavOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)
  // Which sidebar group is expanded — only one at a time. Starts with the active
  // component's group.
  const [openGroup, setOpenGroup] = useState(() => route.group?.id ?? null)

  // Close the mobile drawer + jump back to the top whenever the route changes.
  useEffect(() => {
    setNavOpen(false)
    document.querySelector('.pt-content')?.scrollTo({ top: 0 })
  }, [route.view, route.section?.id])

  // Keep the active component's group expanded when navigating to it.
  useEffect(() => {
    if (!route.group) return
    setOpenGroup(route.group.id)
  }, [route.group?.id])

  // Reveal the back-to-top button once the content area is scrolled.
  useEffect(() => {
    const content = document.querySelector('.pt-content')
    if (!content) return
    const onScroll = () => setShowTop(content.scrollTop > 400)
    onScroll()
    content.addEventListener('scroll', onScroll, { passive: true })
    return () => content.removeEventListener('scroll', onScroll)
  }, [])

  const toggleGroup = (id) => setOpenGroup((prev) => (prev === id ? null : id))

  const activeGroupId = route.group?.id ?? null
  const activeSectionId = route.section?.id ?? null

  return (
    <>
      <div className={`pt-shell${navOpen ? ' pt-shell--nav-open' : ''}`}>
        {/* Mobile topbar — opens the sidebar as a drawer */}
        <div className="pt-topbar">
          <button
            type="button"
            className="pt-topbar-toggle"
            onClick={() => setNavOpen(true)}
            aria-label="Open pattern library navigation"
          >
            <svg
              viewBox="0 0 20 20"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="6" x2="16" y2="6" />
              <line x1="4" y1="10" x2="16" y2="10" />
              <line x1="4" y1="14" x2="16" y2="14" />
            </svg>
          </button>
          <div className="pt-topbar-title">Pattern Library</div>
        </div>

        {navOpen && <div className="pt-sidebar-backdrop" onClick={() => setNavOpen(false)} />}

        <aside className={`pt-sidebar${navOpen ? ' pt-sidebar--open' : ''}`}>
          <div className="pt-sidebar-head">
            <a className="pt-sidebar-brand" href="#/">
              <div className="pt-sidebar-title">Pattern Library</div>
              <div className="pt-sidebar-sub">Shared components used across every prototype</div>
            </a>
            <button
              type="button"
              className="pt-sidebar-close"
              onClick={() => setNavOpen(false)}
              aria-label="Close navigation"
            >
              <svg
                viewBox="0 0 20 20"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>
          </div>
          {GROUPS.map((group, i) => {
            const items = sectionsForGroup(group.id)
            const isOpen = openGroup === group.id
            const isActiveGroup = activeGroupId === group.id
            return (
              <Fragment key={group.id}>
                {startsPrototypeSection(i) && (
                  <div className="pt-nav-divider">Prototype-specific</div>
                )}
                <div className={`pt-nav-group${isOpen ? ' pt-nav-group--open' : ''}`}>
                  <button
                    type="button"
                    className={`pt-nav-group-label${isActiveGroup ? ' pt-nav-group-label--active' : ''}`}
                    onClick={() => toggleGroup(group.id)}
                    aria-expanded={isOpen}
                  >
                    {group.title}
                    <svg
                      className="pt-nav-group-caret"
                      viewBox="0 0 12 12"
                      width="10"
                      height="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="2,4 6,8 10,4" />
                    </svg>
                  </button>
                  {isOpen &&
                    items.map((s) => (
                      <a
                        key={s.id}
                        href={`#/${group.id}/${s.id}`}
                        className={`pt-nav-link${activeSectionId === s.id ? ' pt-nav-link--active' : ''}`}
                      >
                        {s.name}
                      </a>
                    ))}
                </div>
              </Fragment>
            )
          })}
        </aside>

        <main className="pt-content">
          {route.view === 'home' && <HomeView />}
          {route.view === 'component' && <ComponentView section={route.section} />}
        </main>
      </div>
      {showTop && (
        <button
          type="button"
          className="pt-back-to-top"
          onClick={() =>
            document.querySelector('.pt-content')?.scrollTo({ top: 0, behavior: 'smooth' })
          }
          aria-label="Back to top"
        >
          <svg
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3,10 8,5 13,10" />
          </svg>
          Top
        </button>
      )}
      <PrototypeNav currentHref="/bs-prototypes/patterns/" />
      <BreakpointIndicator />
    </>
  )
}
