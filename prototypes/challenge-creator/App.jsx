import { useState, useEffect, useMemo, useRef } from 'react'
import { Button } from '@components/Button/Button'
import { IconButton } from '@components/Primitives/Primitives'
import { Toggle } from '@components/Toggle/Toggle'
import { Stepper } from '@components/Stepper/Stepper'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { Modal } from '@components/Modal/Modal'
import { Icon } from '@components/Icon/Icon'
import '@components/Button/Button.css'
import '@components/Toggle/Toggle.css'

import {
  MODES,
  getRoles,
  getRole,
  getTypesForRole,
  getType,
  getSteps,
  getScreens,
  blankChallenge,
  applyTemplate,
  withLogMilestones,
} from './data'
import { validateStep, firstInvalidStep, phaseOf } from './validation'
import { TypeStep } from './steps/TypeStep'
import { DetailsStep, BadgesStep, SetupStep, RewardsStep, CompletionStep } from './steps/StepStubs'
import { Confetti } from '@components/Confetti/Confetti'
import { ReviewStep } from './steps/ReviewStep'
import { badgePoolOf } from './steps/shared'
import { Preview } from './Preview'
import './index.css'

const LS_KEY = 'cc-v2'
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
  const blank = blankChallenge(c?.typeId || 'logging')
  const merged = {
    ...blank,
    ...c,
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
    bookTalks: { ...blank.bookTalks, ...c?.bookTalks },
  }
  // Logging challenges: backfill any logging badge missing a log value (older
  // drafts saved template badges without one).
  if (getType(merged.typeId)?.primaryMethod === 'log' && merged.badges?.length) {
    merged.badges = withLogMilestones(merged.badges)
  }
  return merged
}

// ── Dev/preview controls (NOT real product controls) ──
// Small icon segmented controls centered in the header: Mode + View-as role.
const MODE_ICON = {
  // Challenge = a flag/goal; Template = stacked layers.
  challenge: <Icon name="flag" size={15} />,
  template: <Icon name="layers" size={15} />,
}
const ROLE_ICON = {
  // Teacher = school; School admin = building; Librarian = book;
  // District = multiple buildings.
  teacher: <Icon name="school" size={15} />,
  msplus: <Icon name="building" size={15} />,
  librarian: <Icon name="book" size={15} />,
  district: <Icon name="building-community" size={15} />,
}
function Seg({ value, onChange, options, label }) {
  return (
    <div className="cc-seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={`cc-seg-btn${value === o.value ? ' is-on' : ''}`}
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          aria-label={o.title}
          data-tip={o.title}
        >
          {o.icon}
        </button>
      ))}
    </div>
  )
}
function DevControls({ mode, roleId, onMode, onRole }) {
  const roles = getRoles(mode)
  // Template-creation mode is hidden for now (to be rebuilt later); only show the
  // Mode switcher if more than one mode remains.
  const modeOptions = MODES.filter((m) => m.id !== 'template')
  return (
    <div className="cc-devseg">
      {modeOptions.length > 1 && (
        <Seg
          label="Mode"
          value={mode}
          onChange={onMode}
          options={modeOptions.map((m) => ({
            value: m.id,
            title: `Mode: ${m.name}`,
            icon: MODE_ICON[m.id],
          }))}
        />
      )}
      <Seg
        label="View as"
        value={roleId}
        onChange={onRole}
        options={roles.map((r) => ({
          value: r.id,
          title: `View as ${r.name}`,
          icon: ROLE_ICON[r.id],
        }))}
      />
    </div>
  )
}

