import React from 'react'
import { AmortizationCalculator } from '@/components/calculator/AmortizationCalculator'
import { getLocale, getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'standalone' })
  return {
    title: t('amortizationTitle'),
    description: t('amortizationDesc'),
  }
}

export default function ExactAmortizationPage() {
  return <AmortizationCalculator />
}
