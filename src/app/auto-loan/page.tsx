import React from 'react'
import { AutoLoanCalculator } from '@/components/calculator/AutoLoanCalculator'
import { getLocale, getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'standalone' })
  return {
    title: t('autoLoanTitle'),
    description: t('autoLoanDesc'),
  }
}

export default function ExactAutoLoanPage() {
  return <AutoLoanCalculator />
}
