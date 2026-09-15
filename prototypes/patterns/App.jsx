import { Fragment, useState, useEffect, useCallback, useSyncExternalStore } from 'react'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { Icon } from '@components/Icon/Icon'
import { Tabs } from '@components/Tabs/Tabs'
import { GROUPS, SECTIONS, GroupHeader, BreakpointIndicator } from './catalog'
import { SearchPalette } from './SearchPalette'
import { CodeBlock } from './CodeBlock'

const SHARED_GROUPS = GROUPS.filter((g) => g.kind !== 'prototype')
const PROTOTYPE_GROUPS = GROUPS.filter((g) => g.kind === 'prototype')

// True when this group is the first prototype-specific group — used to drop in
// a "Prototype-specific" divider between the shared groups and the per-prototype ones.
function startsPrototypeSection(i) {
  return GROUPS[i].kind === 'prototype' && GROUPS[i - 1]?.kind !== 'prototype'
}

// ---------------------------------------------------------------------------
// Tiny hash router. Three views:
//   #/                       → home (index of groups)
//   #/<groupId>              → one group's component cards
//   #/<groupId>/<sectionId>  → a single component page
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
  const [groupId, sectionId] = path.split('/').filter(Boolean)

  const group = GROUPS.find((g) => g.id === groupId)
  if (!group) return { view: 'home' }
  if (!sectionId) return { view: 'group', group }

  const section = SECTIONS.find((s) => s.id === sectionId && s.group === groupId)
  if (!section) return { view: 'group', group }
  return { view: 'component', group, section }
}

function sectionsForGroup(groupId) {
  return SECTIONS.filter((s) => s.group === groupId)
}

/**
 * A group's entries split into its declared sub-groups — the second level of
 * organisation, for a group that has outgrown one list.
 *
 * Returns `null` for a group with no `subs`, so every caller can keep its
 * one-list rendering rather than branching on an empty array. A sub with
 * nothing in it is dropped, and anything an entry left unassigned falls into a
 * trailing bucket rather than disappearing: a missing `sub:` should look like
 * an oversight, not like a deleted component.
 */
function subsForGroup(group) {
  if (!group?.subs?.length) return null
  const items = sectionsForGroup(group.id)
  const buckets = group.subs
    .map((sub) => ({ ...sub, items: items.filter((s) => s.sub === sub.id) }))
    .filter((b) => b.items.length > 0)
  const known = new Set(group.subs.map((sub) => sub.id))
  const rest = items.filter((s) => !known.has(s.sub))
  return rest.length
    ? [...buckets, { id: '_rest', title: 'Everything else', items: rest }]
    : buckets
}

// ── Sidebar group expansion ───────────────────────────────────────────────
// Several groups can stay open at once, and the set survives a reload — with
// 19 groups, a one-at-a-time accordion kept throwing away where you were.
const OPEN_GROUPS_KEY = 'pt-open-groups'

