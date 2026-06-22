import React from 'react'
import { AlertsBanner } from 'bs-prototypes'

export const ReviewQueue = () => (
  <AlertsBanner
    onNavigate={() => {}}
    alerts={[
      {
        id: 'a1',
        level: 'critical',
        title: '3 students flagged',
        description: 'Sessions tripped a safety threshold — review before end of day.',
        action: 'Review',
        tab: 'flags',
      },
      {
        id: 'a2',
        level: 'warning',
        title: 'Maya R.',
        description: 'Logged 240 min in one session — pace exceeds the integrity threshold.',
        action: 'View session',
        tab: 'sessions',
      },
      {
        id: 'a3',
        level: 'positive',
        title: 'Room 12',
        description: 'Class reading streak hit 14 days — highest this semester.',
        action: 'Celebrate',
        tab: 'rewards',
      },
    ]}
  />
)

export const AllClear = () => (
  <AlertsBanner
    onNavigate={() => {}}
    alerts={[
      {
        id: 'b1',
        level: 'positive',
        title: 'No open flags',
        description: 'Every reading session this week passed the integrity check.',
      },
      {
        id: 'b2',
        level: 'info',
        description: 'Lexile growth analysis re-runs tonight for all rostered students.',
      },
    ]}
  />
)
