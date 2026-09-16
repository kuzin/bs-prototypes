import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Pill } from '@components/Pill/Pill'
import { Modal, ModalClose } from '@components/Modal/Modal'
import { CoverStack } from './common'
import { PATHS, DESTINATION, CHALLENGES } from '../data'
import '../../logging-flow/components/Challenges.css'

const CHALLENGE = CHALLENGES.find((c) => c.live)

/**
 * Picking a path is `programs/_join_challenge.html.haml` — the challenge
 * preview the app puts in front of a reader before they are in it: the
 * challenge's own banner over its name, its dates, what it asks of you, and
 * then **Alternative Challenges**, the app's own "this challenge OR one of the
 * following".
 *
 * That last block is exactly what a path is. The proposal's three paths are the
 * alternatives this challenge is offered as, so the modal that asks a reader to
 * choose between them is the one the product already has — only here each
 * alternative is pressable, because choosing one is the join.
 *
 * It opens from the challenge card on the dashboard and from **Change path** on
 * the student's own page, so the choice never takes them off the page they're
 * on.
 */
export function PathPickerModal({ open, offered, chosenPathId, onChoose, onClose }) {
  const paths = PATHS.filter((p) => offered.includes(p.id))
  const current = paths.find((p) => p.id === chosenPathId)

  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="center"
      closeBadge
      ariaLabel={`Pick your path for ${DESTINATION.title}`}
    >
      <ModalClose onClick={onClose} />
      <div className="jc pyp-pickmodal">
        {/* `.join-challenge-header` — the challenge's art on the ground its own
            colour reads as. */}
        <div
          className="jc-head"
          style={{ background: `color-mix(in srgb, ${DESTINATION.color} 70%, white)` }}
        >
          <img className="jc-art" src={DESTINATION.banner} alt="" />
        </div>

        {/* What the challenge *is* — its name, when it runs, what it asks of
            you — held above the rule, so the half that scrolls is the half
            you are choosing between. */}
        <div className="modal-header pyp-pickmodal-head">
          <div className="modal-header-text">
            <h2 className="jc-title">{DESTINATION.title}</h2>
            <div className="jc-dates">{CHALLENGE.dates}</div>
            <div className="jc-reqs">
              {['Reading List', 'Activities', 'Books'].map((t) => (
                <Pill key={t} color="#087542" size="sm" className="jc-type">
                  {t}
                </Pill>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-body jc-body">
          {/* `.join-challenge-alternatives` — the app's own "this challenge OR
              one of the following", with each alternative pressable, because
              choosing one is the join. */}
          <div className="jc-alts pyp-alts">
            <div className="jc-altshead">Select a path…</div>
            <p className="jc-altsdesc">
              All three teach the same four words — they just get there through different books.
              Pick the subject you’d most like to read about. You can switch any time, and anything
              you’ve earned comes with you.
            </p>
            <ul className="pyp-altslist">
              {paths.map((path) => {
                const isCurrent = path.id === chosenPathId
                return (
                  <li
                    key={path.id}
                    className={`pyp-alt${isCurrent ? ' is-current' : ''}`}
                    style={{ '--path-color': path.color }}
                  >
                    <CoverStack path={path} className="pyp-alt-stack" />
                    <div className="pyp-alt-copy">
                      <div className="pyp-alt-head">
                        <h4 className="pyp-alt-name">{path.name}</h4>
                        {isCurrent && (
                          <Pill color="#0F7A55" variant="soft" size="sm">
                            Your path
                          </Pill>
                        )}
                      </div>
                      <p className="pyp-alt-tag">{path.tagline}</p>
                    </div>
                    <Button
                      variant={isCurrent ? 'secondary' : 'accent'}
                      accent={isCurrent ? undefined : path.color}
                      size="md"
                      className="pyp-alt-cta"
                      onClick={() => onChoose(path.id)}
                    >
                      {isCurrent ? 'Continue' : 'Choose'}
                    </Button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* The app's own footer shape: the way out on the left, the answer on
            the right. There is no "Join" here — choosing a path is the join. */}
        <div className="modal-footer modal-footer--between">
          <Button variant="secondary" onClick={onClose}>
            Not now
          </Button>
          {current && (
            <Button onClick={() => onChoose(current.id)}>
              Continue on {current.short ?? current.name}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
