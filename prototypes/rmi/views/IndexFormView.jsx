import { useState } from 'react'
import { PageHeader } from '@components/PageHeader/PageHeader'
import { Button } from '@components/Button/Button'
import { Banner } from '@components/Primitives/Primitives'
import { Icon } from '@components/Icon/Icon'
import { Field, Input } from '@components/Form/Form'
import '@components/Form/Form.css'
import { overlappingIndex } from '../data'
import './IndexFormView.css'

/**
 * `classroom/survey_requests/new` and `/edit` — one form for both, as the app
 * has it: a "Settings" chunk holding the period's name and its two dates, then
 * Create / Update beside Cancel.
 *
 * The validation is the engine's. `SurveyRequest` refuses two index periods
 * whose dates overlap — partially or one inside the other — because a reader
 * can only answer once per period, so overlapping periods would compete for the
 * same response. The four-a-year limit is the plan's.
 */
export function IndexFormView({ index, indexes, limit, onSave, onCancel }) {
  const editing = !!index
  const [name, setName] = useState(index?.name ?? '')
  const [startDate, setStartDate] = useState(index?.startDate ?? '')
  const [endDate, setEndDate] = useState(index?.endDate ?? '')
  const [errors, setErrors] = useState([])

  function submit(e) {
    e.preventDefault()
    const found = []

    if (!name.trim()) found.push('Name can’t be blank')
    if (!startDate) found.push('Start date can’t be blank')
    if (!endDate) found.push('End date can’t be blank')
    if (startDate && endDate && endDate < startDate) {
      found.push('End date must be after the start date')
    }

    if (startDate && endDate) {
      const clash = overlappingIndex(indexes, { id: index?.id, startDate, endDate })
      if (clash) found.push('Another active index overlaps with the specified dates')
    }

    if (!editing && indexes.length >= limit) {
      found.push(`You can create up to ${limit} indexes each school year`)
    }

    setErrors(found)
    if (found.length) return

    onSave({ id: index?.id, name: name.trim(), startDate, endDate })
  }

  return (
    <>
      <PageHeader title={editing ? 'Edit Index' : 'New Motivation Index'} />

      {errors.length > 0 && (
        <div className="rmi-form-errors">
          {errors.map((error) => (
            <Banner key={error} level="error" icon={<Icon name="alert-circle" size={22} />}>
              {error}
            </Banner>
          ))}
        </div>
      )}

      <form onSubmit={submit} noValidate>
        <section className="rmi-form-chunk">
          <header className="rmi-form-chunk-head">
            <h2 className="rmi-form-chunk-title">Settings</h2>
          </header>
          <div className="rmi-form-chunk-body">
            <Field label="Name" className="rmi-index-name">
              <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            </Field>

            <div className="rmi-field-group">
              <Field label="Start date">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Field>
              <Field label="End date">
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </Field>
            </div>
          </div>
        </section>

        <div className="rmi-page-buttons">
          <Button type="submit" variant="primary" size="md">
            {editing ? 'Update Index' : 'Create Index'}
          </Button>
          <Button type="button" variant="secondary" size="md" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </>
  )
}
