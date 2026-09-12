import { useState } from 'react'
import { Field, Input } from '@components/Form/Form'
import { Toggle } from '@components/Toggle/Toggle'
import { ColorPicker, BadgeMultiSelect } from '../../challenge-creator/steps/StepStubs'
import { Knobs, Variant } from './_shared'

const PRESETS = [
  '#0CA7BC',
  '#0BA85F',
  '#B43DD0',
  '#DB2777',
  '#E8453A',
  '#FFBC42',
  '#0EA5B7',
  '#2A2A2A',
]

function ColorPickerKnobs() {
  const [value, setValue] = useState('#0CA7BC')
  const [withPresets, setWithPresets] = useState(true)
  const [chips, setChips] = useState(6)
  return (
    <>
      <Knobs>
        <Field label="value">
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </Field>
        <Field label="# presets">
          <Input
            type="number"
            min={0}
            max={8}
            value={chips}
            onChange={(e) => setChips(Math.max(0, Math.min(8, Number(e.target.value) || 0)))}
          />
        </Field>
        <Field label="presets">
          <Toggle checked={withPresets} onChange={setWithPresets} />
        </Field>
      </Knobs>
      {/* ColorPicker's selected-chip ring uses the challenge-creator --teal token,
          which is scoped to .cc-root; provide it on the demo frame. */}
      <div className="pt-variant-frame" style={{ '--teal': '#0CA7BC' }}>
        <ColorPicker
          value={value}
          presets={withPresets ? PRESETS.slice(0, chips) : []}
          fallback="#0CA7BC"
          onColor={setValue}
        />
      </div>
    </>
  )
}

const circleBadge = (c) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="${c}"/></svg>`,
  )}`
const SAMPLE_BADGES = [
  { id: 'b1', name: 'First Book', img: circleBadge('#0CA7BC') },
  { id: 'b2', name: 'Bookworm', img: circleBadge('#0BA85F') },
  { id: 'b3', name: '5-Day Streak', img: circleBadge('#B43DD0') },
  { id: 'b4', name: 'Top Reviewer', img: circleBadge('#DB2777') },
]

function BadgeMultiSelectKnobs() {
  const [value, setValue] = useState(['b1'])
  const [hasBadges, setHasBadges] = useState(true)
  return (
    <>
      <Knobs>
        <Field label="has badges">
          <Toggle checked={hasBadges} onChange={setHasBadges} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <BadgeMultiSelect
          badges={hasBadges ? SAMPLE_BADGES : []}
          value={value}
          onChange={setValue}
          emptyHint="Add badges on the Badges step first."
        />
      </div>
    </>
  )
}

export const challengeCreatorSections = [
  {
    group: 'challenge-creator',
    id: 'cc-badgemultiselect',
    name: 'BadgeMultiSelect',
    desc: (
      <>
        The badge-selection pattern used wherever badges are chosen (certificates, rewards,
        completion requirements). A <code>MultiSelect</code> over a normalized badge pool (
        <code>{`{ id, name, img }`}</code>) — thumbnails show in the trigger and option rows, with a
        friendly empty state. Props: <code>badges</code>, <code>value</code>, <code>onChange</code>,{' '}
        <code>disabledIds</code>, <code>emptyHint</code>. Build the pool with{' '}
        <code>badgePoolOf(challenge)</code>.
      </>
    ),
    render: () => <BadgeMultiSelectKnobs />,
  },
  {
    group: 'challenge-creator',
    id: 'cc-colorpicker',
    name: 'ColorPicker',
    desc: (
      <>
        The single color-chip picker used everywhere a color is chosen in Challenge Creator (accent,
        title, banner overrides). A compact hex <code>ColorInput</code> followed by up to 8 round
        preset swatches that wrap together. Props: <code>value</code>, <code>presets</code> (array
        of hex, capped at 8), <code>fallback</code> (used when <code>value</code> is empty),{' '}
        <code>onColor(hex)</code>. The selected swatch shows a teal ring.
      </>
    ),
    render: () => (
      <>
        <ColorPickerKnobs />
        <Variant label="no presets (hex input only)">
          <div style={{ '--teal': '#0CA7BC' }}>
            <ColorPicker value="#0BA85F" presets={[]} fallback="#0CA7BC" onColor={() => {}} />
          </div>
        </Variant>
      </>
    ),
  },
]
