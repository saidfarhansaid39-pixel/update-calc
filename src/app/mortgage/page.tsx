import React from 'react'
import { MortgageCalculatorWrapper } from '@/components/calculator/MortgageCalculatorWrapper'
import { getLocale, getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'standalone' })
  return {
    title: t('mortgageTitle'),
    description: t('mortgageDesc'),
  }
}

export default function ExactMortgagePage() {
  return <MortgageCalculatorWrapper />
}
