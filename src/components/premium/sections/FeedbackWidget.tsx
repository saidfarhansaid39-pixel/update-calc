'use client'

import React from 'react'
import { ThumbsUp } from 'lucide-react'

interface FeedbackWidgetProps {
  feedback: 'yes' | 'no' | null
  onFeedback: (f: 'yes' | 'no') => void
}

export function FeedbackWidget({ feedback, onFeedback }: FeedbackWidgetProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">Did this calculator help you?</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onFeedback('yes')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              feedback === 'yes' ? 'bg-green-50 dark:bg-green-900/20 border-green-300 text-green-700 dark:text-green-300' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" /> Yes
          </button>
          <button
            onClick={() => onFeedback('no')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              feedback === 'no' ? 'bg-red-50 dark:bg-red-900/20 border-red-300 text-red-700 dark:text-red-300' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5 rotate-180" /> No
          </button>
        </div>
      </div>
    </div>
  )
}
