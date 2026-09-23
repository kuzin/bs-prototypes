import { Modal, ModalClose } from '@components/Modal/Modal'
import { Button } from '@components/Button/Button'
import { SettingList, SettingRow } from '@components/SettingRow/SettingRow'
import { Icon } from '@components/Icon/Icon'
import '@components/SettingRow/SettingRow.css'
import { PartnerMark } from './PartnerBits'

/* Every way the Collection Engine knows a school can put a book in a reader's
   hands, in the engine's own order — what it owns outright, what it borrows,
   and the two shelves it can walk to — plus the one switch that is a format
   rather than a source.

   The engine's four `SOURCES` are Comics Plus (`own`), Sora (`hold`), Follett
   Destiny (`shelf`, from a MARC drop) and the Classroom Library (`shelf`,
   scanned by teachers). Libby and Scholastic are this app's, and sit with the
   ones they behave like. The list used to be four rows that happened to be the
   integrations somebody had wired up, which meant a school could not turn off
   the two shelves the engine was quietly counting. */
const FEATURES = [
  {
    key: 'comicsplus',
    title: 'Comics Plus',
    desc: 'Unlimited comics, graphic novels & magazines — no holds, no waitlists.',
  },
  {
    key: 'scholastic',
    title: 'Scholastic Magazines',
    desc: 'Classroom magazines — fresh issues every month, leveled for your grade.',
  },
  {
    key: 'sora',
    title: 'Sora Borrowing',
    desc: 'Ebooks and audiobooks borrowed through OverDrive.',
  },
  {
    key: 'libby',
    title: 'Libby Borrowing',
    desc: 'Borrow ebooks & audiobooks free from your public library, via Libby.',
  },
  {
    key: 'library',
    title: 'School Library',
    desc: 'Print holdings from the school library catalog, via a MARC drop.',
  },
  {
    key: 'classroom',
    title: 'Classroom Library',
    desc: 'Books teachers have scanned onto their own classroom shelves.',
  },
  {
    key: 'audiobooks',
    title: 'Audio Books',
    desc: 'Offer audiobooks and the “Great on audio” shelf.',
  },
]

/* Audiobooks are a format rather than a partner, so the one row with no brand
   behind it gets a glyph on a disc in its place — the shape a mark leaves. */
function FeatureMark({ feature }) {
  if (feature === 'audiobooks') {
    return (
      <span
        className="bk-pmark bk-pmark--glyph"
        style={{ width: 34, height: 34, background: '#0D9488' }}
      >
        <Icon name="headphones" size={18} color="#fff" />
      </span>
    )
  }
  return <PartnerMark id={feature} size={34} />
}

/**
 * Which title sources this site has turned on — a reviewer's switch rather
 * than a reader's, which is why it lives on the preview bar.
 *
 * "Reading apps" named half of what is in here: two of these are shelves, not
 * apps, and one is a format. A source is what they have in common — every way
 * a title can reach this reader.
 *
 * The modal's own chrome: a header bar with a rule under it, a body that
 * scrolls, and the answer on a footer — the shape every other modal in the
 * system uses, in place of the header, intro and foot this drew for itself. The
 * switches are the shared SettingRow, each led by the partner's real mark.
 */
export function SettingsModal({ open, onClose, settings, onToggle }) {
  return (
    <Modal open={open} onClose={onClose} variant="center" closeBadge ariaLabel="Title sources">
      <ModalClose onClick={onClose} />

      <div className="modal-header">
        <div className="modal-header-text">
          <h2 className="modal-title">Title sources</h2>
          <p className="modal-sub">Which ways a title can reach this reader.</p>
        </div>
      </div>

      <div className="modal-body">
        <SettingList>
          {FEATURES.map((f) => (
            <SettingRow
              key={f.key}
              icon={<FeatureMark feature={f.key} />}
              label={f.title}
              sub={f.desc}
              checked={settings[f.key]}
              onChange={() => onToggle(f.key)}
            />
          ))}
        </SettingList>
      </div>

      <div className="modal-footer">
        <Button variant="primary" onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  )
}
