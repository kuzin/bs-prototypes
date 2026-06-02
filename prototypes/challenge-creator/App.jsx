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
  blankChallenge,
  applyTemplate,
  withLogMilestones,
} from './data'
import { validateStep, firstInvalidStep } from './validation'
import { TypeStep } from './steps/TypeStep'
import { DetailsStep, BadgesStep, SetupStep, RewardsStep, CompletionStep } from './steps/StepStubs'
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
  return (
    <div className="cc-devseg">
      <Seg
        label="Mode"
        value={mode}
        onChange={onMode}
        options={MODES.map((m) => ({
          value: m.id,
          title: `Mode: ${m.name}`,
          icon: MODE_ICON[m.id],
        }))}
      />
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
  const [stepId, setStepId] = useState(saved?.stepId ?? 'type')
  const [previewOpen, setPreviewOpen] = useState(saved?.previewOpen ?? true)
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false)
  const [saveState, setSaveState] = useState('saved')
  // `dirty` = the user has customized since the last template/scratch pick.
  const [dirty, setDirty] = useState(false)
  const [pendingTemplate, setPendingTemplate] = useState(null)
  const [pendingType, setPendingType] = useState(null)

  const firstRun = useRef(true)
  const saveTimer = useRef(null)

  const role = getRole(mode, roleId)
  const type = getType(challenge.typeId)
  const steps = useMemo(() => getSteps({ mode, role, type }), [mode, role, type])

  // Keep the current step valid when the visible steps change (type/role/mode).
  useEffect(() => {
    if (!steps.find((s) => s.id === stepId)) setStepId(steps[0].id)
  }, [steps, stepId])

  // Persist (draft + dev settings) and drive the autosave indicator.
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify({ mode, roleId, challenge, stepId, previewOpen }))
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    setSaveState('saving')
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => setSaveState('saved'), 650)
    return () => clearTimeout(saveTimer.current)
  }, [mode, roleId, challenge, stepId, previewOpen])

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

  const idx = steps.findIndex((s) => s.id === stepId)
  const isLast = idx === steps.length - 1

  // ── Validation: errors show inline; Next is disabled until the step is valid ──
  const stepErrors = useMemo(
    () => validateStep(stepId, challenge, { role, type }),
    [stepId, challenge, role, type],
  )
  const stepValid = Object.keys(stepErrors).length === 0

  const goNext = () => {
    if (!isLast && stepValid) setStepId(steps[idx + 1].id)
  }
  const goPrev = () => idx > 0 && setStepId(steps[idx - 1].id)
  const publish = () => {
    const bad = firstInvalidStep(steps, challenge, { role, type })
    if (bad) {
      setStepId(bad)
      return
    }
    window.alert('Prototype: the challenge would publish now. ✅')
  }
  // Preview: split-pane toggle on desktop, full-screen modal on mobile.
  const togglePreview = () => {
    if (window.matchMedia('(max-width: 900px)').matches) setMobilePreviewOpen(true)
    else setPreviewOpen((v) => !v)
  }

  const titleVerb = mode === 'template' ? 'Create a template' : 'Create a challenge'
  // A single title that becomes more specific as the challenge takes shape:
  // "Create a challenge" → the chosen type → the named title (each replaces the last).
  const headerTitle =
    challenge.details.name?.trim() || (stepId !== 'type' && type ? type.name : titleVerb)
  // The preview pane is mounted on every step past Type, and slides in/out via a
  // CSS class so it animates cohesively with the side tab (instead of popping).
  const showPreview = stepId !== 'type'
  // Preview backdrop = the challenge accent, a touch darker, so the mock pops;
  // the header bar sits a shade darker still.
  const accent = challenge.details.accent || '#0DA7BC'
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
          <Button variant="primary" size="sm" accent="#0DA7BC" onClick={publish}>
            Publish
          </Button>
        </div>
      </header>

      <div className="cc-stepbar">
        <Stepper steps={steps} current={stepId} onStep={setStepId} accent={type?.accent} />
      </div>

      <div className="cc-main">
        <main className="cc-form">
          <div className="cc-form-inner">
            {stepId === 'type' && (
              <TypeStep
                types={getTypesForRole(role)}
                value={challenge.typeId}
                onSelect={selectType}
              />
            )}
            {stepId === 'details' && (
              <DetailsStep
                challenge={challenge}
                role={role}
                type={type}
                updateDetails={updateDetails}
                onTemplate={chooseTemplate}
                errors={stepErrors}
              />
            )}
            {stepId === 'badges' && (
              <BadgesStep
                challenge={challenge}
                role={role}
                type={type}
                update={update}
                errors={stepErrors}
              />
            )}
            {stepId === 'setup' && <SetupStep challenge={challenge} type={type} update={update} />}
            {stepId === 'rewards' && <RewardsStep challenge={challenge} update={update} />}
            {stepId === 'completion' && <CompletionStep challenge={challenge} update={update} />}
          </div>

          <div className="cc-form-footer">
            <Button variant="secondary" onClick={goPrev} disabled={idx === 0}>
              Back
            </Button>
            <div className="cc-footer-right">
              {stepId !== 'type' && (
                <IconButton
                  className="cc-preview-icon-btn"
                  onClick={togglePreview}
                  aria-label="Preview"
                >
                  <Icon name="eye" size={16} />
                </IconButton>
              )}
              {isLast ? (
                <Button variant="primary" accent="#0DA7BC" onClick={publish}>
                  Publish challenge
                </Button>
              ) : (
                <Button
                  variant="primary"
                  accent={type?.accent || '#0DA7BC'}
                  onClick={goNext}
                  disabled={!stepValid}
                >
                  Next: {steps[idx + 1]?.name}
                </Button>
              )}
            </div>
          </div>
        </main>

        {/* Desktop-only handle to open/close the live preview (mobile uses the
            footer button → modal). Sits on the preview's left edge when open,
            and on the screen's right edge when collapsed. */}
        {stepId !== 'type' && (
          <button
            type="button"
            className={`cc-preview-tab${previewOpen ? ' is-open' : ''}`}
            onClick={() => setPreviewOpen((v) => !v)}
            aria-label={previewOpen ? 'Hide challenge preview' : 'Show challenge preview'}
            aria-expanded={previewOpen}
            title={previewOpen ? 'Hide preview' : 'Show preview'}
          >
            <Icon className="cc-preview-tab-chev" name="chevron-left" size={18} stroke={2.2} />
            <span className="cc-preview-tab-label">Preview</span>
          </button>
        )}
        {showPreview && (
          <aside className={`cc-preview${previewOpen ? '' : ' is-collapsed'}`}>
            <div className="cc-preview-frame" style={{ background: previewBg }}>
              <Preview challenge={challenge} />
            </div>
          </aside>
        )}
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
        open={mobilePreviewOpen}
        onClose={() => setMobilePreviewOpen(false)}
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
