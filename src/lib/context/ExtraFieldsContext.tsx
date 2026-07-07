'use client'

import React, { createContext, useContext, useMemo } from 'react'

type ExtraFieldValues = Record<string, string>

interface ExtraFieldsContextValue {
  extraFields: ExtraFieldValues
}

const ExtraFieldsContext = createContext<ExtraFieldValues>({})

export function ExtraFieldsProvider({
  extraFields,
  children,
}: {
  extraFields: ExtraFieldValues
  children: React.ReactNode
}) {
  const value = useMemo(() => extraFields, [extraFields])

  return (
    <ExtraFieldsContext.Provider value={value}>
      {children}
    </ExtraFieldsContext.Provider>
  )
}

export function useExtraFields(): ExtraFieldValues {
  return useContext(ExtraFieldsContext)
}
