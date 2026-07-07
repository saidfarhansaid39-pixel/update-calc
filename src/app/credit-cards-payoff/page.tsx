import React from 'react'
import { CreditCardsPayoffCalculator } from '@/components/calculator/CreditCardsPayoffCalculator'
import { getLocale, getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'standalone' })
  return {
    title: t('creditCardsPayoffTitle'),
    description: t('creditCardsPayoffDesc'),
  }
}

export default function ExactCreditCardsPayoffPage() {
  return <CreditCardsPayoffCalculator />
}
