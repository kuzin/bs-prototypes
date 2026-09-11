import { useState, useEffect } from 'react'
import {
  Field,
  Input,
  Textarea,
  MultiSelect,
  NumberInput,
  ColorInput,
  DateInput,
  RangeSlider,
} from '@components/Form/Form'
import { Toggle } from '@components/Toggle/Toggle'
import { CustomSelect } from '@components/CustomSelect/CustomSelect'
import { Tabs } from '@components/Tabs/Tabs'
import { RichText } from '@components/RichText/RichText'
import { ImageDropzone } from '@components/ImageDropzone/ImageDropzone'
import { Banner } from '@components/Primitives/Primitives'
import { SettingRow } from '@components/SettingRow/SettingRow'
import { Icon } from '@components/Icon/Icon'
import { LIMITS } from '../validation'
import {
  BANNER_THEMES,
  themeBadges,
  GRADES,
  CLASSROOMS,
  BRANCHES,
  GOOGLE_FONTS,
  EXISTING_CHALLENGES,
  TEMPLATE_PRESETS,
  getBannerTheme,
  fontStack,
  loadFont,
  bannerStyle,
  getTemplatesForType,
  FAKE_UPLOAD_IMG,
} from '../data'
import { StepHead, Screen, MoreOptions, Tip, ColorPicker, thumbStyle, wordCount } from './shared'

const REGISTRATION_FIELDS = [
  { key: 'gender', label: 'Gender' },
  { key: 'gradeLevel', label: 'Grade Level' },
  { key: 'branch', label: 'Library Branch' },
]

// ─── Details phase · one screen per decision ────────────────────────────────
// The heading *is* the question the screen asks. Anything rare (challenge
// position, registration fields) hides behind <MoreOptions> instead of taking
// up a stop of its own.
const HEADS = {
  'details.template': {
    title: 'Start from a template',
    sub: 'Pick a ready-made challenge to build on — or start from scratch and make it yours.',
  },
  'details.basics': {
    title: 'Name your challenge',
    sub: 'This is what readers see on their dashboard, so make it inviting.',
  },
  'details.dates': {
    title: 'When does it run?',
    sub: 'Readers can join and log inside this window.',
  },
  'details.look': {
    title: 'Give it a look',
    sub: 'The banner and colors readers see at the top of the challenge.',
  },
  'details.audience': {
    title: 'Who’s it for?',
    sub: 'Choose who can see this challenge and sign up for it.',
  },
}

