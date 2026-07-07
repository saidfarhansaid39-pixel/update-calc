import React from 'react'
import { DebtConsolidationCalculator } from '@/components/calculator/DebtConsolidationCalculator'
import { getLocale, getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'standalone' })
  return {
    title: t('debtConsolidationTitle'),
    description: t('debtConsolidationDesc'),
  }
}

export default function ExactDebtConsolidationPage() {
  return <DebtConsolidationCalculator />
}
