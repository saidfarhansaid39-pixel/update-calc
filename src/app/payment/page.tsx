import React from 'react'
import { PaymentCalculator } from '@/components/calculator/PaymentCalculator'
import { getLocale, getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'standalone' })
  return {
    title: t('paymentTitle'),
    description: t('paymentDesc'),
  }
}

export default function ExactPaymentPage() {
  return <PaymentCalculator />
}
