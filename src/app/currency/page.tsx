import React from 'react'
import { CurrencyCalculator } from '@/components/calculator/CurrencyCalculator'
import { getLocale, getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'standalone' })
  return {
    title: t('currencyTitle'),
    description: t('currencyDesc'),
  }
}

export default function ExactCurrencyPage() {
  return <CurrencyCalculator />
}
