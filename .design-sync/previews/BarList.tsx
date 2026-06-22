import React from 'react'
import { BarList, Icon } from 'bs-prototypes'

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: '100%', minWidth: 280 }}>{children}</div>
)

export const TopBooks = () => (
  <Frame>
    <BarList
      header={{ label: 'Most-logged books', valueLabel: 'Readers' }}
      items={[
        { label: 'Dog Man: Mothering Heights', value: 312, max: 312, color: '#0DA7BC', valueLabel: '312' },
        { label: 'The Bad Guys #1', value: 268, max: 312, color: '#16A97A', valueLabel: '268' },
        { label: 'Wings of Fire', value: 201, max: 312, color: '#3B82F6', valueLabel: '201' },
        { label: 'Front Desk', value: 154, max: 312, color: '#8B5CF6', valueLabel: '154' },
      ]}
    />
  </Frame>
)

export const WithDeltas = () => (
  <Frame>
    <BarList
      items={[
        { label: 'Mrs. Alvarez — Grade 4', value: 88, max: 100, color: '#16A97A', valueLabel: '88%', delta: 6 },
        { label: 'Mr. Chen — Grade 4', value: 72, max: 100, color: '#0DA7BC', valueLabel: '72%', delta: 3 },
        { label: 'Ms. Okoye — Grade 5', value: 61, max: 100, color: '#F59E0B', valueLabel: '61%', delta: -4 },
      ]}
    />
  </Frame>
)

export const Grouped = () => (
  <Frame>
    <BarList
      layout="columns"
      groups={[
        {
          label: 'Intrinsic',
          labelColor: '#0DA7BC',
          items: [
            { label: 'Curiosity', value: 7.8, max: 10, color: '#0DA7BC', valueLabel: '7.8' },
            { label: 'Enjoyment', value: 8.4, max: 10, color: '#0DA7BC', valueLabel: '8.4' },
          ],
        },
        {
          label: 'Extrinsic',
          labelColor: '#F59E0B',
          items: [
            { label: 'Rewards', value: 6.1, max: 10, color: '#F59E0B', valueLabel: '6.1' },
            { label: 'Recognition', value: 5.3, max: 10, color: '#F59E0B', valueLabel: '5.3' },
          ],
        },
      ]}
    />
  </Frame>
)

export const IconList = () => (
  <Frame>
    <BarList
      showBar={false}
      items={[
        {
          prefix: '1',
          icon: <Icon name="flame" size={16} />,
          iconColor: '#E8866A',
          label: 'Grades 3–5',
          sublabel: 'Reading streaks',
          subValue: '14-day avg',
        },
        {
          prefix: '2',
          icon: <Icon name="trophy" size={16} />,
          iconColor: '#16A97A',
          label: 'Grades K–2',
          sublabel: 'Badges earned',
          subValue: '6.2 / student',
        },
        {
          prefix: '3',
          icon: <Icon name="book" size={16} />,
          iconColor: '#3B82F6',
          label: 'Grades 6–8',
          sublabel: 'Books finished',
          subValue: '4.1 / student',
        },
      ]}
    />
  </Frame>
)