function readOpenGroups() {
  try {
    const raw = JSON.parse(localStorage.getItem(OPEN_GROUPS_KEY))
    return new Set(Array.isArray(raw) ? raw : [])
  } catch {
    return new Set()
  }
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

function CardGrid({ groupId, sections }) {
  const items = sections ?? sectionsForGroup(groupId)
  return (
    <div className="pt-card-grid">
      {items.map((s) => (
        <CompCard key={s.id} groupId={groupId} section={s} />
      ))}
    </div>
  )
}

// ── Home: an index of groups, not of all 130-odd components ───────────────
function GroupTile({ group }) {
  const count = sectionsForGroup(group.id).length
  return (
    <a className="pt-group-tile" href={`#/${group.id}`} style={{ '--tile-color': group.color }}>
      <div className="pt-group-tile-title">
        {group.title}
        <span className="pt-group-tile-count">{count}</span>
      </div>
      <div className="pt-group-tile-desc">{group.desc}</div>
    </a>
  )
}

function HomeView() {
  return (
    <>
      <div className="pt-home-intro">
        <h1 className="pt-home-title">Pattern Library</h1>
        <p className="pt-home-lede">
          {SECTIONS.length} components across {GROUPS.length} groups. Pick a group below, or press{' '}
          <kbd>⌘K</kbd> to search for a component by name.
        </p>
      </div>

      <div className="pt-home-section-label">
        Shared system
        <span>Used across every prototype — check here before building anything new</span>
      </div>
      <div className="pt-group-tiles">
        {SHARED_GROUPS.map((g) => (
          <GroupTile key={g.id} group={g} />
        ))}
      </div>

      <div className="pt-home-section-label">
        Prototype-specific patterns
        <span>Built for a single prototype, catalogued under its name</span>
      </div>
      <div className="pt-group-tiles">
        {PROTOTYPE_GROUPS.map((g) => (
          <GroupTile key={g.id} group={g} />
        ))}
      </div>
    </>
  )
}

// The one bar at the top of every inner page: where you are, and every level
// above it as a link back.
function Crumbs({ group, section }) {
  return (
    <nav className="pt-crumbs" aria-label="Breadcrumb">
      <a href="#/">Pattern Library</a>
      <Icon name="chevron-right" size={12} stroke={2.2} />
      {section ? (
        <>
          <a href={`#/${group.id}`}>{group.title}</a>
          <Icon name="chevron-right" size={12} stroke={2.2} />
          <span aria-current="page">{section.name}</span>
        </>
      ) : (
        <span aria-current="page">{group.title}</span>
      )}
    </nav>
  )
}

function GroupView({ group }) {
  const subs = subsForGroup(group)
  return (
    <div className="pt-group">
      <Crumbs group={group} />
      <GroupHeader title={group.title} desc={group.desc} />
      {subs ? (
        subs.map((sub) => (
          <section className="pt-sub" key={sub.id} id={`sub-${sub.id}`}>
            <div className="pt-sub-head">
              <h2 className="pt-sub-title">{sub.title}</h2>
              {sub.desc && <p className="pt-sub-desc">{sub.desc}</p>}
              <span className="pt-sub-count">{sub.items.length}</span>
            </div>
            <CardGrid groupId={group.id} sections={sub.items} />
          </section>
        ))
      ) : (
        <CardGrid groupId={group.id} />
      )}
    </div>
  )
}

// "How do I use this?" — the import line plus a minimal call, copyable.
function UsageBlock({ usage }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard?.writeText(usage).then(
      () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1400)
      },
      () => {},
    )
  }

  return (
    <div className="pt-usage">
      <button type="button" className="pt-usage-copy" onClick={copy}>
        <Icon name={copied ? 'check' : 'copy'} size={13} stroke={2.2} />
        {copied ? 'Copied' : 'Copy'}
      </button>
      <CodeBlock code={usage} className="pt-usage-code" />
    </div>
  )
}

// The docs column: what it is, and how to call it — one at a time, so a long
// description never pushes the snippet out of view. Sections without a `usage`
// snippet skip the tabs entirely and just show the description.
function SectionDocs({ section }) {
  const [tab, setTab] = useState('about')

  // Back to About whenever you land on a different component.
  useEffect(() => setTab('about'), [section.id])

  if (!section.usage) {
    return section.desc ? <div className="pt-section-desc">{section.desc}</div> : null
  }

  return (
    <div className="pt-docs">
      <Tabs
        variant="folder"
        size="sm"
        active={tab}
        onChange={setTab}
        collapse={false}
        ariaLabel={`${section.name} documentation`}
        items={[
          { id: 'about', label: 'About' },
          { id: 'usage', label: 'Usage' },
        ]}
      />
      <div className="pt-docs-panel">
        {tab === 'about' ? (
          <div className="pt-section-desc">{section.desc}</div>
        ) : (
          <UsageBlock usage={section.usage} />
        )}
      </div>
    </div>
  )
}

// Move between components without going back out to the group — the catalog
// order is the browsing order. A missing neighbour renders nothing at all; the
// remaining button keeps its side (Next is held right by margin-left: auto).
function PrevNextLink({ groupId, target, dir }) {
  if (!target) return null

  const isPrev = dir === 'prev'
  return (
    <a
      className={`pt-prevnext-link pt-prevnext-link--${dir}`}
      href={`#/${groupId}/${target.id}`}
      aria-label={`${isPrev ? 'Previous' : 'Next'}: ${target.name}`}
    >
      {isPrev && <Icon name="chevron-left" size={14} stroke={2.2} />}
      <span>{target.name}</span>
      {!isPrev && <Icon name="chevron-right" size={14} stroke={2.2} />}
    </a>
  )
}

