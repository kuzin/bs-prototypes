import { Fragment, useState } from 'react'
import { Button } from '@components/Button/Button'
import { Pill } from '@components/Pill/Pill'
import { Tabs } from '@components/Tabs/Tabs'
import { ToastStack, useToasts } from '@components/Toast/Toast'
import { Flyout } from '@components/Flyout/Flyout'
import { Modal, ModalClose } from '@components/Modal/Modal'
import { PlumpyIcon } from '@components/PlumpyIcon/PlumpyIcon'
import { Table } from '@components/Table/Table'
import { Avatar } from '@components/Avatar/Avatar'
import { Toggle } from '@components/Toggle/Toggle'
import { ColorInput, Field, Input, Select, Textarea } from '@components/Form/Form'
import { SettingRow, SettingList } from '@components/SettingRow/SettingRow'
import {
  Accordion,
  Banner,
  Breadcrumb,
  EmptyState,
  IconButton,
} from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import { Confetti } from '@components/Confetti/Confetti'
import {
  Knobs,
  Variant,
  PlusIcon,
  CaretIcon,
  EditIcon,
  DuplicateIcon,
  ArchiveIcon,
  TrashIcon,
  MoreIcon,
  TABLE_ROWS,
} from './_shared'

function ToastDemo() {
  const { toasts, push, dismiss } = useToasts()
  return (
    <>
      <div className="pt-variant-frame--row" style={{ display: 'flex', gap: 8, padding: 14 }}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => push({ title: 'Activity marked complete', body: 'Space' })}
        >
          success
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => push({ title: 'Badge earned', body: 'Space', tone: 'info' })}
        >
          info
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => push({ title: 'Nothing to update', tone: 'warning' })}
        >
          warning
        </Button>
      </div>
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </>
  )
}

function TabsShowcase() {
  const [a, setA] = useState('daily')
  const [b, setB] = useState('overview')
  const [c, setC] = useState('details')
  const [seg, setSeg] = useState('classes')
  const [folder, setFolder] = useState('schools')
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
          block
          active={b}
          onChange={setB}
          items={[
            { id: 'overview', label: 'Overview' },
            { id: 'detail', label: 'Detail' },
            { id: 'history', label: 'History' },
          ]}
        />
      </Variant>
      <Variant label="folder variant — tabs on top of a panel">
        {/* On a grey ground, because the whole point of the variant is that the
            active tab is white — on a white card there's nothing to read it against. */}
        <div
          style={{
            width: '100%',
            background: 'var(--c-gray-200)',
            padding: 16,
            borderRadius: 10,
          }}
        >
          {/* Inset by the panel's border width: the panel's *interior* is what
              the active tab has to be flush with, and its 2px outline sits
              outside that. Without this the tabs overhang the panel by 2px at
              each end. */}
          <div style={{ padding: '0 2px' }}>
            <Tabs
              variant="folder"
              size="sm"
              block
              active={folder}
              onChange={setFolder}
              items={[
                { id: 'schools', label: 'Top Schools' },
                { id: 'grades', label: 'Top Grades' },
              ]}
            />
          </div>
          {/* White, and with no top edge, so the active tab flows straight into
              it as one surface — the same trick the About/Usage tabs use. */}
          <div
            style={{
              padding: '17px 21px',
              fontSize: 'var(--text-body)',
              color: 'var(--c-text-light)',
              background: '#fff',
              border: '2px solid var(--c-gray-150)',
              borderTop: 'none',
              borderRadius: '0 0 8px 8px',
            }}
          >
            The panel the tabs belong to. The active tab is white and the panel is white, so the two
            read as one surface and the inactive tab reads as cut away from it.
          </div>
        </div>
      </Variant>
      <Variant label="underline + center — a short strip inside a card">
        <div
          style={{
            width: '100%',
            background: '#fff',
            border: '1px solid var(--c-border)',
            borderRadius: 12,
            /* No top padding: the tab's own 9px then sits above the label and
               9px below it, so the text is halfway between the card's top edge
               and the rule instead of riding high. */
            padding: '0 14px 12px',
          }}
        >
          <Tabs
            variant="underline"
            size="sm"
            center
            ariaLabel="Leaderboard scope"
            active={c}
            onChange={setC}
            items={[
              { id: 'details', label: 'Top Schools' },
              { id: 'all', label: 'Top Grades' },
            ]}
          />
        </div>
      </Variant>
      <Variant label='pill + size="xs" — for a card header or settings row'>
        <Tabs
          variant="pill"
          size="xs"
          block
          ariaLabel="Overview time range"
          active={c}
          onChange={setC}
          items={[
            { id: 'details', label: 'This School Year' },
            { id: 'all', label: 'All Time' },
          ]}
        />
      </Variant>
      <Variant label="pill + plain — a sub-tab bar on its own band">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: 16,
            background: '#f7f8fa',
            borderBottom: '1px solid var(--c-border)',
          }}
        >
          <Tabs
            variant="pill"
            plain
            ariaLabel="Reading log view"
            active={b}
            onChange={setB}
            items={[
              { id: 'overview', label: 'Reading Log' },
              { id: 'detail', label: 'All Titles' },
            ]}
          />
        </div>
      </Variant>
      <Variant label="pill + block (full-width segmented control)">
        <Tabs
          variant="pill"
          block
          ariaLabel="Leaderboard view"
          active={seg}
          onChange={setSeg}
          items={[
            { id: 'classes', label: 'Top Classes' },
            { id: 'students', label: 'Students' },
          ]}
        />
      </Variant>
      {/* In-modal header tabs: full-bleed underline flush under the modal title,
          with a count pill — as used in the Challenge Creator editor modals. */}
      <Variant label="in a modal — full-bleed header tabs + count pill">
        <div
          style={{
            position: 'relative',
            width: '100%',
            border: '1px solid #eaeaea',
            borderRadius: 14,
            background: '#fff',
            boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
          }}
        >
          <ModalClose onClick={() => {}} />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
            }}
          >
            <strong style={{ fontSize: 18, fontWeight: 800, color: '#2a2a2a' }}>
              Edit activity badge
            </strong>
          </div>
          {/* Negative side margin cancels the body padding so the underline runs edge to edge. */}
          <div style={{ padding: '0 14px' }}>
            <Tabs
              accent="#0CA7BC"
              active={c}
              onChange={setC}
              items={[
                { id: 'details', label: 'Details' },
                { id: 'activities', label: 'Activities', count: 2 },
              ]}
            />
          </div>
          <div style={{ padding: 18, fontSize: 14, color: '#707070' }}>
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
  const [accent, setAccent] = useState('#196DD5')
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
          <ColorInput chip size="sm" value={accent} onChange={setAccent} />
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
  return <Icon name="x" />
}

