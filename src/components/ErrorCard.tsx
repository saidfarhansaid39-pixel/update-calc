'use client'

import {
  AlertTriangle,
  RefreshCw,
  Home,
} from 'lucide-react'
import Link from 'next/link'

interface ErrorCardProps {
  title?: string
  message?: string
  error?: Error | null
  reset?: () => void
  showHome?: boolean
}

export function ErrorCard({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again or go back.',
  error,
  reset,
  showHome = true,
}: ErrorCardProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-5">
        <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      <p className="text-gray-500 dark:text-gray-300 mt-2 max-w-md text-sm">
        {error?.message ? error.message : message}
      </p>
      <div className="mt-6 flex items-center gap-3 flex-wrap justify-center">
        {reset && (
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-opacity min-h-[44px]"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Try again
          </button>
        )}
        {showHome && (
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-[44px]"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Go home
          </Link>
        )}
      </div>
    </div>
  )
}