function SaveStatus({ state }) {
  return (
    <span className={`cc-save cc-save--${state}`} aria-live="polite">
      {state === 'saving' ? (
        <>
          <span className="cc-save-spin" /> Saving…
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
  const [mode, setMode] = useState(saved?.mode ?? 'challenge')
  const [roleId, setRoleId] = useState(saved?.roleId ?? getRoles(mode)[0].id)
  const [challenge, setChallenge] = useState(
    saved?.challenge ? normalizeChallenge(saved.challenge) : blankChallenge('logging'),
  )
  const [screenId, setScreenId] = useState(saved?.screenId ?? 'type')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [saveState, setSaveState] = useState('saved')
  // `dirty` = the user has customized since the last template/scratch pick.
  const [dirty, setDirty] = useState(false)
  const [pendingTemplate, setPendingTemplate] = useState(null)
  const [pendingType, setPendingType] = useState(null)
  const [confirmPublish, setConfirmPublish] = useState(false)
  // The payoff: set once the challenge is published, so the walk-through ends on
  // a celebration instead of a dialog quietly closing.
  const [published, setPublished] = useState(false)

  const firstRun = useRef(true)
  const saveTimer = useRef(null)

  const role = getRole(mode, roleId)
  const type = getType(challenge.typeId)
  // Phases = the top rail (Type · Details · Badges · … · Review). Screens = the
  // walk-through itself: one decision each, Back/Next stepping through them.
  const phases = useMemo(() => getSteps({ mode, role, type }), [mode, role, type])
  const screens = useMemo(
    () => getScreens({ mode, role, type, challenge }),
    [mode, role, type, challenge],
  )

  // Keep the current screen valid when the visible screens change (a type or
  // role switch, or a badge method toggled off).
  useEffect(() => {
    if (!screens.find((s) => s.id === screenId)) setScreenId(screens[0].id)
  }, [screens, screenId])

  // Persist (draft + dev settings) and drive the autosave indicator.
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify({ mode, roleId, challenge, screenId }))
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    setSaveState('saving')
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => setSaveState('saved'), 650)
    return () => clearTimeout(saveTimer.current)
  }, [mode, roleId, challenge, screenId])

  const changeMode = (m) => {
    setMode(m)
    setRoleId(getRoles(m)[0].id)
  }

  // Any user edit marks the draft dirty (so we can warn before a reset).
  const update = (patch) => {
    setDirty(true)
    setChallenge((c) => ({ ...c, ...patch }))
  }
  const updateDetails = (patch) => {
    setDirty(true)
    setChallenge((c) => ({ ...c, details: { ...c.details, ...patch } }))
  }

  // Selecting a type = a truly-blank challenge of that type (keep the typed name).
  const applyType = (typeId) => {
    setChallenge((c) => {
      const blank = blankChallenge(typeId)
      return { ...blank, details: { ...blank.details, name: c.details.name } }
    })
    setDirty(false)
  }
  // Changing the type wipes the challenge — confirm first if the user has edits.
  const selectType = (typeId) => {
    if (typeId === challenge.typeId) return
    if (dirty) setPendingType(typeId)
    else applyType(typeId)
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

  const idx = Math.max(
    0,
    screens.findIndex((s) => s.id === screenId),
  )
  const screen = screens[idx]
  const isLast = idx === screens.length - 1
  const phaseId = screen?.phase ?? phaseOf(screenId)
  // How far through the current phase we are, so the rail's connector fills as
  // a real progress bar instead of jumping a whole step at a time.
  const inPhase = screens.filter((s) => s.phase === phaseId)
  const phaseProgress = inPhase.findIndex((s) => s.id === screenId) / inPhase.length
  // Jumping via the rail lands on a phase's first screen.
  const goPhase = (id) => setScreenId(screens.find((s) => s.phase === id)?.id ?? id)

  // ── Validation ──
  // Errors are computed continuously, but only *revealed* once the user has
  // attempted to move on (Next / Publish) from a given step. Before that a step
  // shows required-field markers but no red errors — so you never land on a
  // fresh step that's already shouting at you. Once revealed, errors clear live
  // as you fix them.
  const [revealed, setRevealed] = useState({})
  const formRef = useRef(null)

  const stepErrors = useMemo(
    () => validateStep(screenId, challenge, { role, type }),
    [screenId, challenge, role, type],
  )
  const stepValid = Object.keys(stepErrors).length === 0
  const visibleErrors = revealed[screenId] ? stepErrors : {}

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
      revealStep(screenId)
      focusFirstError()
      return
    }
    setScreenId(screens[idx + 1].id)
  }
  const goPrev = () => idx > 0 && setScreenId(screens[idx - 1].id)
  // Publishing is a deliberate step: validate first, then confirm.
  const publish = () => {
    const bad = firstInvalidStep(screens, challenge, { role, type })
    if (bad) {
      setScreenId(bad)
      revealStep(bad)
      focusFirstError()
      return
    }
    setConfirmPublish(true)
  }
  const doPublish = () => {
    setConfirmPublish(false)
    setPublished(true)
  }
  // A walk-through always starts a screen at its heading — never mid-page from
  // wherever the previous one was scrolled to. (.cc-form-inner is the scroller.)
  useEffect(() => {
    formRef.current?.querySelector('.cc-form-inner')?.scrollTo({ top: 0 })
  }, [screenId])

  // Preview opens as an overlay from the footer's eye button.
  const openPreview = () => setPreviewOpen(true)

  const titleVerb = mode === 'template' ? 'Create a template' : 'Create a challenge'
  // A single title that becomes more specific as the challenge takes shape:
  // "Create a challenge" → the chosen type → the named title (each replaces the last).
  const headerTitle =
    challenge.details.name?.trim() || (screenId !== 'type' && type ? type.name : titleVerb)
  // Preview backdrop = the challenge accent, a touch darker, so the mock pops;
  // the header bar sits a shade darker still.
  const accent = challenge.details.accent || '#0CA7BC'
  const previewBg = `color-mix(in srgb, ${accent} 85%, #000)`

  return (
    <div className="cc-root">
      <header className="cc-topbar">
        <div className="cc-topbar-left">
          <a className="cc-exit" href="/bs-prototypes/" title="Back to prototypes">
            ←
          </a>
          <span className="cc-title" key={headerTitle}>
            {headerTitle}
          </span>
          <span className="cc-status">Draft</span>
          <SaveStatus state={saveState} />
        </div>
        <div className="cc-topbar-center">
          <DevControls mode={mode} roleId={roleId} onMode={changeMode} onRole={setRoleId} />
        </div>
        <div className="cc-topbar-right">
          <Button variant="ghost" size="sm">
            Save &amp; exit
          </Button>
          <Button variant="primary" size="sm" accent="#0CA7BC" onClick={publish}>
            Publish
          </Button>
        </div>
      </header>

      <div className="cc-stepbar">
        <Stepper
          steps={phases}
          current={phaseId}
          onStep={goPhase}
          accent={type?.accent}
          progress={phaseProgress}
        />
      </div>

      <div className="cc-main">
        <main className="cc-form" ref={formRef}>
          <div className="cc-form-inner">
            {phaseId === 'type' && (
              <TypeStep
                types={getTypesForRole(role)}
                value={challenge.typeId}
                onSelect={selectType}
              />
            )}
            {phaseId === 'details' && (
              <DetailsStep
                screen={screenId}
                challenge={challenge}
                role={role}
                type={type}
                updateDetails={updateDetails}
                onTemplate={chooseTemplate}
                errors={visibleErrors}
              />
            )}
            {phaseId === 'badges' && (
              <BadgesStep
                screen={screenId}
                challenge={challenge}
                role={role}
                type={type}
                update={update}
                errors={visibleErrors}
              />
            )}
            {phaseId === 'setup' && <SetupStep challenge={challenge} type={type} update={update} />}
            {phaseId === 'rewards' && (
              <RewardsStep screen={screenId} challenge={challenge} update={update} />
            )}
            {phaseId === 'completion' && <CompletionStep challenge={challenge} update={update} />}
            {phaseId === 'review' && (
              <ReviewStep
                challenge={challenge}
                role={role}
                type={type}
                screens={screens}
                phases={phases}
                onEdit={setScreenId}
              />
            )}
          </div>

          <div className="cc-form-footer">
            <Button variant="secondary" onClick={goPrev} disabled={idx === 0}>
              Back
            </Button>
            <div className="cc-footer-right">
              {screenId !== 'type' && (
                <IconButton
                  className="cc-preview-icon-btn"
                  onClick={openPreview}
                  aria-label="Preview"
                >
                  <Icon name="eye" size={16} />
                </IconButton>
              )}
              {isLast ? (
                <Button variant="primary" accent="#0CA7BC" onClick={publish}>
                  Publish challenge
                </Button>
              ) : (
                <Button variant="primary" accent={type?.accent || '#0CA7BC'} onClick={goNext}>
                  Next: {screens[idx + 1]?.name}
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
          <div className="cc-confirm">
            <h3>Reset your customizations?</h3>
            <p>
              {pendingTemplate === 'scratch' ? 'Starting from scratch' : 'Switching templates'} will
              replace your current title, description, banner, and badges. This can’t be undone.
            </p>
            <div className="cc-confirm-actions">
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
        open={pendingType !== null}
        onClose={() => setPendingType(null)}
        variant="center"
        ariaLabel="Change challenge type?"
      >
        {({ close }) => (
          <div className="cc-confirm">
            <h3>Change the challenge type?</h3>
            <p>
              Changing the type resets this challenge — your details, badges, and settings will be
              cleared (your name is kept). This can’t be undone.
            </p>
            <div className="cc-confirm-actions">
              <Button variant="secondary" onClick={close}>
                Cancel
              </Button>
              <Button
                variant="primary"
                accent="#E8456B"
                onClick={() => {
                  applyType(pendingType)
                  close()
                }}
              >
                Yes, change type
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
          <div className="cc-confirm">
            <h3>Publish this {mode === 'template' ? 'template' : 'challenge'}?</h3>
            <p>
              {mode === 'template'
                ? 'Schools will be able to find and run this template.'
                : 'Readers will be able to find and join it right away.'}{' '}
              You can still edit it after publishing.
            </p>
            <div className="cc-confirm-actions">
              <Button variant="secondary" onClick={close}>
                Keep editing
              </Button>
              <Button variant="primary" accent="#0CA7BC" onClick={doPublish}>
                Yes, publish
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={published}
        onClose={() => setPublished(false)}
        variant="center"
        ariaLabel="Challenge published"
      >
        {({ close }) => (
          <div className="cc-published">
            <Confetti count={18} distance={360} duration={2.4} />
            <div className="cc-published-inner">
              <span className="cc-published-mark" style={{ background: accent }}>
                <Icon name="check" size={30} stroke={2.6} />
              </span>
              <h3 className="cc-published-title">It’s live!</h3>
              <p className="cc-published-name">{challenge.details.name?.trim()}</p>
              <p className="cc-published-sub">
                {badgePoolOf(challenge).length} badges are waiting for your readers
                {mode === 'template'
                  ? '. Schools can find and run it now.'
                  : '. They can find and join it right now.'}
              </p>
              <div className="cc-published-actions">
                <Button variant="secondary" onClick={close}>
                  Keep editing
                </Button>
                <Button variant="primary" accent="#0CA7BC" onClick={close}>
                  View challenge
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        variant="center"
        ariaLabel="Challenge preview"
      >
        {({ close }) => (
          <div className="cc-mobile-preview">
            <div className="modal-header">
              <div className="modal-header-text">
                <h3 className="modal-title">Challenge preview</h3>
              </div>
              <IconButton
                variant="ghost"
                size="sm"
                onClick={close}
                aria-label="Close preview"
                className="modal-close"
              >
                <Icon name="x" size={18} />
              </IconButton>
            </div>
            <div className="cc-preview-frame" style={{ background: previewBg }}>
              <Preview challenge={challenge} />
            </div>
          </div>
        )}
      </Modal>

      <PrototypeNav currentHref="/bs-prototypes/challenge-creator/" />
    </div>
  )
}