export function DetailsStep({ screen, challenge, role, updateDetails, onTemplate, errors = {} }) {
  const d = challenge.details
  const templates = [
    { id: 'scratch', name: 'Start from scratch', blurb: 'A blank challenge you build yourself.' },
    ...getTemplatesForType(challenge.typeId),
  ]
  const isSimple = role.tier === 'simple'
  const isLibrary = role.site === 'library'
  const isTemplate = role.isTemplate
  const bgUploaded = d.background?.kind === 'upload'

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
  // A collapsed disclosure must never hide a setting someone already changed —
  // or an error they need to fix.
  const advancedInUse =
    !!d.staffOnly ||
    !!d.requireCode ||
    !!d.featured ||
    (d.alternative || 'no') === 'yes' ||
    Object.values(reg).some(Boolean) ||
    !!errors.code

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

  // Banner theme category + its variants; header font loads on demand. Templates
  // declare their own theme (their banner isn't a banner-variant id), so prefer
  // that instead of falling back to the first theme.
  const themeId = TEMPLATE_PRESETS[challenge.templateId]?.theme || getBannerTheme(d.background?.id)
  const themeVariants = BANNER_THEMES.find((t) => t.id === themeId)?.variants || []
  useEffect(() => {
    loadFont(d.headerFont)
  }, [d.headerFont])
  // Load every family so each option in the font dropdown renders in its own face.
  useEffect(() => {
    GOOGLE_FONTS.forEach((f) => loadFont(f.name))
  }, [])

  const heads = HEADS[screen] || HEADS['details.basics']

  return (
    <Screen>
      <StepHead title={heads.title} sub={heads.sub} />

      {screen === 'details.template' && (
        <div className="cc-panel">
          <div className="cc-gallery">
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`cc-gallery-card${challenge.templateId === t.id ? ' is-on' : ''}`}
                onClick={() => onTemplate(t.id)}
              >
                <span
                  className="cc-gallery-thumb"
                  style={t.id === 'scratch' ? { background: '#f1f5f9' } : thumbStyle(t.id)}
                >
                  {t.id === 'scratch' && <span className="cc-gallery-plus">+</span>}
                </span>
                <span className="cc-gallery-name">{t.name}</span>
                <span className="cc-gallery-blurb">{t.blurb}</span>
              </button>
            ))}
          </div>
          <Banner level="info" className="cc-template-banner">
            Looking for a challenge template that isn’t listed here?{' '}
            <a href="#" className="cc-link" onClick={(e) => e.preventDefault()}>
              Visit the template browser
            </a>
            .
          </Banner>
        </div>
      )}

      {screen === 'details.basics' && (
        <div className="cc-panel">
          <Field label="Name" required className="cc-w-md" error={errors.name}>
            <Input
              value={d.name}
              maxLength={LIMITS.name}
              placeholder="e.g. Maplewood Summer Reading"
              onChange={(e) => updateDetails({ name: e.target.value })}
            />
          </Field>
          <Field
            label="Description"
            help="What readers see on the challenge page. A sentence or two is plenty."
            className="cc-w-lg"
          >
            <RichText
              key={challenge.templateId}
              value={d.description}
              onChange={(html) => updateDetails({ description: html })}
              placeholder="Tell your readers all about your challenge!"
              minHeight={120}
            />
          </Field>
          <MoreOptions
            hint="Short summary for challenge cards"
            defaultOpen={!!d.previewDescription}
          >
            <Field
              className="cc-w-lg"
              label={
                <span className="cc-label-wc">
                  Short summary
                  <span
                    className={`cc-wordcount${wordCount(d.previewDescription) > 100 ? ' is-over' : ''}`}
                  >
                    {wordCount(d.previewDescription)} / ~100 words
                  </span>
                </span>
              }
              help="Used on challenge cards and previews. Leave it blank to use the description."
            >
              <Textarea
                value={d.previewDescription}
                placeholder="A short summary for challenge cards…"
                onChange={(e) => updateDetails({ previewDescription: e.target.value })}
              />
            </Field>
          </MoreOptions>
        </div>
      )}

      {screen === 'details.dates' && (
        <div className="cc-panel">
          <div className="cc-date-row">
            <Field label="When does it start?">
              <DateInput
                value={d.start}
                onChange={(e) => updateDetails({ start: e.target.value })}
              />
            </Field>
            <Field label="When does it end?" error={errors.end}>
              <DateInput value={d.end} onChange={(e) => updateDetails({ end: e.target.value })} />
            </Field>
          </div>
          <MoreOptions hint="Challenge position" defaultOpen={(d.position || 1) !== 1}>
            <Field label="Challenge position">
              <NumberInput
                className="cc-num-narrow"
                value={d.position || 1}
                min={1}
                max={50}
                onChange={(n) => updateDetails({ position: n })}
              />
            </Field>
          </MoreOptions>
        </div>
      )}

      {screen === 'details.look' && (
        <div className="cc-panel cc-panel--lookfeel">
          <div style={{ marginBottom: 20 }}>
            <Tabs
              accent="#0DA7BC"
              active={bgUploaded ? 'upload' : 'theme'}
              onChange={(id) => {
                if (id === 'theme' && bgUploaded) {
                  const variant = BANNER_THEMES[0].variants[0]
                  updateDetails({
                    background: { kind: 'preset', id: variant.id },
                    accent: variant.color,
                  })
                } else if (id === 'upload' && !bgUploaded) {
                  updateDetails({
                    background: { kind: 'upload', name: d.background?.name || 'header.jpg' },
                  })
                }
              }}
              items={[
                {
                  id: 'theme',
                  label: 'Use a theme',
                  icon: <Icon name="palette" size={18} />,
                  disabled: challenge.templateId !== 'scratch',
                  title:
                    challenge.templateId !== 'scratch'
                      ? 'This template uses its own banner. Start from scratch to use a theme.'
                      : undefined,
                },
                { id: 'upload', label: 'Upload an image', icon: <Icon name="photo" size={18} /> },
              ]}
            />
          </div>

          {bgUploaded ? (
            <>
              <Field
                label="Header image"
                help="Recommended 920 × 351px · JPG, PNG, or GIF · under 10MB."
              >
                <ImageDropzone
                  fileName={d.background?.name}
                  previewSrc={d.background?.loading ? undefined : d.background?.src}
                  onFile={(name) => {
                    // Fake the upload: show a loading state, then reveal the image.
                    updateDetails({
                      background: { kind: 'upload', name, src: FAKE_UPLOAD_IMG, loading: true },
                    })
                    setTimeout(
                      () =>
                        updateDetails({
                          background: { kind: 'upload', name, src: FAKE_UPLOAD_IMG },
                        }),
                      1100,
                    )
                  }}
                  onClear={() => updateDetails({ background: { kind: 'upload', name: '' } })}
                />
                {d.templateBanner && d.background?.src !== d.templateBanner && (
                  <button
                    type="button"
                    className="cc-restore-btn"
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
              <Field label="Accent color" className="cc-w-sm">
                <ColorInput value={d.accent} onChange={(v) => updateDetails({ accent: v })} />
              </Field>
            </>
          ) : (
            <>
              <div className="cc-lookfeel-row">
                {challenge.templateId === 'scratch' && (
                  <Field label="Theme">
                    <CustomSelect
                      value={themeId}
                      onChange={(id) => {
                        const first = BANNER_THEMES.find((t) => t.id === id)?.variants[0]
                        if (first)
                          updateDetails({
                            background: { kind: 'preset', id: first.id },
                            accent: first.color,
                            accentOverride: false,
                          })
                      }}
                      options={BANNER_THEMES.map((t) => {
                        // Badge-style preview: the theme's first themed medallion in
                        // its default color, so you can see the scheme before picking.
                        const sample = themeBadges(t.id)[0]?.img
                        return {
                          value: t.id,
                          label: (
                            <span className="cc-theme-opt">
                              <span
                                className="cc-theme-opt-badge"
                                style={{ '--c': t.variants[0]?.color }}
                              >
                                {sample && <img src={sample} alt="" />}
                              </span>
                              {t.name}
                            </span>
                          ),
                        }
                      })}
                    />
                  </Field>
                )}
                <Field label="Header font">
                  <CustomSelect
                    value={d.headerFont}
                    onChange={(v) => {
                      loadFont(v)
                      updateDetails({ headerFont: v })
                    }}
                    options={GOOGLE_FONTS.map((f) => ({
                      value: f.name,
                      label: <span style={{ fontFamily: fontStack(f.name) }}>{f.name}</span>,
                    }))}
                  />
                </Field>
              </div>
              <Field label="Banner variation">
                <div className="cc-banner-grid">
                  {themeVariants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      className={`cc-banner-thumb${d.background?.id === v.id ? ' is-on' : ''}`}
                      style={bannerStyle(v.id)}
                      aria-label={`Banner variation`}
                      onClick={() =>
                        updateDetails({
                          background: { kind: 'preset', id: v.id },
                          // Accent tracks the variation unless the reader overrode it.
                          ...(d.accentOverride ? {} : { accent: v.color }),
                        })
                      }
                    >
                      {d.background?.id === v.id && (
                        <span className="cc-banner-check" aria-hidden="true">
                          <Icon name="check" size={13} stroke={3.4} color="#fff" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </Field>
              <div className="cc-settings cc-color-settings">
                {(() => {
                  const colorsOn = !!d.accentOverride || !!d.fontColorOverride
                  return (
                    <>
                      <div className="cc-setting-row">
                        <div className="cc-setting-text">
                          <span className="cc-setting-label">Override theme colors</span>
                        </div>
                        <Toggle
                          checked={colorsOn}
                          size="md"
                          onChange={(v) =>
                            updateDetails({
                              accentOverride: v,
                              fontColorOverride: v,
                              ...(v && !d.fontColor ? { fontColor: '#FFFFFF' } : {}),
                            })
                          }
                        />
                      </div>
                      {colorsOn && (
                        <div className="cc-color-reveal cc-color-merged">
                          <div className="cc-color-field">
                            <span className="cc-color-field-label">Accent</span>
                            <ColorPicker
                              value={d.accent}
                              presets={themeVariants.map((v) => v.color)}
                              fallback={d.accent || '#0DA7BC'}
                              onColor={(c) => updateDetails({ accent: c })}
                            />
                          </div>
                          <div className="cc-color-field">
                            <span className="cc-color-field-label">Title</span>
                            <ColorPicker
                              value={d.fontColor}
                              presets={['#FFFFFF', '#0F172A', d.accent || '#0DA7BC']}
                              fallback="#FFFFFF"
                              onColor={(c) => updateDetails({ fontColor: c })}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )
                })()}
                <div className="cc-setting-row">
                  <div className="cc-setting-text">
                    <span className="cc-setting-label">Customize title size</span>
                  </div>
                  <Toggle
                    checked={!!d.titleSizeOn}
                    size="md"
                    onChange={(v) => updateDetails({ titleSizeOn: v })}
                  />
                </div>
                {d.titleSizeOn && (
                  <div className="cc-color-reveal">
                    <RangeSlider
                      min={0.6}
                      max={1.4}
                      step={0.05}
                      value={d.headerFontSize ?? 1}
                      showValue={false}
                      onChange={(v) => updateDetails({ headerFontSize: v })}
                    />
                  </div>
                )}
                <div className="cc-setting-row">
                  <div className="cc-setting-text">
                    <span className="cc-setting-label">Show a subheader ribbon</span>
                  </div>
                  <Toggle
                    checked={!!d.subheader?.enabled}
                    size="md"
                    onChange={(v) => updateDetails({ subheader: { ...d.subheader, enabled: v } })}
                  />
                </div>
                {d.subheader?.enabled && (
                  <div className="cc-color-reveal cc-ribbon-reveal">
                    <Field label="Ribbon text">
                      <Input
                        value={d.subheader?.text || ''}
                        placeholder="Reading Challenge"
                        maxLength={28}
                        onChange={(e) =>
                          updateDetails({ subheader: { ...d.subheader, text: e.target.value } })
                        }
                      />
                    </Field>
                    <Field label="Ribbon font">
                      <CustomSelect
                        value={d.subheader?.font || d.headerFont}
                        onChange={(v) => {
                          loadFont(v)
                          updateDetails({ subheader: { ...d.subheader, font: v } })
                        }}
                        options={GOOGLE_FONTS.map((f) => ({
                          value: f.name,
                          label: <span style={{ fontFamily: fontStack(f.name) }}>{f.name}</span>,
                        }))}
                      />
                    </Field>
                    <Field label="Ribbon color">
                      <ColorPicker
                        value={d.subheader?.color}
                        presets={themeVariants.map((v) => v.color)}
                        fallback={d.accent || '#0DA7BC'}
                        onColor={(c) => updateDetails({ subheader: { ...d.subheader, color: c } })}
                      />
                    </Field>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {screen === 'details.audience' && (
        <>
          <div className="cc-panel">
            <Field label="Who can join?" className="cc-w-sm">
              <CustomSelect
                value={basis}
                onChange={(v) => updateDetails({ basis: v })}
                options={basisOptions}
              />
            </Field>

            {basis === 'age' ? (
              <div className="cc-date-row">
                <Field label="Ages">
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
              <Field label="Branches" className="cc-w-md">
                <MultiSelect
                  options={branchOpts}
                  value={d.branches}
                  onChange={(v) => updateDetails({ branches: v })}
                  placeholder="All branches"
                />
              </Field>
            ) : isSimple ? (
              <Field label="Classrooms" required className="cc-w-md" error={errors.classrooms}>
                <MultiSelect
                  options={classOpts}
                  value={d.classrooms}
                  onChange={(v) => updateDetails({ classrooms: v })}
                  placeholder="Select classrooms"
                />
              </Field>
            ) : (
              <Field label="Grades" className="cc-w-md">
                <MultiSelect
                  options={gradeOpts}
                  value={d.grades}
                  onChange={(v) => updateDetails({ grades: v })}
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

            {isSimple && (
              <Tip>
                Teacher/MS view — advanced options (staff, landing, alternative challenges) are
                hidden.
              </Tip>
            )}
          </div>
          {!isSimple && (
            <MoreOptions
              label="More options"
              hint="Staff only, registration code, registration info"
              defaultOpen={advancedInUse}
            >
              {!isTemplate && (
                <>
                  <div className="cc-settings">
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
                      <div className="cc-code-reveal">
                        <Input
                          value={d.code || ''}
                          placeholder="e.g. READ2026"
                          maxLength={25}
                          aria-invalid={!!(errors.code || codeError)}
                          onChange={(e) =>
                            updateDetails({ code: e.target.value.replace(/\s/g, '') })
                          }
                        />
                        <p className={`cc-code-help${errors.code || codeError ? ' is-error' : ''}`}>
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
                      <div className="cc-code-reveal">
                        {EXISTING_CHALLENGES.length ? (
                          <CustomSelect
                            value={d.alternativeOf || ''}
                            onChange={(v) => updateDetails({ alternativeOf: v })}
                            placeholder="Pair with an existing challenge…"
                            options={EXISTING_CHALLENGES.map((c) => ({
                              value: c.id,
                              label: c.name,
                            }))}
                          />
                        ) : (
                          <p className="cc-code-help">
                            No other challenges exist yet — create one first to pair with it.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
              <h3 className="cc-panel-title">Required registration information</h3>
              <p className="cc-more-note">
                Ask for these when a reader registers for the challenge.
              </p>
              {REGISTRATION_FIELDS.map((f) => (
                <div key={f.key} className="cc-reg-row">
                  <span className="cc-reg-label">{f.label}</span>
                  <div className="cc-reg-toggle">
                    <Toggle
                      checked={!!reg[f.key]}
                      size="md"
                      onChange={(v) => updateDetails({ registration: { ...reg, [f.key]: v } })}
                    />
                  </div>
                </div>
              ))}
            </MoreOptions>
          )}
        </>
      )}
    </Screen>
  )
}
// In a points challenge, reading/activities/reviews all convert to points, so
// they don't get their own badges. We explain that instead of warning about it,
// and tuck the "use separate logging/review badges" escape hatch into Advanced.
function PointsEarning({ methods, setMethod }) {
  const [advanced, setAdvanced] = useState(!!(methods.log || methods.reviews))
  return (
    <>
      <p className="cc-method-note">
        In a points challenge,{' '}
        <strong>reading, activities, and reviews all convert into points</strong> — point values are
        configured once in your site's points settings. Readers unlock <strong>point badges</strong>{' '}
        at the milestones you choose.
      </p>
      <Toggle checked={!!methods.activities} onChange={(v) => setMethod('activities', v)} size="md">
        Add optional activity badges
        <span className="cc-muted"> — earned by finishing specific activities</span>
      </Toggle>
      <button
        type="button"
        className="cc-advanced-toggle"
        aria-expanded={advanced}
        onClick={() => setAdvanced((a) => !a)}
      >
        {advanced ? '−' : '+'} Advanced: use separate logging &amp; review badges
      </button>
      {advanced && (
        <div className="cc-method-toggles cc-method-toggles--nested">
          <p className="cc-method-note cc-method-note--sm">
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
