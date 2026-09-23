import { useEffect, useState } from 'react'
import { Modal } from '@components/Modal/Modal'
import { Button } from '@components/Button/Button'
import { Icon } from '@components/Icon/Icon'
import { SectionCardTitle } from '@components/SectionCard/SectionCard'
import '@components/Modal/Modal.css'
import '@components/Button/Button.css'

import './MarcUpload.css'

// The other half of a MARC feed: Destiny drops a file and somebody carries it
// over. Two steps, because that is what it is — choose the file, then watch it
// go in. The result is a record count, which is how a librarian checks that the
// right export was uploaded.
const FILE = { name: 'lincoln_destiny_full.mrc', size: '4.2 MB' }

export function MarcUpload({ open, feed, run, onUpload, onClose }) {
  const [file, setFile] = useState(null)

  // A reopened dialog starts from the beginning.
  useEffect(() => {
    if (!open) setFile(null)
  }, [open])

  const phase = run?.phase
  const done = phase === 'done'

  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="center"
      className="mup-modal"
      ariaLabel="Upload a MARC file"
    >
      {({ close }) => (
        <div className="mup">
          <SectionCardTitle>Upload a MARC file</SectionCardTitle>

          {!phase && (
            <>
              {/* A drop target you can also click — the same two ways every
                  upload in the app offers, and the only two a browser has. */}
              <button
                type="button"
                className={`mup-drop${file ? ' mup-drop--has' : ''}`}
                onClick={() => setFile(FILE)}
              >
                {file ? (
                  <>
                    <Icon name="file-text" size={26} />
                    <span className="mup-file">{file.name}</span>
                    <span className="mup-note">{file.size} · ready to upload</span>
                  </>
                ) : (
                  <>
                    <Icon name="upload" size={26} />
                    <span className="mup-file">Drop a .mrc file here</span>
                    <span className="mup-note">or click to choose one</span>
                  </>
                )}
              </button>

              <p className="mup-hint">
                A full export replaces what {feed ? 'this catalog' : 'the catalog'} knows. Records
                the file leaves out are taken off the shelves the engine can recommend from.
              </p>
            </>
          )}

          {phase === 'running' && (
            <div className="mup-running">
              <p className="mup-step">{run.step}</p>
              <div className="mup-track">
                <div className="mup-fill" style={{ width: `${run.pct}%` }} />
              </div>
              <p className="mup-note">{FILE.name}</p>
            </div>
          )}

          {done && (
            <div className="mup-done">
              <span className="mup-tick">
                <Icon name="circle-check" size={34} />
              </span>
              <p className="mup-file">{run.result.records.toLocaleString()} records read</p>
              <dl className="mup-result">
                <div>
                  <dt>Added</dt>
                  <dd>{run.result.added}</dd>
                </div>
                <div>
                  <dt>Updated</dt>
                  <dd>{run.result.updated}</dd>
                </div>
                <div>
                  <dt>No longer held</dt>
                  <dd>{run.result.removed}</dd>
                </div>
              </dl>
            </div>
          )}

          <div className="mup-foot">
            {done ? (
              <Button variant="primary" onClick={close}>
                Done
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={close} disabled={phase === 'running'}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  disabled={!file || phase === 'running'}
                  onClick={onUpload}
                >
                  Upload
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}
