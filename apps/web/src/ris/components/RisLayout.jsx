import { useState } from 'react'
import {
  SCHOOL_DETAILS, ALERTS,
} from '../data'
import { Dashboard } from './Dashboard'
import { HabitsDetail } from './HabitsDetail'
import { LexileDetail } from './LexileDetail'
import { Demographics } from './Demographics'
import { Motivation } from './Motivation'
import { Integrity } from './Integrity'
import { DistrictAnalytics } from './DistrictAnalytics'
import { SchoolDashboard } from './SchoolDashboard'
import { SchoolHabits } from './SchoolHabits'
import { SchoolLexile } from './SchoolLexile'
import { SchoolMotivation } from './SchoolMotivation'
import { SchoolIntegrity } from './SchoolIntegrity'
import { SchoolAnalytics } from './SchoolAnalytics'
import { SchoolDemographics } from './SchoolDemographics'
import { StudentPanel } from './StudentPanel'
import { BackBar } from '../../BackBar'
import { Sidebar, SchoolPicker } from './Sidebar'
import './RisLayout.css'

const NAV = [
  { id: 'dashboard',    label: 'Overview',     icon: 'overview' },
  { id: 'motivation',   label: 'Motivation',   icon: 'flame',        subgroup: true, section: 'Reading Health' },
  { id: 'integrity',    label: 'Integrity',    icon: 'shield',       subgroup: true, section: 'Reading Health' },
  { id: 'habits',       label: 'Habits',       icon: 'habits',       subgroup: true, section: 'Reading Health' },
  { id: 'skills',       label: 'Skills',       icon: 'book',         subgroup: true, section: 'Reading Health' },
  { id: 'analytics',    label: 'Analytics',    icon: 'analytics',    section: 'Data' },
  { id: 'demographics', label: 'Demographics', icon: 'demographics', section: 'Data' },
]

export function RisLayout({ scope, schoolId, onSchoolId, page, onPage }) {
  const isSchool = scope === 'school'
  const [openStudent, setOpenStudent] = useState(null)

  const districtAlerts = ALERTS
  const schoolDetails  = isSchool ? SCHOOL_DETAILS[schoolId] : null
  const schoolAlerts   = isSchool ? ALERTS.filter(a => schoolDetails.alertIds.includes(a.id)) : []

  function renderPage() {
    if (isSchool) {
      switch (page) {
        case 'motivation': return <SchoolMotivation schoolId={schoolId} />
        case 'integrity':  return <SchoolIntegrity  schoolId={schoolId} />
        case 'habits':     return <SchoolHabits     schoolId={schoolId} />
        case 'skills':     return <SchoolLexile    schoolId={schoolId} />
        case 'analytics':    return <SchoolAnalytics schoolId={schoolId} />
        case 'demographics': return <SchoolDemographics schoolId={schoolId} />
        default:           return <SchoolDashboard schoolId={schoolId} onNavigate={onPage} onOpenStudent={setOpenStudent} alerts={schoolAlerts} />
      }
    } else {
      switch (page) {
        case 'motivation': return <Motivation />
        case 'integrity':  return <Integrity />
        case 'habits':     return <HabitsDetail />
        case 'skills':     return <LexileDetail />
        case 'analytics':    return <DistrictAnalytics />
        case 'demographics': return <Demographics />
        default:           return <Dashboard onNavigate={onPage} alerts={districtAlerts} />
      }
    }
  }

  const alertCount = (isSchool ? schoolAlerts : districtAlerts)
    .filter(a => a.level === 'critical' || a.level === 'warning').length

  return (
    <div className="ris-layout">
      <Sidebar
        nav={NAV}
        active={page}
        onNavigate={onPage}
        title="Reading Information System"
        subtitle={isSchool ? 'School View' : 'District View'}
        badges={{ dashboard: alertCount }}
        picker={isSchool && (
          <SchoolPicker
            schoolId={schoolId}
            onSchoolId={onSchoolId}
            onAfterChange={() => onPage('dashboard')}
          />
        )}
      />

      {/* ── Content ── */}
      <div className="rl-content">
        {page !== 'dashboard' && page !== 'analytics' && page !== 'demographics' && (
          <BackBar label="Back to Overview" onClick={() => onPage('dashboard')} />
        )}
        <div className="rl-page">
          {renderPage()}
        </div>
      </div>

      {isSchool && <StudentPanel studentId={openStudent} onClose={() => setOpenStudent(null)} />}
    </div>
  )
}
