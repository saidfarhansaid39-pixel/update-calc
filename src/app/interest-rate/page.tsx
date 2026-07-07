import React from 'react'
import { InterestRateCalculatorWrapper } from '@/components/calculator/InterestRateCalculatorWrapper'
import { getLocale, getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'standalone' })
  return {
    title: t('interestRateTitle'),
    description: t('interestRateDesc'),
  }
}

export default function ExactInterestRatePage() {
  return <InterestRateCalculatorWrapper />
}
