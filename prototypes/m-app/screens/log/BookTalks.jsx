import { useState } from 'react'
import { Img, EmptyStateView, FilterBar, SelectSheet } from '@mobile/components'
import './BookTalks.css'

/**
 * `screens/logScreens/bookTalks/` — the reader's conversations with Benny about books they've read.
 *
 * A ToggleTabs switch between In Progress and Completed, then a SectionList grouped by
 * `MMMM yyyy`. The date line changes verb with the tab — "Started" while a chat is open,
 * "Finished" once it's done — and reads `created_at` vs `updated_at` accordingly.
 *
 * The separator is used as BOTH the item separator and the section separator, so the rule between
 * two months looks identical to the rule between two rows.
 */
export function BookTalks({ inProgress, completed, onOpenChat }) {
  const [tab, setTab] = useState('In Progress')
  const [pickerOpen, setPickerOpen] = useState(false)
  const TABS = [
    { id: 'In Progress', label: 'In Progress' },
    { id: 'Completed', label: 'Completed' },
  ]
  const isInProgress = tab === 'In Progress'
  const sections = isInProgress ? inProgress : completed
  const dateVerb = isInProgress ? 'Started' : 'Finished'

  return (
    <div className="m-bt">
      {/* DIVERGENCE — the source's ToggleTabs, on the shared FilterBar. Two options fit a pill
          perfectly well; what does not fit is having three different pickers across the Log tab
          (a pill here, a segmented control on Highlights, a bar on Reading Motivation) for the
          same job. One control, everywhere. */}
      <FilterBar label={tab} onPress={() => setPickerOpen(true)} />

      {sections.length === 0 ? (
        <EmptyStateView
          source={isInProgress ? 'my_activities_empty_state' : 'sleeping_cat_empty_state'}
          boldText="No Conversations to Show"
          middleText={
            isInProgress
              ? 'You do not have any unfinished conversations.'
              : 'You have not completed any conversations.'
          }
        />
      ) : (
        sections.map((section) => (
          /* One separator style serves BOTH slots: `ItemSeparatorComponent` between rows and
             `SectionSeparatorComponent` at the top AND bottom of every section — which is why a
             section closes with a rule as well as opening with one. */
          <section key={section.title}>
            <h3 className="m-section-head m-bt-section">{section.title}</h3>
            <div className="m-bt-rule" />
            {section.chats.map((chat, i) => (
              <div key={chat.id}>
                {i > 0 && <div className="m-bt-rule" />}
                <button type="button" className="m-bt-row" onClick={() => onOpenChat?.(chat)}>
                  <span className="m-bt-info">
                    <span className="m-bt-title">{chat.bookTitle}</span>
                    <span className="m-bt-date">
                      {dateVerb} {chat.date}
                    </span>
                  </span>
                  <Img name="shareIcon" size={20} tint="var(--m-grey-dark-2)" />
                </button>
              </div>
            ))}
            <div className="m-bt-rule" />
          </section>
        ))
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
