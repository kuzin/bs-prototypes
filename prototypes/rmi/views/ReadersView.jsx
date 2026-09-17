import { useState } from 'react'
import { PageHeader } from '@components/PageHeader/PageHeader'
import { Button } from '@components/Button/Button'
import { Table } from '@components/Table/Table'
import { SearchBar } from '../components/SearchBar'
import { Banner, EmptyState } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import { PlumpyIcon } from '@components/PlumpyIcon/PlumpyIcon'
import { STUDENTS, EDUCATOR } from '../data'
import './ReadersView.css'

/**
 * `classroom/students/index` — the roster. In the standalone product a student
 * is just a name and an access code: there's no roster sync and no student
 * login, so the code on this page *is* the student's identity. That's why each
 * row can regenerate and print one, and why the page's main action is printing
 * the set.
 */
export function ReadersView() {
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  const rows = STUDENTS.filter((s) =>
    s.name.toLowerCase().includes(query.trim().toLowerCase()),
  ).map((s) => ({ id: s.id, name: s.name, accessCode: s.accessCode }))

  const columns = [
    { key: 'name', label: 'Student Name', sortable: true },
    {
      key: 'accessCode',
      label: 'Access Code',
      render: (v) => <code className="rmi-access-code">{v}</code>,
    },
    {
      key: 'id',
      label: '',
      align: 'right',
      render: () => (
        <div className="rmi-row-actions">
          <button type="button" title="Regenerate Access Code" aria-label="Regenerate access code">
            <PlumpyIcon name="reset" size={20} />
          </button>
          <button type="button" title="Print Access Code" aria-label="Print access code">
            <PlumpyIcon name="download" size={20} />
          </button>
          <button type="button" title="Edit Student" aria-label="Edit student">
            <PlumpyIcon name="pencil" size={20} />
          </button>
          <button type="button" title="Delete Student" aria-label="Delete student">
            <PlumpyIcon name="trash" size={20} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Students"
        actions={
          <>
            <Button
              variant="secondary"
              size="md"
              iconOnly
              aria-label="Toggle search"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((o) => !o)}
            >
              <Icon name={searchOpen ? 'x' : 'search'} size={18} />
            </Button>
            <Button variant="primary" size="md">
              Print Access Codes
            </Button>
          </>
        }
      />

      <div className="rmi-readers-bar">
        <Banner level="info" icon={<Icon name="info" size={22} />}>
          {STUDENTS.length} students out of {EDUCATOR.studentsLimit} students added.
        </Banner>
      </div>

      <SearchBar
        open={searchOpen}
        label="Student Name"
        value={query}
        onChange={setQuery}
        onClose={() => setSearchOpen(false)}
      />

      {rows.length > 0 ? (
        <div className="rmi-card-table">
          <Table columns={columns} rows={rows} getRowKey={(r) => r.id} pageSize={15} scrollX />
        </div>
      ) : (
        <EmptyState
          variant="dashed"
          title="No students found."
          description="Try a different student name or clear your search."
        />
      )}
    </>
  )
}
