import React from 'react'
import { SalaryCalculator } from '@/components/calculator/SalaryCalculator'
import { getLocale, getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'standalone' })
  return {
    title: t('salaryTitle'),
    description: t('salaryDesc'),
  }
}

export default function ExactSalaryPage() {
  return <SalaryCalculator />
}
