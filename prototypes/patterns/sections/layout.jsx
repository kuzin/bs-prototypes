import { useState } from 'react'
import { SECTIONS as HEALTH_SECTIONS } from '@components/ReadingHealth/ReadingHealth'
import { Hero } from '@components/Hero/Hero'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'
import { PreviewBar } from '@components/PreviewBar/PreviewBar'
import { SchoolPicker, Sidebar } from '@components/Sidebar/Sidebar'
import { Button } from '@components/Button/Button'
import { BackBar } from '@components/BackBar/BackBar'
import { PageHeader } from '@components/PageHeader/PageHeader'
import { ProfileCard, ProfileCardTitle } from '@components/ProfileCard/ProfileCard'
import { Toggle } from '@components/Toggle/Toggle'
import { SectionCard } from '@components/SectionCard/SectionCard'
import { Field, Input, Select } from '@components/Form/Form'
import { SCHOOLS } from '../../ris/data'
import { Icon } from '@components/Icon/Icon'
import { Knobs, Variant } from './_shared'

const PREVIEW_VIEWS = [
  { id: 'admin', label: 'Admin · Site Settings', short: 'Site', icon: 'settings' },
  { id: 'reader', label: 'Reader · Book talks', short: 'Talks', icon: 'message-chatbot' },
  { id: 'teacher', label: 'Teacher · Sessions', short: 'Sessions', icon: 'clipboard-check' },
]

function PreviewBarShowcase() {
  const [active, setActive] = useState('admin')
  return (
    <PreviewBar
      title="Book Talks: Badges"
      views={PREVIEW_VIEWS}
      active={active}
      onChange={setActive}
      sticky={false}
    />
  )
}

// Every row carries a `desc` — the real section menu always pairs a title with
// a one-line description.
const SIDEBAR_NAV_SETS = {
  ris: {
    label: 'RIS district (7 items + subgroup)',
    subtitle: 'District View',
    items: [
      {
        id: 'dashboard',
        label: 'Overview',
        icon: 'overview',
        desc: 'Reading health at a glance, and who to watch.',
      },
      {
        id: 'motivation',
        label: 'Motivation',
        icon: 'flame',
        subgroup: true,
        section: 'Reading Health',
        desc: 'Motivation Index scores and survey trends.',
      },
      {
        id: 'integrity',
        label: 'Integrity',
        icon: 'shield',
        subgroup: true,
        section: 'Reading Health',
        desc: 'Flag rates and book talk completion.',
      },
      {
        id: 'habits',
        label: 'Habits',
        icon: 'habits',
        subgroup: true,
        section: 'Reading Health',
        desc: 'Streaks, logging consistency, and minutes read.',
      },
      {
        id: 'skills',
        label: 'Skills',
        icon: 'book',
        subgroup: true,
        section: 'Reading Health',
        desc: 'Lexile growth and comprehension.',
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: 'analytics',
        section: 'Data',
        desc: 'Build and compare custom views.',
      },
      {
        id: 'demographics',
        label: 'Demographics',
        icon: 'demographics',
        section: 'Data',
        desc: 'Compare reading health across student groups.',
      },
    ],
  },
  school: {
    label: 'School view (4 items)',
    subtitle: 'School View',
    items: [
      {
        id: 'dashboard',
        label: 'Overview',
        icon: 'overview',
        desc: 'Reading health at a glance, and who to watch.',
      },
      {
        id: 'habits',
        label: 'Reading Habits',
        icon: 'habits',
        section: 'Reports',
        desc: 'Streaks, logging consistency, and minutes read.',
      },
      {
        id: 'lexile',
        label: 'Lexile Growth',
        icon: 'lexile',
        section: 'Reports',
        desc: 'Track reading level over the school year.',
      },
    ],
  },
  minimal: {
    label: 'Minimal (3 items, no subgroup)',
    subtitle: undefined,
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'overview', desc: 'Start here.' },
      {
        id: 'habits',
        label: 'Habits',
        icon: 'habits',
        section: 'Main',
        desc: 'Logging and streaks.',
      },
      {
        id: 'skills',
        label: 'Skills',
        icon: 'book',
        section: 'Main',
        desc: 'Lexile and comprehension.',
      },
    ],
  },
}

