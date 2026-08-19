import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Modal } from '@components/Modal/Modal'
import { CoverPreviewRow, WordChips } from './common'
import { PATHS, WORD_LIST } from '../data'

// The one place a student picks (or switches) a path — opened from the challenge
// card's art on the dashboard and from "Change path" on their destination, so
// the choice never takes them off the page they're on.
export function PathPickerModal({ open, offered, chosenPathId, onChoose, onClose }) {
  const paths = PATHS.filter((p) => offered.includes(p.id))

  return (
    <Modal open={open} onClose={onClose} variant="center" ariaLabel="Pick your path">
      <div className="pyp-pickmodal">
        <button className="pyp-pickmodal-close" onClick={onClose} aria-label="Close">
          <Icon name="x" size={16} stroke={2.2} />
        </button>

        <header className="pyp-pickmodal-head">
          <h3 className="pyp-pickmodal-title">Pick your path</h3>
          <p className="pyp-pickmodal-sub">
            All {paths.length} paths build similar vocabulary — choose the one that sounds the most
            fun.
          </p>
          <WordChips words={WORD_LIST} className="pyp-pickmodal-words" />
        </header>

        <div className="pyp-pickmodal-list">
          {paths.map((path) => {
            const current = path.id === chosenPathId
            return (
              <article
                key={path.id}
                className={`pyp-pickrow${current ? ' is-current' : ''}`}
                style={{ '--path-color': path.color }}
              >
                <div className="pyp-pickrow-body">
                  <div className="pyp-pickrow-head">
                    <h4 className="pyp-pickrow-name">{path.name}</h4>
                    {current && (
                      <span className="pyp-pickrow-current">
                        <Icon name="circle-check-filled" size={13} color="#16A97A" /> Your path
                      </span>
                    )}
                  </div>
                  <p className="pyp-pickrow-tag">{path.tagline}</p>
                  <CoverPreviewRow path={path} className="pyp-pickrow-covers" />
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="pyp-pickrow-cta"
                  icon={<Icon name="arrow-right" size={18} />}
                  onClick={() => onChoose(path.id)}
                >
                  {current ? 'Continue' : 'Choose'}
                </Button>
              </article>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}
