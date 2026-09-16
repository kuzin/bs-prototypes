// ⌘K search over every catalogued component.
//
// With 130+ components across 19 groups, "scroll until you spot it" stopped
// working — this is the way you're meant to find things. Opens over whatever
// you're looking at, filters on component name / group / description, and
// navigates on Enter.

import { useEffect, useMemo, useRef, useState } from 'react'
import { Icon } from '@components/Icon/Icon'
import { GROUPS, SECTIONS, platformOf } from './catalog'

const groupTitle = (id) => GROUPS.find((g) => g.id === id)?.title ?? id

// A group big enough to be sub-divided repeats its own name down thirty rows,
// which tells you nothing; the sub is what tells them apart.
const subTitle = (groupId, subId) =>
  subId
    ? (GROUPS.find((g) => g.id === groupId)?.subs?.find((x) => x.id === subId)?.title ?? '')
    : ''

// Group and sub, for the row and for the haystack — "web app reading" should
// find the book pages.
const whereText = (section) =>
  [groupTitle(section.group), subTitle(section.group, section.sub)].filter(Boolean).join(' ')

// Most section descriptions are JSX (they inline <code> for prop names), so
// flatten a node down to its text before searching it.
function textOf(node) {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join(' ')
  return textOf(node.props?.children)
}

// Precomputed once — 134 sections re-flattened on every keystroke would be silly.
const HAYSTACK = SECTIONS.map((section) => ({
  section,
  // Which design system this entry belongs to — the palette only ever searches one.
  platform: platformOf(GROUPS.find((g) => g.id === section.group)),
  name: section.name.toLowerCase(),
  group: whereText(section).toLowerCase(),
  desc: textOf(section.desc).toLowerCase(),
}))

// Rank an entry against the query. Higher is better; null means "no match".
// A name hit always outranks a group hit, which outranks a description hit, so
// typing "modal" puts the Modal component above things that merely mention it.
function score({ name, group, desc }, q) {
  if (name === q) return 100
  if (name.startsWith(q)) return 80
  if (name.includes(q)) return 60
  if (group.startsWith(q)) return 40
  if (group.includes(q)) return 30
  if (desc.includes(q)) return 10
  return null
}

function useResults(query, platform) {
  return useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return HAYSTACK.filter((entry) => entry.platform === platform)
      .map((entry) => ({ entry, rank: score(entry, q) }))
      .filter((r) => r.rank !== null)
      .sort((a, b) => b.rank - a.rank || a.entry.name.localeCompare(b.entry.name))
      .slice(0, 40)
      .map((r) => r.entry.section)
  }, [query, platform])
}

export function SearchPalette({ platform = 'desktop', onClose }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const results = useResults(query, platform)

  useEffect(() => inputRef.current?.focus(), [])
  useEffect(() => setActive(0), [query])

  // Keep the highlighted row in view as you arrow through a long result list.
  useEffect(() => {
    listRef.current?.querySelector('.pt-pal-row--active')?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const go = (section) => {
    if (!section) return
    window.location.hash = `#/${section.group}/${section.id}`
    onClose()
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') return onClose()
    if (e.key === 'Enter') return go(results[active])
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    if (!results.length) return
    const step = e.key === 'ArrowDown' ? 1 : -1
    setActive((i) => (i + step + results.length) % results.length)
  }

  return (
    <div className="pt-pal-backdrop" onMouseDown={onClose}>
      <div
        className="pt-pal"
        role="dialog"
        aria-modal="true"
        aria-label="Search components"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="pt-pal-field">
          <Icon name="search" size={17} className="pt-pal-field-icon" />
          <input
            ref={inputRef}
            className="pt-pal-input"
            type="text"
            placeholder="Search components…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <kbd className="pt-pal-esc">esc</kbd>
        </div>

        {query.trim() && (
          <div className="pt-pal-results" ref={listRef}>
            {results.length === 0 && (
              <div className="pt-pal-empty">
                No component matches “{query.trim()}”.
                <span>Try a component name, a group, or a word from its description.</span>
              </div>
            )}
            {results.map((s, i) => (
              <a
                key={`${s.group}/${s.id}`}
                href={`#/${s.group}/${s.id}`}
                className={`pt-pal-row${i === active ? ' pt-pal-row--active' : ''}`}
                onMouseEnter={() => setActive(i)}
                onClick={onClose}
              >
                <span className="pt-pal-row-name">{s.name}</span>
                <span className="pt-pal-row-group">
                  {groupTitle(s.group)}
                  {subTitle(s.group, s.sub) && (
                    <>
                      {' · '}
                      <span className="pt-pal-row-sub">{subTitle(s.group, s.sub)}</span>
                    </>
                  )}
                </span>
              </a>
            ))}
          </div>
        )}

        <div className="pt-pal-foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> to navigate
          </span>
          <span>
            <kbd>↵</kbd> to open
          </span>
          <span className="pt-pal-foot-count">{SECTIONS.length} components</span>
        </div>
      </div>
    </div>
  )
}
