import { useState } from 'react'
import { Field, Input, Textarea, MultiSelect, NumberInput, DateInput } from '@components/Form/Form'
import { Toggle } from '@components/Toggle/Toggle'
import { CustomSelect } from '@components/CustomSelect/CustomSelect'
import { RichText } from '@components/RichText/RichText'
import { ImageDropzone } from '@components/ImageDropzone/ImageDropzone'
import { SettingRow } from '@components/SettingRow/SettingRow'
import { LIMITS } from '../validation'
import { GRADES, CLASSROOMS, BRANCHES, EXISTING_CHALLENGES, FAKE_UPLOAD_IMG } from '../data'
import { STEP_ICONS, StepHead, Tip, wordCount } from './shared'

const REGISTRATION_FIELDS = [
  { key: 'gender', label: 'Gender' },
  { key: 'gradeLevel', label: 'Grade Level' },
  { key: 'branch', label: 'Library Branch' },
]

// ─── Step 2 · Details ───────────────────────────────────────────────────────
export function DetailsStep({ challenge, role, updateDetails, errors = {} }) {
  const d = challenge.details
  const isSimple = role.tier === 'simple'
  const isLibrary = role.site === 'library'
  const isTemplate = role.isTemplate

  // Registration code: 5–25 chars, alphanumeric, no spaces (case-insensitive).
  const code = d.code || ''
  const codeError =
    d.requireCode && code && !/^[A-Za-z0-9]{5,25}$/.test(code)
      ? 'Codes must be 5–25 characters, alphanumeric, and contain no spaces.'
      : null

  const gradeOpts = GRADES.map((g) => ({ value: g, label: g }))
  const classOpts = CLASSROOMS.map((c) => ({ value: c, label: c }))
  const branchOpts = BRANCHES.map((b) => ({ value: b, label: b }))
  const reg = d.registration || {}

  // Libraries scope by Age or Branch; schools by Grade or Age.
  const basisOptions = isLibrary
    ? [
        { value: 'age', label: 'Age' },
        { value: 'branch', label: 'Library branch' },
      ]
    : [
        { value: 'grade', label: 'Grade' },
        { value: 'age', label: 'Age' },
      ]
  const basis = basisOptions.some((o) => o.value === d.basis) ? d.basis : basisOptions[0].value

  return (
    <section className="gb-step">
      <StepHead
        title="Details & settings"
        sub="Name your challenge, dress up its page, and set who can join."
        icon={STEP_ICONS.details}
      />

      <div className="gb-panel">
        <h3 className="gb-panel-title">Basics</h3>
        <Field
          label="Challenge name"
          required
          className="gb-w-md"
          hint={`${(d.name || '').length}/${LIMITS.name}`}
          error={errors.name}
        >
          <Input
            value={d.name}
            maxLength={LIMITS.name}
            placeholder="e.g. Maplewood Summer Reading"
            onChange={(e) => updateDetails({ name: e.target.value })}
          />
        </Field>
        <Field
          label="Challenge description"
          help="Shown on the reader's full challenge page."
          className="gb-w-lg"
        >
          <RichText
            key={challenge.templateId}
            value={d.description}
            onChange={(html) => updateDetails({ description: html })}
            placeholder="Tell your readers all about your challenge!"
            minHeight={120}
          />
        </Field>
        <Field
          className="gb-w-lg"
          label={
            <span className="gb-label-wc">
              Challenge preview card description
              <span
                className={`gb-wordcount${wordCount(d.previewDescription) > 100 ? ' is-over' : ''}`}
              >
                {wordCount(d.previewDescription)} / ~100 words
              </span>
            </span>
          }
          help="A short summary for challenge cards and previews."
        >
          <Textarea
            value={d.previewDescription}
            placeholder="A short summary for challenge cards…"
            onChange={(e) => updateDetails({ previewDescription: e.target.value })}
          />
        </Field>
        <div className="gb-date-row">
          <Field label="When does it start?">
            <DateInput value={d.start} onChange={(e) => updateDetails({ start: e.target.value })} />
          </Field>
          <Field label="When does it end?" error={errors.end}>
            <DateInput value={d.end} onChange={(e) => updateDetails({ end: e.target.value })} />
          </Field>
        </div>
        <Field label="Challenge position">
          <NumberInput
            className="gb-num-narrow"
            value={d.position || 1}
            min={1}
            max={50}
            onChange={(n) => updateDetails({ position: n })}
          />
        </Field>
      </div>

      <div className="gb-panel gb-panel--lookfeel">
        <h3 className="gb-panel-title">Look &amp; feel</h3>

        <Field label="Header image" help="Recommended 920 × 351px · JPG, PNG, or GIF · under 10MB.">
          <ImageDropzone
            fileName={d.background?.name}
            previewSrc={d.background?.loading ? undefined : d.background?.src}
            onFile={(name) => {
              // Fake the upload: show a loading state, then reveal the image.
              updateDetails({
                background: { kind: 'upload', name, src: FAKE_UPLOAD_IMG, loading: true },
              })
              setTimeout(
                () => updateDetails({ background: { kind: 'upload', name, src: FAKE_UPLOAD_IMG } }),
                1100,
              )
            }}
            onClear={() => updateDetails({ background: { kind: 'upload', name: '' } })}
          />
          {d.templateBanner && d.background?.src !== d.templateBanner && (
            <button
              type="button"
              className="gb-restore-btn"
              onClick={() =>
                updateDetails({
                  background: {
                    kind: 'upload',
                    name: 'Template banner',
                    src: d.templateBanner,
                  },
                })
              }
            >
              ↺ Restore template banner
            </button>
          )}
        </Field>
      </div>

      <div className="gb-panel">
        <h3 className="gb-panel-title">Availability</h3>
        <Field label="This challenge is available to people based on…" className="gb-w-sm">
          <CustomSelect
            value={basis}
            onChange={(v) => updateDetails({ basis: v })}
            options={basisOptions}
          />
        </Field>

        {basis === 'age' ? (
          <div className="gb-date-row">
            <Field label="For ages…">
              <NumberInput
                value={d.ageMin}
                min={0}
                max={120}
                onChange={(n) => updateDetails({ ageMin: n })}
              />
            </Field>
            <Field label="To…">
              <NumberInput
                value={d.ageMax}
                min={0}
                max={120}
                onChange={(n) => updateDetails({ ageMax: n })}
              />
            </Field>
          </div>
        ) : basis === 'branch' ? (
          <Field label="Branches" className="gb-w-md">
            <MultiSelect
              options={branchOpts}
              value={d.branches}
              onChange={(v) => updateDetails({ branches: v })}
              placeholder="All branches"
            />
          </Field>
        ) : isSimple ? (
          <Field label="Classrooms" required className="gb-w-md" error={errors.classrooms}>
            <MultiSelect
              options={classOpts}
              value={d.classrooms}
              onChange={(v) => updateDetails({ classrooms: v })}
              placeholder="Select classrooms"
            />
          </Field>
        ) : (
          <Field label="Grades" className="gb-w-md">
            <MultiSelect
              options={gradeOpts}
              value={d.grades}
              onChange={(v) => updateDetails({ grades: v })}
              placeholder="All grades"
            />
          </Field>
        )}

        {isTemplate && (
          <Field
            label="Publish to schools"
            help="District templates publish out to selected schools."
          >
            <MultiSelect
              options={[
                { value: 'maple', label: 'Maplewood Elementary' },
                { value: 'cedar', label: 'Cedar Middle' },
                { value: 'river', label: 'Riverside High' },
              ]}
              value={[]}
              onChange={() => {}}
              placeholder="Select schools"
            />
          </Field>
        )}

        {!isSimple && !isTemplate && (
          <>
            <div className="gb-settings">
              <SettingRow
                label="Only available to staff members"
                checked={d.staffOnly}
                onChange={(v) => updateDetails({ staffOnly: v })}
              />
              <SettingRow
                label="Require a code to register"
                checked={d.requireCode}
                onChange={(v) =>
                  updateDetails({ requireCode: v, ...(v ? { alternative: 'no' } : {}) })
                }
              />
              {d.requireCode && (
                <div className="gb-code-reveal">
                  <Input
                    value={d.code || ''}
                    placeholder="e.g. READ2026"
                    maxLength={25}
                    aria-invalid={!!(errors.code || codeError)}
                    onChange={(e) => updateDetails({ code: e.target.value.replace(/\s/g, '') })}
                  />
                  <p className={`gb-code-help${errors.code || codeError ? ' is-error' : ''}`}>
                    {errors.code ||
                      codeError ||
                      'Codes must be 5–25 characters, alphanumeric, and contain no spaces. Codes are not case sensitive.'}
                  </p>
                </div>
              )}
              <SettingRow
                label="Allow readers to preregister"
                checked={d.preregister}
                onChange={(v) => updateDetails({ preregister: v })}
              />
              <SettingRow
                label="Feature on your landing page"
                sub="Only published challenges will show up on your landing page."
                checked={d.featured}
                onChange={(v) => updateDetails({ featured: v })}
              />
              <SettingRow
                label="Set as an Alternative Challenge"
                sub={
                  d.requireCode
                    ? 'Unavailable while a registration code is required.'
                    : 'Readers enroll in this OR the paired challenge (which should share the same availability).'
                }
                disabled={d.requireCode}
                checked={(d.alternative || 'no') === 'yes'}
                onChange={(v) => updateDetails({ alternative: v ? 'yes' : 'no' })}
              />
              {(d.alternative || 'no') === 'yes' && !d.requireCode && (
                <div className="gb-code-reveal">
                  {EXISTING_CHALLENGES.length ? (
                    <CustomSelect
                      value={d.alternativeOf || ''}
                      onChange={(v) => updateDetails({ alternativeOf: v })}
                      placeholder="Pair with an existing challenge…"
                      options={EXISTING_CHALLENGES.map((c) => ({ value: c.id, label: c.name }))}
                    />
                  ) : (
                    <p className="gb-code-help">
                      No other challenges exist yet — create one first to pair with it.
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
        {isSimple && (
          <Tip>
            Teacher/MS view — advanced options (staff, landing, alternative challenges) are hidden.
          </Tip>
        )}
      </div>

      {!isSimple && (
        <div className="gb-panel">
          <h3 className="gb-panel-title">Required registration information</h3>
          {REGISTRATION_FIELDS.map((f) => (
            <div key={f.key} className="gb-reg-row">
              <span className="gb-reg-label">{f.label}</span>
              <div className="gb-reg-toggle">
                <Toggle
                  checked={!!reg[f.key]}
                  size="md"
                  onChange={(v) => updateDetails({ registration: { ...reg, [f.key]: v } })}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// In a points challenge, reading/activities/reviews all convert to points, so
// they don't get their own badges. We explain that instead of warning about it,
// and tuck the "use separate logging/review badges" escape hatch into Advanced.
function PointsEarning({ methods, setMethod }) {
  const [advanced, setAdvanced] = useState(!!(methods.log || methods.reviews))
  return (
    <>
      <p className="gb-method-note">
        In a points challenge,{' '}
        <strong>reading, activities, and reviews all convert into points</strong> — point values are
        configured once in your site's points settings. Readers unlock <strong>point badges</strong>{' '}
        at the milestones you choose.
      </p>
      <Toggle checked={!!methods.activities} onChange={(v) => setMethod('activities', v)} size="md">
        Add optional activity badges
        <span className="gb-muted"> — earned by finishing specific activities</span>
      </Toggle>
      <button
        type="button"
        className="gb-advanced-toggle"
        aria-expanded={advanced}
        onClick={() => setAdvanced((a) => !a)}
      >
        {advanced ? '−' : '+'} Advanced: use separate logging &amp; review badges
      </button>
      {advanced && (
        <div className="gb-method-toggles gb-method-toggles--nested">
          <p className="gb-method-note gb-method-note--sm">
            Most points challenges don't need these — reading and reviews already earn points. Turn
            these on only if you also want stand-alone badges for them.
          </p>
          <Toggle checked={!!methods.log} onChange={(v) => setMethod('log', v)} size="md">
            Separate logging badges
          </Toggle>
          <Toggle checked={!!methods.reviews} onChange={(v) => setMethod('reviews', v)} size="md">
            Separate review badges
          </Toggle>
        </div>
      )}
    </>
  )
}
