'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
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

/**
 * Global region preference (country / currency / measurement).
 *
 * Mounted once at the app root (inside ClientLocaleWrapper) so that EVERY
 * component — including standalone calculators that render *above*
 * PremiumCalculatorShell — can read the visitor's selection. The choice is
 * persisted to localStorage so it survives reloads and client-side
 * navigations (previously it reset to the locale default on every page).
 */
export interface RegionValue {
  country: string
  currency: Currency
  measurement: MeasurementSystem
  setCountry: (c: string) => void
  setCurrency: (c: Currency) => void
  setMeasurement: (m: MeasurementSystem) => void
}

const RegionContext = createContext<RegionValue | null>(null)

export function useRegion(): RegionValue {
  const ctx = useContext(RegionContext)
  if (!ctx) throw new Error('useRegion must be used within <RegionProvider>')
  return ctx
}

const REGION_STORAGE_KEY = 'calc-region-v1'
const VALID_MEASUREMENTS: readonly string[] = ['metric', 'imperial', 'us']

export function RegionProvider({
  defaultCountry,
  defaultCurrency,
  children,
}: {
  defaultCountry: string
  defaultCurrency: Currency
  children: React.ReactNode
}) {
  const [country, setCountryState] = useState<string>(defaultCountry)
  const [currency, setCurrencyState] = useState<Currency>(defaultCurrency)
  const [measurement, setMeasurementState] = useState<MeasurementSystem>(
    countryConfigs[defaultCountry]?.measurement || 'metric'
  )
  const dirtyRef = useRef(false)
  const storedRef = useRef(false)

  // Hydrate the persisted preference after mount. Running this in an effect
  // (instead of lazy useState init) keeps the server HTML and the first
  // client render identical, avoiding hydration mismatches — setState here is
  // the correct tradeoff for an SSR'd client component.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(REGION_STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (!parsed || typeof parsed !== 'object') return
      storedRef.current = true
      if (typeof parsed.country === 'string' && countryConfigs[parsed.country]) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCountryState(parsed.country)
      }
      if (typeof parsed.currency === 'string' && Object.prototype.hasOwnProperty.call(currencySymbols, parsed.currency)) {
        setCurrencyState(parsed.currency as Currency)
      }
      if (typeof parsed.measurement === 'string' && VALID_MEASUREMENTS.includes(parsed.measurement)) {
        setMeasurementState(parsed.measurement as MeasurementSystem)
      }
    } catch {
      // corrupt storage or unavailable (private mode) — keep defaults
    }
  }, [])

  // Follow locale-derived defaults on locale changes — but only until the
  // visitor has an explicit stored preference or has made a choice themselves.
  useEffect(() => {
    if (dirtyRef.current || storedRef.current) return
    setCountryState(defaultCountry)
    setCurrencyState(defaultCurrency)
    setMeasurementState(countryConfigs[defaultCountry]?.measurement || 'metric')
  }, [defaultCountry, defaultCurrency])

  // Persist explicit choices only (don't write locale defaults on first visit,
  // so a later locale switch can still apply its own defaults).
  useEffect(() => {
    if (!dirtyRef.current) return
    try {
      window.localStorage.setItem(
        REGION_STORAGE_KEY,
        JSON.stringify({ country, currency, measurement })
      )
    } catch {
      // storage full / unavailable — non-fatal
    }
  }, [country, currency, measurement])

  const setCountry = useCallback((c: string) => {
    dirtyRef.current = true
    setCountryState(c)
  }, [])
  const setCurrency = useCallback((c: Currency) => {
    dirtyRef.current = true
    setCurrencyState(c)
  }, [])
  const setMeasurement = useCallback((m: MeasurementSystem) => {
    dirtyRef.current = true
    setMeasurementState(m)
  }, [])

  const value = useMemo(
    () => ({ country, currency, measurement, setCountry, setCurrency, setMeasurement }),
    [country, currency, measurement, setCountry, setCurrency, setMeasurement]
  )

  return (
    <RegionContext.Provider value={value}>
      <CurrencyProvider country={country} currency={currency}>
        {children}
      </CurrencyProvider>
    </RegionContext.Provider>
  )
}

/**
 * Display-side currency substitution: compute layers emit strings containing
 * a literal `$` (e.g. `$4500.00`, `unit: '$'`). This swaps every `$` for the
 * visitor's selected currency symbol at render time, so thousands of existing
 * calc definitions stay correct without touching their data.
 */
export function subMoney(text: unknown, sym: string): string {
  if (text === null || text === undefined) return ''
  if (typeof text === 'string') return sym ? text.replace(/\$/g, sym) : text
  return String(text)
}
