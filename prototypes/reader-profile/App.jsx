import ReaderProfile from './ReaderProfile'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'

// 1:1 — these profiles are used as pixel references against the real app, so
// the frame must not scale. Still exposed as a CSS variable because
// JS-measured SVGs (nivo) size themselves from the *unzoomed* layout width and
// would get scaled a second time under any zoom — see `.rp-chart-fit`.
const APP_ZOOM = 1

export function App() {
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 48,
          overflow: 'hidden',
          zoom: APP_ZOOM,
          '--app-zoom': APP_ZOOM,
        }}
      >
        <ReaderProfile />
      </div>
      <PrototypeNav currentHref="/bs-prototypes/reader-profile/" />
    </>
  )
}
