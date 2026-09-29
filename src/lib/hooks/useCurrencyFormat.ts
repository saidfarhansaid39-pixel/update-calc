'use client'
import { useLocale } from 'next-intl'
import { formatCurrency, type Currency } from '@/lib/i18n/calculator-i18n'
import { useCurrency } from '@/lib/context/CurrencyContext'

/**
 * Locale-aware currency formatter.
 *
 * When no explicit `currency` argument is given, the formatter falls back to
 * the visitor's globally selected currency (RegionProvider/CurrencyContext)
 * instead of a hardcoded 'USD', so charts, tooltips and result panels follow
 * the location/currency chosen in the internationalization panel.
 */
export function useCurrencyFormat(currency?: Currency) {
  const locale = useLocale()
  const { currency: selectedCurrency } = useCurrency()
  const activeCurrency = currency ?? selectedCurrency
  return (value: number, opts?: Intl.NumberFormatOptions) => formatCurrency(value, activeCurrency, locale, opts)
}
