import { useState } from 'react'
import { Field, Input } from '@components/Form/Form'
import { Toggle } from '@components/Toggle/Toggle'
import {
  ColorPicker,
  BadgeMultiSelect,
  BadgeRow,
  BadgeGallery,
  useDragReorder,
} from '../../challenge-creator/steps/StepStubs'
import { BadgeSelect, BadgeAvatars, MoreOptions, Tip } from '../../challenge-creator/steps/shared'
import { TypeStep } from '../../challenge-creator/steps/TypeStep'
import { Preview } from '../../challenge-creator/Preview'
import { CHALLENGE_TYPES, blankChallenge } from '../../challenge-creator/data'
import { Knobs, Variant } from './_shared'

// Every Challenge Creator component reads the tokens `.cc-root` declares, and
// `.cc-root` is a fixed full-screen frame — so the catalog uses `.cc-catalog`,
// the same tokens without the layout.
function CC({ children, style }) {
  return (
    <div className="cc-catalog" style={style}>
      {children}
    </div>
  )
}

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
      <CC>
        <div className="pt-variant-frame">
          <ColorPicker
            value={value}
            presets={withPresets ? PRESETS.slice(0, chips) : []}
            fallback="#0CA7BC"
            onColor={setValue}
          />
        </div>
      </CC>
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

// A short ladder of badges, drag-reorderable, with every row action switched on.
function BadgeRowDemo() {
  const [rows, setRows] = useState([
    {
      id: 'b1',
      title: 'First Book',
      meta: 'Log 1 book',
      img: circleBadge('#0CA7BC'),
      active: true,
    },
    {
      id: 'b2',
      title: 'Bookworm',
      meta: 'Log 5 books',
      img: circleBadge('#0BA85F'),
      active: true,
    },
    {
      id: 'b3',
      title: 'Streak Star',
      meta: 'Read 5 days in a row',
      icon: 'flame',
      color: '#F26430',
      active: false,
    },
    {
      id: 'b4',
      title: 'Untitled badge',
      meta: 'No requirement yet',
      metaMissing: true,
      icon: 'star',
      color: '#7C5CFA',
      active: true,
    },
  ])
  const move = (from, to) =>
    setRows((prev) => {
      const next = [...prev]
      next.splice(to, 0, next.splice(from, 1)[0])
      return next
    })
  const dragFor = useDragReorder(move)
  const patch = (id, p) => setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...p } : r)))
  return (
    <CC>
      {rows.map((r, i) => (
        <BadgeRow
          key={r.id}
          img={r.img}
          icon={r.icon}
          color={r.color}
          title={r.title}
          meta={r.meta}
          metaMissing={r.metaMissing}
          active={r.active}
          drag={dragFor(i)}
          onToggleActive={() => patch(r.id, { active: !r.active })}
          onEdit={() => {}}
          onRemove={() => setRows((prev) => prev.filter((x) => x.id !== r.id))}
        />
      ))}
    </CC>
  )
}

function BadgeSelectDemo() {
  const [ids, setIds] = useState(['b1'])
  const [values, setValues] = useState({ b1: 3 })
  const [valueMode, setValueMode] = useState(false)
  const toggle = (id) =>
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  return (
    <>
      <Knobs>
        <Field label="valueMode">
          <Toggle checked={valueMode} onChange={setValueMode} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <CC>
          <BadgeSelect
            badges={SAMPLE_BADGES}
            selectedIds={ids}
            onToggle={toggle}
            valueMode={valueMode}
            values={values}
            onValue={(id, v) => setValues((prev) => ({ ...prev, [id]: v }))}
            valueLabel="tickets"
            disabledIds={['b4']}
            disabledHint="Already used"
          />
        </CC>
      </div>
    </>
  )
}

function TypeStepDemo() {
  const [value, setValue] = useState('logging')
  return (
    <CC>
      <TypeStep types={CHALLENGE_TYPES.slice(0, 6)} value={value} onSelect={setValue} />
    </CC>
  )
}

function BadgeGalleryDemo() {
  const [picked, setPicked] = useState(null)
  return (
    <CC>
      <BadgeGallery onPick={(b) => setPicked(b?.img ?? b)} selectedImg={picked} />
    </CC>
  )
}

// A challenge far enough along that the reader card has something to show.
const PREVIEW_CHALLENGE = (() => {
  const c = blankChallenge('logging')
  return {
    ...c,
    details: {
      ...c.details,
      name: 'Summer Reading 2026',
      description:
        '<p>Log your reading all summer and earn a badge every five books. Finish the challenge to take home the completion badge.</p>',
      subheader: { ...c.details.subheader, enabled: true, text: 'Reading Challenge' },
    },
  }
})()

