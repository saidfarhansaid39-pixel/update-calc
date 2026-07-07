import React from 'react'
import { EstateTaxCalculator } from '@/components/calculator/EstateTaxCalculator'
import { getLocale, getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'standalone' })
  return {
    title: t('estateTaxTitle'),
    description: t('estateTaxDesc'),
  }
}

export default function ExactEstateTaxPage() {
  return <EstateTaxCalculator />
}
