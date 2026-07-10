'use client'

import { useEffect } from 'react'
import { ErrorCard } from '@/components/ErrorCard'
import { captureError, initGlobalErrorHandlers } from '@/lib/monitoring'

export default function ErrorClient({
  error,
  reset,
  title,
  message,
}: {
  error: Error & { digest?: string }
  reset: () => void
  title?: string
  message?: string
}) {
  useEffect(() => {
    initGlobalErrorHandlers()
    captureError(error, { digest: error.digest, boundary: 'global-error' })
  }, [error])

  return (
    <ErrorCard
      title={title}
      message={message}
      error={error}
      reset={reset}
    />
  )
}
