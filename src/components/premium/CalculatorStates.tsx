'use client'

import React from 'react'
import { AlertTriangle, RefreshCw, Calculator, Loader2 } from 'lucide-react'

export class CalculatorErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <CalculatorErrorState error={this.state.error} onRetry={() => this.setState({ hasError: false, error: null })} />
    }
    return this.props.children
  }
}

export function CalculatorLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" role="status" aria-label="Loading calculator">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
      <span className="sr-only">Loading calculator...</span>
    </div>
  )
}

export function CalculatorEmptyState({ title, onStart }: { title: string; onStart?: () => void }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 shadow-sm text-center" role="status">
      <Calculator className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" aria-hidden="true" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Start Calculating</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
        Enter your values in the {title} form above to get instant results. All fields are pre-filled with example values to help you get started.
      </p>
      {onStart && (
        <button onClick={onStart} className="px-4 py-2 bg-[#1a3a8a] text-white rounded-lg hover:bg-[#0a1d4f] transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#06b6d4] focus:ring-offset-2">
          Get Started
        </button>
      )}
    </div>
  )
}

export function CalculatorErrorState({ error, onRetry }: { error: Error | null; onRetry?: () => void }) {
  return (
    <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-900/30 p-8 text-center" role="alert">
      <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" aria-hidden="true" />
      <h3 className="text-base font-semibold text-red-700 dark:text-red-300 mb-1">Calculation Error</h3>
      <p className="text-sm text-red-600 dark:text-red-400 mb-4 max-w-sm mx-auto">
        {error?.message || 'Something went wrong while calculating. Please check your inputs and try again.'}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Try Again
        </button>
      )}
    </div>
  )
}

export function CalculatorLoadingSpinner({ label = 'Calculating...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-8" role="status" aria-label={label}>
      <Loader2 className="w-6 h-6 text-[#06b6d4] animate-spin" aria-hidden="true" />
      <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">{label}</span>
    </div>
  )
}
