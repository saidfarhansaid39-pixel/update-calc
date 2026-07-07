import React from 'react'
import { AnnuityPayoutCalculator } from '@/components/calculator/AnnuityPayoutCalculator'
import { getLocale, getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'standalone' })
  return {
    title: t('annuityPayoutTitle'),
    description: t('annuityPayoutDesc'),
  }
}

export default function ExactAnnuityPage() {
  return <AnnuityPayoutCalculator />
}