function SidebarKnobs() {
  const [navSet, setNavSet] = useState('ris')
  const [active, setActive] = useState('dashboard')
  const [withPicker, setPicker] = useState(true)
  const [withBadge, setBadge] = useState(true)
  const [title, setTitle] = useState('Reading Information System')
  const [subtitle, setSubtitle] = useState('District View')
  const [schoolId, setSchoolId] = useState('lincoln')

  const set = SIDEBAR_NAV_SETS[navSet]
  return (
    <>
      <Knobs>
        <Field label="nav set">
          <Select
            value={navSet}
            onChange={(e) => {
              const next = e.target.value
              setNavSet(next)
              setActive(SIDEBAR_NAV_SETS[next].items[0].id)
              setSubtitle(SIDEBAR_NAV_SETS[next].subtitle || '')
            }}
          >
            {Object.entries(SIDEBAR_NAV_SETS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="subtitle">
          <Input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="(none)"
          />
        </Field>
        <Field label="alert badge">
          <Toggle checked={withBadge} onChange={setBadge} />
        </Field>
        <Field label="picker">
          <Toggle checked={withPicker} onChange={setPicker} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame pt-variant-frame--full pt-sidebar-demo">
        <Sidebar
          nav={set.items}
          active={active}
          onNavigate={setActive}
          title={title || undefined}
          subtitle={subtitle || undefined}
          badges={withBadge && set.items.some((i) => i.id === 'dashboard') ? { dashboard: 3 } : {}}
          picker={
            withPicker && (
              <SchoolPicker schools={SCHOOLS} schoolId={schoolId} onSchoolId={setSchoolId} />
            )
          }
        />
        <div className="pt-sidebar-demo-content">
          <span>active = "{active}"</span>
        </div>
      </div>
    </>
  )
}

function HeroKnobs() {
  const [mode, setMode] = useState('bucket')
  const [bucket, setBucket] = useState('motivation')
  const [title, setTitle] = useState('Lincoln Elementary')
  const [subtitle, setSubtitle] = useState('K–5 · 1,650 students')
  const [initials, setInitials] = useState('LE')
  const [accent, setAccent] = useState('#E8866A')
  const [accentBg, setAccentBg] = useState('#FDF1ED')
  const [withAction, setAction] = useState(true)

  const modeSelect = (
    <Field label="mode">
      <Select value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="bucket">bucket (auto)</option>
        <option value="avatar">avatar (overview)</option>
        <option value="icon">icon (page)</option>
      </Select>
    </Field>
  )
  const actionToggle = (
    <Field label="action">
      <Toggle checked={withAction} onChange={setAction} />
    </Field>
  )
  // `sm` is what the real hero action is: the profiles put a single secondary
  // button here beside a 22px title. `lg` — 56px, the app's `.button--large` —
  // is a page-level CTA and dwarfs the header it sits in.
  const actionNode = withAction ? (
    <>
      <Button variant="ghost" size="sm">
        Export
      </Button>
      <Button variant="primary" size="sm">
        Log reading
      </Button>
    </>
  ) : undefined

  if (mode === 'bucket') {
    return (
      <>
        <Knobs>
          {modeSelect}
          <Field label="bucket">
            <Select value={bucket} onChange={(e) => setBucket(e.target.value)}>
              <option>motivation</option>
              <option>integrity</option>
              <option>habits</option>
              <option>skills</option>
            </Select>
          </Field>
          <Field label="accentBg">
            <input
              className="pt-color"
              type="color"
              value={accentBg}
              onChange={(e) => setAccentBg(e.target.value)}
            />
          </Field>
          {actionToggle}
        </Knobs>
        <Hero bucket={bucket} accentBg={accentBg} action={actionNode} />
      </>
    )
  }
  if (mode === 'avatar') {
    return (
      <>
        <Knobs>
          {modeSelect}
          <Field label="initials">
            <Input value={initials} onChange={(e) => setInitials(e.target.value.slice(0, 2))} />
          </Field>
          <Field label="title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="subtitle">
            <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          </Field>
          <Field label="accent">
            <input
              className="pt-color"
              type="color"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
            />
          </Field>
          {actionToggle}
        </Knobs>
        <Hero
          initials={initials}
          title={title}
          subtitle={subtitle}
          accent={accent}
          action={actionNode}
        />
      </>
    )
  }
  // icon mode
  const motIcon = HEALTH_SECTIONS.find((s) => s.key === 'motivation')?.icon
  return (
    <>
      <Knobs>
        {modeSelect}
        <Field label="title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="subtitle">
          <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </Field>
        <Field label="accent">
          <input
            className="pt-color"
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
          />
        </Field>
        {actionToggle}
      </Knobs>
      <Hero icon={motIcon} title={title} subtitle={subtitle} accent={accent} action={actionNode} />
    </>
  )
}

// ── Chart fixtures + chart-card showcase pieces ──────────────────────────

function BackBarKnobs() {
  const [label, setLabel] = useState('Back to Overview')
  const [asAnchor, setAsAnchor] = useState(false)
  const [fixed, setFixed] = useState(false)
  const bar = asAnchor ? (
    <BackBar label={label} href="#" fixed={fixed} />
  ) : (
    <BackBar label={label} onClick={() => {}} fixed={fixed} />
  )
  // The bar carries no padding of its own, so showing it in a bare box just
  // pins it to an edge. Here it sits in a stand-in page container — page
  // ground, the page's own padding, the section gap, then the header and the
  // first card — which is the only context it has.
  return (
    <>
      <Knobs>
        <Field label="label">
          <Input value={label} onChange={(e) => setLabel(e.target.value)} />
        </Field>
        <Field label="anchor (href)">
          <Toggle checked={asAnchor} onChange={setAsAnchor} />
        </Field>
        <Field label="fixed">
          <Toggle checked={fixed} onChange={setFixed} />
        </Field>
      </Knobs>
      <Variant label="inside the page container, above the page header" full>
        <div className="pt-backbar-page">
          {bar}
          <PageHeader title="Class A" actions={<Button variant="secondary">Print</Button>} />
          <div className="pt-backbar-card">The page&apos;s first card starts here.</div>
        </div>
      </Variant>
      <Variant label="fixed — its own white bar, stuck to the top of a scrolling region" full>
        <div className="pt-backbar-scroller">
          <BackBar fixed label={label} href="#" />
          <div className="pt-backbar-scroll-body">
            <div className="pt-backbar-card">Scroll me — the bar stays put.</div>
            <div className="pt-backbar-card">Content passes under the bar, not through it.</div>
            <div className="pt-backbar-card">This is how the Pattern Library uses it.</div>
            <div className="pt-backbar-card">One more, so there&apos;s something to scroll.</div>
          </div>
        </div>
      </Variant>
    </>
  )
}

function SectionCardShowcase() {
  return (
    <>
      <Variant label="plain (default) — bold title above the body">
        <SectionCard title="Availability">
          <div className="pt-section-desc" style={{ margin: 0 }}>
            Body content — fields, settings rows, anything.
          </div>
        </SectionCard>
      </Variant>
      <Variant label="header='bar' — tinted full-width header strip">
        <SectionCard header="bar" title="When should Benny engage students in a Book Talk?">
          <div className="pt-section-desc" style={{ margin: 0 }}>
            Body sits below the header bar.
          </div>
        </SectionCard>
      </Variant>
      <Variant label="with right-side actions">
        <SectionCard title="Earnable badges" actions={<Button>Add badge</Button>}>
          <div className="pt-section-desc" style={{ margin: 0 }}>
            Actions sit opposite the title in the header.
          </div>
        </SectionCard>
      </Variant>
    </>
  )
}

export const layoutSections = [
  {
    group: 'layout',
    id: 'hero',
    name: 'Hero',
    desc: (
      <>
        One unified page header. <code>mode</code> picks between the three shapes:{' '}
        <code>bucket</code> (auto-derive icon/title/accent from SECTIONS), <code>avatar</code>{' '}
        (overview-style), and <code>icon</code> (analytics-style with subtitle).
        <br />
        <br />
        The <code>action</code> slot takes <strong>small</strong> buttons. The title is 22px, so a{' '}
        <code>size="lg"</code> button (56px — the app&apos;s <code>.button--large</code>, meant for
        a page-level CTA) is taller than the header it sits in. The profiles put a single{' '}
        <code>secondary</code> <code>sm</code> button here.
      </>
    ),
    render: () => (
      <>
        <HeroKnobs />
      </>
    ),
  },
  {
    group: 'layout',
    id: 'profile-card',
    name: 'ProfileCard',
    desc: (
      <>
        The titled card the student / reader profiles stack down their content column — and the
        pattern for any panel built from titled blocks. White, 12px radius, <code>16px 18px</code>{' '}
        padding, with an <strong>18px/800</strong> title. What makes it different from{' '}
        <code>SectionCard</code>: the <em>first</em> <code>ProfileCardTitle</code> in a padded card
        promotes itself into a full-bleed header bar with a hairline under it, because these cards
        sit shoulder-to-shoulder and need a hard edge between the block's name and its contents —
        where <code>SectionCard</code> keeps its title inline unless you pass{' '}
        <code>header="bar"</code>. Use <code>flush</code> for content that owns its own edges
        (tables, full-width lists); the title then supplies the padding the card gave up.
      </>
    ),
    render: () => (
      <div
        style={{
          background: 'var(--c-bg)',
          padding: 20,
          borderRadius: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <ProfileCard>
          <ProfileCardTitle>At a glance</ProfileCardTitle>
          <div style={{ fontSize: 15 }}>
            A padded card: the first title becomes a header bar, the body keeps the card's padding.
          </div>
        </ProfileCard>
        <ProfileCard flush>
          <ProfileCardTitle>Recommended actions</ProfileCardTitle>
          <div style={{ fontSize: 15, padding: '14px 18px' }}>
            A <code>flush</code> card: rows bleed to the card's edges and own their own padding.
          </div>
        </ProfileCard>
        <ProfileCard>
          <div style={{ fontSize: 15 }}>A card with no title at all.</div>
        </ProfileCard>
      </div>
    ),
  },
  {
    group: 'layout',
    id: 'page-header',
    name: 'PageHeader',
    desc: (
      <>
        The title / subtitle / actions block at the top of an admin page — a port of the shipped
        app's <code>.page-header</code> (<code>microsite/_page_header.scss</code>):{' '}
        <code>.page-title</code> at 28px/800 in <code>$textColorDark</code>, the{' '}
        <code>.page-title-search</code> subtitle slot at 22px/500 in <code>$gray750</code>, and a
        right-aligned <code>.page-header__actions</code> row. Props: <code>title</code>,{' '}
        <code>subtitle</code>, <code>actions</code>, <code>before</code> (a leading avatar slot),{' '}
        <code>border</code> (the app's <code>--with-border</code> rule), plus <code>children</code>{' '}
        for a row beneath. Every admin page should use this instead of its own heading so titles
        share a baseline and a left edge.
      </>
    ),
    render: () => (
      <div style={{ background: 'var(--c-bg)', padding: 20, borderRadius: 10 }}>
        <PageHeader
          title="Find a Person"
          subtitle="Search fields must contain at least two characters."
        />
        <PageHeader
          title="Class A"
          subtitle="24 students · 2024–25 School Year"
          actions={
            <>
              <Button variant="ghost">Set Classroom Goal</Button>
              <Button variant="primary">Log for Class</Button>
            </>
          }
        />
        <PageHeader title="Account Merges" subtitle="Review queued merges." border />
      </div>
    ),
  },
  {
    group: 'layout',
    id: 'back-bar',
    name: 'BackBar',
    desc: (
      <>
        "‹ Back to X" link styled like a breadcrumb. Renders as a button or anchor. Props:{' '}
        <code>label</code>, <code>onClick</code> or <code>href</code>. It floats directly above the
        page's <code>PageHeader</code> on the page background — no white bar, no rule.
        <br />
        <br />
        It carries <strong>no padding of its own</strong>: it goes inside the page container and
        picks up that container's top padding and left edge, so it lines up with the title beneath
        it and the page's vertical rhythm (<code>--admin-section-gap</code>) does the spacing. The
        one exception is <code>AppShell</code>, where consumers own the markup inside{' '}
        <code>.app-shell-page</code> and the bar is a sibling above the scrolling column — there{' '}
        <code>.app-shell-content &gt; .back-bar</code> supplies the page padding and gutters itself.
        The preview below stands in a mock page container (at a smaller padding than the real 56/70,
        so it fits here).
        <br />
        <br />
        <code>fixed</code> makes it a bar in its own right instead — <code>position: sticky</code>{' '}
        to the top of its scrolling region, on white, with its own padding and a hairline beneath
        it. Reach for it where there is no page container to sit inside and the content scrolls past
        the link rather than starting below it; the Pattern Library&apos;s own component pages are
        the case it was built for.
        <br />
        <br />
        On a <strong>phone</strong> (&le;&nbsp;699px) the link grows to a 44px tap target at 16px
        with an 18px chevron — the extra height comes back out in negative margin, so the row
        doesn&apos;t get taller than the link looks. It also stops being indented by the desktop
        70px gutter: the admin frame tokens drop to 20px at that width, which is the app&apos;s own{' '}
        <code>$small-only</code> value, so the back link lands flush with the page header and every
        card below it.
      </>
    ),
    render: () => (
      <>
        <BackBarKnobs />
      </>
    ),
  },
  {
    group: 'layout',
    id: 'sidebar',
    name: 'Sidebar',
    desc: (
      <>
        The full navigation chrome used by every admin prototype — narrow Beanstack rail (MainRail)
        + the blue gradient sidebar. Props: <code>nav</code>, <code>active</code>,{' '}
        <code>onNavigate</code>, <code>title</code>, <code>subtitle</code>, <code>badges</code>,{' '}
        <code>picker</code> slot (typically <code>SchoolPicker</code>), <code>mainRailIndex</code>.
        <br />
        <br />
        Three tiers, switched on viewport width: <strong>desktop</strong> (&ge;&nbsp;1100) rail +
        320px sidebar in flow, <strong>tablet</strong> (700&ndash;1099) rail + a 64px icon sidebar
        that expands to an overlay, and <strong>phone</strong> (&lt;&nbsp;700) a topbar whose
        hamburger opens the app menu. That last one is the product&apos;s own{' '}
        <code>$small-only</code> behaviour: the rail isn&apos;t shrunk, it&apos;s <em>promoted</em>{' '}
        to an 85vw full-height panel where every destination finally shows its label — close / heart
        / help across the top, and a forward chevron on the rows that own a section menu. Tapping
        one steps into that menu at the same footprint; its contract notch steps back out. Resize
        the window below 700px to see it.
      </>
    ),
    render: () => (
      <>
        <SidebarKnobs />
      </>
    ),
  },
  {
    group: 'layout',
    id: 'prototype-nav',
    name: 'PrototypeNav',
    desc: (
      <>
        Fixed bar at the bottom of every prototype page. Shows the current prototype name with
        prev/next arrows and a dropdown to jump directly to any other prototype. Props:{' '}
        <code>currentHref</code>.
      </>
    ),
    render: () => (
      <>
        <div className="pt-section-desc">
          The PrototypeNav is rendered at the bottom of this page itself — scroll to see it. It
          picks up the current prototype from <code>currentHref</code> and shows prev/next arrows
          for the other prototypes.
        </div>
      </>
    ),
  },
  {
    group: 'layout',
    id: 'preview-bar',
    name: 'PreviewBar',
    desc: (
      <>
        The dev/preview bar above a multi-persona prototype, switching between its views. Every
        prototype with one uses this, so the bars read the same everywhere — Benny, the
        prototype&apos;s name, and a segmented strip of views on the right. Replaces four
        hand-rolled bars (<code>bt-toolbar</code>, <code>bw-toolbar</code>, <code>pyp-devbar</code>,{' '}
        <code>wb-toolbar</code>) that had drifted onto three different grounds and two different
        active states.
        <br />
        <br />
        Props: <code>title</code>, optional <code>subtitle</code>, <code>views</code> (
        <code>{'{ id, label, short?, icon }'}</code>), <code>active</code>, <code>onChange</code>,
        optional <code>actions</code> (right-side controls, styled by the bar), and{' '}
        <code>sticky</code> — default true; pass <code>false</code> inside a flex-column shell that
        owns its own scrolling. <code>short</code> is the label the strip swaps to before it would
        overflow. Deliberately <strong>no accent prop</strong>: the active pill is white everywhere,
        which is what keeps the bars consistent. The bar publishes its height as{' '}
        <code>--preview-bar-h</code>, so a prototype can size a full-height shell or a sticky header
        beneath it without guessing pixels.
      </>
    ),
    render: () => (
      <>
        <Variant label="three views — the common case" bare>
          <PreviewBarShowcase />
        </Variant>
        <Variant label="a subtitle + a right-side action" bare>
          <PreviewBar
            title="Book Talks: Comprehension"
            subtitle="Site-wide completion setting"
            views={PREVIEW_VIEWS}
            active="reader"
            onChange={() => {}}
            sticky={false}
            actions={
              <button type="button">
                <Icon name="refresh" size={13} /> Reset
              </button>
            }
          />
        </Variant>
      </>
    ),
  },
  {
    group: 'layout',
    id: 'section-card',
    name: 'SectionCard',
    desc: (
      <>
        A titled card: optional header (<code>title</code> + right-side <code>actions</code>) over a
        body. <code>header="plain"</code> (default) puts a bold title above the body;{' '}
        <code>header="bar"</code> renders a tinted full-width header strip. Replaces the ad-hoc
        panel / section-card markup hand-rolled across prototypes (e.g. challenge-creator’s{' '}
        <code>cc-panel</code>).
      </>
    ),
    render: () => (
      <>
        <SectionCardShowcase />
      </>
    ),
  },
]
