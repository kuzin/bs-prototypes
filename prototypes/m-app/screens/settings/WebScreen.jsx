import { useState } from 'react'
import { Header, LoadingIndicator } from '@mobile/components'
import './WebScreen.css'

/**
 * Settings > Help and Settings > About.
 *
 * Both are one component in spirit and nearly one in source: `HelpScreen.tsx` is twelve lines and
 * `About.jsx` is sixteen, and each is a single `<WebView>` filling the screen under a native
 * header. Neither is a designed screen, which is worth knowing before anyone specs one — the app
 * is handing off to the web here, and the only native thing about either is the back button.
 *
 * So the prototype frames the REAL pages rather than redrawing them. A redrawn help centre would
 * be a fiction that goes stale the day someone edits an article, and a screenshot of one would be
 * worse; an iframe is what a WebView is. Both hosts allow framing, which was checked rather than
 * assumed.
 *
 * `#main-content` on the help URL is the app's own fragment: it skips the knowledge base's
 * marketing header so the WebView opens on the articles.
 */
export const WEB_SCREENS = {
  help: {
    title: 'Help',
    url: 'https://help.beanstack.com/beanstack-mobile-app#main-content',
  },
  about: {
    title: 'About',
    url: 'https://zoobean.github.io/beanstack-tracker-help/docs/about.html',
  },
}

export function WebScreen({ screen, onBack }) {
  const [loaded, setLoaded] = useState(false)
  const { title, url } = WEB_SCREENS[screen] ?? WEB_SCREENS.help

  return (
    <div className="m-web">
      <Header variant="stack" title={title} onBack={onBack} />

      <div className="m-web-body">
        {/* A WebView is white until the document paints, and on a phone connection that gap is
            long enough to be part of the screen. */}
        {!loaded && (
          <div className="m-web-loading">
            <LoadingIndicator />
          </div>
        )}
        <iframe
          className="m-web-frame"
          src={url}
          title={title}
          onLoad={() => setLoaded(true)}
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  )
}
