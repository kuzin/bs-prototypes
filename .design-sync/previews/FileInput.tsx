import React from 'react'
import { FileInput } from 'bs-prototypes'

export const Default = () => <FileInput accept=".csv" placeholder="No roster chosen" />

export const WithLabel = () => (
  <FileInput label="Import class roster" accept=".csv" placeholder="reading-roster.csv" />
)

export const Disabled = () => (
  <FileInput label="Upload badge artwork" accept="image/*" disabled />
)
