import { useState } from 'react'
import { Modal } from '@components/Modal/Modal'
import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'
import { Field, Input, NumberInput } from '@components/Form/Form'
import { SettingRow, SettingList } from '@components/SettingRow/SettingRow'
import { BadgeGallery } from '../../challenge-creator/steps/StepStubs'
import { EXAMPLE_PROMPTS } from '../data'

import '@components/SettingRow/SettingRow.css'

// Blank draft for the create flow — mirrors the Challenge Creator editors,
// which open empty (no art, no name) rather than pre-filled.
const BLANK = {
  img: null,
  name: '',
  color: '#14B8A6',
  promptId: '',
  prompt: '',
  minExchanges: 3,
  requireEngagement: true,
}

// The full "AI Chat Activity" badge editor, in a modal — the Book Talks twin of
// the Challenge Creator's badge editor (same chrome, same disc-opens-gallery
// flow). Everything that defines the badge lives here: art, name, Benny's
// conversation prompt, and the completion bar. No book — students talk about
// whatever they've been reading (specific titles belong to Reading List
// challenges).
export function BadgeEditor({ open, initial, onSave, onCancel }) {
  const editing = !!initial
  const [draft, setDraft] = useState(initial || BLANK)
  const [picking, setPicking] = useState(false)
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }))

  // Re-seed the draft each time the modal opens (create after edit, etc.).
  const [seenOpen, setSeenOpen] = useState(open)
  if (open !== seenOpen) {
    setSeenOpen(open)
    if (open) {
      setDraft(initial || BLANK)
      setPicking(false)
    }
  }

  const valid = !!(draft.img && draft.name.trim() && draft.promptId)

  return (
    <Modal open={open} onClose={onCancel} variant="center" ariaLabel="Book Talk badge editor">
      <div className="cc-badge-editor">
        <header className="cc-badge-editor-head">
          {picking ? (
            <button
              type="button"
              className="cc-badge-editor-back"
              onClick={() => setPicking(false)}
            >
              <Icon name="chevron-left" size={16} />
              Back to badge details
            </button>
          ) : (
            <h3>{editing ? 'Edit Book Talk badge' : 'Create a Book Talk badge'}</h3>
          )}
          <button
            type="button"
            className="cc-badge-editor-close"
            onClick={onCancel}
            aria-label="Close"
          >
            <Icon name="x" size={18} />
          </button>
        </header>

        <div className="cc-badge-editor-body">
          {picking ? (
            <div className="cc-badgepick-wrap">
              <div className="cc-badgepick">
                <BadgeGallery
                  selectedImg={draft.img}
                  defaultGroupId="theme-reading"
                  onPick={(b) => {
                    set({ img: b.img })
                    if (!draft.name && b.name) set({ name: b.name })
                    setPicking(false)
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="cc-badge-form">
              <div className="cc-badge-preview">
                <button
                  type="button"
                  className={`cc-badge-disc${draft.img ? '' : ' is-empty'}`}
                  onClick={() => setPicking(true)}
                  aria-label={draft.img ? 'Change badge art' : 'Choose badge art'}
                >
                  {draft.img ? <img src={draft.img} alt="" /> : <Icon name="photo" size={34} />}
                  <span className="cc-badge-disc-edit" aria-hidden="true">
                    <Icon name="pencil" size={15} />
                  </span>
                </button>
              </div>
              <div className="cc-badge-fields">
                <Field
                  label={
                    <>
                      Badge name <span className="cc-req">*</span>
                    </>
                  }
                  hint={draft.name ? `${draft.name.length}/60` : undefined}
                >
                  <Input
                    value={draft.name}
                    maxLength={60}
                    placeholder="e.g. Talk About Your Reading"
                    onChange={(e) => set({ name: e.target.value })}
                  />
                </Field>
                <Field
                  label={
                    <>
                      What should Benny talk about? <span className="cc-req">*</span>
                    </>
                  }
                >
                  <div
                    className="bt-prompt-examples"
                    role="group"
                    aria-label="Conversation starters"
                  >
                    {EXAMPLE_PROMPTS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className={`bt-prompt-chip${draft.promptId === p.id ? ' is-on' : ''}`}
                        onClick={() => set({ promptId: p.id, prompt: p.text })}
                        title={p.text}
                      >
                        <Icon name="sparkles" size={12} />
                        {p.label}
                      </button>
                    ))}
                  </div>
                  {draft.prompt && (
                    <div className="bt-prompt-selected">
                      <img
                        src="/bs-prototypes/benny.png"
                        alt=""
                        className="bt-prompt-selected-benny"
                      />
                      <p>{draft.prompt}</p>
                    </div>
                  )}
                </Field>
                <Field label="Completed after">
                  <div className="bt-exchanges-field">
                    <NumberInput
                      value={draft.minExchanges}
                      min={2}
                      max={8}
                      onChange={(v) => set({ minExchanges: v })}
                    />
                    <span className="bt-exchanges-hint">exchanges</span>
                  </div>
                </Field>
                <SettingList>
                  <SettingRow
                    label="Require genuine engagement"
                    sub="Don't award if Benny flags the chat as disengaged or copied."
                    checked={draft.requireEngagement}
                    onChange={(v) => set({ requireEngagement: v })}
                  />
                </SettingList>
              </div>
            </div>
          )}
        </div>

        {!picking && (
          <footer className="cc-badge-editor-foot">
            <Button variant="secondary" size="md" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              accent="#0DA7BC"
              disabled={!valid}
              onClick={() => onSave({ ...draft, name: draft.name.trim() })}
            >
              {editing ? 'Save badge' : 'Save & add'}
            </Button>
          </footer>
        )}
      </div>
    </Modal>
  )
}
