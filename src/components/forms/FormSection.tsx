'use client'

import React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FormSectionProps {
  title: string
  description?: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export function FormSection({ title, description, defaultOpen = true, children }: FormSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[44px]"
        aria-expanded={open}
      >
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
          )}
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        )}
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  )
}
