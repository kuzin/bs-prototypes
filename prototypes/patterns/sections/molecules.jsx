import { Fragment, useState } from 'react'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { Flyout } from '@components/Flyout/Flyout'
import { Modal } from '@components/Modal/Modal'
import { Table } from '@components/Table/Table'
import { Avatar } from '@components/Avatar/Avatar'
import { Toggle } from '@components/Toggle/Toggle'
import {
  Field,
  Input,
  Select,
  Textarea,
} from '@components/Form/Form'
import {
  Accordion,
  Banner,
  Breadcrumb,
  EmptyState,
  IconButton,
  SectionHeading,
} from '@components/Primitives/Primitives'
import { Knobs, Variant, PlusIcon, CaretIcon, EditIcon, DuplicateIcon, ArchiveIcon, TrashIcon, MoreIcon, TABLE_ROWS } from './_shared'

function TabsShowcase() {
  const [a, setA] = useState('daily')
  const [b, setB] = useState('overview')
  const [c, setC] = useState('details')
  return (
    <>
      <Variant label="underline (default)">
        <Tabs
          active={a}
          onChange={setA}
          items={[
            { id: 'daily', label: 'Daily Reading' },
            { id: 'roster', label: 'Students', count: 24 },
            { id: 'rewards', label: 'Earned Rewards' },
          ]}
        />
      </Variant>
      <Variant label="pill variant">
        <Tabs
          variant="pill"
          active={b}
          onChange={setB}
          items={[
            { id: 'overview', label: 'Overview' },
            { id: 'detail', label: 'Detail' },
            { id: 'history', label: 'History' },
          ]}
        />
      </Variant>
      {/* In-modal header tabs: full-bleed underline flush under the modal title,
          with a count pill — as used in the Challenge Creator editor modals. */}
      <Variant label="in a modal — full-bleed header tabs + count pill">
        <div
          style={{
            width: 'min(440px, 100%)',
            border: '1px solid #e2e8f0',
            borderRadius: 14,
            overflow: 'hidden',
            background: '#fff',
            boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px' }}>
            <strong style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Edit activity badge</strong>
            <span aria-hidden="true" style={{ color: '#94a3b8', fontSize: 20, lineHeight: 1 }}>
              ×
            </span>
          </div>
          {/* Negative side margin cancels the body padding so the underline runs edge to edge. */}
          <div style={{ padding: '0 14px' }}>
            <Tabs
              accent="#0DA7BC"
              active={c}
              onChange={setC}
              items={[
                { id: 'details', label: 'Details' },
                { id: 'activities', label: 'Activities', count: 2 },
              ]}
            />
          </div>
          <div style={{ padding: 18, fontSize: 14, color: '#64748b' }}>
            {c === 'details'
              ? 'Details panel — badge art, title, description…'
              : 'Activities panel — the activities readers complete.'}
          </div>
        </div>
      </Variant>
    </>
  )
}

// Tiny icons for menu items

function TabsKnobs() {
  const [variant, setVariant] = useState('underline')
  const [size, setSize] = useState('md')
  const [active, setActive] = useState('daily')
  const [accent, setAccent] = useState('#1D4ED8')
  const [showCount, setCount] = useState(true)
  const [showIcon, setIcon] = useState(false)
  const [withDisabled, setDis] = useState(false)
  const items = [
    { id: 'daily', label: 'Daily Reading', icon: showIcon ? <PlusIcon /> : undefined },
    { id: 'roster', label: 'Students', count: showCount ? 24 : undefined },
    { id: 'rewards', label: 'Earned Rewards' },
    ...(withDisabled ? [{ id: 'locked', label: 'Locked tab', disabled: true }] : []),
  ]
  return (
    <>
      <Knobs>
        <Field label="variant">
          <Select value={variant} onChange={(e) => setVariant(e.target.value)}>
            <option>underline</option>
            <option>pill</option>
          </Select>
        </Field>
        <Field label="size">
          <Select value={size} onChange={(e) => setSize(e.target.value)}>
            <option>sm</option>
            <option>md</option>
            <option>lg</option>
          </Select>
        </Field>
        <Field label="accent">
          <input
            className="pt-color"
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
          />
        </Field>
        <Field label="active">
          <Select value={active} onChange={(e) => setActive(e.target.value)}>
            {items
              .filter((i) => !i.disabled)
              .map((i) => (
                <option key={i.id} value={i.id}>
                  {i.label}
                </option>
              ))}
          </Select>
        </Field>
        <Field label="count">
          <Toggle checked={showCount} onChange={setCount} />
        </Field>
        <Field label="icon">
          <Toggle checked={showIcon} onChange={setIcon} />
        </Field>
        <Field label="disabled">
          <Toggle checked={withDisabled} onChange={setDis} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Tabs
          variant={variant}
          size={size}
          accent={accent}
          active={active}
          onChange={setActive}
          items={items}
        />
      </div>
    </>
  )
}

function FlyoutKnobs() {
  const [size, setSize] = useState('md')
  const [withIcons, setIcons] = useState(true)
  const [placement, setPlacement] = useState('bottom-start')
  const [offset, setOffset] = useState(6)
  return (
    <>
      <Knobs>
        <Field label="button size">
          <Select value={size} onChange={(e) => setSize(e.target.value)}>
            <option>sm</option>
            <option>md</option>
            <option>lg</option>
          </Select>
        </Field>
        <Field label="placement">
          <Select value={placement} onChange={(e) => setPlacement(e.target.value)}>
            <option>auto</option>
            <option>bottom-start</option>
            <option>bottom-end</option>
            <option>top-start</option>
            <option>top-end</option>
          </Select>
        </Field>
        <Field label="offset (px)">
          <Input
            type="number"
            min="0"
            max="40"
            value={offset}
            onChange={(e) => setOffset(Number(e.target.value))}
          />
        </Field>
        <Field label="icons in menu">
          <Toggle checked={withIcons} onChange={setIcons} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Flyout
          placement={placement}
          offset={offset}
          trigger={({ open, toggle }) => (
            <Button
              variant="secondary"
              size={size}
              iconRight={<CaretIcon />}
              onClick={toggle}
              aria-expanded={open}
            >
              Actions
            </Button>
          )}
        >
          {({ close }) => (
            <div className="flyout-menu" style={{ minWidth: 180 }}>
              <button className="flyout-menu-item" onClick={close}>
                {withIcons && (
                  <span className="flyout-menu-icon">
                    <EditIcon />
                  </span>
                )}
                Edit
              </button>
              <button className="flyout-menu-item" onClick={close}>
                {withIcons && (
                  <span className="flyout-menu-icon">
                    <DuplicateIcon />
                  </span>
                )}
                Duplicate
              </button>
              <button className="flyout-menu-item" onClick={close}>
                {withIcons && (
                  <span className="flyout-menu-icon">
                    <ArchiveIcon />
                  </span>
                )}
                Archive
              </button>
              <div className="flyout-menu-sep" />
              <button className="flyout-menu-item flyout-menu-item--danger" onClick={close}>
                {withIcons && (
                  <span className="flyout-menu-icon">
                    <TrashIcon />
                  </span>
                )}
                Delete
              </button>
            </div>
          )}
        </Flyout>
      </div>
    </>
  )
}

function FlyoutShowcase() {
  return (
    <div className="pt-variants pt-variants--2">
      <Variant label="school picker">
        <Flyout
          placement="bottom-start"
          trigger={({ open, toggle }) => (
            <Button
              variant="secondary"
              iconRight={<CaretIcon />}
              onClick={toggle}
              aria-expanded={open}
            >
              Lincoln Elementary
            </Button>
          )}
        >
          {({ close }) => (
            <div className="flyout-menu" style={{ minWidth: 200 }}>
              {['Jefferson', 'Lincoln', 'Kennedy', 'Roosevelt', 'Washington', 'Adams'].map((s) => (
                <button
                  key={s}
                  className={`flyout-menu-item${s === 'Lincoln' ? ' flyout-menu-item--active' : ''}`}
                  onClick={close}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </Flyout>
      </Variant>

      <Variant label="overflow menu (3+ actions collapse into More)">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button variant="primary" size="sm">
            Review
          </Button>
          <Button variant="secondary" size="sm">
            Snooze
          </Button>
          <Flyout
            placement="bottom-end"
            trigger={({ open, toggle }) => (
              <IconButton
                variant="secondary"
                size="sm"
                aria-label="More actions"
                aria-expanded={open}
                onClick={toggle}
              >
                <MoreIcon />
              </IconButton>
            )}
          >
            {({ close }) => (
              <div className="flyout-menu" style={{ minWidth: 180 }}>
                <button className="flyout-menu-item" onClick={close}>
                  <span className="flyout-menu-icon">
                    <EditIcon />
                  </span>
                  Edit
                </button>
                <button className="flyout-menu-item" onClick={close}>
                  <span className="flyout-menu-icon">
                    <DuplicateIcon />
                  </span>
                  Duplicate
                </button>
                <button className="flyout-menu-item" onClick={close}>
                  <span className="flyout-menu-icon">
                    <ArchiveIcon />
                  </span>
                  Archive
                </button>
                <div className="flyout-menu-sep" />
                <button className="flyout-menu-item flyout-menu-item--danger" onClick={close}>
                  <span className="flyout-menu-icon">
                    <TrashIcon />
                  </span>
                  Delete
                </button>
              </div>
            )}
          </Flyout>
        </div>
      </Variant>
    </div>
  )
}

const DEFAULT_MODAL_BODY = `Once deleted, this challenge and its logged minutes won't appear in any reports or student dashboards. You can still see it in the audit log for 30 days.

If you only want to pause logging without losing data, archive the challenge instead.`

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="3" x2="11" y2="11" />
      <line x1="11" y1="3" x2="3" y2="11" />
    </svg>
  )
}

function CenteredModalKnobs() {
  const [open, setOpen] = useState(false)
  const [variant, setVariant] = useState('center')
  const [withClose, setClose] = useState(true)
  const [withImage, setImage] = useState(false)
  const [withFooter, setFooter] = useState(true)
  const [destructive, setDest] = useState(false)
  const [title, setTitle] = useState('Delete this challenge?')
  const [body, setBody] = useState(DEFAULT_MODAL_BODY)

  return (
    <>
      <Knobs>
        <Field label="variant">
          <Select value={variant} onChange={(e) => setVariant(e.target.value)}>
            <option value="center">center</option>
            <option value="side">side</option>
          </Select>
        </Field>
        <Field label="title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="close btn">
          <Toggle checked={withClose} onChange={setClose} />
        </Field>
        <Field label="banner image">
          <Toggle checked={withImage} onChange={setImage} />
        </Field>
        <Field label="footer">
          <Toggle checked={withFooter} onChange={setFooter} />
        </Field>
        <Field label="destructive">
          <Toggle checked={destructive} onChange={setDest} />
        </Field>
        <Field label="body" className="pt-knob-full">
          <Textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Button onClick={() => setOpen(true)}>Open {variant} modal</Button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} variant={variant} ariaLabel={title}>
        {({ close }) => (
          <>
            {withImage && (
              <img
                className="modal-image"
                alt=""
                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1040&q=70"
              />
            )}
            {withImage && withClose && (
              <IconButton
                variant="secondary"
                size="sm"
                onClick={close}
                aria-label="Close"
                className="modal-close modal-close--floating"
              >
                <CloseIcon />
              </IconButton>
            )}
            <div className={`modal-header${withImage ? ' modal-header--flush' : ''}`}>
              <div className="modal-header-text">
                <h3 className="modal-title">{title}</h3>
              </div>
              {!withImage && withClose && (
                <IconButton
                  variant="ghost"
                  size="sm"
                  onClick={close}
                  aria-label="Close"
                  className="modal-close"
                >
                  <CloseIcon />
                </IconButton>
              )}
            </div>
            <div className="modal-body">
              {body.split(/\n{2,}/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            {withFooter && (
              <div className="modal-footer">
                <Button variant="ghost" onClick={close}>
                  Cancel
                </Button>
                <Button variant={destructive ? 'danger' : 'primary'} onClick={close}>
                  {destructive ? 'Delete challenge' : 'Confirm'}
                </Button>
              </div>
            )}
          </>
        )}
      </Modal>
    </>
  )
}

const SP_SECTIONS = [
  { id: 'overview', label: 'Overview', icon: 'overview', color: '#475569' },
  { id: 'motivation', label: 'Motivation', icon: 'flame', color: '#E8866A' },
  { id: 'integrity', label: 'Integrity', icon: 'shield', color: '#1D4ED8' },
  { id: 'habits', label: 'Habits', icon: 'habits', color: '#16A97A' },
  { id: 'skills', label: 'Skills', icon: 'book', color: '#7C3AED' },
]

const SP_EMPTY = {
  overview: {
    title: 'No data yet',
    description: 'Once this student logs reading sessions, their overview will appear here.',
  },
  motivation: {
    title: 'No motivation data',
    description: "Complete the RMI survey to see this student's intrinsic and extrinsic scores.",
  },
  integrity: {
    title: 'No Book Talks logged',
    description: 'Verification activity for this student will show up after their first Book Talk.',
  },
  habits: {
    title: 'No reading sessions',
    description:
      'Session length, streaks, and frequency populate after this student starts logging.',
  },
  skills: {
    title: 'No Lexile scores yet',
    description: 'Lexile growth requires at least two assessment data points.',
  },
}

function EmptyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="16" y1="16" x2="21" y2="21" />
    </svg>
  )
}

function SpNavIcon({ name }) {
  const props = {
    viewBox: '0 0 20 20',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.6',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    width: 20,
    height: 20,
  }
  switch (name) {
    case 'overview':
      return (
        <svg {...props}>
          <circle cx="10" cy="7" r="3" />
          <path d="M3 17c0-3.3 3.1-6 7-6s7 2.7 7 6" />
        </svg>
      )
    case 'flame':
      return (
        <svg {...props}>
          <path d="M10 2c.2 2.2-1.1 3.2-2.3 4.4C6.5 7.6 5 9.1 5 11.5 5 14.5 7.2 17 10 17s5-2.5 5-5.5c0-1.7-.6-2.7-1.4-3.4" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...props}>
          <path d="M10 2.5 16 4.5v5.7c0 3.7-2.7 6.7-6 7.6-3.3-.9-6-3.9-6-7.6V4.5z" />
          <polyline points="7,10 9.2,12.2 13.2,8" />
        </svg>
      )
    case 'habits':
      return (
        <svg {...props}>
          <rect x="3" y="4.5" width="14" height="13" rx="1.6" />
          <line x1="3" y1="8.5" x2="17" y2="8.5" />
          <line x1="7" y1="2.5" x2="7" y2="5.5" />
          <line x1="13" y1="2.5" x2="13" y2="5.5" />
        </svg>
      )
    case 'book':
      return (
        <svg {...props}>
          <path d="M3 4c0-.6.4-1 1-1h5.5v14H4c-.6 0-1-.4-1-1V4z" />
          <path d="M17 4c0-.6-.4-1-1-1h-5.5v14H16c.6 0 1-.4 1-1V4z" />
          <line x1="9.5" y1="3" x2="9.5" y2="17" />
        </svg>
      )
    default:
      return null
  }
}

function SideModalShowcase() {
  const [open, setOpen] = useState(false)
  const [section, setSection] = useState('overview')
  const [variant, setVariant] = useState('side')
  const [withActions, setActions] = useState(true)
  const empty = SP_EMPTY[section]
  return (
    <>
      <Knobs>
        <Field label="variant">
          <Select value={variant} onChange={(e) => setVariant(e.target.value)}>
            <option value="side">side</option>
            <option value="center">center</option>
          </Select>
        </Field>
        <Field label="section">
          <Select value={section} onChange={(e) => setSection(e.target.value)}>
            {SP_SECTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="header actions">
          <Toggle checked={withActions} onChange={setActions} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Button onClick={() => setOpen(true)}>Open student panel</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          variant={variant}
          ariaLabel="Marcus Chen — student profile"
        >
        {({ close }) => (
          <div className="sp-shell">
            {/* Left vertical nav (BeanstackProfile-style) */}
            <nav className="sp-nav">
              {SP_SECTIONS.map((s, i) => {
                const active = section === s.id
                return (
                  <Fragment key={s.id}>
                    <button
                      type="button"
                      className={`sp-nav-item${active ? ' sp-nav-item--active' : ''}`}
                      style={
                        active
                          ? {
                              '--nav-active-color': s.color,
                              '--nav-active-bg': `color-mix(in srgb, ${s.color} 12%, white)`,
                            }
                          : undefined
                      }
                      onClick={() => setSection(s.id)}
                      title={s.label}
                    >
                      <span className="sp-nav-icon">
                        <SpNavIcon name={s.icon} />
                      </span>
                      <span className="sp-nav-label">{s.label}</span>
                    </button>
                    {i === 0 && <div className="sp-nav-divider" />}
                  </Fragment>
                )
              })}
            </nav>

            {/* Main pane */}
            <div className="sp-pane">
              <div className="sp-pane-header">
                <div className="sp-pane-identity">
                  <Avatar initials="MC" color="#7C3AED" size="md" />
                  <div className="sp-pane-identity-text">
                    <div className="sp-pane-name">Marcus Chen</div>
                    <div className="sp-pane-meta">Grade 5 · Lincoln Elementary</div>
                  </div>
                </div>
                <div className="sp-pane-actions">
                  {withActions && (
                    <Button variant="secondary" size="sm">
                      Log reading
                    </Button>
                  )}
                  <IconButton variant="ghost" size="sm" onClick={close} aria-label="Close">
                    <CloseIcon />
                  </IconButton>
                </div>
              </div>

              <div className="sp-pane-body">
                <EmptyState
                  icon={<EmptyIcon />}
                  title={empty.title}
                  description={empty.description}
                  action={
                    <Button variant="secondary" size="sm">
                      Get started
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        )}
        </Modal>
      </div>
    </>
  )
}

function BannerKnobs() {
  const [level, setLevel] = useState('info')
  const [title, setTitle] = useState('Heads up')
  const [message, setMessage] = useState('The Reading Information System rolls out next Monday.')
  const [hasAction, setAction] = useState(false)
  const [hasDismiss, setDismiss] = useState(true)
  const [customIcon, setCustomIcon] = useState(false)
  const sparkleIcon = (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1.5l1.9 4 4.4.6-3.2 3.1.8 4.3L8 11.4l-4 2.1.8-4.3L1.7 6.1 6.1 5.5z" />
    </svg>
  )
  return (
    <>
      <Knobs>
        <Field label="level">
          <Select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option>info</option>
            <option>success</option>
            <option>warning</option>
            <option>error</option>
          </Select>
        </Field>
        <Field label="title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="message">
          <Input value={message} onChange={(e) => setMessage(e.target.value)} />
        </Field>
        <Field label="custom icon">
          <Toggle checked={customIcon} onChange={setCustomIcon} />
        </Field>
        <Field label="action">
          <Toggle checked={hasAction} onChange={setAction} />
        </Field>
        <Field label="dismiss">
          <Toggle checked={hasDismiss} onChange={setDismiss} />
        </Field>
      </Knobs>
      <Banner
        level={level}
        title={title}
        icon={customIcon ? sparkleIcon : undefined}
        action={
          hasAction ? (
            <Button variant="secondary" size="sm">
              View
            </Button>
          ) : undefined
        }
        onDismiss={hasDismiss ? () => {} : undefined}
      >
        {message}
      </Banner>
    </>
  )
}

function AccordionKnobs() {
  const [accent, setAccent] = useState('#1D4ED8')
  const [multi, setMulti] = useState(false)
  const [count, setCount] = useState('3')
  const ITEMS = [
    {
      id: 'a',
      title: 'What is the Reading Motivation Index?',
      content:
        'The RMI is a composite score 0–100 derived from ten survey factors (five intrinsic, five extrinsic) collected three times a year.',
    },
    {
      id: 'b',
      title: 'How is the Lexile plateau alert triggered?',
      content:
        "When a school's average Lexile growth is below 5% of the expected annual gain across 6 consecutive weeks despite engagement above 85%.",
    },
    {
      id: 'c',
      title: 'Can I export this dashboard?',
      content: 'Yes — use the kebab menu in the top-right of any chart to export a PNG or CSV.',
    },
    {
      id: 'd',
      title: 'How often is data refreshed?',
      content:
        'Reading logs sync every 15 minutes. Lexile assessments sync nightly. RMI surveys update on the next page load after submission.',
    },
    {
      id: 'e',
      title: 'Who can see flagged students?',
      content:
        'Only users with the District Admin or School Lead role. Teachers see only the students in their own roster.',
    },
  ]
  const items = ITEMS.slice(0, Number(count) || 3)
  return (
    <>
      <Knobs>
        <Field label="accent">
          <input
            className="pt-color"
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
          />
        </Field>
        <Field label="allow multiple">
          <Toggle checked={multi} onChange={setMulti} />
        </Field>
        <Field label="items">
          <Select value={count} onChange={(e) => setCount(e.target.value)}>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </Select>
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Accordion accent={accent} allowMultiple={multi} defaultOpen={['a']} items={items} />
      </div>
    </>
  )
}

function EmptyStateKnobs() {
  const [title, setTitle] = useState('No students to watch')
  const [desc, setDesc] = useState(
    'Students appear here when they trip a habit, integrity, or skill alert. Adjust your thresholds to see more.',
  )
  const [iconKey, setIcon] = useState('search')
  const [actionText, setActionText] = useState('Set thresholds')
  const [hasAction, setHas] = useState(true)
  const ICONS = {
    search: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="16" y1="16" x2="21" y2="21" />
      </svg>
    ),
    inbox: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 13l3-9h12l3 9" />
        <path d="M3 13v6a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-6" />
        <path d="M3 13h6l1 2h4l1-2h6" />
      </svg>
    ),
    book: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v15a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2z" />
        <path d="M4 18a2 2 0 0 1 2-2h13" />
      </svg>
    ),
    chart: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 21h18" />
        <rect x="6" y="13" width="3" height="6" />
        <rect x="11" y="9" width="3" height="10" />
        <rect x="16" y="5" width="3" height="14" />
      </svg>
    ),
  }
  return (
    <>
      <Knobs>
        <Field label="title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="icon">
          <Select value={iconKey} onChange={(e) => setIcon(e.target.value)}>
            <option value="search">search</option>
            <option value="inbox">inbox</option>
            <option value="book">book</option>
            <option value="chart">chart</option>
          </Select>
        </Field>
        <Field label="action">
          <Toggle checked={hasAction} onChange={setHas} />
        </Field>
        {hasAction && (
          <Field label="action text">
            <Input value={actionText} onChange={(e) => setActionText(e.target.value)} />
          </Field>
        )}
        <Field label="description" className="pt-knob-full">
          <Textarea rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <EmptyState
          icon={ICONS[iconKey]}
          title={title}
          description={desc}
          action={hasAction ? <Button variant="secondary">{actionText}</Button> : undefined}
        />
      </div>
    </>
  )
}

function SectionHeadingKnobs() {
  const [title, setTitle] = useState('Students to Watch')
  const [subtitle, setSubtitle] = useState('Last 30 days · 4 students flagged')
  const [level, setLevel] = useState('h3')
  const [withAction, setAction] = useState(true)
  const [withSub, setSub] = useState(true)
  return (
    <>
      <Knobs>
        <Field label="title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="subtitle">
          <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </Field>
        <Field label="level">
          <Select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option>h2</option>
            <option>h3</option>
            <option>h4</option>
          </Select>
        </Field>
        <Field label="show subtitle">
          <Toggle checked={withSub} onChange={setSub} />
        </Field>
        <Field label="show action">
          <Toggle checked={withAction} onChange={setAction} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <SectionHeading
          title={title}
          subtitle={withSub ? subtitle : undefined}
          level={level}
          action={
            withAction ? (
              <Button variant="ghost" size="sm">
                View all →
              </Button>
            ) : undefined
          }
        />
      </div>
    </>
  )
}

function TableKnobs() {
  const [zebra, setZebra] = useState(false)
  const [compact, setCompact] = useState(false)
  const [bordered, setBordered] = useState(false)
  const [flush, setFlush] = useState(false)
  const [collapse, setCollapse] = useState(false)
  const [stickyHeader, setStickyHeader] = useState(false)
  const [sortable, setSortable] = useState(false)
  const [defaultSortKey, setDefaultSortKey] = useState('none')
  const [defaultSortDir, setDefaultSortDir] = useState('asc')
  const [paginate, setPaginate] = useState(false)
  const [scrollX, setScrollX] = useState(false)
  const [clickable, setClick] = useState(true)
  const [highlight, setHL] = useState(false)
  const [state, setState] = useState('data') // data | empty | loading

  const renderDelta = (v) => (
    <span style={{ color: v >= 0 ? '#16A34A' : '#DC2626', fontWeight: 700 }}>
      {v >= 0 ? '↑' : '↓'} {Math.abs(v)} pts
    </span>
  )

  const columns = [
    { key: 'name', label: 'School', sortable },
    {
      key: 'students',
      label: 'Students',
      align: 'right',
      sortable,
      render: (v) => v.toLocaleString(),
    },
    { key: 'rmi', label: 'RMI', align: 'right', sortable },
    { key: 'delta', label: 'YoY', align: 'right', render: renderDelta },
  ]

  return (
    <>
      <Knobs>
        <Field label="state">
          <Select value={state} onChange={(e) => setState(e.target.value)}>
            <option value="data">with data</option>
            <option value="empty">empty</option>
            <option value="loading">loading</option>
          </Select>
        </Field>
        <Field label="zebra">
          <Toggle checked={zebra} onChange={setZebra} />
        </Field>
        <Field label="compact">
          <Toggle checked={compact} onChange={setCompact} />
        </Field>
        <Field label="bordered">
          <Toggle checked={bordered} onChange={setBordered} />
        </Field>
        <Field label="flush">
          <Toggle checked={flush} onChange={setFlush} />
        </Field>
        <Field label="collapse">
          <Toggle checked={collapse} onChange={setCollapse} />
        </Field>
        <Field label="stickyHeader">
          <Toggle checked={stickyHeader} onChange={setStickyHeader} />
        </Field>
        <Field label="sortable cols">
          <Toggle checked={sortable} onChange={setSortable} />
        </Field>
        {sortable && (
          <Field label="defaultSortKey">
            <Select value={defaultSortKey} onChange={(e) => setDefaultSortKey(e.target.value)}>
              <option value="none">none</option>
              <option value="name">name</option>
              <option value="students">students</option>
              <option value="rmi">rmi</option>
            </Select>
          </Field>
        )}
        {sortable && defaultSortKey !== 'none' && (
          <Field label="defaultSortDir">
            <Select value={defaultSortDir} onChange={(e) => setDefaultSortDir(e.target.value)}>
              <option value="asc">asc</option>
              <option value="desc">desc</option>
            </Select>
          </Field>
        )}
        <Field label="pagination">
          <Toggle checked={paginate} onChange={setPaginate} />
        </Field>
        <Field label="scrollX">
          <Toggle checked={scrollX} onChange={setScrollX} />
        </Field>
        <Field label="clickable">
          <Toggle checked={clickable} onChange={setClick} />
        </Field>
        <Field label="highlight Lincoln">
          <Toggle checked={highlight} onChange={setHL} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <Table
          key={`${sortable && defaultSortKey !== 'none' ? defaultSortKey : ''}-${defaultSortDir}`}
          columns={columns}
          rows={state === 'empty' ? [] : TABLE_ROWS}
          zebra={zebra}
          compact={compact}
          bordered={bordered}
          flush={flush}
          collapse={collapse}
          stickyHeader={stickyHeader}
          scrollX={scrollX}
          className={scrollX ? 'pt-tbl-wide' : ''}
          loading={state === 'loading'}
          empty="No schools match the current filter."
          onRowClick={clickable ? () => {} : undefined}
          highlightRow={highlight ? (r) => r.id === 'lincoln' : undefined}
          pageSize={paginate ? 3 : undefined}
          defaultSortKey={
            sortable && defaultSortKey !== 'none' ? defaultSortKey : undefined
          }
          defaultSortDir={defaultSortDir}
        />
      </div>
    </>
  )
}

// ── Knobs panel wrapper ──────────────────────────────────────────────────

export const moleculesSections = [
  {
    group: 'molecules',
    id: 'tabs',
    name: "Tabs",
    desc: (
      <>
                  Horizontal tab strip. <code>items</code> is{' '}
                  <code>{'[{ id, label, count?, icon? }]'}</code>. Two variants:{' '}
                  <code>underline</code> (default) and <code>pill</code>. The underline
                  variant also doubles as a full-bleed header tab bar inside a modal
                  (see the in-modal example below).
                </>
    ),
    render: () => (
      <>
              <TabsKnobs />
              <TabsShowcase />
            </>
    ),
  },
  {
    group: 'molecules',
    id: 'flyout',
    name: "Flyout",
    desc: (
      <>
                  Anchored popover triggered by a button. Closes on outside click + Escape. Children
                  can be JSX or a render function that receives <code>{'{ close }'}</code>.{' '}
                  <strong>Overflow rule:</strong> when a button row has 3+ actions, collapse the
                  secondary ones into a <code>More</code> (kebab) flyout.
                </>
    ),
    render: () => (
      <>
              <FlyoutKnobs />
              <FlyoutShowcase />
            </>
    ),
  },
  {
    group: 'molecules',
    id: 'modal',
    name: "Modal",
    desc: (
      <>
                  Two variants: <code>side</code> (right-slide panel) and <code>center</code>{' '}
                  (overlay). Both close on backdrop click + Escape and animate in/out. The centered
                  modal composes from <code>.modal-image</code>, <code>.modal-header</code>,{' '}
                  <code>.modal-body</code>, <code>.modal-footer</code> — toggle each below.
                </>
    ),
    render: () => (
      <>
              <div className="pt-variant">
                <div className="pt-variant-label">variant='center' (overlay)</div>
                <CenteredModalKnobs />
              </div>
              <div className="pt-variant">
                <div className="pt-variant-label">variant='side' (slide-in)</div>
                <SideModalShowcase />
              </div>
            </>
    ),
  },
  {
    group: 'molecules',
    id: 'banner',
    name: "Banner",
    desc: (
      <>
                  Page-level alert / banner. Levels: <code>info</code>, <code>success</code>,{' '}
                  <code>warning</code>, <code>error</code>. Optional <code>title</code>,{' '}
                  <code>action</code>, <code>onDismiss</code>.
                </>
    ),
    render: () => (
      <>
              <BannerKnobs />
            </>
    ),
  },
  {
    group: 'molecules',
    id: 'accordion',
    name: "Accordion",
    desc: (
      <>
                  Expand/collapse list. Pass <code>items</code> as{' '}
                  <code>{'[{ id, title, content }]'}</code>. Optional <code>accent</code> color,{' '}
                  <code>allowMultiple</code>, <code>defaultOpen</code>.
                </>
    ),
    render: () => (
      <>
              <AccordionKnobs />
            </>
    ),
  },
  {
    group: 'molecules',
    id: 'breadcrumb',
    name: "Breadcrumb",
    desc: (
      <>
                  Navigation crumbs. Pass <code>items</code> as <code>{'[{ label, href? }]'}</code>{' '}
                  — the last item is treated as the current page and rendered without a link.
                </>
    ),
    render: () => (
      <>
              <div className="pt-variant-frame">
                <Breadcrumb
                  items={[
                    { label: 'Schools', href: '#' },
                    { label: 'Lincoln Elementary', href: '#' },
                    { label: 'Motivation' },
                  ]}
                />
              </div>
            </>
    ),
  },
  {
    group: 'molecules',
    id: 'empty-state',
    name: "EmptyState",
    desc: (
      <>
                  Empty-list placeholder. Props: <code>icon</code>, <code>title</code>,{' '}
                  <code>description</code>, <code>action</code>.
                </>
    ),
    render: () => (
      <>
              <EmptyStateKnobs />
            </>
    ),
  },
  {
    group: 'molecules',
    id: 'section-heading',
    name: "SectionHeading",
    desc: (
      <>
                  Recurring h2/h3 + optional subtitle + optional right-side action. Used as the
                  header inside content sections / cards.
                </>
    ),
    render: () => (
      <>
              <SectionHeadingKnobs />
            </>
    ),
  },
  {
    group: 'molecules',
    id: 'table',
    name: "Table",
    desc: (
      <>
                  Pass <code>columns</code> and <code>rows</code>. Each column can have{' '}
                  <code>align</code>, <code>render</code>, <code>width</code>, <code>sortable</code>
                  . Props: <code>zebra</code>, <code>compact</code>, <code>flush</code>,{' '}
                  <code>pageSize</code> (enables pagination), <code>defaultSortKey</code>.
                </>
    ),
    render: () => (
      <>
              <TableKnobs />
            </>
    ),
  },
]
