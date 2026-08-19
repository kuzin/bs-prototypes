import { useState, useEffect, useMemo, useRef } from 'react'
import { Button } from '@components/Button/Button'
import { Stepper } from '@components/Stepper/Stepper'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { Modal } from '@components/Modal/Modal'
import { Icon } from '@components/Icon/Icon'
import '@components/Button/Button.css'
import '@components/Toggle/Toggle.css'

import {
  getRole,
  getTypesForRole,
  getType,
  getSteps,
  blankChallenge,
  applyTemplate,
  withLogMilestones,
} from './data'
import { validateStep, firstInvalidStep } from './validation'
import { TypeStep } from './steps/TypeStep'
import { TemplateStep } from './steps/TemplateStep'
import { DetailsStep } from './steps/DetailsStep'
import { BadgesStep } from './steps/StepStubs'
import { GameboardStep } from './steps/GameboardStep'
import { CompletionStep } from './steps/CompletionStep'
import './index.css'

// Gameboard Challenge — the challenge creator narrowed to one type.
//
// Forked from the Challenge Creator V2 prototype so the gameboard can be worked
// on inside the flow that actually produces it. Four pieces of V2 scaffolding are
// gone: the live reader preview, the dev mode/role toolbar, the "use the applied
// template's art as the board background" theme, and badge art you upload or
// build from scratch. The Rewards step is gone too — a reward attaches to the
// badge that grants it, picked in the badge editor, which is how Beanstack
// actually models rewards. What's left is: type, template, details, badges, the
// board, completion.
const TYPE_ID = 'gameboard'
// One role: an MS+ school admin, the full-access creator tier.
const MODE = 'challenge'
const ROLE_ID = 'msplus'

const LS_KEY = 'gameboard'
const loadSaved = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || null
  } catch {
    return null
  }
}

// Merge a saved challenge over current defaults so older drafts pick up new
// fields (accent/background/cover) instead of rendering with stale gaps.
const normalizeChallenge = (c) => {
  const blank = blankChallenge(TYPE_ID)
  const merged = {
    ...blank,
    ...c,
    typeId: TYPE_ID,
    details: {
      ...blank.details,
      ...c?.details,
      // Empty start/end fall back to the default window (today → +1 week).
      start: c?.details?.start || blank.details.start,
      end: c?.details?.end || blank.details.end,
    },
    setup: { ...blank.setup, ...c?.setup },
    rewards: { ...blank.rewards, ...c?.rewards },
    completion: { ...blank.completion, ...c?.completion },
  }
  // Backfill any logging badge missing a log value (older drafts saved template
  // badges without one).
  if (merged.badges?.length) merged.badges = withLogMilestones(merged.badges)
  return merged
}

function SaveStatus({ state }) {
  return (
    <span className={`gb-save gb-save--${state}`} aria-live="polite">
      {state === 'saving' ? (
        <>
          <span className="gb-save-spin" /> Saving…
        </>
      ) : (
        <>
          <Icon name="check" size={13} stroke={2.2} />
          Saved
        </>
      )}
    </span>
  )
}

