import { Modal } from '@components/Modal/Modal'
import { Toggle } from '@components/Toggle/Toggle'
import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'
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

function FeatureMark({ feature }) {
  if (feature === 'audiobooks') {
    return (
      <span
        className="bk-pmark bk-pmark--glyph"
        style={{ width: 36, height: 36, background: '#0D9488' }}
      >
        <Icon name="headphones" size={19} color="#fff" />
      </span>
    )
  }
  return <PartnerMark id={feature} size={36} />
}

export function SettingsModal({ open, onClose, settings, onToggle }) {
  return (
    <Modal open={open} onClose={onClose} variant="center" ariaLabel="Settings">
      <div className="bk-settings">
        <div className="bk-settings-head">
          <h2>
            <Icon name="settings" size={20} /> Settings
          </h2>
          <button className="bk-settings-close" onClick={onClose} aria-label="Close settings">
            <Icon name="x" size={18} />
          </button>
        </div>
        <p className="bk-settings-intro">Turn discovery features on or off for this reader.</p>

        <div className="bk-settings-list">
          {FEATURES.map((f) => (
            <label key={f.key} className="bk-setting-row">
              <span className="bk-setting-icon">
                <FeatureMark feature={f.key} />
              </span>
              <span className="bk-setting-text">
                <span className="bk-setting-title">{f.title}</span>
                <span className="bk-setting-desc">{f.desc}</span>
              </span>
              <Toggle checked={settings[f.key]} onChange={() => onToggle(f.key)} />
            </label>
          ))}
        </div>

        <div className="bk-settings-foot">
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  )
}
