import { createContext, useContext } from 'react'

export const FieldContext = createContext(null)

export function useFieldProps() {
  return useContext(FieldContext) || { id: undefined, hasError: false }
}
