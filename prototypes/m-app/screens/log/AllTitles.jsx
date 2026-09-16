import { useState } from 'react'
import {
  BookListItem,
  EmptyStateView,
  LogLoader,
  CompletedLoader,
  FilterBar,
  SelectSheet,
} from '@mobile/components'
import './AllTitles.css'

/**
 * `screens/logScreens/allTitles/` — every title this reader has logged.
 *
 * A ToggleTabs switch over two lists: All Titles is a SectionList of `BookListItem` rows grouped
 * by month; Completed is a loose grid of covers. Both carry the app's faked book shadow — a
 * sibling block at 7% black offset down and right, rather than a box-shadow.
 */
export function AllTitles({ sections, completed, onOpenBook, loading = false }) {
  const [tab, setTab] = useState('All Titles')
  const [pickerOpen, setPickerOpen] = useState(false)
  const TABS = [
    { id: 'All Titles', label: 'All Titles' },
    { id: 'Completed', label: 'Completed' },
  ]

  return (
    <div className="m-at">
      {/* DIVERGENCE — the source's ToggleTabs, on the shared FilterBar with Book Talks and the
          rest: one way of picking a value across the whole Log tab. */}
      <FilterBar label={tab} onPress={() => setPickerOpen(true)} />

      {/* Loading comes BEFORE empty — `renderEmptyState` returns the loader when a fetch is in
          flight, so a slow list never flashes "you haven't logged any reading yet". */}
      {loading ? (
        tab === 'All Titles' ? (
          <LogLoader />
        ) : (
          <CompletedLoader />
        )
      ) : /* `ListEmptyComponent` — each half has its OWN artwork and its own two strings, so the
             empty Completed tab is not the empty All Titles tab with a different noun. */
      tab === 'All Titles' && sections.length === 0 ? (
        <EmptyStateView
          source="my_activities_empty_state"
          boldText="No Recent Titles to Show"
          middleText="You haven’t logged any reading yet."
        />
      ) : tab === 'Completed' && completed.length === 0 ? (
        <EmptyStateView
          source="completed_empty_state"
          boldText="No Completed Titles"
          middleText="You haven’t completed any titles yet."
        />
      ) : tab === 'All Titles' ? (
        sections.map((section) => (
          <section key={section.month}>
            <div className="m-at-section-head">
              <h3 className="m-section-head m-at-section">{section.month}</h3>
              {/* A Divider sits under every section title, inset to the page gutter. */}
              <div className="m-at-divider" />
            </div>
            {section.books.map((b) => (
              <BookListItem key={b.id} {...b} showProgressBar onPress={() => onOpenBook?.(b)} />
            ))}
          </section>
        ))
      ) : (
        <div className="m-at-grid">
          {completed.map((b) => (
            <button key={b.id} type="button" className="m-at-tile" onClick={() => onOpenBook?.(b)}>
              <span className="m-at-tile-cover" style={{ background: b.cover }}>
                <span className="m-at-tile-title">{b.title}</span>
              </span>
              {/* The faked shadow: a sibling block, not a box-shadow. */}
              <span className="m-at-tile-shadow" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      <SelectSheet
        open={pickerOpen}
        items={TABS}
        selectedId={tab}
        onSelect={setTab}
        onClose={() => setPickerOpen(false)}
      />
    </div>
  )
}
