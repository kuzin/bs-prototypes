import { Icon } from '@components/Icon/Icon'
import { Button } from '@components/Button/Button'
import { Tabs } from '@components/Tabs/Tabs'
import { SITE } from '../data'

const NAV_TABS = [
  { id: 'challenges', label: 'Challenges' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'badges', label: 'All Badges' },
  { id: 'log', label: 'Reading Log' },
  { id: 'recs', label: 'Recommendations' },
]

// Student-facing reader top bar — its own `.pyp-topbar` chrome (mirrors the
// web-app reader look without importing its stylesheet).
export function ReaderTopBar() {
  return (
    <header className="pyp-topbar">
      <div className="pyp-topbar-inner">
        <div className="pyp-logo">
          <img src="/bs-prototypes/bs.svg" alt="" className="pyp-logo-mark" />
          <span className="pyp-logo-word">beanstack</span>
        </div>
        <div className="pyp-topbar-actions">
          <Button variant="primary" size="sm" icon={<Icon name="book" size={15} />}>
            Log Reading and Activities
          </Button>
          <Button variant="ghost" size="sm" icon={<Icon name="writing" size={15} />}>
            Write Review
          </Button>
        </div>
        <div className="pyp-topbar-user">
          <span className="pyp-user-pill">
            <span className="pyp-user-avatar">{SITE.student.initials}</span>
            <span className="pyp-user-name">{SITE.student.firstName}</span>
          </span>
          <button className="pyp-icon-btn" aria-label="Settings">
            <Icon name="settings" size={20} />
          </button>
        </div>
      </div>
      <div className="pyp-tabsbar">
        <Tabs variant="underline" size="md" active="challenges" accent="#0F766E" items={NAV_TABS} />
      </div>
    </header>
  )
}
