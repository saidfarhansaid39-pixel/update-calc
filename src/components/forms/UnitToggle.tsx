'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface UnitOption {
  id: string
  label: string
}

interface UnitToggleProps {
  options: UnitOption[]
  selected: string
  onChange: (unit: string) => void
  size?: 'sm' | 'md'
}

export function UnitToggle({ options, selected, onChange, size = 'sm' }: UnitToggleProps) {
  return (
    <div className={cn(
      'inline-flex border rounded-lg overflow-hidden border-gray-200 dark:border-gray-600',
      size === 'sm' ? 'gap-0' : 'gap-0'
    )}>
      {options.map((opt, i) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={cn(
            'font-medium transition-colors',
            size === 'sm' ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-xs',
            i > 0 && 'border-l border-gray-200 dark:border-gray-600',
            selected === opt.id
              ? 'bg-[#1a3a8a] text-white'
              : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
