'use client'

import React, { createContext, useContext } from 'react'
import type { Currency } from '@/lib/i18n/calculator-i18n'
import { currencySymbols, countryConfigs, type MeasurementSystem } from '@/lib/i18n/calculator-i18n'

export interface CurrencyContextValue {
  country: string
  currency: Currency
  currencySymbol: string
  locale: string
  measurement: MeasurementSystem
  dateFormat: string
  timeFormat: string
  weekStartsOn: 0 | 1
  taxRate: number
}

const CurrencyContext = createContext<CurrencyContextValue>({
  country: 'US',
  currency: 'USD',
  currencySymbol: '$',
  locale: 'en-US',
  measurement: 'us',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: 'h:mm A',
  weekStartsOn: 0,
  taxRate: 0.07,
})

export function useCurrency() {
  return useContext(CurrencyContext)
}

export function CurrencyProvider({
  country,
  currency,
  children,
}: {
  country: string
  currency: Currency
  children: React.ReactNode
}) {
  const config = countryConfigs[country]
  const locale = config?.locale || 'en-US'
  const symbol = currencySymbols[currency] || '$'
  const measurement = config?.measurement || 'us'
  const dateFormat = config?.dateFormat || 'MM/DD/YYYY'
  const timeFormat = config?.timeFormat || 'h:mm A'
  const weekStartsOn = config?.weekStartsOn ?? 0
  const taxRate = config?.taxRate ?? 0

  return (
    <CurrencyContext.Provider value={{ country, currency, currencySymbol: symbol, locale, measurement, dateFormat, timeFormat, weekStartsOn, taxRate }}>
      {children}
    </CurrencyContext.Provider>
  )
}
