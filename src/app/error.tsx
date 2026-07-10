'use client'

import { getLocale, getTranslations } from 'next-intl/server'
import ErrorClient from './error-client'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jdcalc.com'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations('common')
  return {
    title: t('somethingWentWrong') ? `${t('somethingWentWrong')} - JDCALC` : 'Error - JDCALC',
    description: t('errorOccurred'),
    alternates: { canonical: siteUrl },
    openGraph: { title: 'Error - JDCALC', description: t('errorOccurred'), url: siteUrl, siteName: 'JDCALC', type: 'website' },
    twitter: { card: 'summary_large_image', title: 'Error - JDCALC', description: t('errorOccurred') },
  }
}

export default async function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = await getTranslations('common')
  return (
    <ErrorClient
      error={error}
      reset={reset}
      title={t('somethingWentWrong')}
      message={t('errorOccurred')}
    />
  )
}
