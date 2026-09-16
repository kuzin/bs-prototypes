import { ReaderTopBar } from '@components/ReaderApp/ReaderApp'
import { JoyfulFooter, APPS } from '../../footers/JoyfulFooter'
import { SITE } from '../data'

const READER = {
  id: 'maya',
  name: SITE.student.firstName,
  initials: SITE.student.initials,
  color: '#F09A77',
}

/**
 * Every student-facing screen in this prototype: the shared reader app bar and
 * page frame, with the screen's own content in the middle.
 *
 * This used to be a hand-rolled `.pyp-topbar` — its own logo lockup, its own
 * reader pill, its own tab strip — beside four other prototypes rendering the
 * real one. Only Challenges is wired up; the rest of the nav is scaffolding, as
 * elsewhere in the prototypes.
 */
export function ReaderShell({ active = 'challenges', onNav, onLog, children, band }) {
  return (
    <div className="pyp-reader">
      <ReaderTopBar
        reader={READER}
        /* The site nav is the shared one — `READER_TABS`, the order the app
           spells it — less the two this school doesn't run. */
        hideTabs={['reviews', 'leaderboards']}
        active={active}
        /* Challenges and Collections are real here; the rest of the nav is
           scaffolding, as elsewhere in the prototypes. */
        onTabChange={(id) => ['challenges', 'badges'].includes(id) && onNav?.(id)}
        onLog={onLog}
        /* A school site has no account above the reader, so the gear is the
           reader's own settings rather than a menu. */
        accountMenu={false}
      />
      {band}
      <main className="wa-main">
        <div className="wa-main-inner">{children}</div>
      </main>
      <JoyfulFooter app={APPS.find((a) => a.id === 'beanstack')} />
    </div>
  )
}
