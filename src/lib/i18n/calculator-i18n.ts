export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'INR' | 'CAD' | 'AUD' | 'BRL' | 'MXN' | 'CHF' | 'KRW' | 'SEK' | 'NOK' | 'NZD'

export type Locale = 'en-US' | 'en-GB' | 'en-IN' | 'en-CA' | 'en-AU' | 'en-NZ' | 'fr-FR' | 'fr-CH' | 'de-DE' | 'de-CH' | 'es-ES' | 'es-MX' | 'it-IT' | 'it-CH' | 'pt-BR' | 'ja-JP' | 'zh-CN' | 'ko-KR' | 'sv-SE' | 'nb-NO' | 'da-DK' | 'fi-FI'

export type MeasurementSystem = 'metric' | 'imperial' | 'us'

interface CountryConfig {
  currency: Currency
  locale: Locale
  measurement: MeasurementSystem
  taxRate: number
  dateFormat: string
  timeFormat: string
  weekStartsOn: 0 | 1
}

export const countryConfigs: Record<string, CountryConfig> = {
  US: { currency: 'USD', locale: 'en-US', measurement: 'us', taxRate: 0.07, dateFormat: 'MM/DD/YYYY', timeFormat: 'h:mm A', weekStartsOn: 0 },
  GB: { currency: 'GBP', locale: 'en-GB', measurement: 'imperial', taxRate: 0.20, dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  DE: { currency: 'EUR', locale: 'de-DE', measurement: 'metric', taxRate: 0.19, dateFormat: 'DD.MM.YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  FR: { currency: 'EUR', locale: 'fr-FR', measurement: 'metric', taxRate: 0.20, dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  JP: { currency: 'JPY', locale: 'ja-JP', measurement: 'metric', taxRate: 0.10, dateFormat: 'YYYY/MM/DD', timeFormat: 'HH:mm', weekStartsOn: 1 },
  CN: { currency: 'CNY', locale: 'zh-CN', measurement: 'metric', taxRate: 0.13, dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm', weekStartsOn: 1 },
  IN: { currency: 'INR', locale: 'en-IN', measurement: 'metric', taxRate: 0.18, dateFormat: 'DD/MM/YYYY', timeFormat: 'hh:mm A', weekStartsOn: 1 },
  CA: { currency: 'CAD', locale: 'en-CA', measurement: 'metric', taxRate: 0.13, dateFormat: 'YYYY-MM-DD', timeFormat: 'h:mm A', weekStartsOn: 0 },
  AU: { currency: 'AUD', locale: 'en-AU', measurement: 'metric', taxRate: 0.10, dateFormat: 'DD/MM/YYYY', timeFormat: 'h:mm A', weekStartsOn: 1 },
  BR: { currency: 'BRL', locale: 'pt-BR', measurement: 'metric', taxRate: 0.17, dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  MX: { currency: 'MXN', locale: 'es-MX', measurement: 'metric', taxRate: 0.16, dateFormat: 'DD/MM/YYYY', timeFormat: 'h:mm A', weekStartsOn: 1 },
  KR: { currency: 'KRW', locale: 'ko-KR', measurement: 'metric', taxRate: 0.10, dateFormat: 'YYYY.MM.DD', timeFormat: 'A h:mm', weekStartsOn: 1 },
  SE: { currency: 'SEK', locale: 'sv-SE', measurement: 'metric', taxRate: 0.25, dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm', weekStartsOn: 1 },
  NO: { currency: 'NOK', locale: 'nb-NO', measurement: 'metric', taxRate: 0.25, dateFormat: 'DD.MM.YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  CH: { currency: 'CHF', locale: 'de-CH', measurement: 'metric', taxRate: 0.077, dateFormat: 'DD.MM.YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  NZ: { currency: 'NZD', locale: 'en-NZ', measurement: 'metric', taxRate: 0.15, dateFormat: 'DD/MM/YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  FI: { currency: 'EUR', locale: 'fi-FI', measurement: 'metric', taxRate: 0.255, dateFormat: 'DD.MM.YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  'CH-fr': { currency: 'CHF', locale: 'fr-CH', measurement: 'metric', taxRate: 0.081, dateFormat: 'DD.MM.YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
  'CH-it': { currency: 'CHF', locale: 'it-CH', measurement: 'metric', taxRate: 0.081, dateFormat: 'DD.MM.YYYY', timeFormat: 'HH:mm', weekStartsOn: 1 },
}

export const currencySymbols: Record<Currency, string> = {
  USD: '$', EUR: '€', GBP: '£', JPY: '¥', CNY: '¥', INR: '₹', CAD: 'C$', AUD: 'A$',
  BRL: 'R$', MXN: 'Mex$', CHF: 'CHF', KRW: '₩', SEK: 'kr', NOK: 'kr', NZD: 'NZ$',
}

export function formatCurrency(value: number, currency: Currency, locale: Locale = 'en-US'): string {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
  } catch {
    return `${currencySymbols[currency] || '$'}${value.toFixed(2)}`
  }
}

export function formatNumber(value: number, locale: Locale = 'en-US', decimals = 2): string {
  try {
    return new Intl.NumberFormat(locale, { minimumFractionDigits: 0, maximumFractionDigits: decimals }).format(value)
  } catch {
    return value.toFixed(decimals)
  }
}

export function formatDate(date: Date, format: string, locale: Locale = 'en-US'): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(date)
  } catch {
    return date.toLocaleDateString()
  }
}

export function convertMeasurement(value: number, from: MeasurementSystem, to: MeasurementSystem, dimension: 'length' | 'mass' | 'volume' | 'temperature'): number {
  if (from === to) return value
  const inMetric = (v: number, sys: MeasurementSystem): number => {
    if (dimension === 'length') {
      if (sys === 'imperial' || sys === 'us') return v * 0.3048 * 3.28084
      return v
    }
    return v
  }
  const fromMetric = (v: number, sys: MeasurementSystem): number => {
    if (dimension === 'length') {
      if (sys === 'imperial' || sys === 'us') return v / 0.3048 / 3.28084
      return v
    }
    return v
  }
  const metric = inMetric(value, from)
  return fromMetric(metric, to)
}

export const countryNames: Record<string, string> = {
  US: 'United States', GB: 'United Kingdom', DE: 'Germany', FR: 'France',
  JP: 'Japan', CN: 'China', IN: 'India', CA: 'Canada', AU: 'Australia',
  BR: 'Brazil', MX: 'Mexico', KR: 'South Korea', SE: 'Sweden', NO: 'Norway', CH: 'Switzerland',
  NZ: 'New Zealand', FI: 'Finland', 'CH-fr': 'Switzerland (French)', 'CH-it': 'Switzerland (Italian)',
}
