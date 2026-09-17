import { useState } from 'react'
import { PageHeader } from '@components/PageHeader/PageHeader'
import { Button } from '@components/Button/Button'
import { Table } from '@components/Table/Table'
import { Banner, EmptyState } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import { PlumpyIcon } from '@components/PlumpyIcon/PlumpyIcon'
import { Field, Input } from '@components/Form/Form'
import '@components/Form/Form.css'
import { SearchBar } from '../components/SearchBar'
import { ConfirmModal } from '../components/ConfirmModal'
import { STUDENTS, EDUCATOR, SURVEY_URL } from '../data'
import './ReadersView.css'

/**
 * `classroom/students` — the roster, and everything you can do to it.
 *
 * In the standalone product a student is just a name and an access code: no
 * roster sync, no student login. That code *is* their identity, which is why a
 * row can regenerate it, print it or copy it, and why both destructive actions
 * warn about what they cost. Adding is an inline form above the table, sharing
 * the table's panel; editing is a page of its own, as the app has it.
 */

// The app's access code: 8 characters of A–Z0–9.
const CODE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const newAccessCode = () =>
  Array.from(
    { length: 8 },
    () => CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)],
  ).join('')

export function ReadersView() {
  const [roster, setRoster] = useState(STUDENTS)
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [name, setName] = useState('')
  const [editing, setEditing] = useState(null)
  const [editName, setEditName] = useState('')
  const [confirm, setConfirm] = useState(null) // { kind: 'delete' | 'regenerate', student }
  const [copied, setCopied] = useState(null)

  function addStudent(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setRoster((r) => [
      ...r,
      { id: `s${Date.now()}`, name: trimmed, accessCode: newAccessCode(), bias: {} },
    ])
    setName('')
  }

  function updateStudent(e) {
    e.preventDefault()
    const trimmed = editName.trim()
    if (!trimmed) return
    setRoster((r) => r.map((s) => (s.id === editing.id ? { ...s, name: trimmed } : s)))
    setEditing(null)
  }

  function removeStudent(student) {
    setRoster((r) => r.filter((s) => s.id !== student.id))
  }

  function regenerateCode(student) {
    setRoster((r) =>
      r.map((s) => (s.id === student.id ? { ...s, accessCode: newAccessCode() } : s)),
    )
  }

  // The app's cell copies the reader's whole survey link, not just the code.
  function copyCode(student) {
    navigator.clipboard
      ?.writeText(`https://${SURVEY_URL}?code=${student.accessCode}`)
      .catch(() => {})
    setCopied(student.id)
    setTimeout(() => setCopied(null), 1600)
  }

  // ── The edit page ──────────────────────────────────────────────────────
  if (editing) {
    return (
      <>
        <PageHeader title={`Editing ${editing.name}`} />
        <form onSubmit={updateStudent}>
          <section className="rmi-form-chunk">
            <header className="rmi-form-chunk-head">
              <h2 className="rmi-form-chunk-title">Edit Student</h2>
            </header>
            <div className="rmi-form-chunk-body">
              <Field label="Student Name">
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus />
              </Field>
            </div>
          </section>

          <div className="rmi-page-buttons">
            <Button type="submit" variant="primary" size="md">
              Update Student
            </Button>
            <Button type="button" variant="secondary" size="md" onClick={() => setEditing(null)}>
              Cancel
            </Button>
          </div>
        </form>
      </>
    )
  }

  // ── The roster ─────────────────────────────────────────────────────────
  const rows = roster.filter((s) => s.name.toLowerCase().includes(query.trim().toLowerCase()))

  const columns = [
    { key: 'name', label: 'Student Name', sortable: true },
    {
      key: 'accessCode',
      label: 'Access Code',
      render: (code, row) => (
        <button
          type="button"
          className="rmi-access-code"
          onClick={() => copyCode(row)}
          title="Copy access code link"
          aria-label={`Copy ${row.name}'s access code`}
        >
          {code}
          <Icon name={copied === row.id ? 'check' : 'copy'} size={15} />
        </button>
      ),
    },
    {
      key: 'id',
      label: '',
      align: 'right',
      render: (_id, row) => (
        <div className="rmi-row-actions">
          <button
            type="button"
            title="Regenerate Access Code"
            aria-label={`Regenerate ${row.name}'s access code`}
            onClick={() => setConfirm({ kind: 'regenerate', student: row })}
          >
            <PlumpyIcon name="reset" size={20} />
          </button>
          <button
            type="button"
            title="Print Access Code"
            aria-label={`Print ${row.name}'s access code`}
          >
            <PlumpyIcon name="download" size={20} />
          </button>
          <button
            type="button"
            title="Edit Student"
            aria-label={`Edit ${row.name}`}
            onClick={() => {
              setEditing(row)
              setEditName(row.name)
            }}
          >
            <PlumpyIcon name="pencil" size={20} />
          </button>
          <button
            type="button"
            title="Delete Student"
            aria-label={`Delete ${row.name}`}
            onClick={() => setConfirm({ kind: 'delete', student: row })}
          >
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
          {roster.length} students out of {EDUCATOR.studentsLimit} students added.
        </Banner>
      </div>

      <SearchBar
        open={searchOpen}
        label="Student Name"
        value={query}
        onChange={setQuery}
        onClose={() => setSearchOpen(false)}
      />

      {/* `.form-chunk` — the app puts the add form and the roster in one
          bordered panel under a "Students" strip. The table goes `flush` inside
          it: its own border would make this a card within a card. */}
      <section className="rmi-form-chunk">
        <header className="rmi-form-chunk-head">
          <h2 className="rmi-form-chunk-title">Students</h2>
        </header>
        <div className="rmi-form-chunk-body">
          <form className="rmi-field-group" onSubmit={addStudent}>
            <Field label="Student Name" className="rmi-add-field">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Button type="submit" variant="primary" size="md" disabled={!name.trim()}>
              Add Student
            </Button>
          </form>

          {rows.length > 0 ? (
            <Table
              columns={columns}
              rows={rows}
              getRowKey={(r) => r.id}
              pageSize={15}
              scrollX
              flush
            />
          ) : (
            <EmptyState
              variant="dashed"
              title={query ? 'No students found.' : 'No students have been added.'}
              description={
                query
                  ? 'Try a different student name or clear your search.'
                  : `You can add up to ${EDUCATOR.studentsLimit} students.`
              }
            />
          )}
        </div>
      </section>

      <ConfirmModal
        open={confirm?.kind === 'delete'}
        onClose={() => setConfirm(null)}
        title={`Delete ${confirm?.student?.name ?? ''}`}
        confirmLabel="Delete"
        onConfirm={() => removeStudent(confirm.student)}
      >
        Are you sure you want to delete this student? This will delete all of their RMI results, if
        present.
      </ConfirmModal>

      <ConfirmModal
        open={confirm?.kind === 'regenerate'}
        onClose={() => setConfirm(null)}
        title="Are you sure you want to regenerate this student's access code?"
        confirmLabel="Regenerate"
        onConfirm={() => regenerateCode(confirm.student)}
      >
        Students with old access codes will be unable to access their survey or results. However,
        students who already took the survey can view results at their new access code.
      </ConfirmModal>
    </>
  )
}
