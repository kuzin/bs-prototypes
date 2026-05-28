import { useState } from 'react'
import { SCHOOLS, SCHOOL_DETAILS, ALERTS } from '../data'
import { DistrictDashboard } from './DistrictDashboard'
import { DistrictHabits } from './DistrictHabits'
import { DistrictLexile } from './DistrictLexile'
import { DistrictDemographics } from './DistrictDemographics'
import { DistrictMotivation } from './DistrictMotivation'
import { DistrictIntegrity } from './DistrictIntegrity'
import { DistrictAnalytics } from './DistrictAnalytics'
import { SchoolDashboard } from './SchoolDashboard'
import { SchoolHabits } from './SchoolHabits'
import { SchoolLexile } from './SchoolLexile'
import { SchoolMotivation } from './SchoolMotivation'
import { SchoolIntegrity } from './SchoolIntegrity'
import { SchoolAnalytics } from './SchoolAnalytics'
import { SchoolDemographics } from './SchoolDemographics'
import { StudentPanel } from './StudentPanel'
import { AppShell } from '@components/AppShell/AppShell'
import { SchoolPicker } from '@components/Sidebar/Sidebar'
import { useTooltipFlip } from '@components/useTooltipFlip/useTooltipFlip'

const NAV = [
  { id: 'dashboard', label: 'Overview', icon: 'overview' },
  {
    id: 'motivation',
    label: 'Motivation',
    icon: 'flame',
    subgroup: true,
    section: 'Reading Health',
  },
  {
    id: 'integrity',
    label: 'Integrity',
    icon: 'shield',
    subgroup: true,
    section: 'Reading Health',
  },
  { id: 'habits', label: 'Habits', icon: 'habits', subgroup: true, section: 'Reading Health' },
  { id: 'skills', label: 'Skills', icon: 'book', subgroup: true, section: 'Reading Health' },
  { id: 'analytics', label: 'Analytics', icon: 'analytics', section: 'Data' },
  { id: 'demographics', label: 'Demographics', icon: 'demographics', section: 'Data' },
]

export function RisLayout({ scope, schoolId, onSchoolId, page, onPage }) {
  const isSchool = scope === 'school'
  const [openStudent, setOpenStudent] = useState(null)
  // Keep chart tooltips inside the content column — never let them spill
  // over the sidebar on the left or off the right edge of the viewport.
  useTooltipFlip()

  const schoolDetails = isSchool ? SCHOOL_DETAILS[schoolId] : null
  const schoolAlerts = isSchool ? ALERTS.filter((a) => schoolDetails.alertIds.includes(a.id)) : []

  function renderPage() {
    if (isSchool) {
      switch (page) {
        case 'motivation':
          return <SchoolMotivation schoolId={schoolId} />
        case 'integrity':
          return <SchoolIntegrity schoolId={schoolId} />
        case 'habits':
          return <SchoolHabits schoolId={schoolId} />
        case 'skills':
          return <SchoolLexile schoolId={schoolId} />
        case 'analytics':
          return <SchoolAnalytics schoolId={schoolId} />
        case 'demographics':
          return <SchoolDemographics schoolId={schoolId} />
        default:
          return (
            <SchoolDashboard
              schoolId={schoolId}
              onNavigate={onPage}
              onOpenStudent={setOpenStudent}
              alerts={schoolAlerts}
            />
          )
      }
    } else {
      switch (page) {
        case 'motivation':
          return <DistrictMotivation />
        case 'integrity':
          return <DistrictIntegrity />
        case 'habits':
          return <DistrictHabits />
        case 'skills':
          return <DistrictLexile />
        case 'analytics':
          return <DistrictAnalytics />
        case 'demographics':
          return <DistrictDemographics />
        default:
          return <DistrictDashboard onNavigate={onPage} />
      }
    }
  }

  const alertCount = isSchool
    ? schoolAlerts.filter((a) => a.level === 'critical' || a.level === 'warning').length
    : 0

  const showBackBar = page !== 'dashboard' && page !== 'analytics' && page !== 'demographics'

  return (
    <AppShell
      sidebar={{
        nav: NAV,
        active: page,
        onNavigate: onPage,
        title: 'Reading Information System',
        subtitle: isSchool ? 'School View' : 'District View',
        badges: { dashboard: alertCount },
        picker: isSchool && (
          <SchoolPicker
            schools={SCHOOLS}
            schoolId={schoolId}
            onSchoolId={onSchoolId}
            onAfterChange={() => onPage('dashboard')}
          />
        ),
      }}
      backBar={
        showBackBar ? { label: 'Back to Overview', onClick: () => onPage('dashboard') } : undefined
      }
      after={
        isSchool && <StudentPanel studentId={openStudent} onClose={() => setOpenStudent(null)} />
      }
    >
      <div className="app-shell-page">{renderPage()}</div>
    </AppShell>
  )
}
