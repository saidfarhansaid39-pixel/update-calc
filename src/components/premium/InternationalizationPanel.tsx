'use client'

import React from 'react'
import { Globe, ChevronDown } from 'lucide-react'
import { useId } from 'react'
import { countryConfigs, countryNames, currencySymbols, type Currency, type Locale, type MeasurementSystem } from '@/lib/i18n/calculator-i18n'

interface InternationalizationPanelProps {
  country: string
  currency: Currency
  measurement: MeasurementSystem
  onCountryChange: (country: string) => void
  onCurrencyChange: (currency: Currency) => void
  onMeasurementChange: (system: MeasurementSystem) => void
}

export function InternationalizationPanel({
  country, currency, measurement, onCountryChange, onCurrencyChange, onMeasurementChange,
}: InternationalizationPanelProps) {
  const countries = Object.keys(countryConfigs)
  const config = countryConfigs[country]
  const countryId = useId()
  const currencyId = useId()
  const measurementId = useId()

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Globe className="w-4 h-4 text-gray-400" aria-hidden="true" />
      <label htmlFor={countryId} className="sr-only">Country</label>
      <select
        id={countryId}
        value={country}
        onChange={e => {
          const c = e.target.value
          const cfg = countryConfigs[c]
          onCountryChange(c)
          onCurrencyChange(cfg.currency)
          onMeasurementChange(cfg.measurement)
        }}
        className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-3 min-h-[36px] py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
      >
        {countries.map(c => (
          <option key={c} value={c}>{countryNames[c]} ({c})</option>
        ))}
      </select>
      <label htmlFor={currencyId} className="sr-only">Currency</label>
      <select
        id={currencyId}
        value={currency}
        onChange={e => onCurrencyChange(e.target.value as Currency)}
        className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-3 min-h-[36px] py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
      >
        {countries.map(c => {
          const cfg = countryConfigs[c]
          return <option key={c} value={cfg.currency}>{currencySymbols[cfg.currency]} {cfg.currency}</option>
        })}
      </select>
      <label htmlFor={measurementId} className="sr-only">Measurement system</label>
      <select
        id={measurementId}
        value={measurement}
        onChange={e => onMeasurementChange(e.target.value as MeasurementSystem)}
        className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-3 min-h-[36px] py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
      >
        <option value="metric">Metric</option>
        <option value="imperial">Imperial</option>
        <option value="us">US Customary</option>
      </select>
    </div>
  )
}
