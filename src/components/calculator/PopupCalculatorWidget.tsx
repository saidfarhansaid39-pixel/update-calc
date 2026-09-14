'use client'

import React, { useState } from 'react'
import { Calculator as CalcIcon, X } from 'lucide-react'
import { QuickCalculator } from '@/components/calculator/QuickCalculator'

export function PopupCalculatorWidget() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close calculator' : 'Open calculator'}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#1a3a8a] to-[#06b6d4] text-white shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-200"
      >
        {open ? <X className="w-6 h-6" /> : <CalcIcon className="w-6 h-6" />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Quick calculator"
          className="fixed bottom-24 right-5 z-[60] w-[300px] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-2xl animate-fade-in-down"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Quick Calculator</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <QuickCalculator compact />
        </div>
      )}
    </>
  )
}
