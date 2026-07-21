import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { ReaderTopBar } from './ReaderChrome'
import { CoverPreviewRow } from './common'
import { DESTINATION, PATHS } from '../data'

// One choosable path card — art-forward, a quick cover preview, one confident CTA.
function PathCard({ path, onChoose }) {
  return (
    <article className="pyp-pathcard" style={{ '--path-color': path.color }}>
      <div
        className="pyp-pathcard-band"
        style={{
          backgroundImage: `linear-gradient(to top, color-mix(in srgb, ${path.color} 88%, #04211e) 0%, color-mix(in srgb, ${path.color} 66%, #0b3b39) 30%, color-mix(in srgb, ${path.color} 26%, transparent) 64%, transparent 100%), url(${path.banner})`,
        }}
      >
        <h3 className="pyp-pathcard-name">{path.name}</h3>
        <p className="pyp-pathcard-tag">{path.tagline}</p>
      </div>
      <div className="pyp-pathcard-body">
        <CoverPreviewRow path={path} />
        <Button
          variant="primary"
          size="lg"
          className="pyp-pathcard-cta"
          icon={<Icon name="arrow-right" size={17} />}
          onClick={() => onChoose(path.id)}
        >
          Choose this path
        </Button>
      </div>
    </article>
  )
}

// Screen 2 — the student sees the teacher's destination and picks a path.
export function PickPath({ offered, onChoose }) {
  const paths = PATHS.filter((p) => offered.includes(p.id))
  return (
    <div className="pyp-reader">
      <ReaderTopBar />

      <div
        className="pyp-dest-band"
        style={{
          backgroundImage: `linear-gradient(to right, color-mix(in srgb, ${DESTINATION.color} 92%, #04211e) 0%, color-mix(in srgb, ${DESTINATION.color} 68%, #0b3b39) 42%, color-mix(in srgb, ${DESTINATION.color} 30%, transparent) 80%, color-mix(in srgb, ${DESTINATION.color} 14%, transparent) 100%), url(${DESTINATION.banner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="pyp-dest-band-inner">
          <h1 className="pyp-dest-band-title">{DESTINATION.title}</h1>
          <p className="pyp-dest-band-sub">{DESTINATION.blurb}</p>
        </div>
      </div>

      <main className="pyp-reader-body">
        <div className="pyp-reader-inner">
          <div className="pyp-pick-head">
            <h2 className="pyp-h2">Pick your path</h2>
            <p className="pyp-pick-sub">
              Every path builds the same background knowledge — choose the one that sounds the most
              fun.
            </p>
          </div>

          <div className="pyp-pathgrid">
            {paths.map((path) => (
              <PathCard key={path.id} path={path} onChoose={onChoose} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
