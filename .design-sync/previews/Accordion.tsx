import React from 'react'
import { Accordion } from 'bs-prototypes'

export const Default = () => (
  <div style={{ width: 320 }}>
    <Accordion
      defaultOpen={['rules']}
      items={[
        {
          id: 'rules',
          title: 'Challenge rules',
          content: (
            <p style={{ margin: 0 }}>
              Log at least 20 minutes of reading a day to keep your streak alive and earn the
              Bookworm badge.
            </p>
          ),
        },
        {
          id: 'rewards',
          title: 'Rewards & badges',
          content: (
            <p style={{ margin: 0 }}>
              Hit 7 days for a Reading Streak badge, 30 days for the Marathon Reader trophy.
            </p>
          ),
        },
        {
          id: 'leaderboard',
          title: 'How the leaderboard works',
          content: (
            <p style={{ margin: 0 }}>
              Classes are ranked by total minutes read. Ties break in favor of the longer streak.
            </p>
          ),
        },
      ]}
    />
  </div>
)

export const AllowMultiple = () => (
  <div style={{ width: 320 }}>
    <Accordion
      allowMultiple
      defaultOpen={['lexile', 'rmi']}
      accent="#0DA7BC"
      items={[
        {
          id: 'lexile',
          title: 'What is a Lexile measure?',
          content: (
            <p style={{ margin: 0 }}>
              A Lexile measure describes a reader&apos;s level and a book&apos;s difficulty on the
              same scale.
            </p>
          ),
        },
        {
          id: 'rmi',
          title: 'How is RMI calculated?',
          content: (
            <p style={{ margin: 0 }}>
              The Reading Motivation Index blends frequency, volume, and variety into a 0–40 score.
            </p>
          ),
        },
      ]}
    />
  </div>
)
