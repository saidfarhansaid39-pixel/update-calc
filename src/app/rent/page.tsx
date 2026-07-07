import React from 'react'
import { RentCalculator } from '@/components/calculator/RentCalculator'
import { getLocale, getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'standalone' })
  return {
    title: t('rentTitle'),
    description: t('rentDesc'),
  }
}

export default function ExactRentPage() {
  return <RentCalculator />
}
