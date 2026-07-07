'use client'

import React, { createContext, useContext, useMemo } from 'react'
import type { CalcMode } from '@/components/premium/CalculatorModeToggle'

interface CalculatorModeContextValue {
  mode: CalcMode
  modeLevel: number
}

const CalculatorModeContext = createContext<CalculatorModeContextValue>({
  mode: 'basic',
  modeLevel: 0,
})

export function CalculatorModeProvider({
  mode,
  children,
}: {
  mode: CalcMode
  children: React.ReactNode
}) {
  const modeLevel = useMemo(() => {
    const levels: Record<CalcMode, number> = { basic: 0, advanced: 1, professional: 2, expert: 3 }
    return levels[mode] || 0
  }, [mode])

  const value = useMemo(() => ({ mode, modeLevel }), [mode, modeLevel])

  return (
    <CalculatorModeContext.Provider value={value}>
      {children}
    </CalculatorModeContext.Provider>
  )
}

export function useCalculatorMode() {
  return useContext(CalculatorModeContext)
}
