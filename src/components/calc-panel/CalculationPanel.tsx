'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Settings2 } from 'lucide-react'

interface CalculationPanelProps {
  children: React.ReactNode
  results?: React.ReactNode
  title?: string
  description?: string
}

export function CalculationPanel({ children, results, title, description }: CalculationPanelProps) {
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
      )}

      {/* Two-column grid: form | results */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form column */}
        <div className="lg:col-span-3 space-y-4">
          {children}
        </div>

        {/* Results column */}
        {results && (
          <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-24 lg:self-start">
            {results}
          </div>
        )}
      </div>
    </div>
  )
}

// --- Field Group ---

interface FieldGroupProps {
  title: string
  description?: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export function FieldGroup({ title, description, defaultOpen = true, children }: FieldGroupProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors min-h-[44px]"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <Settings2 size={16} className="text-gray-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        )}
      </button>
      {open && <div className="px-4 pb-4 space-y-4">{children}</div>}
    </div>
  )
}
