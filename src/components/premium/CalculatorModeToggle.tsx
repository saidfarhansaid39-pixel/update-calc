'use client'

import React from 'react'
import { Layers, Zap, Sliders, Crosshair } from 'lucide-react'
import { cn } from '@/lib/utils'

export type CalcMode = 'basic' | 'advanced' | 'professional' | 'expert'

interface CalculatorModeToggleProps {
  mode: CalcMode
  onChange: (mode: CalcMode) => void
  availableModes?: CalcMode[]
}

const allModes: { id: CalcMode; label: string; icon: React.ComponentType<{ className?: string }>; description: string }[] = [
  { id: 'basic', label: 'Basic', icon: Zap, description: 'Essential inputs' },
  { id: 'advanced', label: 'Advanced', icon: Sliders, description: 'More parameters & results' },
  { id: 'professional', label: 'Professional', icon: Layers, description: 'Charts & examples' },
  { id: 'expert', label: 'Expert', icon: Crosshair, description: 'Scenarios & audit' },
]

export function CalculatorModeToggle({ mode, onChange, availableModes }: CalculatorModeToggleProps) {
  const modes = availableModes ? allModes.filter(m => availableModes.includes(m.id)) : allModes

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700" role="group" aria-label="Calculator mode">
      {modes.map(m => {
        const Icon = m.icon
        const isActive = mode === m.id
        return (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            title={m.description}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all min-h-[36px]',
              isActive
                ? 'bg-white dark:bg-gray-800 text-[#06b6d4] shadow-sm border border-gray-200 dark:border-gray-600'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {m.label}
          </button>
        )
      })}
    </div>
  )
}
