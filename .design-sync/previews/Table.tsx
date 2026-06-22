import React from 'react'
import { Table, Pill } from 'bs-prototypes'

const STUDENTS = [
  { id: 1, name: 'Maya Chen', minutes: 412, rmi: 34, status: 'On track' },
  { id: 2, name: 'Liam Edwards', minutes: 388, rmi: 31, status: 'On track' },
  { id: 3, name: 'Harper Khan', minutes: 205, rmi: 22, status: 'At risk' },
  { id: 4, name: 'Jordan Reyes', minutes: 96, rmi: 14, status: 'Needs review' },
  { id: 5, name: 'Aisha Bello', minutes: 467, rmi: 37, status: 'On track' },
]

const STATUS_COLOR: Record<string, string> = {
  'On track': '#16A34A',
  'At risk': '#D97706',
  'Needs review': '#DC2626',
}

const columns = [
  { key: 'name', label: 'Student', sortable: true },
  { key: 'minutes', label: 'Minutes read', align: 'right', sortable: true, render: (v: number) => v.toLocaleString() },
  { key: 'rmi', label: 'RMI', align: 'right', sortable: true },
  {
    key: 'status',
    label: 'Status',
    render: (v: string) => <Pill color={STATUS_COLOR[v]}>{v}</Pill>,
  },
]

export const Default = () => (
  <Table columns={columns} rows={STUDENTS} getRowKey={(r: any) => r.id} />
)

export const Zebra = () => (
  <Table columns={columns} rows={STUDENTS} getRowKey={(r: any) => r.id} zebra bordered />
)

export const Empty = () => (
  <Table columns={columns} rows={[]} empty="No students logged reading this week yet." />
)

export const Loading = () => <Table columns={columns} rows={[]} loading />