function PrevNext({ group, section }) {
  const items = sectionsForGroup(group.id)
  const i = items.findIndex((s) => s.id === section.id)

  return (
    <nav className="pt-prevnext" aria-label={`More in ${group.title}`}>
      <PrevNextLink groupId={group.id} target={items[i - 1]} dir="prev" />
      <PrevNextLink groupId={group.id} target={items[i + 1]} dir="next" />
    </nav>
  )
}

// The name, docs, and prev/next ride in a sticky full-height left column so
// they stay put while you scroll a long set of examples on the right.
function ComponentView({ group, section }) {
  return (
    <div className="pt-group">
      <Crumbs group={group} section={section} />
      <section id={section.id} className="pt-section pt-section--split">
        <div className="pt-section-aside">
          <div className="pt-section-head">
            <h2>{section.name}</h2>
          </div>
          <SectionDocs section={section} />
          <PrevNext group={group} section={section} />
        </div>
        <div className="pt-section-body">
          {/* A section with a rail gets its rules from <Knobs>; one without has
              only static examples, so it gets a plain "Examples" rule here.
              CSS hides this when a rail is present. */}
          <div className="pt-examples-rule pt-examples-rule--standalone">
            <span>Examples</span>
          </div>
          {section.render()}
        </div>
      </section>
    </div>
  )
}

