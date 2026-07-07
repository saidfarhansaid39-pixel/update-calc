import React from 'react'
import { HouseAffordabilityCalculator } from '@/components/calculator/HouseAffordabilityCalculator'
import { getLocale, getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'standalone' })
  return {
    title: t('houseAffordabilityTitle'),
    description: t('houseAffordabilityDesc'),
  }
}

export default function ExactHouseAffordabilityPage() {
  return <HouseAffordabilityCalculator />
}