export const challengeCreatorSections = [
  {
    group: 'challenge-creator',
    id: 'cc-badgemultiselect',
    name: 'BadgeMultiSelect',
    usage: `import { BadgeMultiSelect, badgePoolOf } from './steps/StepStubs'

<BadgeMultiSelect
  badges={badgePoolOf(challenge)}
  value={ids}
  onChange={setIds}
  disabledIds={usedIds}
/>`,
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
    usage: `import { ColorPicker } from './steps/StepStubs'

<ColorPicker value={accent} presets={BADGE_COLORS} fallback="#0CA7BC" onColor={setAccent} />`,
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
  {
    group: 'challenge-creator',
    id: 'cc-typestep',
    name: 'Challenge Type Picker',
    usage: `import { TypeStep, TypeGlyph } from './steps/TypeStep'

<TypeStep types={CHALLENGE_TYPES} value={typeId} onSelect={setTypeId} />
<TypeGlyph id="logging" size={26} />`,
    desc: (
      <>
        The creator&apos;s first decision, and the one that decides what every later step asks — how
        readers earn badges. A grid of cards, each carrying the type&apos;s own accent (
        <code>--type-accent</code>), its Plumpy duotone glyph and a one-line tagline saying what the
        type does rather than what it is called. The glyph is <code>TypeGlyph</code>, which maps a
        type id onto the Plumpy family the real admin chrome uses; both duotone layers tint from{' '}
        <code>currentColor</code>, so the card&apos;s accent drives them. Props: <code>types</code>,{' '}
        <code>value</code>, <code>onSelect(id)</code>.
      </>
    ),
    render: () => (
      <Variant label="six types · logging selected">
        <TypeStepDemo />
      </Variant>
    ),
  },
  {
    group: 'challenge-creator',
    id: 'cc-badgerow',
    name: 'BadgeRow',
    usage: `import { BadgeRow, useDragReorder } from './steps/StepStubs'

const dragFor = useDragReorder((from, to) => reorder(from, to))

<BadgeRow
  img={badge.img}
  title={badge.name}
  meta="Log 5 books"
  active={badge.active}
  drag={dragFor(i)}
  onToggleActive={…}
  onEdit={…}
  onRemove={…}
/>`,
    desc: (
      <>
        One badge in the ladder the creator is building — the row every badge, reward, certificate
        and activity list is made of. Art is whichever of three is given: <code>num</code> (a
        numbered gameboard space), <code>img</code> (badge art), or <code>icon</code> +{' '}
        <code>color</code> (a tinted glyph tile); <code>square</code> switches the art from a disc
        to a rounded square. <code>meta</code> is the requirement under the name, and{' '}
        <code>metaMissing</code> tints it when the badge has none yet — the row is how an unfinished
        badge announces itself.
        <br />
        <br />
        Each action is opt-in by passing its handler: <code>onToggleActive</code> (the eye — an
        inactive badge dims the whole row rather than leaving the list), <code>onEdit</code>,{' '}
        <code>onRemove</code>. Pass <code>drag</code> from <code>useDragReorder</code> for
        drag-to-reorder: the whole row becomes the drag image, and the drop indicator lands above or
        below the hovered row depending on the direction of travel.
      </>
    ),
    render: () => (
      <Variant label="drag to reorder · active, inactive, and a badge with no requirement">
        <BadgeRowDemo />
      </Variant>
    ),
  },
  {
    group: 'challenge-creator',
    id: 'cc-badgeselect',
    name: 'BadgeSelect',
    usage: `import { BadgeSelect, badgePoolOf } from './steps/shared'

<BadgeSelect
  badges={badgePoolOf(challenge)}
  selectedIds={ids}
  onToggle={toggle}
  valueMode
  values={values}
  onValue={setValue}
  valueLabel="tickets"
  disabledIds={usedIds}
/>`,
    desc: (
      <>
        Assign a reward to the badges that earn it. Where <code>BadgeMultiSelect</code> is a
        dropdown for a form field, this is the open list — every badge visible with its art, for the
        step where choosing them <em>is</em> the task. <code>valueMode</code> adds a number input to
        each selected row (how many raffle tickets that badge is worth), and{' '}
        <code>disabledIds</code> greys a badge another reward already claimed, with{' '}
        <code>disabledHint</code> saying so on the row rather than in a tooltip. With no badges yet
        it says where to go and make one.
      </>
    ),
    render: () => <BadgeSelectDemo />,
  },
  {
    group: 'challenge-creator',
    id: 'cc-badgeavatars',
    name: 'BadgeAvatars',
    usage: `import { BadgeAvatars } from './steps/shared'

<BadgeAvatars badges={selectedBadges} />`,
    desc: (
      <>
        The read-back of a <code>BadgeSelect</code> — which badges grant this reward, shown on the
        reward&apos;s own row. Up to six overlapping thumbnails and then a count, because past a few
        the art stops being identifiable and the number is the useful part. A single badge is named
        outright instead of counted.
      </>
    ),
    render: () => (
      <>
        <Variant label="one badge — named">
          <CC>
            <BadgeAvatars badges={SAMPLE_BADGES.slice(0, 1)} />
          </CC>
        </Variant>
        <Variant label="several — counted">
          <CC>
            <BadgeAvatars badges={SAMPLE_BADGES} />
          </CC>
        </Variant>
      </>
    ),
  },
  {
    group: 'challenge-creator',
    id: 'cc-badgegallery',
    name: 'BadgeGallery',
    usage: `import { BadgeGallery } from './steps/StepStubs'

<BadgeGallery
  onPick={(badge) => setArt(badge.img)}
  extraGroups={templateGroups}
  defaultGroupId="benny"
  selectedImg={art}
/>`,
    desc: (
      <>
        The badge art picker — every set in the library behind a sidebar, plus search and a colour
        filter. Search and colour work as <em>global</em> filters rather than filters within the
        open set: the moment either is active the sidebar steps aside and the grid shows matches
        from the whole catalog, because someone typing &ldquo;rocket&rdquo; wants the rocket, not
        the rockets in one set. A badge&apos;s subjects come from keywords in its name union its
        set&apos;s own subjects, and each badge&apos;s dominant colour is derived once from the
        image and cached, which is what the colour filter sorts on. <code>extraGroups</code> puts a
        template&apos;s own art at the front of the list.
      </>
    ),
    // Not `full`: the gallery draws its own columns but no outer edge, so
    // bleeding it to the card's rim put the set labels hard against it.
    render: () => (
      <Variant label="sets, search, and a colour filter">
        <BadgeGalleryDemo />
      </Variant>
    ),
  },
  {
    group: 'challenge-creator',
    id: 'cc-moreoptions',
    name: 'MoreOptions',
    usage: `import { MoreOptions, Tip } from './steps/shared'

<MoreOptions hint="Grades 3–5" defaultOpen={challenge.details.grades.length > 0}>
  …rarely-touched settings…
</MoreOptions>

<Tip>Readers see this on the challenge card.</Tip>`,
    desc: (
      <>
        How the creator keeps one decision per screen: everything rare or advanced folds into{' '}
        <code>MoreOptions</code> so the default path stays a straight line. <code>defaultOpen</code>{' '}
        is the important prop — a draft that already uses something inside opens the group, so a
        saved value is never hidden from the person who set it. Closed, it can carry a{' '}
        <code>hint</code> naming what is set in there.
        <br />
        <br />
        <code>Tip</code> is the other half of the same idea: the one-line aside that would otherwise
        become helper text under every field. It is the shared <code>Banner</code> at{' '}
        <code>level=&quot;info&quot;</code>, not a second callout style.
      </>
    ),
    render: () => (
      <>
        <Variant label="closed, with a hint">
          <CC>
            <MoreOptions hint="Grades 3–5">
              <Tip>Readers see this on the challenge card.</Tip>
            </MoreOptions>
          </CC>
        </Variant>
        <Variant label="open — a saved value is never hidden">
          <CC>
            <MoreOptions label="Audience" defaultOpen>
              <Tip>Leave this alone and every reader on the site can join.</Tip>
            </MoreOptions>
          </CC>
        </Variant>
      </>
    ),
  },
  {
    group: 'challenge-creator',
    id: 'cc-preview',
    name: 'Challenge Preview',
    usage: `import { Preview } from './Preview'

<Preview challenge={challenge} />`,
    desc: (
      <>
        The reader&apos;s side of the challenge, rendered live beside the form so every choice is
        answered by the thing it changes. It reads one <code>challenge</code> object and derives the
        rest: the ribbon takes the accent mixed 84% with white and picks its own text colour from
        that ground&apos;s luminance, the title auto-fits, and the badge strip fills from the
        challenge&apos;s real badges — falling back to the banner theme&apos;s set, then a generic
        one, so the card is never empty while it is being built. The registration badge leads and
        the completion badge anchors the row, mirroring the order a reader earns them in.
      </>
    ),
    render: () => (
      <Variant label="a challenge part-way through being built" ground>
        <CC>
          <Preview challenge={PREVIEW_CHALLENGE} />
        </CC>
      </Variant>
    ),
  },
]