export function App() {
  const route = useRoute()
  const [navOpen, setNavOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  // Which sidebar groups are expanded — any number at once, remembered across reloads.
  const [openGroups, setOpenGroups] = useState(readOpenGroups)

  const openPalette = useCallback(() => setPaletteOpen(true), [])

  // Close the mobile drawer + jump back to the top whenever the route changes.
  useEffect(() => {
    setNavOpen(false)
    document.querySelector('.pt-content')?.scrollTo({ top: 0 })
  }, [route.view, route.group?.id, route.section?.id])

  // Keep the group you're inside expanded, and remember the set.
  const routeGroupId = route.group?.id
  useEffect(() => {
    if (!routeGroupId) return
    setOpenGroups((prev) => (prev.has(routeGroupId) ? prev : new Set(prev).add(routeGroupId)))
  }, [routeGroupId])

  useEffect(() => {
    localStorage.setItem(OPEN_GROUPS_KEY, JSON.stringify([...openGroups]))
  }, [openGroups])

  // ⌘K / Ctrl-K anywhere, and "/" when you're not already typing into something.
  useEffect(() => {
    const onKey = (e) => {
      const typing =
        /^(input|textarea|select)$/i.test(e.target.tagName) || e.target.isContentEditable
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault()
        setPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Reveal the back-to-top button once the content area is scrolled.
  useEffect(() => {
    const content = document.querySelector('.pt-content')
    if (!content) return
    const onScroll = () => setShowTop(content.scrollTop > 400)
    onScroll()
    content.addEventListener('scroll', onScroll, { passive: true })
    return () => content.removeEventListener('scroll', onScroll)
  }, [])

  const toggleGroup = (id) =>
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (!next.delete(id)) next.add(id)
      return next
    })

  // One switch for the whole tree: with 24 groups, closing them one at a time to
  // get back to a readable list was the tedious part. Collapsing everything
  // includes the group you're currently inside — the effect above only re-opens
  // it when the route *changes*, so the sidebar stays shut until you navigate.
  const allCollapsed = openGroups.size === 0
  const toggleAllGroups = () =>
    setOpenGroups(allCollapsed ? new Set(GROUPS.map((g) => g.id)) : new Set())

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
            <Icon name="menu" size={18} />
          </button>
          <div className="pt-topbar-title">Pattern Library</div>
          <button
            type="button"
            className="pt-topbar-toggle pt-topbar-search"
            onClick={openPalette}
            aria-label="Search components"
          >
            <Icon name="search" size={18} />
          </button>
        </div>

        {navOpen && <div className="pt-sidebar-backdrop" onClick={() => setNavOpen(false)} />}

        <aside className={`pt-sidebar${navOpen ? ' pt-sidebar--open' : ''}`}>
          <div className="pt-sidebar-head">
            <a className="pt-sidebar-brand" href="#/">
              <div className="pt-sidebar-title">Pattern Library</div>
            </a>
            <button
              type="button"
              className="pt-nav-collapse"
              onClick={toggleAllGroups}
              title={allCollapsed ? 'Expand all groups' : 'Collapse all groups'}
              aria-label={allCollapsed ? 'Expand all groups' : 'Collapse all groups'}
            >
              <Icon name={allCollapsed ? 'chevrons-down' : 'chevrons-up'} size={15} stroke={2} />
            </button>
            <button
              type="button"
              className="pt-sidebar-close"
              onClick={() => setNavOpen(false)}
              aria-label="Close navigation"
            >
              <Icon name="x" size={18} />
            </button>
          </div>

          <button type="button" className="pt-sidebar-search" onClick={openPalette}>
            <Icon name="search" size={15} />
            Search
            <kbd>⌘K</kbd>
          </button>

          {GROUPS.map((group, i) => {
            const items = sectionsForGroup(group.id)
            const subs = subsForGroup(group)
            const isOpen = openGroups.has(group.id)
            const isActiveGroup = activeGroupId === group.id
            return (
              <Fragment key={group.id}>
                {startsPrototypeSection(i) && <div className="pt-nav-divider" aria-hidden="true" />}
                <div className={`pt-nav-group${isOpen ? ' pt-nav-group--open' : ''}`}>
                  <div
                    className={`pt-nav-group-label${isActiveGroup ? ' pt-nav-group-label--active' : ''}`}
                  >
                    <a href={`#/${group.id}`} className="pt-nav-group-name">
                      {group.title}
                    </a>
                    <button
                      type="button"
                      className="pt-nav-group-toggle"
                      onClick={() => toggleGroup(group.id)}
                      aria-expanded={isOpen}
                      aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${group.title}`}
                    >
                      <Icon name="chevron-down" size={10} className="pt-nav-group-caret" />
                    </button>
                  </div>
                  {isOpen &&
                    (subs
                      ? /* The same links, under the sub-headings the group
                         declares — a run of thirty in one column is a list you
                         scroll past rather than one you read. */
                        subs.map((sub) => (
                          <Fragment key={sub.id}>
                            <div className="pt-nav-sub">{sub.title}</div>
                            {sub.items.map((s) => (
                              <a
                                key={s.id}
                                href={`#/${group.id}/${s.id}`}
                                className={`pt-nav-link${activeSectionId === s.id ? ' pt-nav-link--active' : ''}`}
                              >
                                {s.name}
                              </a>
                            ))}
                          </Fragment>
                        ))
                      : items.map((s) => (
                          <a
                            key={s.id}
                            href={`#/${group.id}/${s.id}`}
                            className={`pt-nav-link${activeSectionId === s.id ? ' pt-nav-link--active' : ''}`}
                          >
                            {s.name}
                          </a>
                        )))}
                </div>
              </Fragment>
            )
          })}
        </aside>

        <main className={`pt-content${route.view === 'component' ? ' pt-content--panes' : ''}`}>
          {route.view === 'home' && <HomeView />}
          {route.view === 'group' && <GroupView group={route.group} />}
          {route.view === 'component' && (
            <ComponentView group={route.group} section={route.section} />
          )}
        </main>
      </div>
      {paletteOpen && <SearchPalette onClose={() => setPaletteOpen(false)} />}
      {showTop && (
        <button
          type="button"
          className="pt-back-to-top"
          onClick={() =>
            document.querySelector('.pt-content')?.scrollTo({ top: 0, behavior: 'smooth' })
          }
          aria-label="Back to top"
        >
          <Icon name="chevron-up" size={14} stroke={2.5} />
          Top
        </button>
      )}
      <PrototypeNav currentHref="/bs-prototypes/patterns/" center={<BreakpointIndicator />} />
    </>
  )
}
