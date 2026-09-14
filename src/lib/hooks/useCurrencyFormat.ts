'use client'
import { useLocale } from 'next-intl'
import { formatCurrency, type Currency } from '@/lib/i18n/calculator-i18n'

export function useCurrencyFormat(currency: Currency = 'USD') {
  const locale = useLocale()
  return (value: number, opts?: Intl.NumberFormatOptions) => formatCurrency(value, currency, locale, opts)
}
