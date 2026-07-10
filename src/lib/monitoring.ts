'use client'

import { trackEvent } from '@/components/analytics/Analytics'

let initialized = false

export function captureError(error: Error, context?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  // send to analytics or console in dev
  if (process.env.NODE_ENV === 'development') console.error('[monitor]', error, context)
  trackEvent('error', {
    message: error.message,
    stack: error.stack,
    ...context,
  })
}

export function initGlobalErrorHandlers() {
  if (typeof window === 'undefined' || initialized) return
  initialized = true

  window.onerror = (message, source, lineno, colno, error) => {
    captureError(
      error instanceof Error ? error : new Error(String(message)),
      { source, lineno, colno, type: 'window.onerror' },
    )
  }

  window.onunhandledrejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason
    captureError(
      reason instanceof Error ? reason : new Error(String(reason)),
      { type: 'unhandledrejection' },
    )
  }
}
