import ReaderProfile from './ReaderProfile'
import { PrototypeNav } from '@components/PrototypeNav/PrototypeNav'

// The mock is scaled up slightly to fill the frame. Exposed as a CSS variable
// too, because JS-measured SVGs (nivo) size themselves from the *unzoomed*
// layout width and then get scaled a second time — see `.rp-chart-fit`.
const APP_ZOOM = 1.07

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