function CenteredModalKnobs() {
  const [open, setOpen] = useState(false)
  const [closeStyle, setCloseStyle] = useState('badge')
  const [withImage, setImage] = useState(false)
  const [withFooter, setFooter] = useState(true)
  const [destructive, setDest] = useState(false)
  const [title, setTitle] = useState('Delete this challenge?')
  const [body, setBody] = useState(DEFAULT_MODAL_BODY)

  return (
    <>
      <Knobs examples={false}>
        <Field label="title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="close">
          <Select value={closeStyle} onChange={(e) => setCloseStyle(e.target.value)}>
            <option value="badge">badge (the app&apos;s)</option>
            <option value="inline">inline</option>
            <option value="none">none</option>
          </Select>
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
        <Button onClick={() => setOpen(true)}>Open modal</Button>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        variant="center"
        ariaLabel={title}
        closeBadge={closeStyle === 'badge'}
      >
        {({ close }) => (
          <>
            {closeStyle === 'badge' && <ModalClose onClick={close} />}
            {withImage && (
              <img
                className="modal-image"
                alt=""
                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1040&q=70"
              />
            )}
            {withImage && closeStyle === 'inline' && (
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
              {!withImage && closeStyle === 'inline' && (
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

// No rail of its own — the page has one, above. The section nav inside the
// panel is the control here, which is truer to how it's actually driven.

function BannerKnobs() {
  const [level, setLevel] = useState('info')
  const [title, setTitle] = useState('Heads up')
  const [message, setMessage] = useState('The Reading Information System rolls out next Monday.')
  const [hasAction, setAction] = useState(false)
  const [hasDismiss, setDismiss] = useState(true)
  const [customIcon, setCustomIcon] = useState(false)
  const sparkleIcon = <Icon name="star-filled" />
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

const FAQ = [
  {
    id: 'streaks',
    title: 'How do reading streaks work?',
    content: <p>Log on consecutive days.</p>,
  },
  {
    id: 'badges',
    title: 'When are badges awarded?',
    content: <p>Overnight, after a log lands.</p>,
  },
  { id: 'goals', title: 'Can a goal be changed mid-challenge?', content: <p>Yes, by an admin.</p> },
]

function AccordionShowcase() {
  return (
    <>
      <Variant label="one open at a time (default)">
        <Accordion items={FAQ} defaultOpen={['streaks']} />
      </Variant>

      <Variant label="allowMultiple — several open at once">
        <Accordion items={FAQ} allowMultiple defaultOpen={['streaks', 'badges']} />
      </Variant>

      <Variant label="accent — tints the open row">
        <Accordion items={FAQ} accent="var(--c-teal)" defaultOpen={['streaks']} />
      </Variant>

      <Variant label="all closed — no defaultOpen">
        <Accordion items={FAQ} />
      </Variant>
    </>
  )
}

function AccordionKnobs() {
  const [accent, setAccent] = useState('#196DD5')
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
          <ColorInput chip size="sm" value={accent} onChange={setAccent} />
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
  const [iconKey, setIcon] = useState('filter')
  const [actionText, setActionText] = useState('Set thresholds')
  const [hasAction, setHas] = useState(true)
  const [variant, setVariant] = useState('plain')
  // Plumpy rather than the stroked registry: an empty state's icon is the only
  // art on the surface, and a hairline glyph in a 52px tile reads as a loading
  // placeholder.
  const ICONS = {
    filter: <PlumpyIcon name="filter" />,
    log: <PlumpyIcon name="log" />,
    book: <PlumpyIcon name="book" />,
    insights: <PlumpyIcon name="insights" />,
    chat: <PlumpyIcon name="chat" />,
    trophy: <PlumpyIcon name="trophy" />,
  }
  return (
    <>
      <Knobs>
        <Field label="title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="icon">
          <Select value={iconKey} onChange={(e) => setIcon(e.target.value)}>
            <option value="filter">filter</option>
            <option value="log">log</option>
            <option value="book">book</option>
            <option value="insights">insights</option>
            <option value="chat">chat</option>
            <option value="trophy">trophy</option>
          </Select>
        </Field>
        <Field label="variant">
          <Select value={variant} onChange={(e) => setVariant(e.target.value)}>
            <option value="plain">plain</option>
            <option value="dashed">dashed</option>
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
          variant={variant}
          icon={ICONS[iconKey]}
          title={title}
          description={desc}
          action={hasAction ? <Button variant="secondary">{actionText}</Button> : undefined}
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
    <span style={{ color: v >= 0 ? '#16A34A' : '#E85648', fontWeight: 700 }}>
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
          stickyHeader={stickyHeader}
          scrollX={scrollX}
          className={scrollX ? 'pt-tbl-wide' : ''}
          loading={state === 'loading'}
          empty="No schools match the current filter."
          onRowClick={clickable ? () => {} : undefined}
          highlightRow={highlight ? (r) => r.id === 'lincoln' : undefined}
          pageSize={paginate ? 3 : undefined}
          defaultSortKey={sortable && defaultSortKey !== 'none' ? defaultSortKey : undefined}
          defaultSortDir={defaultSortDir}
        />
      </div>
    </>
  )
}

// ── Knobs panel wrapper ──────────────────────────────────────────────────

function SettingRowKnobs() {
  const [on, setOn] = useState(true)
  const [label, setLabel] = useState('Require verification')
  const [sub, setSub] = useState('Readers confirm each session before it counts')
  const [control, setControl] = useState('toggle')
  const [state, setState] = useState(true)
  const [size, setSize] = useState('md')
  const [disabled, setDisabled] = useState(false)

  const CONTROLS = {
    toggle: undefined,
    select: (
      <Select value="grade" onChange={() => {}}>
        <option value="grade">By grade</option>
        <option value="all">Everyone</option>
      </Select>
    ),
    button: <Button variant="secondary">Manage</Button>,
    badge: <Pill color="var(--c-green)">3 rules</Pill>,
  }

  return (
    <>
      <Knobs>
        <Field label="label">
          <Input value={label} onChange={(e) => setLabel(e.target.value)} />
        </Field>
        <Field label="sub">
          <Input value={sub} onChange={(e) => setSub(e.target.value)} />
        </Field>
        <Field label="control">
          <Select value={control} onChange={(e) => setControl(e.target.value)}>
            <option value="toggle">toggle (default)</option>
            <option value="select">select</option>
            <option value="button">button</option>
            <option value="badge">badge</option>
          </Select>
        </Field>
        <Field label="toggle size">
          <Select value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="sm">sm</option>
            <option value="md">md</option>
          </Select>
        </Field>
        <Field label="state text">
          <Toggle checked={state} onChange={setState} />
        </Field>
        <Field label="disabled">
          <Toggle checked={disabled} onChange={setDisabled} />
        </Field>
      </Knobs>
      <div className="pt-variant-frame">
        <SettingList>
          <SettingRow
            label={label}
            sub={sub || undefined}
            control={CONTROLS[control]}
            state={control === 'toggle' && state ? (on ? 'Enabled' : 'Disabled') : undefined}
            checked={on}
            onChange={setOn}
            size={size}
            disabled={disabled}
          />
        </SettingList>
      </div>
    </>
  )
}

function SettingRowShowcase() {
  const [a, setA] = useState(false)
  const [b, setB] = useState(true)
  const [c, setC] = useState('grade')
  const [d, setD] = useState(true)
  return (
    <>
      <Variant label="a SettingList of rows — toggle + state text, sub-text, custom control">
        <SettingList>
          <SettingRow
            label="On Title Completions"
            state={a ? 'Enabled' : 'Disabled'}
            checked={a}
            onChange={setA}
          />
          <SettingRow
            label="Featured"
            sub="Pin this challenge to the top of the list"
            checked={b}
            onChange={setB}
          />
          <SettingRow
            label="Audience"
            control={
              <Select value={c} onChange={(e) => setC(e.target.value)}>
                <option value="grade">By grade</option>
                <option value="all">Everyone</option>
              </Select>
            }
          />
          <SettingRow
            label="Reading validation"
            sub="Three rules are active"
            control={<Button variant="secondary">Manage</Button>}
          />
        </SettingList>
      </Variant>

      <Variant label="disabled — the text dims, the control stays put">
        <SettingList>
          <SettingRow
            label="Require verification"
            sub="Turn logging validation on first"
            checked={d}
            onChange={setD}
            disabled
          />
        </SettingList>
      </Variant>
    </>
  )
}

function ConfettiShowcase() {
  // The burst animates once, so replaying it means remounting it.
  const [run, setRun] = useState(0)
  return (
    <div>
      <div
        key={run}
        style={{
          position: 'relative',
          overflow: 'hidden',
          height: 200,
          borderRadius: 14,
          border: '1px solid var(--c-border)',
          background: 'var(--c-bg)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Confetti count={18} distance={220} />
        <strong style={{ position: 'relative', fontSize: 18 }}>🎉 You did it!</strong>
      </div>
      <div style={{ marginTop: 12 }}>
        <Button variant="secondary" size="sm" onClick={() => setRun((n) => n + 1)}>
          Replay
        </Button>
      </div>
    </div>
  )
}

export const moleculesSections = [
  {
    group: 'navigation',
    id: 'tabs',
    name: 'Tabs',
    usage: `import { Tabs } from '@components/Tabs/Tabs'

<Tabs active={tab} onChange={setTab} items={[{ id: 'overview', label: 'Overview' }]} />

/* Segmented control / view switcher — never build a separate component */
<Tabs variant="pill" block active={range} onChange={setRange} items={ranges} />`,
    desc: (
      <>
        Horizontal tab strip. <code>items</code> is <code>{'[{ id, label, count?, icon? }]'}</code>.
        Three variants: <code>underline</code> (default), <code>pill</code> and <code>folder</code>.
        The underline variant also doubles as a full-bleed header tab bar inside a modal (see the
        in-modal example below).
        <br />
        <br />
        <code>folder</code> is for tabs that sit on top of a panel: the active one is white so it
        merges with the panel below, the inactive ones carry the grey so they read as cut away from
        it, and the strip has no rule of its own — the panel supplies the edge. The geometry comes
        from the shipped leaderboard widget, which fills the other way round (its active tab matches
        its own grey action band); <code>web-app</code> keeps that look with a local override. Pair
        it with <code>block</code> for a 50/50 split.
        <br />
        <br />
        If the panel carries a border, inset the strip by that border width — the active tab has to
        line up with the panel&apos;s <em>interior</em>, and the outline sits outside it.
        <br />
        <br />
        <code>plain</code> drops the pill variant&apos;s track and gives the active pill a grey fill
        instead of white — for a sub-tab bar that already sits on a tinted band of its own, where a
        white-on-grey pill would vanish. That&apos;s the reader&apos;s Reading Log and Collections
        bars.
        <br />
        <br />
        <code>center</code> centres the strip in its container — for a short bar inside a card,
        where left-aligning two tabs against a wide panel leaves the rest of the rule looking empty.
        Page-level bars stay left-aligned. The size ladder is <strong>14 / 15 / 16</strong> in both
        variants.
        <br />
        <br />
        <strong>On a phone the underline bar becomes a select.</strong> Three or four page labels
        don&apos;t fit a 375px row, and a strip that scrolls sideways hides the tabs you
        haven&apos;t found yet — so below 699px the tabs give way to a full-width dropdown carrying
        the same items (counts in parentheses). Pill groups keep their buttons: those are segmented
        controls, not navigation, and two short options read better as a control than a dropdown.{' '}
        <code>collapse</code> forces it either way. The select is a child of <code>.tabs</code>, not
        a sibling, so no consumer&apos;s markup or selectors change — CSS swaps which one shows.
        Resize the window below 699px to see it.
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
    group: 'overlays',
    id: 'flyout',
    name: 'Flyout',
    usage: `import { Flyout } from '@components/Flyout/Flyout'

<Flyout placement="bottom-end" trigger={<IconButton aria-label="More"><Icon name="dots" /></IconButton>}>
  {menu}
</Flyout>`,
    desc: (
      <>
        Anchored popover triggered by a button. Closes on outside click + Escape. Children can be
        JSX or a render function that receives <code>{'{ close }'}</code>.{' '}
        <strong>Overflow rule:</strong> when a button row has 3+ actions, collapse the secondary
        ones into a <code>More</code> (kebab) flyout.
        <br />
        <br />
        <strong>Two shapes go inside it.</strong> <code>.flyout-menu</code> is a list of things to
        pick between — one line, one verb, and the whole row is the control.{' '}
        <code>.flyout-rows</code> is a queue of things to <em>act on</em>: a subject, who or what it
        is, and more than one answer per line. The friend-requests queue is the second kind — each
        row is a person, with Accept and Decline opposite. The row takes no hover, because the row
        itself isn&apos;t clickable and lighting it up implied a third thing to press, and the
        answers are <strong>primary and secondary</strong>: one of them is what the bar was asking
        for.
      </>
    ),
    render: () => (
      <>
        <FlyoutKnobs />
        <FlyoutShowcase />
        <Variant label=".flyout-rows — a subject and its answers, not a list to pick from">
          <Flyout
            placement="bottom-start"
            trigger={({ toggle }) => (
              <Button variant="secondary" onClick={toggle}>
                View Requests
              </Button>
            )}
          >
            {() => (
              <div className="flyout-rows" role="menu">
                {[
                  { id: 'maya', name: 'Maya C.', initials: 'MC', color: '#F0966F' },
                  { id: 'theo', name: 'Theo N.', initials: 'TN', color: '#0F766E' },
                ].map((r) => (
                  <div className="flyout-row" key={r.id} role="menuitem">
                    <Avatar initials={r.initials} color={r.color} size="lg" shape="circle" />
                    <div className="flyout-row-body">
                      <span className="flyout-row-title">{r.name}</span>
                    </div>
                    <div className="flyout-row-actions">
                      <Button size="sm">Accept</Button>
                      <Button variant="secondary" size="sm">
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Flyout>
        </Variant>
      </>
    ),
  },
  {
    group: 'overlays',
    id: 'modal',
    name: 'Modal',
    usage: `import { Modal } from '@components/Modal/Modal'

<Modal open={open} onClose={() => setOpen(false)} ariaLabel="Session detail">
  {children}
</Modal>`,
    desc: (
      <>
        Three variants: <code>side</code> (right-slide panel), <code>center</code> (overlay) and{' '}
        <code>full</code> (full-screen surface). The first two close on backdrop click + Escape and
        animate in/out.
        <br />
        <br />
        <strong>
          <code>full</code> is the reader app&apos;s own full-screen flow
        </strong>{' '}
        — a white page over the whole app area with a corner close. It is what the logging flow is,
        and what writing a review is: the app renders both into the same{' '}
        <code>#logged-books--new</code> shell. Use it for a task that <em>takes</em> the screen
        rather than a dialogue that sits over one. It draws no backdrop, because there is nothing
        behind it to click, and it stops at the shell&apos;s <code>--chrome-top</code> /{' '}
        <code>--chrome-bottom</code> rather than the window, so a preview bar or prototype nav stays
        reachable. Compose it from <code>ModalFullClose</code>, an optional{' '}
        <code>ModalFullBack</code>, and a <code>.modal-full-panel</code> for the measure in the
        middle. The centered modal composes from <code>.modal-image</code>,{' '}
        <code>.modal-header</code>, <code>.modal-body</code>, <code>.modal-footer</code> — toggle
        each below. The title is 18px/800 and the body 16px, matching the app&apos;s{' '}
        <code>.modal__title</code> / <code>.modal__content</code>.
        <br />
        <br />
        <code>ModalClose</code> is the app&apos;s own close control — a floating white disc pinned
        just outside the top-right corner (<code>.mfp-close-badge-modal</code>). It needs{' '}
        <code>closeBadge</code> on the Modal so the overhang isn&apos;t clipped, and it&apos;s the
        default in the rail below. It isn&apos;t catalogued on its own because it positions against{' '}
        <code>.modal</code> and has no meaning outside one; the alternative is a plain{' '}
        <code>IconButton</code> in the header, which is the <code>inline</code> option.
      </>
    ),
    render: () => (
      <>
        <CenteredModalKnobs />
      </>
    ),
  },
  {
    group: 'feedback',
    id: 'banner',
    name: 'Banner',
    usage: `import { Banner } from '@components/Primitives/Primitives'

<Banner level="info" title="Roster sync runs nightly" onDismiss={hide}>
  Last run 2 hours ago.
</Banner>`,
    desc: (
      <>
        Page-level alert / banner. Levels: <code>info</code>, <code>success</code>,{' '}
        <code>warning</code>, <code>error</code>. Optional <code>title</code>, <code>action</code>,{' '}
        <code>onDismiss</code>.
      </>
    ),
    render: () => (
      <>
        <BannerKnobs />
      </>
    ),
  },
  {
    group: 'cards',
    id: 'accordion',
    name: 'Accordion',
    usage: `import { Accordion } from '@components/Primitives/Primitives'

<Accordion
  items={[{ id: 'a', title: 'How streaks work', content: <p>…</p> }]}
  allowMultiple
  defaultOpen={['a']}
/>`,
    desc: (
      <>
        Expand/collapse list. Pass <code>items</code> as <code>{'[{ id, title, content }]'}</code>.
        Optional <code>accent</code> color, <code>allowMultiple</code>, <code>defaultOpen</code>.
      </>
    ),
    render: () => (
      <>
        <AccordionKnobs />
        <AccordionShowcase />
      </>
    ),
  },
  {
    group: 'navigation',
    id: 'breadcrumb',
    name: 'Breadcrumb',
    usage: `import { Breadcrumb } from '@components/Primitives/Primitives'

<Breadcrumb items={[{ label: 'Schools', href: '#/schools' }, { label: 'PS 118' }]} />`,
    desc: (
      <>
        Navigation crumbs. Pass <code>items</code> as <code>{'[{ label, href? }]'}</code> — the last
        item is treated as the current page and rendered without a link.
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
    group: 'feedback',
    id: 'empty-state',
    name: 'EmptyState',
    usage: `import { EmptyState } from '@components/Primitives/Primitives'

<EmptyState
  icon={<PlumpyIcon name="log" />}
  title="No sessions yet"
  description="Logged reading will show up here."
  variant="dashed"
  action={<Button size="sm">Log reading</Button>}
/>`,
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
    group: 'tables',
    id: 'table',
    name: 'Table',
    usage: `import { Table } from '@components/Table/Table'

<Table
  columns={[
    { key: 'name', label: 'Reader' },
    { key: 'minutes', label: 'Minutes', align: 'right' },
  ]}
  rows={rows}
  getRowKey={(r) => r.id}
  onRowClick={(r) => open(r.id)}
  stickyHeader
  defaultSortKey="minutes"
  defaultSortDir="desc"
  empty="No sessions yet"
/>`,
    desc: (
      <>
        Pass <code>columns</code> and <code>rows</code>. Each column can have <code>align</code>,{' '}
        <code>render</code>, <code>width</code>, <code>sortable</code>. Props: <code>zebra</code>,{' '}
        <code>compact</code>, <code>flush</code>, <code>pageSize</code> (enables pagination),{' '}
        <code>defaultSortKey</code>.
      </>
    ),
    render: () => (
      <>
        <TableKnobs />
      </>
    ),
  },
  {
    group: 'tables',
    id: 'setting-row',
    name: 'SettingRow',
    usage: `import { SettingList, SettingRow } from '@components/SettingRow/SettingRow'

<SettingList>
  <SettingRow
    label="Require verification"
    sub="Readers confirm each session before it counts"
    checked={on}
    onChange={setOn}
  />
</SettingList>`,
    desc: (
      <>
        A labeled settings row: <code>label</code> (+ optional <code>sub</code>) on the left, a
        control on the right. Defaults to a <code>Toggle</code> (pass <code>checked</code>/
        <code>onChange</code>, plus optional <code>state</code> text like “Disabled”), or pass any{' '}
        <code>control</code>. Wrap rows in <code>&lt;SettingList&gt;</code> for hairline dividers.
      </>
    ),
    render: () => (
      <>
        <SettingRowKnobs />
        <SettingRowShowcase />
      </>
    ),
  },
  {
    group: 'feedback',
    id: 'toast',
    name: 'Toast',
    usage: `import { ToastStack, useToasts } from '@components/Toast/Toast'

const { toasts, push, dismiss } = useToasts()

push({ level: 'success', title: 'Session verified' })

<ToastStack toasts={toasts} onDismiss={dismiss} />`,
    desc: (
      <>
        A bottom-right stack of short confirmations, ported from the app&apos;s own toastr
        (bs-product <code>lib/_toastr.scss</code>): radius 12, 15px, a flat pastel ground per tone
        with the matching dark text — <code>$pastelGreen</code>/<code>$darkGreen</code>,{' '}
        <code>$pastelDenim</code>/<code>$darkDenim</code>, <code>$pastelYellow</code>/
        <code>$darkYellow</code> — on a 6px gap. The app caps at 500px; the stack here is a uniform
        340px, which fits the short confirmations these carry without stretching one across half the
        screen. Lifted clear of the PrototypeNav bar, which the real app doesn&apos;t have.
        <br />
        <br />
        For the thing that just happened and needs acknowledging but not deciding about: an activity
        ticked off, a badge awarded, a goal saved. Anything the user has to answer is a{' '}
        <code>Modal</code>. <code>useToasts()</code> owns the queue —{' '}
        <code>{'{ toasts, push, dismiss }'}</code> — and <code>&lt;ToastStack&gt;</code> renders it;
        it&apos;s a hook rather than a context so a page can hold its own without a provider. The
        stack is <code>position: fixed</code>, so mount it once per page. Each toast clears itself
        after 4s.
      </>
    ),
    render: () => (
      <>
        <Variant label="push one — bottom right, auto-dismiss" full>
          <ToastDemo />
        </Variant>
      </>
    ),
  },
  {
    group: 'feedback',
    id: 'confetti',
    name: 'Confetti',
    usage: `import { Confetti } from '@components/Confetti/Confetti'

/* Fills its nearest positioned ancestor — give that \`position: relative\` */
<div style={{ position: 'relative' }}>
  {won && <Confetti count={80} duration={2200} />}
</div>`,
    desc: (
      <>
        A one-shot celebration burst that fills its nearest positioned ancestor — drop it into a
        modal or card with <code>position: relative</code>. Props: <code>count</code>,{' '}
        <code>colors</code>, <code>duration</code>, <code>distance</code>. Decorative and
        aria-hidden; it doesn’t animate under <code>prefers-reduced-motion</code>.
      </>
    ),
    render: () => (
      <>
        <ConfettiShowcase />
      </>
    ),
  },
]
