'use client'

import React from 'react'
import { Info } from 'lucide-react'

interface InputHintProps {
  hint: string
  example?: string
}

export function InputHint({ hint, example }: InputHintProps) {
  const [show, setShow] = React.useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="inline-flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 hover:text-[#06b6d4] transition-colors min-h-[28px]"
        aria-label={hint}
      >
        <Info className="w-3 h-3" />
        <span>{example ? `e.g. ${example}` : 'What\'s this?'}</span>
      </button>
      {show && (
        <div className="absolute bottom-full left-0 mb-2 z-20 w-64 p-2.5 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-100 text-xs rounded-lg shadow-lg">
          {hint}
          <div className="absolute top-full left-4 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45 -mt-1" />
        </div>
      )}
    </div>
  )
}
