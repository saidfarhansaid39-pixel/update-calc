'use client'

import React from 'react'
import { useCalculatorMode } from '@/lib/context/CalculatorModeContext'
import type { CalcMode } from '@/components/premium/CalculatorModeToggle'
import { cn } from '@/lib/utils'

interface ModeFieldGroupProps {
  minMode: CalcMode
  label?: string
  children: React.ReactNode
  className?: string
}

const modeOrder: Record<CalcMode, number> = {
  basic: 0,
  advanced: 1,
  professional: 2,
  expert: 3,
}

export function ModeFieldGroup({ minMode, label, children, className }: ModeFieldGroupProps) {
  const { mode } = useCalculatorMode()
  const currentLevel = modeOrder[mode] ?? 0
  const requiredLevel = modeOrder[minMode] ?? 0

  if (currentLevel < requiredLevel) return null

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider border-t border-gray-100 dark:border-gray-700 pt-3 mt-3">
          {label}
          <span className="ml-1.5 text-[10px] font-normal text-gray-300 dark:text-gray-600 normal-case">
            ({minMode}+)
          </span>
        </p>
      )}
      {children}
    </div>
  )
}
