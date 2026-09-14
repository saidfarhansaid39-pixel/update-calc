'use client'

import { useTranslations } from 'next-intl'
import ErrorClient from './error-client'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('common')
  return (
    <ErrorClient
      error={error}
      reset={reset}
      title={t('somethingWentWrong')}
      message={t('errorOccurred')}
    />
  )
}
