import { Field, MultiSelect, NumberInput } from '@components/Form/Form'
import { Toggle } from '@components/Toggle/Toggle'
import { Banner } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import { SAMPLE_TITLES } from '../data'
import { STEP_ICONS, StepHead, badgePoolOf, BadgeMultiSelect } from './shared'

// ─── Step 6 · Completion ──────────────────────────────────────────────────────
const BADGE_REQ_OPTIONS = [
  {
    value: 'all',
    icon: 'circle-check',
    title: 'Require all badges',
    desc: 'Readers must earn every badge.',
  },
  {
    value: 'specific',
    icon: 'badge',
    title: 'Require specific badges',
    desc: 'Readers must earn the badges you choose below.',
  },
  {
    value: 'some',
    icon: 'medal',
    title: 'Require some badges',
    desc: 'Readers must earn a set number of badges — you can also require specific ones.',
  },
]
const TITLE_REQ_OPTIONS = [
  {
    value: 'all',
    icon: 'book-2',
    title: 'Require all titles',
    desc: 'Readers must complete every title.',
  },
  {
    value: 'specific',
    icon: 'book',
    title: 'Require specific titles',
    desc: 'Readers must complete the titles you choose below.',
  },
  {
    value: 'some',
    icon: 'list',
    title: 'Require some titles',
    desc: 'Readers must complete a set number of titles — you can also require specific ones.',
  },
]

// Stacked radio cards (reuses the option-card pattern from the ticket source).
function ReqCards({ options, value, onChange }) {
  return (
    <div className="cc-optcards cc-optcards--stack" role="radiogroup">
      {options.map((o) => {
        const on = value === o.value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            className={`cc-optcard${on ? ' is-on' : ''}`}
            onClick={() => onChange(o.value)}
          >
            <span className="cc-optcard-ic" aria-hidden="true">
              <Icon name={o.icon} size={18} />
            </span>
            <span className="cc-optcard-text">
              <strong>{o.title}</strong>
              <span>{o.desc}</span>
            </span>
            <span className="cc-optcard-dot" aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}

export function CompletionStep({ challenge, update }) {
  const c = challenge.completion || {}
  const isRLC = challenge.typeId === 'reading-list'
  const titlesEnabled = !!c.titlesEnabled
  const setC = (patch) => update({ completion: { ...c, ...patch } })

  // Pools for the "specific …" sub-pickers. Earned/completion badges don't count
  // toward completion, so they're excluded here.
  const badgePool = badgePoolOf(challenge)
  const titleOpts = (challenge.setup?.titles || SAMPLE_TITLES).map((t, i) => ({
    value: `t-${i}`,
    label: t.title || t,
  }))

  return (
    <section className="cc-step">
      <StepHead
        title="Completion"
        sub="Decide what it takes to finish the challenge."
        icon={STEP_ICONS.completion}
      />

      {isRLC && (
        <div className="cc-panel">
          <h3 className="cc-panel-title">Completion type</h3>
          <div className="cc-settings">
            <div className="cc-setting-row is-disabled">
              <div className="cc-setting-text">
                <span className="cc-setting-label">Badges</span>
                <span className="cc-setting-sub">
                  Earned badges always count toward completion.
                </span>
              </div>
              <Toggle checked size="md" disabled onChange={() => {}} />
            </div>
            <div className="cc-setting-row">
              <div className="cc-setting-text">
                <span className="cc-setting-label">Completing titles</span>
                <span className="cc-setting-sub">
                  Also require readers to finish titles from the reading list.
                </span>
              </div>
              <Toggle
                checked={titlesEnabled}
                size="md"
                onChange={(v) => setC({ titlesEnabled: v })}
              />
            </div>
          </div>
        </div>
      )}

      {isRLC && titlesEnabled && (
        <div className="cc-panel">
          <h3 className="cc-panel-title">Title requirements</h3>
          <ReqCards
            options={TITLE_REQ_OPTIONS}
            value={c.titleMode || 'all'}
            onChange={(v) => setC({ titleMode: v })}
          />
          {c.titleMode === 'some' && (
            <Field label="Titles required" className="cc-w-sm">
              <NumberInput
                value={c.titleCount ?? 1}
                min={1}
                max={titleOpts.length || 99}
                onChange={(n) => setC({ titleCount: n })}
              />
            </Field>
          )}
          {(c.titleMode === 'specific' || c.titleMode === 'some') && (
            <Field
              label={
                c.titleMode === 'some' ? 'Required specific titles (optional)' : 'Required titles'
              }
            >
              <MultiSelect
                options={titleOpts}
                value={c.titleRequired || []}
                onChange={(v) => setC({ titleRequired: v })}
                placeholder="Select titles"
              />
            </Field>
          )}
        </div>
      )}

      <div className="cc-panel">
        <h3 className="cc-panel-title">Badge requirements</h3>
        <ReqCards
          options={BADGE_REQ_OPTIONS}
          value={c.mode || 'all'}
          onChange={(v) => setC({ mode: v })}
        />
        {c.mode === 'some' && (
          <Field label="Badges required" className="cc-w-sm">
            <NumberInput
              value={c.count ?? 1}
              min={1}
              max={badgePool.length || 99}
              onChange={(n) => setC({ count: n })}
            />
          </Field>
        )}
        {(c.mode === 'specific' || c.mode === 'some') &&
          (badgePool.length > 0 ? (
            <Field
              label={c.mode === 'some' ? 'Required specific badges (optional)' : 'Required badges'}
            >
              <BadgeMultiSelect
                badges={badgePool}
                value={c.required || []}
                onChange={(v) => setC({ required: v })}
              />
            </Field>
          ) : (
            <Banner level="warning" className="cc-panel-banner">
              Add badges on the Badges step, then choose the required ones here.
            </Banner>
          ))}
      </div>
    </section>
  )
}