export function App() {
  const saved = loadSaved()
  const [challenge, setChallenge] = useState(
    saved?.challenge ? normalizeChallenge(saved.challenge) : blankChallenge(TYPE_ID),
  )
  const [stepId, setStepId] = useState(saved?.stepId ?? 'type')
  const [saveState, setSaveState] = useState('saved')
  // `dirty` = the user has customized since the last template/scratch pick.
  const [dirty, setDirty] = useState(false)
  const [pendingTemplate, setPendingTemplate] = useState(null)
  const [confirmPublish, setConfirmPublish] = useState(false)

  const firstRun = useRef(true)
  const saveTimer = useRef(null)

  const role = getRole(MODE, ROLE_ID)
  const type = getType(challenge.typeId)
  const steps = useMemo(() => getSteps(), [])

  // Persist the draft and drive the autosave indicator.
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify({ challenge, stepId }))
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    setSaveState('saving')
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => setSaveState('saved'), 650)
    return () => clearTimeout(saveTimer.current)
  }, [challenge, stepId])

  // Any user edit marks the draft dirty (so we can warn before a reset).
  const update = (patch) => {
    setDirty(true)
    setChallenge((c) => ({ ...c, ...patch }))
  }
  const updateDetails = (patch) => {
    setDirty(true)
    setChallenge((c) => ({ ...c, details: { ...c.details, ...patch } }))
  }

  // Applying a template (or scratch) overwrites name/description/banner/badges —
  // so if the user has customized, confirm first.
  const applyTpl = (templateId) => {
    setChallenge((c) => applyTemplate(c, templateId))
    setDirty(false)
  }
  const chooseTemplate = (templateId) => {
    if (dirty && templateId !== challenge.templateId) setPendingTemplate(templateId)
    else applyTpl(templateId)
  }

  const idx = steps.findIndex((s) => s.id === stepId)
  const isLast = idx === steps.length - 1

  // ── Validation ──
  // Errors are computed continuously, but only *revealed* once the user has
  // attempted to move on (Next / Publish) from a given step. Before that a step
  // shows required-field markers but no red errors — so you never land on a
  // fresh step that's already shouting at you. Once revealed, errors clear live
  // as you fix them.
  const [revealed, setRevealed] = useState({})
  const formRef = useRef(null)

  const stepErrors = useMemo(
    () => validateStep(stepId, challenge, { role, type }),
    [stepId, challenge, role, type],
  )
  const stepValid = Object.keys(stepErrors).length === 0
  const visibleErrors = revealed[stepId] ? stepErrors : {}

  const revealStep = (id) => setRevealed((r) => (r[id] ? r : { ...r, [id]: true }))
  // After revealing, focus the first invalid field's control and scroll it into
  // view. Scroll is instant — a smooth scroll here got silently cancelled when
  // the control then took focus, leaving the page where it was.
  const focusFirstError = () => {
    setTimeout(() => {
      const field = formRef.current?.querySelector('.fld--has-error')
      if (!field) return
      const control = field.querySelector('input, textarea, select, button, [tabindex]')
      if (control && typeof control.focus === 'function') control.focus({ preventScroll: true })
      field.scrollIntoView({ block: 'center' })
    }, 40)
  }

  const goNext = () => {
    if (isLast) return
    if (!stepValid) {
      revealStep(stepId)
      focusFirstError()
      return
    }
    setStepId(steps[idx + 1].id)
  }
  const goPrev = () => idx > 0 && setStepId(steps[idx - 1].id)
  // Publishing is a deliberate step: validate first, then confirm.
  const publish = () => {
    const bad = firstInvalidStep(steps, challenge, { role, type })
    if (bad) {
      setStepId(bad)
      revealStep(bad)
      focusFirstError()
      return
    }
    setConfirmPublish(true)
  }

  // A single title that becomes more specific as the challenge takes shape:
  // the type name → the named challenge (each replaces the last).
  const headerTitle = challenge.details.name?.trim() || type?.name || 'Create a challenge'

  return (
    <div className="gb-root">
      <header className="gb-topbar">
        <div className="gb-topbar-left">
          <a className="gb-exit" href="/bs-prototypes/" title="Back to prototypes">
            ←
          </a>
          <span className="gb-title" key={headerTitle}>
            {headerTitle}
          </span>
          <span className="gb-status">Draft</span>
          <SaveStatus state={saveState} />
        </div>
        <div className="gb-topbar-right">
          <Button variant="ghost" size="sm">
            Save &amp; exit
          </Button>
          <Button variant="primary" size="sm" accent="#0DA7BC" onClick={publish}>
            Publish
          </Button>
        </div>
      </header>

      <div className="gb-stepbar">
        <Stepper steps={steps} current={stepId} onStep={setStepId} accent={type?.accent} />
      </div>

      <div className="gb-main">
        <main className="gb-form" ref={formRef}>
          <div className="gb-form-inner">
            {stepId === 'type' && (
              <TypeStep
                types={getTypesForRole(role)}
                value={challenge.typeId}
                onSelect={() => {
                  /* only the Gameboard type is selectable here */
                }}
                selectableIds={[TYPE_ID]}
              />
            )}
            {stepId === 'template' && (
              <TemplateStep challenge={challenge} onTemplate={chooseTemplate} />
            )}
            {stepId === 'details' && (
              <DetailsStep
                challenge={challenge}
                role={role}
                type={type}
                updateDetails={updateDetails}
                errors={visibleErrors}
              />
            )}
            {stepId === 'badges' && (
              <BadgesStep
                challenge={challenge}
                role={role}
                type={type}
                update={update}
                errors={visibleErrors}
              />
            )}
            {stepId === 'setup' && <GameboardStep challenge={challenge} update={update} />}
            {stepId === 'completion' && <CompletionStep challenge={challenge} update={update} />}
          </div>

          <div className="gb-form-footer">
            <Button variant="secondary" onClick={goPrev} disabled={idx === 0}>
              Back
            </Button>
            <div className="gb-footer-right">
              {isLast ? (
                <Button variant="primary" accent="#0DA7BC" onClick={publish}>
                  Publish challenge
                </Button>
              ) : (
                <Button variant="primary" accent={type?.accent || '#0DA7BC'} onClick={goNext}>
                  Next: {steps[idx + 1]?.name}
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>

      <Modal
        open={pendingTemplate !== null}
        onClose={() => setPendingTemplate(null)}
        variant="center"
        ariaLabel="Reset customizations?"
      >
        {({ close }) => (
          <div className="gb-confirm">
            <h3>Reset your customizations?</h3>
            <p>
              {pendingTemplate === 'scratch' ? 'Starting from scratch' : 'Switching templates'} will
              replace your current title, description, banner, and badges. This can’t be undone.
            </p>
            <div className="gb-confirm-actions">
              <Button variant="secondary" onClick={close}>
                Cancel
              </Button>
              <Button
                variant="primary"
                accent="#E8456B"
                onClick={() => {
                  applyTpl(pendingTemplate)
                  close()
                }}
              >
                Yes, reset
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={confirmPublish}
        onClose={() => setConfirmPublish(false)}
        variant="center"
        ariaLabel="Publish challenge?"
      >
        {({ close }) => (
          <div className="gb-confirm">
            <h3>Publish this challenge?</h3>
            <p>
              Readers will be able to find it and start travelling the board right away. You can
              still edit it after publishing.
            </p>
            <div className="gb-confirm-actions">
              <Button variant="secondary" onClick={close}>
                Keep editing
              </Button>
              <Button
                variant="primary"
                accent="#0DA7BC"
                onClick={() => {
                  setConfirmPublish(false)
                  window.alert('Prototype: the challenge would publish now. ✅')
                }}
              >
                Yes, publish
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <PrototypeNav currentHref="/bs-prototypes/gameboard/" />
    </div>
  )
}
