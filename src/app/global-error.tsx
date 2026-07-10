'use client'

import { ErrorCard } from '@/components/ErrorCard'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
          color: '#1f2937',
          fontFamily:
            'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <ErrorCard
          title="Something went wrong"
          message="An unexpected error occurred. Please try again or go back."
          error={error}
          reset={reset}
        />
      </body>
    </html>
  )
}
