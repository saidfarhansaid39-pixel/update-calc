import React from 'react'
import { SocialSecurityCalculator } from '@/components/calculator/SocialSecurityCalculator'
import { getLocale, getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'standalone' })
  return {
    title: t('socialSecurityTitle'),
    description: t('socialSecurityDesc'),
  }
}

export default function ExactSocialSecurityPage() {
  return <SocialSecurityCalculator />
}
