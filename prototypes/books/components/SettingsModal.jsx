import { Modal, ModalClose } from '@components/Modal/Modal'
import { Button } from '@components/Button/Button'
import { SettingList, SettingRow } from '@components/SettingRow/SettingRow'
import { Icon } from '@components/Icon/Icon'
import '@components/SettingRow/SettingRow.css'
import { PartnerMark } from './PartnerBits'

const FEATURES = [
  {
    key: 'sora',
    title: 'Sora Borrowing',
    desc: 'Borrow ebooks & audiobooks free from your public library, via Sora.',
  },
  {
    key: 'libby',
    title: 'Libby Borrowing',
    desc: 'Borrow ebooks & audiobooks free from your public library, via Libby.',
  },
  {
    key: 'scholastic',
    title: 'Scholastic Magazines',
    desc: 'Show Scholastic classroom magazines on Discover.',
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
 * Which reading apps this site has turned on — a reviewer's switch rather than
 * a reader's, which is why it lives on the preview bar.
 *
 * The modal's own chrome: a header bar with a rule under it, a body that
 * scrolls, and the answer on a footer — the shape every other modal in the
 * system uses, in place of the header, intro and foot this drew for itself. The
 * switches are the shared SettingRow, each led by the partner's real mark.
 */
export function SettingsModal({ open, onClose, settings, onToggle }) {
  return (
    <Modal open={open} onClose={onClose} variant="center" closeBadge ariaLabel="Reading apps">
      <ModalClose onClick={onClose} />

      <div className="modal-header">
        <div className="modal-header-text">
          <h2 className="modal-title">Reading apps</h2>
          <p className="modal-sub">Turn discovery features on or off for this reader.</p>
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
