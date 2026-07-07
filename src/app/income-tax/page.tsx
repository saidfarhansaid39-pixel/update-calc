import React from 'react'
import { IncomeTaxCalculator } from '@/components/calculator/IncomeTaxCalculator'
import { getLocale, getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'standalone' })
  return {
    title: t('incomeTaxTitle'),
    description: t('incomeTaxDesc'),
  }
}

export default function ExactIncomeTaxPage() {
  return <IncomeTaxCalculator />
}
